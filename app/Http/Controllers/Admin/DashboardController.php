<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\InventoryLog;
use App\Models\LoanRecord;
use App\Models\Item;
use Carbon\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $totalItems    = Item::count();
        $available     = Item::where('status', 'Tersedia')->count();
        $borrowed      = Item::where('status', 'Dipinjam')->count();
        $overdueLoans  = LoanRecord::with('item')
            ->where('status', 'Active')
            ->whereNotNull('return_date')
            ->where('return_date', '<', Carbon::today())
            ->latest()
            ->take(5)
            ->get();

        $recentLogs = InventoryLog::with(['item', 'user'])
            ->latest()
            ->take(5)
            ->get();

        $draftArticles = Article::where('status', 'Draft')
            ->latest('updated_at')
            ->take(3)
            ->get()
            ->map(fn($a) => array_merge($a->toArray(), [
                'updated_at_diff' => $a->updated_at->diffForHumans(),
            ]));

        return Inertia::render('Dashboard', [
            'metrics' => [
                'total_items'    => $totalItems,
                'available'      => $available,
                'borrowed'       => $borrowed,
                'overdue'        => $overdueLoans->count(),
                'articles_total' => Article::count(),
                'articles_draft' => Article::where('status', 'Draft')->count(),
            ],
            'overdue_loans'   => $overdueLoans,
            'recent_logs'     => $recentLogs,
            'draft_articles'  => $draftArticles,
        ]);
    }
}
