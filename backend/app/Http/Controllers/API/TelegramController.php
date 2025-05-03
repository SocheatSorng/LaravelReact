<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Services\TelegramBotService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\URL;

class TelegramController extends Controller
{
    /**
     * The Telegram Bot Service instance.
     *
     * @var \App\Services\TelegramBotService
     */
    protected $telegramService;

    /**
     * Create a new TelegramController instance.
     *
     * @param  \App\Services\TelegramBotService  $telegramService
     * @return void
     */
    public function __construct(TelegramBotService $telegramService)
    {
        $this->telegramService = $telegramService;
    }

    /**
     * Handle incoming webhook requests from Telegram.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function webhook(Request $request)
    {
        try {
            // Log the incoming webhook data
            Log::info('Telegram webhook received', [
                'data' => $request->all()
            ]);

            // Process the update
            $this->telegramService->processUpdate($request->all());

            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            Log::error('Error processing Telegram webhook', [
                'exception' => $e->getMessage()
            ]);

            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Get information about the current webhook.
     *
     * @return \Illuminate\Http\Response
     */
    public function webhookInfo()
    {
        try {
            $info = $this->telegramService->getWebhookInfo();

            return response()->json([
                'success' => true,
                'data' => $info
            ]);
        } catch (\Exception $e) {
            Log::error('Error getting webhook info', [
                'exception' => $e->getMessage()
            ]);

            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Set the webhook URL for the Telegram bot.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function setWebhook(Request $request)
    {
        try {
            // Get the webhook path from config
            $webhookPath = config('telegram.webhook.path');
            
            // Generate the full URL
            $webhookUrl = URL::to($webhookPath);
            
            // Set the webhook
            $result = $this->telegramService->setWebhook($webhookUrl);

            return response()->json([
                'success' => true,
                'data' => $result,
                'webhook_url' => $webhookUrl
            ]);
        } catch (\Exception $e) {
            Log::error('Error setting webhook', [
                'exception' => $e->getMessage()
            ]);

            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Delete the current webhook.
     *
     * @return \Illuminate\Http\Response
     */
    public function deleteWebhook()
    {
        try {
            $result = $this->telegramService->deleteWebhook();

            return response()->json([
                'success' => true,
                'data' => $result
            ]);
        } catch (\Exception $e) {
            Log::error('Error deleting webhook', [
                'exception' => $e->getMessage()
            ]);

            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Send a test message to all configured chat IDs.
     *
     * @return \Illuminate\Http\Response
     */
    public function sendTestMessage()
    {
        try {
            $allowedChatIds = config('telegram.allowed_chat_ids', []);
            $results = [];
            
            if (empty($allowedChatIds)) {
                return response()->json([
                    'success' => false,
                    'message' => 'No allowed chat IDs configured'
                ], 400);
            }
            
            foreach ($allowedChatIds as $chatId) {
                $result = $this->telegramService->sendMessage(
                    $chatId, 
                    "🧪 *Test Message* 🧪\n\nThis is a test message from your bookstore system."
                );
                $results[$chatId] = $result;
            }

            return response()->json([
                'success' => true,
                'data' => $results
            ]);
        } catch (\Exception $e) {
            Log::error('Error sending test message', [
                'exception' => $e->getMessage()
            ]);

            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }
}
