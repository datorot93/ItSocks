<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Nueva orden recibida - ItSocks Admin</title>
    <style>
        body { font-family: Arial, sans-serif; background: #f4f4f4; }
        .container { max-width: 600px; margin: 30px auto; background: #fff; border-radius: 8px; overflow: hidden; }
        .header { background: #2d1b69; color: #fff; padding: 20px; }
        .body { padding: 24px; }
        table { width: 100%; border-collapse: collapse; margin: 16px 0; }
        th { background: #f0f0f0; text-align: left; padding: 8px; }
        td { padding: 8px; border-bottom: 1px solid #eee; }
        .total { font-size: 18px; font-weight: bold; color: #2d1b69; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Nueva Orden Recibida</h2>
            <p>Orden #{{ $order->id }} — {{ now()->format('d/m/Y H:i') }}</p>
        </div>
        <div class="body">
            <h3>Datos del cliente</h3>
            <table>
                <tr><th>Nombre</th><td>{{ $order->customer_name }}</td></tr>
                <tr><th>Email</th><td>{{ $order->email }}</td></tr>
                <tr><th>Teléfono</th><td>{{ $order->phone }}</td></tr>
                <tr><th>Ciudad</th><td>{{ $order->shipping_city }}, {{ $order->shipping_department }}</td></tr>
                <tr><th>Dirección</th><td>{{ $order->shipping_address }}</td></tr>
                @if($order->is_gift)
                <tr><th>Es regalo</th><td>Sí — De: {{ $order->gift_from }}, Para: {{ $order->gift_to }}</td></tr>
                @endif
            </table>

            <h3>Resumen financiero</h3>
            <table>
                <tr><th>Subtotal</th><td>${{ number_format($order->subtotal, 0, ',', '.') }} COP</td></tr>
                <tr><th>Envío</th><td>${{ number_format($order->shipping_cost, 0, ',', '.') }} COP</td></tr>
                <tr><th>Descuento</th><td>-${{ number_format($order->discount_amount, 0, ',', '.') }} COP</td></tr>
                <tr><th class="total">Total</th><td class="total">${{ number_format($order->total, 0, ',', '.') }} COP</td></tr>
            </table>

            <p><a href="{{ config('app.url') }}/admin/orders/{{ $order->id }}">Ver orden en Filament</a></p>
        </div>
    </div>
</body>
</html>
