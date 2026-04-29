<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Confirmación de orden</title>
</head>
<body style="margin:0;padding:0;font-family:Arial,sans-serif;">
    <div style="max-width:600px;margin:0 auto;padding:20px;">
        <h4>Confirmación de orden</h4>
        <p>La orden de compra con el número <strong>{{ $orderId }}</strong> ha sido creada exitosamente por un valor de <strong>${{ number_format($total, 0, ',', '.') }}</strong>.</p>
        <p>Gracias por tu compra en <strong>IT Socks</strong>.</p>
    </div>
</body>
</html>
