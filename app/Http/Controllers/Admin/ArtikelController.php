<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ArtikelController extends Controller
{
    public function index(Request $request)
    {
        $query = Article::latest();

        if ($request->filled('search')) {
            $query->where('title', 'like', "%{$request->search}%");
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        return Inertia::render('Admin/Artikel/Index', [
            'articles' => $query->paginate(15)->withQueryString()
                ->through(fn($a) => array_merge($a->toArray(), [
                    'updated_at_diff' => $a->updated_at->diffForHumans(),
                ])),
            'filters' => $request->only('search', 'status'),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Artikel/Form', ['article' => null]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title'   => 'required|string|max:255',
            'content' => 'required|string',
            'status'  => 'in:Draft,Published',
        ]);

        $data['slug']   = Str::slug($data['title']) . '-' . time();
        $data['status'] ??= 'Draft';

        Article::create($data);

        return redirect()->route('admin.artikel.index');
    }

    public function edit(Article $artikel)
    {
        return Inertia::render('Admin/Artikel/Form', ['article' => $artikel]);
    }

    public function update(Request $request, Article $artikel)
    {
        $data = $request->validate([
            'title'   => 'required|string|max:255',
            'content' => 'required|string',
            'status'  => 'in:Draft,Published',
        ]);

        if ($artikel->title !== $data['title']) {
            $data['slug'] = Str::slug($data['title']) . '-' . time();
        }

        $artikel->update($data);

        return redirect()->route('admin.artikel.index');
    }

    public function destroy(Article $artikel)
    {
        $artikel->delete();
        return redirect()->route('admin.artikel.index');
    }
}
