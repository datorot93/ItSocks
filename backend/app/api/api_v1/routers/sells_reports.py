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


@router.get("/")
def get_products_by_city(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    from_date: datetime = None,
    to_date: datetime = None,
):
    """
    Get detailed orders with optional date filtering
    """
    filters = {}
    if from_date:
        filters["from_date"] = from_date
    if to_date:
        filters["to_date"] = to_date
    
    orders = crud.sells_report.get_detailed_orders(
        db=db,
        skip=skip,
        limit=limit,
        filters=filters
    )

    return orders

@router.get("/products_by_city")
def get_products_by_city(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
):
    """
    Get products by city
    """
    orders = crud.sells_report.get_products_by_city(
        db=db,
        filters={},
        skip=skip,
        limit=limit
    )
    # No need to convert to dict since crud method already returns dictionaries
    return orders

@router.get("detailed_orders")
def get_detailed_orders(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    from_date: datetime = None,
    to_date: datetime = None,
):
    """
    Get detailed orders with optional date filtering
    """
    filters = {}
    if from_date:
        filters["from_date"] = from_date
    if to_date:
        filters["to_date"] = to_date
    
    orders = crud.sells_report.get_detailed_orders(
        db=db,
        skip=skip,
        limit=limit,
        filters=filters
    )

    return orders

@router.get("/products_sum")
def get_products_sum(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
):
    """
    Get products sum
    """
    orders = crud.sells_report.get_products_sum(
        db=db,
        filters={},
        skip=skip,
        limit=limit
    )
    # No need to convert to dict since crud method already returns dictionaries
    return orders


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