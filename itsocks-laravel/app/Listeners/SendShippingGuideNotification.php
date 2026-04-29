<?php

namespace App\Listeners;

use App\Events\ShippingGuideAdded;
use App\Jobs\SendShippingGuideEmail;

class SendShippingGuideNotification
{
    public function handle(ShippingGuideAdded $event): void
    {
        dispatch(new SendShippingGuideEmail($event->order));
    }
}
