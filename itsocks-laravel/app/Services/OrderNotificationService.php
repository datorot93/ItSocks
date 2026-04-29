<?php

namespace App\Services;

use App\Jobs\SendOrderEmailJob;
use App\Jobs\SendShippingGuideEmail;
use App\Mail\OrderConfirmation;
use App\Mail\ShippingGuideUpdated;
use App\Models\Order;
use Illuminate\Support\Facades\Mail;

class OrderNotificationService
{
    public function sendOrderConfirmation(Order $order): void
    {
        Mail::to($order->email)->queue(new OrderConfirmation($order));
    }

    public function sendShippingGuide(Order $order): void
    {
        dispatch(new SendShippingGuideEmail($order));
    }

    public function sendAdminNotification(Order $order): void
    {
        $adminEmail = config('mail.admin_email', 'admin@itsocks.co');
        Mail::to($adminEmail)->queue(new OrderConfirmation($order));
    }
}
