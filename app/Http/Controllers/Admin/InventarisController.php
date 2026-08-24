<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\InventoryLog;
use App\Models\Item;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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

        return Inertia::render('Admin/Inventaris/Index', [
            'items'   => $query->latest()->paginate(12)->withQueryString(),
            'filters' => $request->only('search', 'status'),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'        => 'required|string|max:255',
            'item_code'   => 'nullable|string|unique:items,item_code|max:50',
            'category'    => 'required|string|max:100',
            'status'      => 'in:Tersedia,Dipinjam,Perbaikan',
            'description' => 'nullable|string',
        ]);

        if (empty($data['item_code'])) {
            $count = Item::count() + 1;
            $data['item_code'] = 'INV-LDK-' . str_pad($count, 3, '0', STR_PAD_LEFT);
        }

        $data['qr_code_url'] = 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data='
            . urlencode(url('/api/public/inventory/' . $data['item_code']));
        $data['status'] ??= 'Tersedia';

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
            'item_code'   => "required|string|unique:items,item_code,{$item->id}|max:50",
            'category'    => 'required|string|max:100',
            'status'      => 'in:Tersedia,Dipinjam,Perbaikan',
            'description' => 'nullable|string',
        ]);

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
        $data = $request->validate([
            'status' => 'required|in:Tersedia,Dipinjam,Perbaikan',
            'notes'  => 'nullable|string|max:255',
        ]);

        $oldStatus = $item->status;
        $item->update(['status' => $data['status']]);

        InventoryLog::create([
            'item_id' => $item->id,
            'user_id' => Auth::id(),
            'action'  => "Status diubah: {$oldStatus} → {$data['status']}",
            'notes'   => $data['notes'] ?? '',
        ]);

        return redirect()->route('admin.inventaris.index');
    }

    public function destroy(Item $item)
    {
        $item->delete();
        return redirect()->route('admin.inventaris.index');
    }
}
