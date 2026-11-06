<?php

namespace App\Providers;

use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if (config('app.env') === 'production' || env('APP_ENV') === 'production' || env('VERCEL')) {
            URL::forceScheme('https');
        }

        Vite::prefetch(concurrency: 3);

        // Auto-create view cache directory in serverless environment (/tmp)
        $compiledPath = config('view.compiled');
        if ($compiledPath && !is_dir($compiledPath)) {
            @mkdir($compiledPath, 0755, true);
        }
    }
}
