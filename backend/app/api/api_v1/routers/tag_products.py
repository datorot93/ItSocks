from typing import Any, List

from fastapi import APIRouter, Request, Depends, HTTPException, Response
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps

router = APIRouter()


@router.get("", response_model=List[schemas.TagProduct], response_model_exclude_none=True)
async def tag_product_list(
    response: Response,
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 200,
    # current_user: models.User = Depends(deps.get_current_active_superuser),
):
    """
    Get all TagProducts
    """

    tag_products = crud.tag_product.get_multi(
        db, 
        skip=skip, 
        limit=limit
    )

    # print(devices)
    response.headers["Content-Range"] = f"0-9/{len(tag_products)}"
    return tag_products


@router.get("/{tag_product_id}", response_model=schemas.TagProduct, response_model_exclude_none=True)
async def tag_product_detail(
    tag_product_id: int,
    db: Session = Depends(deps.get_db),
    # current_user: models.User = Depends(deps.get_current_active_superuser),
):
    """
    Get a specific TagProduct by id
    """
    tag_product = crud.tag_product.get(db, id=tag_product_id)

    if tag_product is None:
        raise HTTPException(
            status_code=404, detail="The tag_product with this id does not exist in the system",
        )

    return tag_product


@router.post("", response_model=schemas.TagProduct, response_model_exclude_none=True)
async def tag_product_create(
    request: Request,
    tag_product_in: schemas.TagProductCreate,
    db: Session = Depends(deps.get_db),
    # current_user: models.User = Depends(deps.get_current_active_superuser),
):
    """
    Create a new TagProduct
    """
    # tag_product = crud.tag_product.get_tag_product_by_name(db, name=tag_product_in.name)

    # if tag_product:
    #     raise HTTPException(
    #         status_code=400, detail=f"Ya existe la talla que intentas crear {tag_product_in.name}",
    #     )
    
    tag_product = crud.tag_product.create(
        db,
        obj_in=tag_product_in
    )
    
    return tag_product


@router.put("/{tag_product_id}", response_model=schemas.TagProduct, response_model_exclude_none=True)
async def tag_product_update(
    request: Request,
    tag_product_id: int,
    tag_product_in: schemas.TagProductUpdate,
    db: Session = Depends(deps.get_db),
    # current_user: models.User = Depends(deps.get_current_active_superuser),
):
    """
    Update an TagProduct
    """
    tag_product = crud.tag_product.get(db, id=tag_product_id)

    if tag_product is None:
        raise HTTPException(
            status_code=404, detail="The tag_product with this id does not exist in the system",
        )

    tag_product = crud.tag_product.update(
        db,
        db_obj=tag_product,
        obj_in=tag_product_in
    )
    
    return tag_product


@router.delete("/{tag_product_id}", response_model=schemas.TagProduct, response_model_exclude_none=True)
async def tag_product_delete(
    tag_product_id: int,
    db: Session = Depends(deps.get_db),
    # current_user: models.User = Depends(deps.get_current_active_superuser),
):
    """
    Delete an TagProduct
    """
    tag_product = crud.tag_product.get(db, id=tag_product_id)

    if tag_product is None:
        raise HTTPException(
            status_code=404, detail="The tag_product with this id does not exist in the system",
        )

    tag_product = crud.tag_product.remove(db, id=tag_product_id)
    
    return tag_product