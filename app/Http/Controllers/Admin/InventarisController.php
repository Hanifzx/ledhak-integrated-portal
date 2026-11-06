<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\InventoryLog;
use App\Models\Item;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class InventarisController extends Controller
{
    public function index(Request $request)
    {
        $query = Item::query();

        if ($request->filled('search')) {
            $query->where(fn($q) => $q
                ->where('name', 'like', "%{$request->search}%")
                ->orWhere('item_code', 'like', "%{$request->search}%")
            );
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $items = $query->latest()->paginate(12)->withQueryString();
        $items->getCollection()->transform(fn($item) => array_merge($item->toArray(), [
            'photo_url' => $item->photo_path
                ? Storage::disk('public')->url($item->photo_path)
                : null,
        ]));

        return Inertia::render('Admin/Inventaris/Index', [
            'items'   => $items,
            'filters' => $request->only('search', 'status'),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'        => 'required|string|max:255',
            'category'    => 'required|string|max:100',
            'status'      => 'in:Tersedia,Perbaikan,Hilang',  // Dipinjam diatur otomatis lewat Peminjaman
            'description' => 'nullable|string',
            'photo'       => 'nullable|image|mimes:jpeg,jpg,png,webp|max:1024',
        ]);

        $count = (Item::withTrashed()->max('id') ?? 0) + 1;
        $data['item_code'] = 'INV-LDK-' . str_pad($count, 3, '0', STR_PAD_LEFT);

        $hash = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode('LEDHAK|' . $data['item_code']));
        $data['qr_code_url'] = 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data='
            . urlencode(route('public.item.show', ['hash' => $hash]));
        $data['status'] ??= 'Tersedia';

        if ($request->hasFile('photo')) {
            $data['photo_path'] = $this->cropAndStoreSquare($request->file('photo'));
        }
        unset($data['photo']);

        $item = Item::create($data);

        InventoryLog::create([
            'item_id' => $item->id,
            'user_id' => Auth::id(),
            'action'  => 'Barang ditambahkan',
            'notes'   => "Barang baru: {$item->name}",
        ]);

        return redirect()->route('admin.inventaris.index');
    }

    public function update(Request $request, Item $item)
    {
        $data = $request->validate([
            'name'        => 'required|string|max:255',
            'category'    => 'required|string|max:100',
            'status'      => 'in:Tersedia,Perbaikan,Hilang',  // Dipinjam diatur otomatis lewat Peminjaman
            'description' => 'nullable|string',
            'photo'       => 'nullable|image|mimes:jpeg,jpg,png,webp|max:1024',
        ]);

        if ($request->hasFile('photo')) {
            // delete old photo
            if ($item->photo_path) {
                Storage::disk('public')->delete($item->photo_path);
            }
            $data['photo_path'] = $this->cropAndStoreSquare($request->file('photo'));
        }
        unset($data['photo']);

        $item->update($data);

        InventoryLog::create([
            'item_id' => $item->id,
            'user_id' => Auth::id(),
            'action'  => 'Data barang diperbarui',
            'notes'   => "Update: {$item->name}",
        ]);

        return redirect()->route('admin.inventaris.index');
    }

    public function updateStatus(Request $request, Item $item)
    {
        $rules = [
            'status' => 'required|in:Tersedia,Perbaikan,Hilang',
            // Catatan wajib jika barang sedang dipinjam (butuh dokumentasi kejadian)
            'notes'  => $item->status === 'Dipinjam' ? 'required|string|max:500' : 'nullable|string|max:500',
        ];

        $data = $request->validate($rules);

        $oldStatus = $item->status;
        $newStatus = $data['status'];

        $item->update(['status' => $newStatus]);

        // Log activity yang deskriptif sesuai skenario
        if ($oldStatus === 'Dipinjam') {
            $action = "Status diubah saat dipinjam: {$oldStatus} → {$newStatus}";
        } else {
            $action = "Status diubah: {$oldStatus} → {$newStatus}";
        }

        InventoryLog::create([
            'item_id' => $item->id,
            'user_id' => Auth::id(),
            'action'  => $action,
            'notes'   => $data['notes'] ?? '',
        ]);

        return redirect()->route('admin.inventaris.index');
    }

    public function destroy(Item $item)
    {
        InventoryLog::create([
            'item_id' => $item->id,
            'user_id' => Auth::id(),
            'action'  => 'Barang dihapus',
            'notes'   => "Menghapus barang dari sistem: {$item->name}",
        ]);

        $item->delete();
        return redirect()->route('admin.inventaris.index');
    }

    public function downloadQr(Item $item)
    {
        if (!$item->qr_code_url) {
            abort(404, 'QR Code belum di-generate.');
        }

        try {
            $response = \Illuminate\Support\Facades\Http::get($item->qr_code_url);
            if ($response->successful()) {
                return response($response->body())
                    ->header('Content-Type', 'image/png')
                    ->header('Content-Disposition', 'attachment; filename="QR_' . $item->item_code . '.png"');
            }
            throw new \Exception('Failed to download from API');
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal mengunduh QR Code.');
        }
    }

    /**
     * Crop & save an uploaded image as a 500x500 square JPEG.
     */
    private function cropAndStoreSquare(\Illuminate\Http\UploadedFile $file): string
    {
        $src = $file->getRealPath();
        $mime = $file->getMimeType();

        $image = match (true) {
            str_contains($mime, 'png')  => imagecreatefrompng($src),
            str_contains($mime, 'webp') => imagecreatefromwebp($src),
            default                     => imagecreatefromjpeg($src),
        };

        $w = imagesx($image);
        $h = imagesy($image);
        $size = min($w, $h);
        $x = (int)(($w - $size) / 2);
        $y = (int)(($h - $size) / 2);

        $square = imagecreatetruecolor(500, 500);
        imagecopyresampled($square, $image, 0, 0, $x, $y, 500, 500, $size, $size);
        imagedestroy($image);

        $filename = 'items/' . uniqid('item_', true) . '.jpg';
        try {
            Storage::disk('public')->makeDirectory('items');
            $fullPath = storage_path('app/public/' . $filename);
            @imagejpeg($square, $fullPath, 85);
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::warning('Could not write image to local storage: ' . $e->getMessage());
        } finally {
            imagedestroy($square);
        }

        return $filename;
    }
}
