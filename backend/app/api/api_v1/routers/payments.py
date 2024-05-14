from typing import Any, List

from fastapi import APIRouter, UploadFile, File, Request, Depends, HTTPException, Response
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps
import json

import mercadopago

router = APIRouter()

sdk = mercadopago.SDK("TEST-8944576435109529-121520-5c0d24b5fb06cfe20048a87da50e520f-113403489")

@router.post("create_payment_preference")
async def create_payment_preference(
    request: Request,
    obj_in: dict = {},
    db: Session = Depends(deps.get_db),
    # current_user: models.User = Depends(deps.get_current_active_superuser),
):
    # print(obj_in)

    obj_in['back_urls'] = {
        'success': 'http://itsocks-static-files.s3-website.us-east-2.amazonaws.com/',
        'failure': 'https://www.google.com',
        'pending': 'http://itsocks-static-files.s3-website.us-east-2.amazonaws.com/'
    }
    obj_in['auto_return'] = 'approved'

    preference_response = sdk.preference().create(obj_in)
    # preference = preference_response["response"]

    return preference_response
    