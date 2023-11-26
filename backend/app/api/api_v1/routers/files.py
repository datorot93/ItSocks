import pandas as pd
import os
from pathlib import Path

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
    'VISERAS': 12
}

dict_subcategory = {
    'Termos': 1,
    'Pines': 2,
    'Viseras': 3,
    'Estampadas': 4,
    'Tejidas': 5,
    'Personalizadas': 6,
    'Canguros': 7
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
    'Canguros': 7
}

dict_compresion = {
    'Verdadero': True,
    'Falso': False
}

dict_estado = {
    'ACTIVO': True,
    'INACTIVO': False
}

# IMAGES_FOLDER = './Datos_ItSocks/IMAGENES'

ruta_script = os.path.abspath(__file__)

# Obtener el directorio padre
IMAGES_FOLDER = os.path.dirname(ruta_script)


def get_images_from_folder(folder):
    print('ESTE ES EL FOLDER')
    print(folder)
    images = []
    if os.path.exists(folder):
        for filename in os.listdir(folder):
            images.append(filename)
    else:
        # raise FileNotFoundError(f'No se encontró la carpeta {folder}')
        print(f'La carpeta {folder} no existe')

    return images



@router.post("/uploadfile")
async def create_upload_file(
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

    for row in df.itertuples():

        product_in = schemas.ProductCreate(
            name= row[2],
            talla = row[14],
            price = float(row[13]),
            state = dict_estado[row[9]],
            color = row[6],
            description = "ESTA ES UNA DESCRIPCIÓN DE PRUEBA",
            compresion = dict_compresion[row[7]],
            code = row[1],
            quantity = row[15],
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

        

        if row[12] == '':
            continue
        else:
            image_folder = IMAGES_FOLDER + '/Datos_ItSocks/IMAGENES/' + row[12] 
            images = get_images_from_folder(image_folder)
            for image in images:
                url = ""
                with open(image_folder + '/' + image, "rb") as buffer:
                    bucket = s3.Bucket('itsocks-images')
                    obj = bucket.Object(image_folder.split('/')[-1] + '_' +image)
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

    return "Archivo cargado con éxito"