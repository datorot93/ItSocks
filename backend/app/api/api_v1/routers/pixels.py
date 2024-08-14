from typing import Any, List

from fastapi import APIRouter, Request, Depends, HTTPException, Response
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps
import json

from facebook_business.api import FacebookAdsApi


router = APIRouter()



@router.post("")
async def create_payment_preference(
    request: Request,
    obj_in: dict = {},
    db: Session = Depends(deps.get_db),
    # current_user: models.User = Depends(deps.get_current_active_superuser),
):
    # print(obj_in)

    obj_in['back_urls'] = {
        'success': 'http://itsocks.s3-website.us-east-2.amazonaws.com/',
        'failure': 'http://itsocks.s3-website.us-east-2.amazonaws.com/carrito',
        'pending': 'http://itsocks.s3-website.us-east-2.amazonaws.com/'
    }
    obj_in['auto_return'] = 'approved'

    # preference_response = sdk.preference().create(obj_in)
    # preference = preference_response["response"]

    # return preference_response
    