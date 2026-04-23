from typing import List
from datetime import datetime

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


@router.get("/{subcategory}/{type}")
def get_subcategory_type_prices(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    subcategory: str = None,
    type: str = None
):
    """
    Get detailed orders with optional date filtering
    """
    
    prices = crud.bulk_price.get_subcategory_type_price(
        db=db,
        subcategory=subcategory,
        type=type
    )

    return prices

@router.get("/")
def get_all_sub_type_prices(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100
):
    """
    Get detailed orders with optional date filtering
    """
    
    prices = crud.bulk_price.get_all_sub_type_prices(
        db=db
    )

    return prices

@router.put(
    "/{id}", 
    response_model_exclude_none=True
)
def update_prices(
    id: str,
    price: float,  # Este parámetro vendrá como query parameter
    db: Session = Depends(deps.get_db),
):
    """
    Function to update all the prices of a product based on the subcategory and type which are passed
    in the id with the format subcategory-type
    """
    subcategory, type = id.split('-')
    result = crud.bulk_price.update_prices(
        db=db,
        subcategory=subcategory,
        type=type,
        price=price
    )

    return result
