<?php

namespace App\Services;

use App\Models\LoanRecord;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GoogleSheetService
{
    /**
     * Send loan record payload to Google Apps Script Web App.
     */
    public static function syncLoanRecord(array $loanData): bool
    {
        $webAppUrl = config('services.google_apps_script.url');

        if (empty($webAppUrl) || str_contains($webAppUrl, 'YOUR_DEPLOYMENT_ID')) {
            Log::info('Google Apps Script URL is not fully configured in .env.');
            return false;
        }

        try {
            $response = Http::withoutVerifying()
                ->timeout(15)
                ->asJson()
                ->post($webAppUrl, [
                    'type' => 'LOAN_RECORD',
                    'timestamp' => now()->toIso8601String(),
                    'item_code' => $loanData['item_code'] ?? '-',
                    'item_name' => $loanData['item_name'] ?? '-',
                    'borrower_name' => $loanData['borrower_name'] ?? '-',
                    'borrower_phone' => $loanData['borrower_phone'] ?? '-',
                    'loan_date' => $loanData['loan_date'] ?? '-',
                    'return_date' => $loanData['return_date'] ?? '-',
                    'status' => $loanData['status'] ?? 'Active',
                ]);

            if (! $response->successful()) {
                Log::error('Google Sheet Sync HTTP Error: ' . $response->status() . ' - ' . $response->body());
            }

            return $response->successful();
        } catch (\Throwable $e) {
            Log::error('Failed to sync loan record to Google Sheets: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Sync a loan record model when a new loan is recorded.
     */
    public static function syncLoan(LoanRecord $loan): bool
    {
        $loan->loadMissing('item');

        return static::syncLoanRecord([
            'item_code'     => $loan->item?->item_code ?? '-',
            'item_name'     => $loan->item?->name ?? '-',
            'borrower_name' => $loan->borrower_name ?? '-',
            'borrower_phone'=> $loan->borrower_phone ?? '-',
            'loan_date'     => $loan->loan_date ? (is_string($loan->loan_date) ? $loan->loan_date : $loan->loan_date->toDateString()) : '-',
            'return_date'   => $loan->return_date ? (is_string($loan->return_date) ? $loan->return_date : $loan->return_date->toDateString()) : '-',
            'status'        => $loan->status ?? 'Active',
        ]);
    }

    /**
     * Sync a loan record model when a loan is returned.
     */
    public static function syncReturn(LoanRecord $loan): bool
    {
        $loan->loadMissing('item');

        return static::syncLoanRecord([
            'item_code'     => $loan->item?->item_code ?? '-',
            'item_name'     => $loan->item?->name ?? '-',
            'borrower_name' => $loan->borrower_name ?? '-',
            'borrower_phone'=> $loan->borrower_phone ?? '-',
            'loan_date'     => $loan->loan_date ? (is_string($loan->loan_date) ? $loan->loan_date : $loan->loan_date->toDateString()) : '-',
            'return_date'   => $loan->return_date ? (is_string($loan->return_date) ? $loan->return_date : $loan->return_date->toDateString()) : now()->toDateString(),
            'status'        => 'Returned',
        ]);
    }

    /**
     * Send inventory log payload to Google Apps Script Web App.
     */
    public static function syncInventoryLog(array $logData): bool
    {
        $webAppUrl = config('services.google_apps_script.url');

        if (empty($webAppUrl) || str_contains($webAppUrl, 'YOUR_DEPLOYMENT_ID')) {
            return false;
        }

        try {
            $response = Http::withoutVerifying()
                ->timeout(15)
                ->asJson()
                ->post($webAppUrl, [
                    'type' => 'INVENTORY_LOG',
                    'timestamp' => now()->toIso8601String(),
                    'item_code' => $logData['item_code'] ?? '-',
                    'action' => $logData['action'] ?? '-',
                    'notes' => $logData['notes'] ?? '-',
                    'admin_name' => $logData['admin_name'] ?? 'System',
                ]);

            return $response->successful();
        } catch (\Throwable $e) {
            Log::error('Failed to sync inventory log to Google Sheets: ' . $e->getMessage());
            return false;
        }
    }
}
