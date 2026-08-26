<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\InventoryLog;
use App\Models\Item;
use App\Models\LoanRecord;
use App\Services\GoogleSheetService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PeminjamanController extends Controller
{
    public function index(Request $request)
    {
        $query = LoanRecord::with('item')->latest();

        if ($request->filled('search')) {
            $query->where(fn($q) => $q
                ->where('borrower_name', 'like', "%{$request->search}%")
                ->orWhereHas('item', fn($q2) => $q2
                    ->where('name', 'like', "%{$request->search}%")
                    ->orWhere('item_code', 'like', "%{$request->search}%")
                )
            );
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        return Inertia::render('Admin/Peminjaman/Index', [
            'loans'           => $query->paginate(15)->withQueryString(),
            'filters'         => $request->only('search', 'status'),
            'items_available' => Item::where('status', 'Tersedia')->select('id', 'item_code', 'name')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'item_id'        => 'required|exists:items,id',
            'borrower_name'  => 'required|string|max:255',
            'borrower_phone' => 'required|string|max:20',
            'loan_date'      => 'required|date',
            'return_date'    => 'nullable|date|after_or_equal:loan_date',
        ]);

        DB::transaction(function () use ($data) {
            $item = Item::findOrFail($data['item_id']);

            if ($item->status !== 'Tersedia') {
                $msg = $item->status === 'Dipinjam'
                    ? 'Barang sedang dipinjam oleh orang lain.'
                    : 'Barang tidak dapat dipinjam karena statusnya Perbaikan.';
                throw \Illuminate\Validation\ValidationException::withMessages(['item_id' => $msg]);
            }

            $loan = LoanRecord::create(array_merge($data, ['status' => 'Active']));
            $item->update(['status' => 'Dipinjam']);

            InventoryLog::create([
                'item_id' => $item->id,
                'user_id' => Auth::id(),
                'action'  => 'Barang dipinjam',
                'notes'   => "Peminjam: {$data['borrower_name']} (Tgl: {$data['loan_date']})",
            ]);

            // Sync ke Google Sheets jika service tersedia
            if (class_exists(GoogleSheetService::class)) {
                rescue(fn() => app(GoogleSheetService::class)->syncLoan($loan->load('item')));
            }
        });

        return redirect()->route('admin.peminjaman.index');
    }

    public function returnLoan(LoanRecord $loan)
    {
        DB::transaction(function () use ($loan) {
            $loan->update(['status' => 'Returned', 'return_date' => Carbon::today()]);
            $loan->item->update(['status' => 'Tersedia']);

            InventoryLog::create([
                'item_id' => $loan->item_id,
                'user_id' => Auth::id(),
                'action'  => 'Barang dikembalikan',
                'notes'   => "Oleh: {$loan->borrower_name}",
            ]);

            if (class_exists(GoogleSheetService::class)) {
                rescue(fn() => app(GoogleSheetService::class)->syncReturn($loan->load('item')));
            }
        });

        return redirect()->route('admin.peminjaman.index');
    }
}
