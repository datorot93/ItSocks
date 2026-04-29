<?php

namespace App\Services;

use App\Models\Order;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class MercadoPagoService
{
    private string $accessToken;
    private string $baseUrl = 'https://api.mercadopago.com';

    public function __construct()
    {
        $this->accessToken = config('services.mercadopago.access_token', env('MERCADOPAGO_ACCESS_TOKEN', ''));
    }

    /**
     * Crea una preferencia de pago en MercadoPago.
     *
     * @return string preference_id
     */
    public function createPreference(array $items, ?Order $order = null, array $extra = []): string
    {
        $payload = array_merge([
            'items' => $items,
            'back_urls' => [
                'success' => config('app.frontend_url', env('FRONTEND_URL', 'http://itsocks.s3-website.us-east-2.amazonaws.com/')),
                'failure' => config('app.frontend_url', env('FRONTEND_URL', 'http://itsocks.s3-website.us-east-2.amazonaws.com/')) . 'carrito',
                'pending' => config('app.frontend_url', env('FRONTEND_URL', 'http://itsocks.s3-website.us-east-2.amazonaws.com/')),
            ],
            'auto_return' => 'approved',
        ], $extra);

        if ($order) {
            $payload['external_reference'] = (string) $order->id;
            $payload['payer'] = [
                'email' => $order->email,
                'name' => $order->customer_name,
            ];
        }

        $response = Http::withToken($this->accessToken)
            ->post("{$this->baseUrl}/checkout/preferences", $payload);

        if ($response->failed()) {
            Log::error('MercadoPago createPreference falló', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);
            throw new \RuntimeException('Error al crear preferencia de MercadoPago: ' . $response->status());
        }

        $data = $response->json();

        // Actualizar orden con preference_id
        if ($order) {
            $order->update(['preference_id' => $data['id']]);
        }

        return $data['id'];
    }

    public function handleWebhook(array $payload): void
    {
        $type = $payload['type'] ?? null;

        if ($type !== 'payment') {
            return;
        }

        $paymentId = $payload['data']['id'] ?? null;
        if (! $paymentId) {
            return;
        }

        $status = $this->getPaymentStatus((string) $paymentId);
        $paymentData = $this->getPaymentData((string) $paymentId);

        $externalReference = $paymentData['external_reference'] ?? null;
        if (! $externalReference) {
            return;
        }

        $order = Order::find((int) $externalReference);
        if (! $order) {
            return;
        }

        $newStatus = match ($status) {
            'approved' => 'paid',
            'rejected', 'cancelled' => 'cancelled',
            default => $order->status,
        };

        $order->update([
            'status' => $newStatus,
            'payment_id' => $paymentId,
            'paid_status' => ucfirst($status),
        ]);
    }

    public function getPaymentStatus(string $paymentId): string
    {
        $data = $this->getPaymentData($paymentId);
        return $data['status'] ?? 'unknown';
    }

    private function getPaymentData(string $paymentId): array
    {
        $response = Http::withToken($this->accessToken)
            ->get("{$this->baseUrl}/v1/payments/{$paymentId}");

        if ($response->failed()) {
            throw new \RuntimeException('Error al obtener pago de MercadoPago: ' . $response->status());
        }

        return $response->json();
    }
}
