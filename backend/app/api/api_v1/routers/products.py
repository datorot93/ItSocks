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



@router.get("/q/colors_tallas/{name}/{type}", response_model_exclude_none=True)
async def get_colors_tallas_by_product(
    response: Response,
    name: str,
    type: str,
    db: Session = Depends(deps.get_db),
):
    """
    Obtener todos los colores de un producto
    """

    product = crud.product.get_products_by_name_type(db=db, name=name, type=type)
    # print(product)
    
    if not product:
        raise HTTPException(
            status_code=404, detail="No existe el producto con el nombre especificado",
        )
    
    colors = crud.product.get_colors_tallas_by_product(db=db, name=name, type=type)
    return colors



@router.post(
    "/tag_create", 
    response_model=schemas.Tag, 
    response_model_exclude_none=True
)
async def tag_create(
    request: Request,
    tag_in: schemas.TagCreate,
    db: Session = Depends(deps.get_db),
    # current_user: models.User = Depends(deps.get_current_active_superuser),
):
    """
    Create a new Tag
    """

    tag = crud.tag.get_tag(
        db, 
        name=tag_in.name
    )

    if tag:
        raise HTTPException(
            status_code=400, detail="Ya existe el tag que está tratando de crear",
        )
    
    tag = crud.tag.create(db, obj_in=tag_in)

    return tag

@router.get("/tag_products", response_model_exclude_none=True)
async def get_product_by_tag(
    response: Response,
    tag: str,
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    # current_user: models.User = Depends(deps.get_current_active_user),
):
    """
    Obtener todos los productos por tag
    """
    products = crud.product.get_product_by_tag(db, tag=tag, skip=skip, limit=limit)
    
    # response.headers["Content-Range"] = f"0-9/{len(products)}"
    return products


@router.get("/product_by_design", response_model_exclude_none=True)
async def get_product_by_design(
    response: Response,
    design: str,
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    # current_user: models.User = Depends(deps.get_current_active_user),
):
    """
    Obtener todos los productos por diseño
    """
    products = crud.product.get_product_by_design(db, design=design, skip=skip, limit=limit)
    # response.headers["Content-Range"] = f"0-9/{len(products)}"
    return products


@router.get("/tag_products_types", response_model_exclude_none=True)
async def get_products_by_tag_type(
    response: Response,
    tag: str,
    type: str,
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    # current_user: models.User = Depends(deps.get_current_active_user),
):
    """
    Obtener todos los productos por tag
    """
    products = crud.product.get_products_by_tag_type(db, tag=tag, type=type, skip=skip, limit=limit)
    # response.headers["Content-Range"] = f"0-9/{len(products)}"
    return products

@router.get("/tag_products_types_compresion", response_model_exclude_none=True)
async def get_products_by_tag_type_compresion(
    response: Response,
    tag: str,
    type: str,
    compresion: bool,
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    # current_user: models.User = Depends(deps.get_current_active_user),
):
    """
    Obtener todos los productos por tag
    """
    products = crud.product.get_products_by_tag_type_compresion(
        db, 
        tag=tag, 
        type=type,
        compresion=compresion,
        skip=skip, 
        limit=limit
    )
    # response.headers["Content-Range"] = f"0-9/{len(products)}"
    return products

@router.get("/tag_products_subcategory_compresion", response_model_exclude_none=True)
async def get_products_by_tag_subcategory_compresion(
    response: Response,
    tag: str,
    subcategory: str,
    compresion: bool,
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    # current_user: models.User = Depends(deps.get_current_active_user),
):
    """
    Obtener todos los productos por tag
    """
    products = crud.product.get_products_by_tag_subcategory_compresion(
        db, 
        tag=tag, 
        subcategory=subcategory,
        compresion=compresion,
        skip=skip, 
        limit=limit
    )
    # response.headers["Content-Range"] = f"0-9/{len(products)}"
    return products

@router.get(
    "/q/compresion_filters_tag_type/{tag}/{type}", response_model_exclude_none=True
)
async def get_compresion_tag_type_filters(
    response: Response,
    tag: str,
    type: str,
    db: Session = Depends(deps.get_db),
):
    """
    Obtener los filtros por compresión
    """

    compresion_filters = crud.product.get_compresion_filters_tag_type(
        db=db, 
        tag=tag, 
        type=type
    )

    return compresion_filters
    
    

@router.get(
    "/q/compresion_filters_tag_subcategory/{tag}/{subcategory}", response_model_exclude_none=True
)
async def get_compresion_tag_subcategory_filters(
    response: Response,
    tag: str,
    subcategory: str,
    db: Session = Depends(deps.get_db),
):
    """
    Obtener los filtros por compresión
    """

    compresion_filters = crud.product.get_compresion_filters_tag_subcategory(
        db=db, 
        tag=tag, 
        subcategory=subcategory
    )
    
    return compresion_filters


@router.get("/tag_products_subcategories", response_model_exclude_none=True)
async def get_products_by_tag_subcategory(
    response: Response,
    tag: str,
    subcategory: str,
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    # current_user: models.User = Depends(deps.get_current_active_user),
):
    """
    Obtener todos los productos por tag
    """
    products = crud.product.get_products_by_tag_subcategory(db, tag=tag, subcategory=subcategory, skip=skip, limit=limit)
    # response.headers["Content-Range"] = f"0-9/{len(products)}"
    return products

@router.get("/tag_products_subcategories_compresion", response_model_exclude_none=True)
async def get_products_by_tag_subcategories_compresion(
    response: Response,
    tag: str,
    subcategory: str,
    compresion: bool,
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    # current_user: models.User = Depends(deps.get_current_active_user),
):
    """
    Obtener todos los productos por tag
    """
    products = crud.product.get_products_by_tag_subcategory(db, tag=tag, subcategory=subcategory, skip=skip, limit=limit)
    # response.headers["Content-Range"] = f"0-9/{len(products)}"
    return products


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

@router.get("/accesorios/design", response_model_exclude_none=True)
async def get_accesorios_design(
    response: Response,
    category: str,
    design: str,
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    # current_user: models.User = Depends(deps.get_current_active_user),
):
    """
    Obtener todos los accesorios por diseño
    """
    products = crud.product.get_products_by_category_design(db, category=category, design=design, skip=skip, limit=limit)
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

@router.get("/q/products_categories_subcat_types", response_model_exclude_none=True)
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

@router.get("/q/products_categories_subcat_types_designs", response_model_exclude_none=True)
async def get_products_by_cat_subcat_type_design(
    response: Response,
    category: str,
    subcategory: str,
    type: str,
    design: str,
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
):
    """
    Obtener todos los productos por subcategoria y categoria
    """
    products = crud.product.get_products_by_cat_subcat_type_design( 
        db=db,
        category=category,
        subcategory=subcategory,
        type=type,
        design=design,
        skip=skip,
        limit=limit
    )

    return products


@router.get("/q/products_categories_subcat_types_designs_compresion", response_model_exclude_none=True)
async def get_products_by_cat_subcat_type_design_compresion(
    response: Response,
    category: str,
    subcategory: str,
    type: str,
    design: str,
    compresion: bool,
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
):
    """
    Obtener todos los productos por categoria, subcategoria, tipo, diseño y compresion
    """
    products = crud.product.get_products_by_cat_subcat_type_design_compresion( 
        db=db,
        category=category,
        subcategory=subcategory,
        type=type,
        design=design,
        compresion=compresion,
        skip=skip,
        limit=limit
    )

    return products


@router.get("/q/products_categories_types_designs_compresion", response_model_exclude_none=True)
async def get_products_by_cat_type_design_compresion(
    response: Response,
    category: str,
    type: str,
    design: str,
    compresion: bool,
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
):
    """
    Obtener todos los productos por categoria, subcategoria, tipo, diseño y compresion
    """
    products = crud.product.get_products_by_cat_type_design_compresion( 
        db=db,
        category=category,
        type=type,
        design=design,
        compresion=compresion,
        skip=skip,
        limit=limit
    )

    return products


@router.get("/q/products_categories_types", response_model_exclude_none=True)
async def get_products_by_cat_type(
    response: Response,
    category: str,
    type: str,
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
):
    """
    Obtener todos los productos por subcategoria y categoria
    """
    products = crud.product.get_products_by_cat_type( 
        db=db,
        category=category,
        type=type,
        skip=skip,
        limit=limit
    )

    return products

@router.get("/q/products_categories_types_design", response_model_exclude_none=True)
async def get_products_by_cat_type_design(
    response: Response,
    category: str,
    type: str,
    design: str,
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
):
    """
    Obtener todos los productos por subcategoria y categoria
    """
    products = crud.product.get_products_by_cat_type_design( 
        db=db,
        category=category,
        type=type,
        design=design,
        skip=skip,
        limit=limit
    )

    return products



@router.get(
    "/q/compresion_filters/{category}/{subcategory}/{type}/{design}", response_model_exclude_none=True
)
async def get_compresion_filters(
    response: Response,
    category: str,
    subcategory: str,
    type: str,
    design: str,
    db: Session = Depends(deps.get_db),
):
    """
    Obtener los filtros por compresión
    """

    compresion_filters = crud.product.get_compresion_filters(
        db=db, 
        category=category, 
        subcategory=subcategory, 
        type=type,
        design=design
    )
    
    return compresion_filters


@router.get(
    "/q/pack_compresion_filters/{category}/{type}/{design}", response_model_exclude_none=True
)
async def get_pack_compresion_filters(
    response: Response,
    category: str,
    type: str,
    design: str,
    db: Session = Depends(deps.get_db),
):
    """
    Obtener los filtros por compresión (packs)
    """

    compresion_filters = crud.product.get_pack_compresion_filters(
        db=db, 
        category=category, 
        type=type,
        design=design
    )
    
    return compresion_filters


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

@router.get("/q/subcategories_by_tag", response_model_exclude_none=True)
async def get_subcategory_by_tag(
    response: Response,
    tag: str,
    db: Session = Depends(deps.get_db),
):
    """
    Obtener las subcategorias por tag
    """
    subcategories = crud.product.get_subcategory_by_tag( 
        db=db,
        tag=tag
    )

    return subcategories

@router.get("/q/types_by_tag", response_model_exclude_none=True)
async def get_types_by_tag(
    response: Response,
    tag: str,
    db: Session = Depends(deps.get_db),
):
    """
    Obtener los tipos de productos por tag
    """
    subcategories = crud.product.get_type_by_tag( 
        db=db,
        tag=tag
    )

    return subcategories


@router.get("/q/packs_designs", response_model_exclude_none=True)
async def get_designs_by_cat_type(
    response: Response,
    category: str,
    type: str,
    db: Session = Depends(deps.get_db),
):
    """
    Obtener todos los productos por subcategoria y categoria
    """
    products_design = crud.product.get_designs_by_cat_type( 
        db=db,
        category=category,
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
    

