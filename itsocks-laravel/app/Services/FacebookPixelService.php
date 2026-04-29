<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class FacebookPixelService
{
    private string $pixelId;
    private string $accessToken;
    private string $apiVersion = 'v18.0';

    public function __construct()
    {
        $this->pixelId = config('services.facebook.pixel_id', env('FACEBOOK_PIXEL_ID', ''));
        $this->accessToken = config('services.facebook.access_token', env('FACEBOOK_ACCESS_TOKEN', ''));
    }

    /**
     * Enviar evento de compra via Conversions API.
     */
    public function sendPurchaseEvent(array $eventData): bool
    {
        if (empty($this->pixelId) || empty($this->accessToken)) {
            Log::warning('FacebookPixelService: credenciales no configuradas');
            return false;
        }

        $payload = [
            'data' => [
                [
                    'event_name' => 'Purchase',
                    'event_time' => time(),
                    'event_source_url' => $eventData['source_url'] ?? config('app.frontend_url', ''),
                    'action_source' => 'website',
                    'user_data' => [
                        'em' => isset($eventData['email']) ? hash('sha256', strtolower(trim($eventData['email']))) : null,
                        'ph' => isset($eventData['phone']) ? hash('sha256', preg_replace('/\D/', '', $eventData['phone'])) : null,
                    ],
                    'custom_data' => [
                        'currency' => 'COP',
                        'value' => $eventData['value'] ?? 0,
                        'order_id' => $eventData['order_id'] ?? null,
                        'content_ids' => $eventData['product_ids'] ?? [],
                        'content_type' => 'product',
                    ],
                ],
            ],
        ];

        // Limpiar nulls
        $payload['data'][0]['user_data'] = array_filter($payload['data'][0]['user_data']);

        $response = Http::post(
            "https://graph.facebook.com/{$this->apiVersion}/{$this->pixelId}/events?access_token={$this->accessToken}",
            $payload
        );

        if ($response->failed()) {
            Log::error('FacebookPixelService: error al enviar evento', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);
            return false;
        }

        return true;
    }
}
