<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmación de Pedido - ItSocks</title>
    <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 30px auto; background: #fff; border-radius: 8px; overflow: hidden; }
        .header { background-color: #1a1a2e; color: #fff; padding: 24px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; }
        .body { padding: 24px; color: #333; }
        .order-details { background: #f9f9f9; border-radius: 6px; padding: 16px; margin: 16px 0; }
        .footer { background: #1a1a2e; color: #aaa; text-align: center; padding: 16px; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>ItSocks</h1>
            <p>¡Gracias por tu pedido!</p>
        </div>
        <div class="body">
            <p>Hola <strong>{{ $order->customer_name }}</strong>,</p>
            <p>Hemos recibido tu pedido correctamente. A continuación encontrarás el resumen:</p>

            <div class="order-details">
                <h3>Detalles del pedido #{{ $order->id }}</h3>
                <p><strong>Dirección de envío:</strong> {{ $order->shipping_address }}, {{ $order->shipping_city }}, {{ $order->shipping_department }}</p>
                @if($order->is_gift)
                <p><strong>Regalo de:</strong> {{ $order->gift_from }} <strong>para:</strong> {{ $order->gift_to }}</p>
                @if($order->gift_message)
                <p><strong>Mensaje:</strong> {{ $order->gift_message }}</p>
                @endif
                @endif
                <hr>
                <p><strong>Subtotal:</strong> ${{ number_format($order->subtotal, 0, ',', '.') }} COP</p>
                <p><strong>Costo de envío:</strong> ${{ number_format($order->shipping_cost, 0, ',', '.') }} COP</p>
                @if($order->discount_amount > 0)
                <p><strong>Descuento:</strong> -${{ number_format($order->discount_amount, 0, ',', '.') }} COP</p>
                @endif
                <p><strong>Total:</strong> ${{ number_format($order->total, 0, ',', '.') }} COP</p>
            </div>

            <p>Te notificaremos cuando tu pedido sea despachado.</p>
            <p>Si tienes alguna duda, escríbenos a <a href="mailto:info@itsocks.co">info@itsocks.co</a></p>
        </div>
        <div class="footer">
            <p>© {{ date('Y') }} ItSocks. Todos los derechos reservados.</p>
        </div>
    </div>
</body>
</html>
