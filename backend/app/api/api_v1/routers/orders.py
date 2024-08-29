from typing import List

from fastapi import APIRouter, Request, Depends, HTTPException, Response
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps

# UTILITIES
import os
import httpx
import requests

# EMAIL
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import smtplib

import copy

router = APIRouter()


@router.get("", response_model_exclude_none=True)
async def order_list(
    response: Response,
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    # current_user: models.User = Depends(deps.get_current_active_superuser),
):
    """
    Get all Orders adsas
    """

    # http://itsocks.s3-website.us-east-2.amazonaws.com/?collection_id=85419114517&collection_status=approved&payment_id=85419114517&status=approved&external_reference=null&payment_type=account_money&merchant_order_id=21964129510&preference_id=1600827084-e01ca9a8-7597-46c3-b1a9-cc5dcbbd9624&site_id=MCO&processing_mode=aggregator&merchant_account_id=null
    
    orders = crud.order.get_order_list(
        db,
        skip=skip, 
        limit=limit
    )

    all_orders = [ order.__dict__ for order in orders]

    print(orders)
    response.headers["Content-Range"] = f"0-9/{len(orders)}"
    return all_orders


@router.get("/single_order/{order_id}", response_model_exclude_none=True)
async def get_single_order(
    order_id: int,
    response: Response,
    db: Session = Depends(deps.get_db),
    # current_user: models.User = Depends(deps.get_current_active_superuser),
):
    """
    Get a specific Order by id
    """
    order = crud.order.get_single_order(db, id=order_id)

    print(order)
    if order is None:
        raise HTTPException(
            status_code=404, detail="The order with this id does not exist in the system",
        )

    return order


@router.get("/{order_id}", response_model_exclude_none=True)
async def order_detail(
    order_id: int,
    # response: Response,
    db: Session = Depends(deps.get_db),
    # current_user: models.User = Depends(deps.get_current_active_superuser),
):
    """
    Get a specific Order by id
    """
    order = crud.order.get_single_order(db, id=order_id)
    if order is None:
        raise HTTPException(
            status_code=404, detail="The order with this id does not exist in the system",
        )
    
    order_detail = order.__dict__

    import copy
    
    # Fetch and sort products
    list_of_products = [product_order for product_order in order.product_order]
    list_of_products = sorted(list_of_products, key=lambda x: x.num_in_order)
    order_detail['products'] = [product.product for product in list_of_products]
    
    # Build the products list
    products = []
    for indice, product in enumerate(order_detail['products']):
        sizes = []
        product_dict = copy.deepcopy(product.__dict__)
        products.append(product_dict)
        
        products[-1]['cantidad'] = order.product_order[indice].quantity
        products[-1]['num_in_order'] = order.product_order[indice].num_in_order
        if order.product_order[indice].pack and "pares" in order.product_order[indice].pack.lower():
            products[-1]['pack'] = order.product_order[indice].pack
        else:
            products[-1]['pack'] = ''
    
        try:
            sizes.append(product.product_size[0].size.size)
            products[-1]['product_size'] = sizes[0]
            products[-1]["type"] = product.type.name
        except:
            continue
            print('Ups')
    
    # Sort the products list
    order_detail['products'] = sorted(products, key=lambda x: x['num_in_order'])
    
    # Remove the 'product_order' key
    order_detail.pop('product_order')

    return order_detail


@router.post("", response_model_exclude_none=True)
async def order_create(
    request: Request,
    order_in: schemas.OrderCreate,
    db: Session = Depends(deps.get_db),
    # current_user: models.User = Depends(deps.get_current_active_superuser),
):
    """
    Create a new Order
    """

    order = crud.order.create(
        db,
        obj_in=order_in
    )

    create_order_send_email(
        to_email=order.email, 
        order_id=order.id, 
        total=order.total
    )
    
    return order


@router.put("/{order_id}", response_model_exclude_none=True)
async def order_update(
    request: Request,
    order_id: int,
    order_in: schemas.OrderUpdate,
    db: Session = Depends(deps.get_db),
    # current_user: models.User = Depends(deps.get_current_active_superuser),
):
    """
    Update an Order
    """
    order = crud.order.get(db, id=order_id)

    if order is None:
        raise HTTPException(
            status_code=404, detail="The order with this id does not exist in the system",
        )
    # print("*"*100)
    # print(order.shipping_guide)
    # print(order_in.shipping_guide)
    prevoius_shipping_guide = order.shipping_guide
    prevoius_state = order.state
    

    if prevoius_shipping_guide != order_in.shipping_guide:
        order_in.state = "Preparado"
        update_guide_send_email(
            to_email=order.email,
            order_id=order.id,
            shipping_guide=order.shipping_guide,
            url_guide=order.shipping_guide_url
        )

    # if prevoius_state != order_in.state:
    #     update_guide_send_email(
    #         to_email=order.email,
    #         order_id=order.id,
    #         shipping_guide=order.state
    #     )

    order = crud.order.update(
        db,
        db_obj=order,
        obj_in=order_in
    )
    
    return order


@router.delete("/{order_id}", response_model_exclude_none=True)
async def order_delete(
    order_id: int,
    db: Session = Depends(deps.get_db),
    # current_user: models.User = Depends(deps.get_current_active_superuser),
):
    """
    Delete an Order
    """
    order = crud.order.get(db, id=order_id)

    if order is None:
        raise HTTPException(
            status_code=404, detail="The order with this id does not exist in the system",
        )

    order = crud.order.remove(db, id=order_id)
    
    return order

def update_guide_send_email(to_email, order_id, shipping_guide, url_guide):
    from_email = os.getenv("EMAIL_USER", "daaltoto@gmail.com")
    from_email_password = os.getenv("EMAIL_APP_PASSWORD", "cldu nlga ufuf uuku")
    body = update_guide_email(order_id, shipping_guide, url_guide)
    
    msg = MIMEMultipart()
    msg['From'] = from_email
    msg['To'] = to_email
    msg['Subject'] = "IT SOCKS guía de envío"
    msg.attach(MIMEText(body, 'html'))

    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.starttls()
    server.login(from_email, from_email_password)
    text = msg.as_string()
    server.sendmail(from_email, to_email, text)
    server.quit()

    return True


def update_state_send_email(to_email, order_id, state):
    from_email = os.getenv("EMAIL_USER", "daaltoto@gmail.com")
    from_email_password = os.getenv("EMAIL_APP_PASSWORD", "cldu nlga ufuf uuku")
    body = update_guide_email(order_id, order_id, state)
    
    msg = MIMEMultipart()
    msg['From'] = from_email
    msg['To'] = to_email
    msg['Subject'] = f"IT SOCKS cambio de estado de tu orden {order_id}"
    msg.attach(MIMEText(body, 'html'))

    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.starttls()
    server.login(from_email, from_email_password)
    text = msg.as_string()
    server.sendmail(from_email, to_email, text)
    server.quit()

    return True


def create_order_send_email(to_email, order_id, total):
    print("Sending email")
    from_email = os.getenv("EMAIL_USER", "daaltoto@gmail.com")
    from_email_password = os.getenv("EMAIL_APP_PASSWORD", "cldu nlga ufuf uuku")
    body = create_order_email(order_id, total)
    
    msg = MIMEMultipart()
    msg['From'] = from_email
    msg['To'] = to_email
    msg['Subject'] = "Confirmación compra"
    msg.attach(MIMEText(body, 'html'))

    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.starttls()
    server.login(from_email, from_email_password)
    text = msg.as_string()
    server.sendmail(from_email, to_email, text)
    server.quit()

    return True




def create_order_email(order_id, total):
    return f"""
    <html lang="en" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">
        <title></title>
        <meta content="text/html; charset=utf-8" http-equiv="Content-Type"/>
        <meta content="width=device-width, initial-scale=1.0" name="viewport"/><!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]--><!--[if !mso]><!-->
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900" rel="stylesheet" type="text/css"/><!--<![endif]-->
        <head>
            <style>
                body {{
                    margin: 0;
                    padding: 0;
                }}
                table {{
                    border-collapse: collapse;
                    table-layout: fixed;
                }}
                * {{
                    line-height: inherit;
                }}
                a[x-apple-data-detectors=true] {{
                    color: inherit !important;
                    text-decoration: none !important;
                }}
            </style>
        </head>
        <body>
            <h4>Confirmación de orden</h4>
            La orden de compra con el número <strong>{order_id}<strong> ha sido creada exitosamente por un valor de {total}
        </body>
    </html>
    """


def update_guide_email(order_id, shipping_guide, url_guide):
    return f"""
    <html lang="en" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">
        <title></title>
        <meta content="text/html; charset=utf-8" http-equiv="Content-Type"/>
        <meta content="width=device-width, initial-scale=1.0" name="viewport"/><!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]--><!--[if !mso]><!-->
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900" rel="stylesheet" type="text/css"/><!--<![endif]-->
        <head>
            <style>
                body {{
                    margin: 0;
                    padding: 0;
                }}
                table {{
                    border-collapse: collapse;
                    table-layout: fixed;
                }}
                * {{
                    line-height: inherit;
                }}
                a[x-apple-data-detectors=true] {{
                    color: inherit !important;
                    text-decoration: none !important;
                }}
            </style>
        </head>
        <body>
            <h4>Orden {order_id} actualizada</h4>
            <p>El número de guía para tu orden {order_id} es {shipping_guide}, puedes hacer el seguimiento de la misma en el siguiente enlace: {url_guide}</p>
        </body>
    """

def update_state_email(order_id, state):
    return """
    <html lang="en" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">
        <title></title>
        <meta content="text/html; charset=utf-8" http-equiv="Content-Type"/>
        <meta content="width=device-width, initial-scale=1.0" name="viewport"/><!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]--><!--[if !mso]><!-->
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900" rel="stylesheet" type="text/css"/><!--<![endif]-->
        <head>
            <style>
                body {{
                    margin: 0;
                    padding: 0;
                }}
                table {{
                    border-collapse: collapse;
                    table-layout: fixed;
                }}
                * {{
                    line-height: inherit;
                }}
                a[x-apple-data-detectors=true] {{
                    color: inherit !important;
                    text-decoration: none !important;
                }}
            </style>
        </head>
        <body>
            <h4>Orden {order_id} actualizada</h4>
            <p>El estado de la orden {order_id} es {state}.</p>
        </body>
    """