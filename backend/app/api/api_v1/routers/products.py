from typing import Any, List

from fastapi import APIRouter, Request, Depends, HTTPException, Response
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps

router = APIRouter()


@router.post("", response_model=schemas.Product, response_model_exclude_none=True)
async def product_create(
    request: Request,
    product_in: schemas.ProductCreate,
    db: Session = Depends(deps.get_db),
    # current_user: models.User = Depends(deps.get_current_active_superuser),
):
    """
    Create a new Product
    """

    product = crud.product.get_product(
        db, 
        name=product_in.name, 
        talla=product_in.talla,
        compresion=product_in.compresion,
        color = product_in.color
    )
    if product:
        raise HTTPException(
            status_code=400, detail="Ya existe el producto que está tratando de crear",
        )
    
    product = crud.product.create(db, obj_in=product_in)
    

    return product


@router.put(
    "/{product_id}", 
    response_model=schemas.Product, 
    response_model_exclude_none=True
)
async def product_edit(
    request: Request,
    product_id: int,
    product_in: schemas.ProductUpdate,
    db: Session = Depends(deps.get_db)
    # current_user: models.User = Depends(deps.get_current_active_superuser),
):
    """ Update an existing Product """
    product = crud.product.get(db, id=product_id)

    if not product:
        raise HTTPException(
            status_code=404, detail="No existe el producto con el id especificado",
        )
    product = crud.product.update(db, db_obj=product, obj_in=product_in)
    return product


@router.get("", response_model=List[schemas.Product], response_model_exclude_none=True)
async def product_list(
    response: Response,
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    # current_user: models.User = Depends(deps.get_current_active_user),
):
    """
    Get all products
    """
    product = crud.product.get_multi(db, skip=skip, limit=limit)
    response.headers["Content-Range"] = f"0-9/{len(product)}"
    return product

@router.get("/accesorios", response_model_exclude_none=True)
async def get_accesorios(
    response: Response,
    category: str,
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    # current_user: models.User = Depends(deps.get_current_active_user),
):
    """
    Obtener todos los accesorios
    """
    products = crud.product.get_products_by_category(db, category=category, skip=skip, limit=limit)
    # response.headers["Content-Range"] = f"0-9/{len(products)}"
    return products

@router.get("/q/products_categories", response_model_exclude_none=True)
async def get_products_by_subcat_cat(
    response: Response,
    category: str,
    subcategory: str,
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
):
    """
    Obtener todos los productos por subcategoria y categoria
    """
    products = crud.product.get_products_by_subcat_cat( 
        db=db,
        category=category,
        subcategory=subcategory,
        skip=skip,
        limit=limit
    )

    return products

@router.get("/q/products_categories_types", response_model_exclude_none=True)
async def get_products_by_cat_subcat_type(
    response: Response,
    category: str,
    subcategory: str,
    type: str,
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
):
    """
    Obtener todos los productos por subcategoria y categoria
    """
    products = crud.product.get_products_by_cat_subcat_type( 
        db=db,
        category=category,
        subcategory=subcategory,
        type=type,
        skip=skip,
        limit=limit
    )

    return products

@router.get("/q/colors_tallas/{name}", response_model_exclude_none=True)
async def get_colors_tallas_by_product(
    response: Response,
    name: str,
    db: Session = Depends(deps.get_db),
):
    """
    Obtener todos los colores de un producto
    """
    
    print(name)
    print('ANTES DEL CRUD')
    product = crud.product.get_products_by_name(db=db, name=name)
    print('DESPUES DEL CRUD')
    # print(product)

    if not product:
        print('ENTRO AL IF')
        raise HTTPException(
            status_code=404, detail="No existe el producto con el nombre especificado",
        )
    
    colors = crud.product.get_colors_tallas_by_product(db=db, name=name)
    return colors


@router.get("/q/products_designs", response_model_exclude_none=True)
async def get_designs_by_cat_subcat(
    response: Response,
    category: str,
    subcategory: str,
    type: str,
    db: Session = Depends(deps.get_db),
):
    """
    Obtener todos los productos por subcategoria y categoria
    """
    products_design = crud.product.get_designs_by_cat_subcat( 
        db=db,
        category=category,
        subcategory=subcategory,
        type=type
    )

    return products_design

@router.get("/q/accesorios_designs", response_model_exclude_none=True)
async def get_accesorios_designs(
    response: Response,
    category: str,
    db: Session = Depends(deps.get_db),
):
    """
    Obtener todos los productos por subcategoria y categoria
    """
    products_design = crud.product.get_accesorios_designs( 
        db=db,
        category=category
    )

    return products_design


@router.get("/q/products/{name}", response_model_exclude_none=True)
async def product_by_name(
    response: Response,
    name: str,
    db: Session = Depends(deps.get_db),
    # current_user: models.User = Depends(deps.get_current_active_user),
):
    """
    Get a specific product by name.
    """
    product = crud.product.get_products_by_name(db=db, name=name)

    if product:
        return product
    else:
        raise HTTPException(status_code=400, detail="The product doesn't exists")


@router.delete(
    "/d/{product_id}", response_model=schemas.Product, response_model_exclude_none=True
)
async def product_delete(
    request: Request,
    product_id: int,
    db: Session = Depends(deps.get_db),
    # current_user: models.User = Depends(deps.get_current_active_superuser),
):
    """
    Delete existing Station
    """
    product = crud.product.get(db, id=product_id)
    if not product:
        raise HTTPException(
            status_code=404,
            detail="No existe el producto especificado",
        )
    product = crud.product.remove(db=db, id=product_id)
    return product


@router.get(
    "/{product_id}", response_model=schemas.Product, response_model_exclude_none=True
)
async def category_by_id(
    product_id: int,
    # current_user: models.User = Depends(deps.get_current_active_user),
    db: Session = Depends(deps.get_db),
):
    """
    Get a specific product by id.
    """
    product = crud.product.get(db, id=product_id)
    if product:
        return product
    else:
        raise HTTPException(status_code=400, detail="The product doesn't exists")
    

