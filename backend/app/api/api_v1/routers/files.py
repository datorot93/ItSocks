import pandas as pd
import os
from pathlib import Path

from PIL import Image

import sqlalchemy
from fastapi import UploadFile, APIRouter, Request, Depends, File, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
import pandas as pd
import numpy as np

from app import models, crud, schemas
from app.api import deps

import boto3

from app.core.config import aws_access_key, aws_secret_key, aws_region_name, aws_bucket_name



router = APIRouter()

dict_disenio = {
    'ANIMALES': 1,
    'COMIDA': 2,
    'NATURALEZA': 3,
    'PERSONAJES': 4,
    'PINES': 5,
    'CANGUROS': 6,
    'DEPORTES': 7,
    'FIGURAS Y COLORES': 8,
    'PROFESIONES': 9,
    'TEMPORADA': 10,
    'TERMOS': 11,
    'VISERAS': 12,
    'Balacas Deportivas': 15
}

dict_subcategory = {
    'Termos': 1,
    'Pines': 2,
    'Viseras': 3,
    'Estampadas': 4,
    'Tejidas': 5,
    'Personalizadas': 6,
    'Canguros': 7,
    'Balacas Deportivas': 19,
}

dict_category = {
    'Medias': 1,
    'Accesorios': 2
}

dict_type = {
    'Termos': 1,
    'Pines': 2,
    'Viseras': 3,
    'Largas': 4,
    'Media caña': 5,
    'Pantorrilleras': 6,
    'Canguros': 7,
    'Balacas Deportivas': 12
}

dict_compresion = {
    'Verdadero': True,
    'Falso': False
}

dict_estado = {
    'ACTIVO': True,
    'INACTIVO': False
}

dict_tallas = {
    '8-10': 1,
    '9-11': 2,
    '10-12': 3,
    'S': 4,
    'M': 5,
    'L': 6,
    'unica': 7,
    '12-14': 8
}


dict_colores = {
    'VERDE': 1,
    'MORADO': 2,
    'NEGRO': 3,
    'AZUL OSCURO': 4,
    'AZUL CLARO': 5,
    'AMARILLO': 6,
    'NARANJA': 7,
    'FUCSIA': 8,
    'ROSADO': 9,
    "AZUL": 10
}


# IMAGES_FOLDER = './Datos_ItSocks/IMAGENES'

ruta_script = os.path.abspath(__file__)

# Obtener el directorio padre
IMAGES_FOLDER = os.path.dirname(ruta_script)


def get_images_from_folder(folder):
    images = []
    if os.path.exists(folder):
        for filename in os.listdir(folder):
            if filename != '.DS_Store':
                images.append(filename)
    else:
        # raise FileNotFoundError(f'No se encontró la carpeta {folder}')
        print('*'*15)
        print('*'*15)
        print(f'La carpeta {folder} no existe')
        print('*'*15)
        print('*'*15)

    return images

def compress_image(input_path, image, calidad=85, compress_level=6, new_width=800):
    """
    Compresses an image and saves the compressed image.

    :param input_path: Path to the input image.
    :param image: Name of the image file.
    :param calidad: Compression quality level (0-100), where 100 is the best quality.
    :param compress_level: Compression level for PNG images (0-9).
    :param new_width: New width for the resized image.
    """
    try:
        print('ESTA ES LA IMAGEN')
        print(image)
        # Abrir la imagen
        imagen = Image.open(input_path + '/' + image)

        aspect_ratio = imagen.width / imagen.height

        new_height = int(new_width / aspect_ratio)

        resized_image = imagen.resize((new_width, new_height))
        print('YA REDIMENSIONÉ LA IMAGEN')
        # Convertir la imagen a RGB si es necesario
        if resized_image.mode in ("RGBA", "P"):
            resized_image.save(f'{IMAGES_FOLDER}/Datos_ItSocks/temp_images/{image}', 'PNG', optimize=True, quality=calidad, compress_level=compress_level)

        else:
            resized_image.save(f'{IMAGES_FOLDER}/Datos_ItSocks/temp_images/{image}', 'JPEG', optimize=True, quality=calidad)

        print(f'Imagen comprimida y guardada en: ./temp_images/{image}')

    except Exception as e:
        raise Exception(f'Ocurrió un error: {e}')
        # print(f'Ocurrió un error: {e}')



def process_image(input_path, image, size=(800, 800)):
    """
    Processes an image by converting it to RGB, resizing it, and saving it as a WebP file.

    :param input_path: Path to the input image.
    :param image: Name of the image file.
    :param size: Tuple specifying the size to which the image should be resized.
    """

    image_without_extension = ''.join(image.split('.')[0:-1])
    output_path = f'{IMAGES_FOLDER}/Datos_ItSocks/temp_images/{image_without_extension}.webp'
    image_path = f'{input_path}/{image}'
    try:
        with Image.open(image_path) as img:
            img = img.convert("RGB")  # Convertir a RGB (necesario para WebP)
            img.thumbnail(size)  # Redimensionar manteniendo proporción
            img.save(output_path, "WEBP")
            print(f"Procesada: {input_path} -> {output_path}")
    except Exception as e:
        print(f"Error procesando {input_path}: {e}")


@router.post("/uploadfile")
async def create_upload_file(
    request: Request,
    file: UploadFile = File(default=None,),
    db: Session = Depends(deps.get_db),
):

    content = await file.read()
    xlsxfile = pd.ExcelFile(content)
    df = xlsxfile.parse("Productos")

    df['CANTIDAD'] = df['CANTIDAD'].fillna(100000000)
    df['IMAGENES'] = df['IMAGENES'].fillna('')
    df['TAGS'] = df['TAGS'].fillna('')
    df['DESCUENTO'] = df['DESCUENTO'].fillna(0)


    df.rename(
        columns={
            'DE COMPRESIÓN?': 'COMPRESION'
        }, inplace=True
    )


    df_productos = df[[
        'CODIGO_PRODUCTO',
        'NOMBRE_PRODUCTO',
        'CATEGORIA',
        'SUBCATEGORÍA',
        'TIPO',
        'COLOR',
        'COMPRESION',
        'DISENIO',
        'ESTADO',
        'DESCUENTO',
        'DESCRIPTION',
        'PRECIO',
        'CANTIDAD',
        'IMAGENES'
    ]].drop_duplicates()


    for row in df_productos.itertuples():
        print( 
            row[2],
            '',
            float(row[12]),
            dict_estado[row[9]],
            '',
            row[11],
            dict_compresion[row[7]],
            row[1],
            row[13],
            dict_disenio[row[8]],
            dict_type[row[5]],
            dict_subcategory[row[4]]
        )
        print('*'*15)
        product_in = schemas.ProductCreate(
            name= row[2],
            talla = '',
            price = float(row[12]),
            state = dict_estado[row[9]],
            color = '',
            description = row[11],
            compresion = dict_compresion[row[7]],
            code = row[1],
            quantity = row[13],
            id_design = dict_disenio[row[8]],
            id_type = dict_type[row[5]],
            id_subcategory = dict_subcategory[row[4]],
        )

        prodcut = crud.product.create(
            db,
            obj_in=product_in
        )

        s3 = boto3.resource(
            's3', 
            aws_access_key_id=aws_access_key, 
            aws_secret_access_key=aws_secret_key,
            region_name=aws_region_name
        )

        if row[14] == '':
            continue
        else:
            image_folder = IMAGES_FOLDER + '/Datos_ItSocks/IMAGENES/' + row[14]

            images = get_images_from_folder(image_folder)
            for image_name in images:
                url = ""
                image_without_extension = ''.join(image_name.split('.')[0:-1])
                process_image(image_folder, image_name)
                # compress_image(image_folder, image_name)

                with open(f'{IMAGES_FOLDER}/Datos_ItSocks/temp_images/' + image_without_extension + '.webp', "rb") as buffer:
                    bucket = s3.Bucket('images-itsocks')
                    obj = bucket.Object(image_folder.split('/')[-1] + '_' +image_name)
                    obj.upload_file(buffer.name)
                    url = f"https://{bucket.name}.s3.amazonaws.com/{obj.key}"


                image_in = schemas.ImageCreate(
                    id_product=prodcut.id,
                    url = url
                )
                image = crud.image.create(
                    db,
                    obj_in=image_in
                )

                os.remove(f'{IMAGES_FOLDER}/Datos_ItSocks/temp_images/{image_without_extension}.webp')


    return "Archivo cargado con éxito"

@router.post("/upload_tags")
async def upload_tags(
    request: Request,
    file: UploadFile = File(default=None,),
    db: Session = Depends(deps.get_db),
):
    content = await file.read()
    xlsxfile = pd.ExcelFile(content)
    df = xlsxfile.parse("Productos")

    df['CANTIDAD'] = df['CANTIDAD'].fillna(1000000)
    df['IMAGENES'] = df['IMAGENES'].fillna('')
    df['TAGS'] = df['TAGS'].fillna('')
    df['DESCUENTO'] = df['DESCUENTO'].fillna(0)
    # df['CANTIDAD'] = df['CANTIDAD'].fillna(0)
    # df['CANTIDAD'] = df['CANTIDAD'].astype(int)

    df.rename(columns={'DE COMPRESIÓN?': 'COMPRESION'}, inplace=True)

    df_productos = df[[
        'CODIGO_PRODUCTO',
        'NOMBRE_PRODUCTO',
        'CATEGORIA',
        'SUBCATEGORÍA',
        'TIPO',
        'COLOR',
        'COMPRESION',
        'DISENIO',
        'ESTADO',
        'DESCUENTO',
        'DESCRIPTION',
        'PRECIO',
        'CANTIDAD',
        'IMAGENES',
        'TAGS'
    ]].drop_duplicates()

    df_productos = df_productos[df['TAGS'] != '']
    
    
    for row in df_productos.itertuples():
        # print('ESTE ES EL ROW')
        # print(row[11], row[2], row[14])
        list_tags = row[15].split(',')
        id_tags = []

        for tag in list_tags:
            tag = tag.strip().upper()

            tag_in = schemas.TagCreate(
                name = tag,
                image_url = '',
                discount = 0
            )

            tag_db = crud.tag.get_tag_by_name(
                db,
                name = tag
            )

            if tag_db is None:
                tag_db = crud.tag.create(
                    db,
                    obj_in = tag_in
                )

            id_tags.append(tag_db.id)

        for id_tag in id_tags:

            product = crud.product.get_product_by_name_subcat_type(
                db,
                name=row[2],
                subcategory=row[4],
                type=row[5]
            )
            print(product)

            if not product:
                # raise HTTPException(
                #     status_code=404,
                #     detail=f"No existe el producto {row[2]} con talla {row[14]}",
                # )
                print(f"No existe el producto {row[2]} con talla {row[14]}")
                continue
            

            crud.tag_product.create(
                db,
                obj_in=schemas.TagProductCreate(
                    product_id = product[0][0],
                    tag_id = id_tag
                )        
            )

    return df.shape


@router.post("/upload_colors")
async def upload_colors(
    request: Request,
    file: UploadFile = File(default=None,),
    db: Session = Depends(deps.get_db),
):
    content = await file.read()
    xlsxfile = pd.ExcelFile(content)
    df = xlsxfile.parse("Productos")

    df['CANTIDAD'] = df['CANTIDAD'].fillna(1000000)
    df['IMAGENES'] = df['IMAGENES'].fillna('')
    df['TAGS'] = df['TAGS'].fillna('')
    df['DESCUENTO'] = df['DESCUENTO'].fillna(0)
    df['COLOR'] = df['COLOR'].fillna('')

    df.rename(columns={'DE COMPRESIÓN?': 'COMPRESION'}, inplace=True)
    
    df = df[df['COLOR'] != '']


    for row in df.itertuples():

        product = crud.product.get_product_by_name_subcat_type(
                db,
                name=row[2],
                subcategory=row[4],
                type=row[5]
            )
        
        if product:
            crud.product_color.create(
                db,
                obj_in=schemas.ProductColorCreate(
                    product_id = product.id,
                    color_id = dict_colores[row[6]]
                )
            )

    return df.shape


@router.post("/upload_sizes")
async def upload_sizes(
    request: Request,
    file: UploadFile = File(default=None,),
    db: Session = Depends(deps.get_db),
):
    content = await file.read()
    xlsxfile = pd.ExcelFile(content)
    df = xlsxfile.parse("Productos")

    df['CANTIDAD'] = df['CANTIDAD'].fillna(1000000)
    df['IMAGENES'] = df['IMAGENES'].fillna('')
    df['TAGS'] = df['TAGS'].fillna('')
    df['DESCUENTO'] = df['DESCUENTO'].fillna(0)
    df['COLOR'] = df['COLOR'].fillna('')

    df.rename(columns={'DE COMPRESIÓN?': 'COMPRESION'}, inplace=True)

    

    for row in df.itertuples():

        product = crud.product.get_product_by_name_subcat_type(
                db,
                name=row[2],
                subcategory=row[4],
                type=row[5]
            )
        
        if product:
            print('ESTE ES EL PRODUCTO')
            print(product[0][0])
            crud.product_size.create(
                db,
                obj_in=schemas.ProductSizeCreate(
                    product_id = product[0][0],
                    size_id = dict_tallas[row[15]]
                )
            )

    return df.shape