from typing import Any, List

from fastapi import APIRouter, UploadFile, File, Request, Depends, HTTPException, Response
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps

# UTILITIES
import os
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

router = APIRouter()


@router.get("discounts", response_model=List[schemas.DiscountCode], response_model_exclude_none=True)
async def get_codes_list(
    response: Response,
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    # current_user: models.User = Depends(deps.get_current_active_user),
):
    """
    Get all shippings
    """
    codes = crud.discount_code.get_codes(db, skip=skip, limit=limit)
    response.headers["Content-Range"] = f"0-9/{len(codes)}"
    return codes

@router.get("active_discounts", response_model=List[schemas.DiscountCode], response_model_exclude_none=True)
async def get_active_codes(
    response: Response,
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    # current_user: models.User = Depends(deps.get_current_active_user),
):
    """
    Get all shippings
    """
    codes = crud.discount_code.get_active_codes(db, skip=skip, limit=limit)

    return codes


@router.get("specific_code", response_model_exclude_none=True)
async def get_specific_code(
    response: Response,
    code: str,
    db: Session = Depends(deps.get_db),
    # current_user: models.User = Depends(deps.get_current_active_user),
):
    """
    Get specific code
    """
    code = crud.discount_code.get_discount_by_code(db, code=code)

    if code:
        return code
    
    return None


# CREATE DISCOUNT CODE
@router.post("/discount_code_create", response_model=schemas.DiscountCode, response_model_exclude_none=True)
async def discount_code_create(
    request: Request,
    discount_code_in: schemas.DiscountCodeCreate,

    db: Session = Depends(deps.get_db),
    # current_user: models.User = Depends(deps.get_current_active_superuser),
):
    """
    Create a new Discount Code
    """

    discount = crud.discount_code.get_discount_by_code(db, code=discount_code_in.code)
    if discount:
        raise HTTPException(
            status_code=400, detail="El código de descuento que está intentando crear ya existe",
        )
    discount = crud.discount_code.create(db, obj_in=discount_code_in)
    
    return discount


def send_email(to_email, name, code):
    import smtplib
    from email.mime.multipart import MIMEMultipart
    from email.mime.text import MIMEText

    from_email = os.getenv("EMAIL_USER", "daaltoto@gmail.com")
    from_email_password = os.getenv("EMAIL_APP_PASSWORD", "cldu nlga ufuf uuku")
    body = get_email_body(name, code)
    
    msg = MIMEMultipart()
    msg['From'] = from_email
    msg['To'] = to_email
    msg['Subject'] = "Código de descuento ItSocks"
    msg.attach(MIMEText(body, 'html'))

    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.starttls()
    server.login(from_email, from_email_password)
    text = msg.as_string()
    server.sendmail(from_email, to_email, text)
    server.quit()

    return True

def get_email_body(name, code):
    return f"""
    Hola {name},

    Gracias por registrarte en nuestra tienda en línea. A continuación, te proporcionamos un código de descuento único que puedes utilizar en tu próxima compra.

    Código de descuento: {code}

    ¡Esperamos que disfrutes de tu compra!

    Saludos,
    Equipo de ItSocks
    """

# CREATE DISCOUNT CODE
@router.post("/unique_discount_code_create", response_model_exclude_none=True)
async def unique_discount_code_create(
    request: Request,
    obj_in: dict,

    db: Session = Depends(deps.get_db),
    # current_user: models.User = Depends(deps.get_current_active_superuser),
):
    """
    Create a new unique discount code
    """
    email = obj_in.get('email')
    name = obj_in.get('name')
    promo = obj_in.get('promo')

    if crud.customer.get_by_email(db, email=email):
        raise HTTPException(
            status_code=400, detail="El email proporcionado ya tiene un código de descuento asociado",
        )
    
    crud.customer.create(
        db,
        obj_in=schemas.CustomerCreate(
            email=email,
            full_name=name
        )
    )

    new_user = crud.customer.get_by_email(db, email=email)

    discount = crud.discount_code.create_unique_code(
        db, 
        email=email, 
        name=name,
        promo=promo,
        user_id=new_user.id
    )
    if not discount:
        raise HTTPException(
            status_code=400, detail="No se pudo crear el código de descuento",
        )
    
    send_email(email, name, discount.code)
    
    return discount


