<?php

namespace App\Services;

use App\Models\Order;
use Illuminate\Support\Facades\Log;

class OrderNotificationService
{
    /**
     * The Telegram Bot Service instance.
     *
     * @var \App\Services\TelegramBotService
     */
    protected $telegramService;

    /**
     * Create a new OrderNotificationService instance.
     *
     * @param  \App\Services\TelegramBotService  $telegramService
     * @return void
     */
    public function __construct(TelegramBotService $telegramService)
    {
        $this->telegramService = $telegramService;
    }

    /**
     * Send notifications for a new order.
     *
     * @param  \App\Models\Order  $order
     * @return void
     */
    public function sendNewOrderNotifications(Order $order)
    {
        try {
            // Log the start of the notification process
            Log::info('Starting new order notifications', [
                'order_id' => $order->OrderID
            ]);

            // Send Telegram notification
            $this->sendTelegramNotification($order);

            // Log the completion of the notification process
            Log::info('Completed new order notifications', [
                'order_id' => $order->OrderID
            ]);

            // You can add other notification channels here in the future
            // For example: email, SMS, Slack, etc.
        } catch (\Exception $e) {
            Log::error('Failed to send order notifications', [
                'order_id' => $order->OrderID,
                'exception' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
        }
    }

    /**
     * Send a Telegram notification for a new order.
     *
     * @param  \App\Models\Order  $order
     * @return void
     */
    protected function sendTelegramNotification(Order $order)
    {
        // Log the start of the Telegram notification process
        Log::info('Starting Telegram notification', [
            'order_id' => $order->OrderID
        ]);

        // Check if Telegram notifications are enabled
        $enabled = config('telegram.notifications.enabled', false);
        Log::info('Telegram notifications enabled status', [
            'enabled' => $enabled,
            'order_id' => $order->OrderID
        ]);

        if (!$enabled) {
            Log::warning('Telegram notifications are disabled', [
                'order_id' => $order->OrderID
            ]);
            return;
        }

        // Send the notification to all configured chat IDs
        $result = $this->telegramService->broadcastOrderNotification($order);

        // Log the completion of the Telegram notification process
        Log::info('Completed Telegram notification', [
            'order_id' => $order->OrderID,
            'result' => $result
        ]);
    }
}
