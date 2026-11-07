<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class PengaturanController extends Controller
{
    public function index(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = $request->user();

        $admins = User::orderBy('created_at', 'asc')
            ->get()
            ->map(fn($u) => [
                'id'         => $u->id,
                'name'       => $u->name,
                'email'      => $u->email,
                'created_at' => $u->created_at?->toDateString(),
                'is_self'    => $u->id === $user->id,
            ]);

        return Inertia::render('Admin/Pengaturan/Index', [
            'user' => [
                'name'  => $user->name,
                'email' => $user->email,
            ],
            'admins' => $admins,
            'google_sheets_url' => config('services.google_apps_script.url', env('GOOGLE_APPS_SCRIPT_URL', '')),
            'system_info' => [
                'laravel_version' => app()->version(),
                'php_version'     => PHP_VERSION,
            ],
        ]);
    }

    public function updateProfile(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = $request->user();

        $data = $request->validate([
            'name'  => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
        ]);

        $user->update($data);

        return back()->with('success', 'Profil berhasil diperbarui.');
    }

    public function updatePassword(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = $request->user();

        $request->validate([
            'password' => ['required', 'confirmed', Password::min(8)->letters()->numbers()],
        ]);

        $user->update([
            'password' => Hash::make($request->password),
        ]);

        return back()->with('success', 'Password berhasil diperbarui.');
    }

    public function storeAdmin(Request $request)
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => ['required', 'confirmed', Password::min(8)->letters()->numbers()],
        ]);

        User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
        ]);

        return back()->with('success', 'Akun admin "' . $request->name . '" berhasil dibuat.');
    }

    public function resetAdminPassword(Request $request, User $user)
    {
        $request->validate([
            'password' => ['required', 'confirmed', Password::min(8)->letters()->numbers()],
        ]);

        $user->update([
            'password' => Hash::make($request->password),
        ]);

        return back()->with('success', 'Password akun "' . $user->name . '" berhasil direset.');
    }

    public function destroyAdmin(Request $request, User $user)
    {
        // Guard: tidak boleh hapus akun sendiri
        if ($user->id === Auth::id()) {
            return back()->withErrors(['delete' => 'Anda tidak dapat menghapus akun Anda sendiri.']);
        }

        // Guard: minimal harus tersisa 1 admin
        if (User::count() <= 1) {
            return back()->withErrors(['delete' => 'Tidak dapat menghapus admin terakhir.']);
        }

        $name = $user->name;
        $user->delete();

        return back()->with('success', 'Akun admin "' . $name . '" telah dihapus.');
    }
}
