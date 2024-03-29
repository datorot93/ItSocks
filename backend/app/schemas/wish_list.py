from typing import Optional
from pydantic import BaseModel


class WishListBase( BaseModel ):
    json_list: str = None
    url_list: str = None
    id_list: str = None

class WishListCreate( WishListBase ):
    json_list: str = None
    url_list: str = None
    id_list: str = None

class WishListUpdate( WishListBase ):
    json_list: str = None
    url_list: str = None
    id_list: str = None

class WishListInDBBase( WishListBase ):
    id: int
    json_list: str = None
    url_list: str = None
    id_list: str = None

    class Config:
        orm_mode = True


class WishList( WishListInDBBase ):
    json_list: str = None
    url_list: str = None
    id_list: str = None

class WishListInDB( WishListInDBBase ):
    pass