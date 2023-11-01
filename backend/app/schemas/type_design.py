# from typing import Optional
# from pydantic import BaseModel


# class TypeDesignBase( BaseModel ):
#     type_id: int = None
#     design_id: int = None

# class TypeDesignCreate( TypeDesignBase ):
#     pass

# class TypeDesignUpdate( TypeDesignBase ):
#     pass

# class TypeDesignInDBBase( TypeDesignBase ):
#     id: int


#     class Config:
#         orm_mode = True


# class TypeDesign( TypeDesignInDBBase ):
#     pass

# class TypeDesignInDB( TypeDesignInDBBase ):
#     pass