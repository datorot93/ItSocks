<?php

namespace App\Mail;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ShippingGuideUpdated extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Order $order) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'IT Socks — Guía de envío orden #' . $this->order->id,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.shipping-guide-updated',
            with: [
                'order' => $this->order,
                'orderId' => $this->order->id,
                'trackingNumber' => $this->order->tracking_number,
                'shippingGuideUrl' => $this->order->shipping_guide_url,
            ],
        );
    }
}
