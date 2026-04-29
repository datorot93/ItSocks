<?php

namespace App\Listeners;

use App\Events\OrderCreated;
use App\Mail\OrderConfirmation;
use Illuminate\Support\Facades\Mail;

class SendOrderConfirmationEmail
{
    public function handle(OrderCreated $event): void
    {
        Mail::to($event->order->email)->queue(new OrderConfirmation($event->order));
    }
}
