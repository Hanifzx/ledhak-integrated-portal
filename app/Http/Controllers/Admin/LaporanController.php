<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\InventoryLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LaporanController extends Controller
{
    public function index(Request $request)
    {
        $query = InventoryLog::with(['item:id,name,item_code', 'user:id,name'])
            ->latest();

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('action', 'like', "%{$request->search}%")
                  ->orWhere('notes', 'like', "%{$request->search}%")
                  ->orWhereHas('item', fn($q2) => $q2->where('name', 'like', "%{$request->search}%"))
                  ->orWhereHas('user', fn($q2) => $q2->where('name', 'like', "%{$request->search}%"));
            });
        }

        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        return Inertia::render('Admin/Laporan/Index', [
            'logs'    => $query->paginate(25)->withQueryString()
                ->through(fn($log) => [
                    'id'         => $log->id,
                    'action'     => $log->action,
                    'notes'      => $log->notes,
                    'item'       => $log->item,
                    'user'       => $log->user,
                    'created_at' => $log->created_at->format('d M Y, H:i'),
                    'created_at_diff' => $log->created_at->diffForHumans(),
                ]),
            'filters' => $request->only('search', 'date_from', 'date_to'),
            'total'   => InventoryLog::count(),
        ]);
    }
}
