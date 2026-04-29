<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Guía de envío</title>
</head>
<body style="margin:0;padding:0;font-family:Arial,sans-serif;">
    <div style="max-width:600px;margin:0 auto;padding:20px;">
        <h4>Orden {{ $orderId }} actualizada</h4>
        <p>El número de guía para tu orden <strong>{{ $orderId }}</strong> es <strong>{{ $trackingNumber }}</strong>.</p>
        @if($shippingGuideUrl)
        <p>Puedes hacer seguimiento en: <a href="{{ $shippingGuideUrl }}">{{ $shippingGuideUrl }}</a></p>
        @endif
    </div>
</body>
</html>
