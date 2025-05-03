<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;
use Symfony\Component\HttpFoundation\Response;

class PayPalReturnCheck
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if this is a PayPal return URL
        $isPayPalReturn = $request->query('paypal_return') === 'true';
        
        // Store this information in the request for later use
        $request->attributes->set('is_paypal_return', $isPayPalReturn);
        
        // Get payment method in a case-insensitive way
        $paymentMethod = strtolower($request->input('PaymentMethod', ''));
        $isPayPal = ($paymentMethod === 'paypal');
        
        // If this is not a PayPal return and the payment method is PayPal,
        // temporarily disable Telegram notifications
        if (!$isPayPalReturn && $isPayPal) {
            // Store the original config value
            $originalValue = Config::get('telegram.notifications.enabled');
            $request->attributes->set('original_telegram_notifications_enabled', $originalValue);
            
            // Temporarily disable Telegram notifications
            Config::set('telegram.notifications.enabled', false);
        }
        
        // Process the request
        $response = $next($request);
        
        // Restore the original config value if it was changed
        if ($request->attributes->has('original_telegram_notifications_enabled')) {
            $originalValue = $request->attributes->get('original_telegram_notifications_enabled');
            Config::set('telegram.notifications.enabled', $originalValue);
        }
        
        return $response;
    }
}
