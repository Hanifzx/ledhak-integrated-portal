<?php

namespace App\Http\Controllers;

use App\Models\Item;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PublicItemController extends Controller
{
    public function show(string $hash)
    {
        $decoded = base64_decode(str_replace(['-', '_'], ['+', '/'], $hash));
        if (!$decoded || !str_starts_with($decoded, 'LEDHAK|')) {
            abort(404, 'URL tidak valid atau barang tidak ditemukan.');
        }
        $item_code = substr($decoded, 7);

        $item = Item::with(['loanRecords' => function($q) {
            $q->where('status', 'Active')->latest();
        }])->where('item_code', $item_code)->firstOrFail();

        $activeLoan = $item->loanRecords->first();

        $itemData = array_merge($item->toArray(), [
            'photo_url' => $item->photo_path 
                ? asset('storage/' . $item->photo_path) 
                : null,
            'active_loan_id' => $activeLoan ? $activeLoan->id : null,
        ]);

        return Inertia::render('Public/ItemDetail', [
            'item' => $itemData,
            'hash' => $hash,
        ]);
    }
}
