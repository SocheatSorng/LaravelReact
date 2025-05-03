<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Telegram Bot Configuration
    |--------------------------------------------------------------------------
    |
    | This file contains the configuration for your Telegram bot.
    |
    */

    // Your Telegram Bot Token from BotFather
    'bot_token' => env('TELEGRAM_BOT_TOKEN', ''),

    // Allowed Telegram chat IDs (optional, for restricting access)
    'allowed_chat_ids' => array_map('trim', array_filter(explode(',', env('TELEGRAM_ALLOWED_CHAT_IDS', '')))),

    // Webhook settings
    'webhook' => [
        // The URL path where the webhook will be accessible
        'path' => env('TELEGRAM_WEBHOOK_PATH', 'api/telegram/webhook'),

        // Whether to verify the Telegram IP address
        'verify_ip' => env('TELEGRAM_VERIFY_IP', false),
    ],

    // Notification settings
    'notifications' => [
        // Whether to enable Telegram notifications
        'enabled' => env('TELEGRAM_NOTIFICATIONS_ENABLED', true),

        // Notification types
        'orders' => [
            'new_order' => env('TELEGRAM_NOTIFY_NEW_ORDERS', true),
            'order_status_change' => env('TELEGRAM_NOTIFY_ORDER_STATUS_CHANGE', true),
        ],
    ],
];
