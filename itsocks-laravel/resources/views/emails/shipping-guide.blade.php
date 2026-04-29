<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tu pedido está en camino - ItSocks</title>
    <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 30px auto; background: #fff; border-radius: 8px; overflow: hidden; }
        .header { background-color: #1a1a2e; color: #fff; padding: 24px; text-align: center; }
        .body { padding: 24px; color: #333; }
        .tracking-box { background: #e8f4fd; border: 2px solid #2196f3; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
        .footer { background: #1a1a2e; color: #aaa; text-align: center; padding: 16px; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>ItSocks</h1>
            <p>¡Tu pedido está en camino!</p>
        </div>
        <div class="body">
            <p>Hola <strong>{{ $order->customer_name }}</strong>,</p>
            <p>Buenas noticias — tu pedido #{{ $order->id }} ha sido despachado.</p>

            <div class="tracking-box">
                <h3>Información de seguimiento</h3>
                <p><strong>Transportadora:</strong> {{ $order->shipping_guide }}</p>
                @if($order->tracking_number)
                <p><strong>Número de guía:</strong> {{ $order->tracking_number }}</p>
                @endif
                @if($order->shipping_guide_url)
                <p><a href="{{ $order->shipping_guide_url }}" target="_blank">Rastrear mi paquete</a></p>
                @endif
            </div>

            <p>Tiempo estimado de entrega: 2-5 días hábiles.</p>
        </div>
        <div class="footer">
            <p>© {{ date('Y') }} ItSocks. Todos los derechos reservados.</p>
        </div>
    </div>
</body>
</html>
