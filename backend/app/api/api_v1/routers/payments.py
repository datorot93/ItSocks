from typing import Any, List

from fastapi import APIRouter, UploadFile, File, Request, Depends, HTTPException, Response
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps
import json
import os

import mercadopago

router = APIRouter()

sdk = mercadopago.SDK(os.getenv("MERCADOPAGO_ACCESS_TOKEN"))

@router.post("create_payment_preference")
async def create_payment_preference(
    request: Request,
    obj_in: dict = {},
    db: Session = Depends(deps.get_db),
):


    obj_in['back_urls'] = {
        'success': 'http://itsocks.s3-website.us-east-2.amazonaws.com/',
        'failure': 'http://itsocks.s3-website.us-east-2.amazonaws.com/carrito',
        'pending': 'http://itsocks.s3-website.us-east-2.amazonaws.com/'
    }
    obj_in['auto_return'] = 'approved'

    preference_response = sdk.preference().create(obj_in)
    # preference = preference_response["response"]

    return preference_response
    