const initialState = {
    "PARES DE MEDIAS LARGAS X4": false,
    "PARES DE MEDIAS LARGAS X3": false,
    "PARES DE PANTORRILLERAS X4": false,
    "PARES DE PANTORRILLERAS X3": false,
    "PARES MEDIA CAÑA X4": false,
    "PARES MEDIA CAÑA X3": false
};



export const lista_packs = [
    // PARES DE MEDIAS LARGAS
    {
        "id": 101,
        "nombre": "PARES DE MEDIAS LARGAS X4",
        "price": 70000,
        "cantidad": 4,
        "imagen": "../../../public/assets/packs/pack_x4.jpg",
        "to": "/packs/largas"
    },
    {
        "id": 102,
        "nombre": "PARES DE MEDIAS LARGAS X3",
        "price": 60000,
        "cantidad": 3,
        "imagen": "../../../public/assets/packs/pack_x42.jpg",
        "to": "/packs/largas"
    },
    // PARES DE MEDIAS PANTORRILLERAS
    {
        "id": 103,
        "nombre": "PARES DE MEDIAS PANTORILLERAS X4",
        "price": 70000,
        "cantidad": 4,
        "imagen": "../../../public/assets/packs/pack_x3.jpg",
        "to": "/packs/pantorrilleras"
    },
    {
        "id": 104,
        "nombre": "PARES DE MEDIAS PANTORILLERAS X3",
        "price": 60000,
        "cantidad": 3,
        "imagen": "../../../public/assets/packs/pack_x3.jpg",
        "to": "/packs/pantorrilleras"
    },
    // PARES DE MEDIAS MEDIA CANIA
    {
        "id": 105,
        "nombre": "PARES MEDIA CAÑA X4",
        "price": 70000,
        "cantidad": 4,
        "imagen": "../../../public/assets/packs/pack_x4.jpg",
        "to": "/packs/media_cania"
    },
    {
        "id": 106,
        "nombre": "PARES MEDIA CAÑA X3",
        "price": 60000,
        "cantidad": 3,
        "imagen": "../../../public/assets/packs/pack_x42.jpg",
        "to": "/packs/media_cania"
    }
]