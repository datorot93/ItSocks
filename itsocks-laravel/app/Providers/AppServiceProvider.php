<?php

namespace App\Providers;

use App\Events\OrderCreated;
use App\Events\ShippingGuideAdded;
use App\Listeners\SendOrderConfirmationEmail;
use App\Listeners\SendShippingGuideNotification;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Event::listen(OrderCreated::class, SendOrderConfirmationEmail::class);
        Event::listen(ShippingGuideAdded::class, SendShippingGuideNotification::class);
    }
}
