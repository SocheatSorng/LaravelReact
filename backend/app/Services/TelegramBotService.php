<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class TelegramBotService
{
    /**
     * The Telegram Bot API URL.
     *
     * @var string
     */
    protected $apiUrl;

    /**
     * The Telegram Bot token.
     *
     * @var string
     */
    protected $botToken;

    /**
     * Create a new TelegramBotService instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->botToken = config('telegram.bot_token');
        $this->apiUrl = "https://api.telegram.org/bot{$this->botToken}";
    }

    /**
     * Send a message to a Telegram chat.
     *
     * @param  int  $chatId
     * @param  string  $text
     * @param  string  $parseMode
     * @return array|null
     */
    public function sendMessage($chatId, $text, $parseMode = 'Markdown')
    {
        try {
            // In development environment, we'll ignore SSL verification
            // In production, this should be properly handled with valid certificates
            $http = Http::withOptions([
                'verify' => !app()->environment('local'),
            ]);

            $response = $http->post("{$this->apiUrl}/sendMessage", [
                'chat_id' => $chatId,
                'text' => $text,
                'parse_mode' => $parseMode,
            ]);

            if ($response->successful()) {
                return $response->json();
            }

            Log::error('Failed to send Telegram message', [
                'chat_id' => $chatId,
                'response' => $response->json(),
            ]);

            return null;
        } catch (\Exception $e) {
            Log::error('Exception when sending Telegram message', [
                'chat_id' => $chatId,
                'exception' => $e->getMessage(),
            ]);

            return null;
        }
    }

    /**
     * Set the webhook URL for the Telegram bot.
     *
     * @param  string  $url
     * @return array|null
     */
    public function setWebhook($url)
    {
        try {
            // In development environment, we'll ignore SSL verification
            $http = Http::withOptions([
                'verify' => !app()->environment('local'),
            ]);

            $response = $http->post("{$this->apiUrl}/setWebhook", [
                'url' => $url,
            ]);

            if ($response->successful()) {
                return $response->json();
            }

            Log::error('Failed to set Telegram webhook', [
                'url' => $url,
                'response' => $response->json(),
            ]);

            return null;
        } catch (\Exception $e) {
            Log::error('Exception when setting Telegram webhook', [
                'url' => $url,
                'exception' => $e->getMessage(),
            ]);

            return null;
        }
    }

    /**
     * Get information about the current webhook.
     *
     * @return array|null
     */
    public function getWebhookInfo()
    {
        try {
            // In development environment, we'll ignore SSL verification
            $http = Http::withOptions([
                'verify' => !app()->environment('local'),
            ]);

            $response = $http->get("{$this->apiUrl}/getWebhookInfo");

            if ($response->successful()) {
                return $response->json();
            }

            Log::error('Failed to get Telegram webhook info', [
                'response' => $response->json(),
            ]);

            return null;
        } catch (\Exception $e) {
            Log::error('Exception when getting Telegram webhook info', [
                'exception' => $e->getMessage(),
            ]);

            return null;
        }
    }

    /**
     * Delete the current webhook.
     *
     * @return array|null
     */
    public function deleteWebhook()
    {
        try {
            // In development environment, we'll ignore SSL verification
            $http = Http::withOptions([
                'verify' => !app()->environment('local'),
            ]);

            $response = $http->post("{$this->apiUrl}/deleteWebhook");

            if ($response->successful()) {
                return $response->json();
            }

            Log::error('Failed to delete Telegram webhook', [
                'response' => $response->json(),
            ]);

            return null;
        } catch (\Exception $e) {
            Log::error('Exception when deleting Telegram webhook', [
                'exception' => $e->getMessage(),
            ]);

            return null;
        }
    }

    /**
     * Send a photo to a Telegram chat.
     *
     * @param  int  $chatId
     * @param  string  $photo  URL or file_id of the photo
     * @param  string  $caption
     * @param  string  $parseMode
     * @return array|null
     */
    public function sendPhoto($chatId, $photo, $caption = null, $parseMode = 'Markdown')
    {
        try {
            $params = [
                'chat_id' => $chatId,
                'photo' => $photo,
            ];

            if ($caption) {
                $params['caption'] = $caption;
                $params['parse_mode'] = $parseMode;
            }

            $response = Http::post("{$this->apiUrl}/sendPhoto", $params);

            if ($response->successful()) {
                return $response->json();
            }

            Log::error('Failed to send Telegram photo', [
                'chat_id' => $chatId,
                'response' => $response->json(),
            ]);

            return null;
        } catch (\Exception $e) {
            Log::error('Exception when sending Telegram photo', [
                'chat_id' => $chatId,
                'exception' => $e->getMessage(),
            ]);

            return null;
        }
    }

    /**
     * Process an incoming update from Telegram.
     *
     * @param  array  $update
     * @return void
     */
    public function processUpdate($update)
    {
        try {
            // Check if this is a message
            if (isset($update['message'])) {
                $message = $update['message'];
                $chatId = $message['chat']['id'];
                $text = $message['text'] ?? '';

                // Process commands
                if (isset($text) && strpos($text, '/') === 0) {
                    $this->processCommand($text, $chatId, $message);
                    return;
                }

                // Process regular messages
                $this->processMessage($text, $chatId, $message);
            }
        } catch (\Exception $e) {
            Log::error('Exception when processing Telegram update', [
                'update' => $update,
                'exception' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Process a command from a Telegram message.
     *
     * @param  string  $text
     * @param  int  $chatId
     * @param  array  $message
     * @return void
     */
    protected function processCommand($text, $chatId, $message)
    {
        // Extract the command
        $command = strtolower(explode(' ', $text)[0]);

        switch ($command) {
            case '/start':
                $this->sendMessage($chatId, 'Welcome to our bot! Use /help to see available commands.');
                break;

            case '/help':
                $this->sendMessage($chatId, "Available commands:\n/start - Start the bot\n/help - Show this help message");
                break;

            default:
                $this->sendMessage($chatId, "Unknown command. Use /help to see available commands.");
                break;
        }
    }

    /**
     * Process a regular message from Telegram.
     *
     * @param  string  $text
     * @param  int  $chatId
     * @param  array  $message
     * @return void
     */
    protected function processMessage($text, $chatId, $message)
    {
        // Here you can implement custom logic for processing regular messages
        $this->sendMessage($chatId, 'I received your message: ' . $text);
    }

    /**
     * Send an order notification to a Telegram chat.
     *
     * @param  int  $chatId
     * @param  \App\Models\Order  $order
     * @return array|null
     */
    public function sendOrderNotification($chatId, $order)
    {
        try {
            // Log the start of the notification process
            Log::info('Starting order notification process', [
                'chat_id' => $chatId,
                'order_id' => $order->OrderID
            ]);

            // Load order details if not already loaded
            if (!$order->relationLoaded('orderDetails')) {
                $order->load(['orderDetails.book', 'customerAccount']);
            }

            // Format the message
            $message = $this->formatOrderNotification($order);

            // Log the formatted message
            Log::info('Formatted order notification message', [
                'chat_id' => $chatId,
                'order_id' => $order->OrderID,
                'message' => $message
            ]);

            // Send the message
            $result = $this->sendMessage($chatId, $message);

            // Log the result
            Log::info('Order notification send result', [
                'chat_id' => $chatId,
                'order_id' => $order->OrderID,
                'result' => $result
            ]);

            return $result;
        } catch (\Exception $e) {
            Log::error('Exception when sending order notification', [
                'chat_id' => $chatId,
                'order_id' => $order->OrderID,
                'exception' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return null;
        }
    }

    /**
     * Format an order notification message.
     *
     * @param  \App\Models\Order  $order
     * @return string
     */
    protected function formatOrderNotification($order)
    {
        try {
            // Log the order data for debugging
            Log::info('Formatting order notification', [
                'order_id' => $order->OrderID,
                'order_data' => $order->toArray()
            ]);

            // Get customer name
            $customerName = 'Guest';
            if ($order->customerAccount) {
                $customerName = $order->customerAccount->FirstName . ' ' . $order->customerAccount->LastName;
            } elseif ($order->GuestName) {
                $customerName = $order->GuestName;
            }

            // Format the message
            $message = "🛒 *NEW ORDER PLACED* 🛒\n\n";
            $message .= "Order ID: `#" . $order->OrderID . "`\n";

            // Check if OrderDate is not null before formatting
            if ($order->OrderDate) {
                $message .= "Date: " . $order->OrderDate->format('Y-m-d H:i:s') . "\n";
            } else {
                $message .= "Date: " . now()->format('Y-m-d H:i:s') . "\n";
            }

            $message .= "Customer: " . $customerName . "\n";
            $message .= "Total Amount: $" . number_format($order->TotalAmount, 2) . "\n";
            $message .= "Payment Method: " . $order->PaymentMethod . "\n\n";

            $message .= "*Order Items:*\n";

            // Check if orderDetails is loaded
            if ($order->relationLoaded('orderDetails') && count($order->orderDetails) > 0) {
                foreach ($order->orderDetails as $detail) {
                    // Check if book is loaded
                    if ($detail->relationLoaded('book') && $detail->book) {
                        $message .= "- " . $detail->book->Title . " (x" . $detail->Quantity . ") - $" . number_format($detail->Price * $detail->Quantity, 2) . "\n";
                    } else {
                        $message .= "- Item #" . $detail->BookID . " (x" . $detail->Quantity . ") - $" . number_format($detail->Price * $detail->Quantity, 2) . "\n";
                    }
                }
            } else {
                $message .= "- No items found\n";
            }

            $message .= "\nShipping Address: " . $order->ShippingAddress;

            return $message;
        } catch (\Exception $e) {
            Log::error('Error formatting order notification', [
                'order_id' => $order->OrderID ?? 'unknown',
                'exception' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            // Return a simple message as fallback
            return "🛒 *NEW ORDER PLACED* 🛒\n\nOrder ID: `#" . ($order->OrderID ?? 'unknown') . "`\n\nPlease check the admin dashboard for details.";
        }
    }

    /**
     * Send order notifications to all allowed chat IDs.
     *
     * @param  \App\Models\Order  $order
     * @return array Results of the notification attempts
     */
    public function broadcastOrderNotification($order)
    {
        $results = [];
        $allowedChatIds = config('telegram.allowed_chat_ids', []);

        // Log the chat IDs for debugging
        Log::info('Telegram notification chat IDs', [
            'chat_ids' => $allowedChatIds,
            'raw_env_value' => env('TELEGRAM_ALLOWED_CHAT_IDS'),
            'order_id' => $order->OrderID
        ]);

        if (empty($allowedChatIds)) {
            Log::warning('No allowed chat IDs configured for Telegram notifications');
            return $results;
        }

        foreach ($allowedChatIds as $chatId) {
            // Log each chat ID being processed
            Log::info('Sending Telegram notification to chat ID', [
                'chat_id' => $chatId,
                'order_id' => $order->OrderID
            ]);

            $results[$chatId] = $this->sendOrderNotification($chatId, $order);
        }

        return $results;
    }
}
