import React from 'react';
import {
  Edit,
  SimpleForm,
  TextInput,
  ReferenceInput,
  SelectInput,
  AutocompleteInput
} from 'react-admin';

export const ProductSizeEdit = (props) => {

  const obj_types = {
    "1": "Termos",
    "2": "Pines",
    "3": "Viseras",
    "4": "Largas",
    "5": "Media caña",
    "6": "Pantorrilleras",
    "7": "Canguros",
    "8": "Tobilleras",
    "11": "Mangas"
  }

  return (

    <Edit {...props}>
      <SimpleForm>
        <TextInput disabled source="id" />

        <ReferenceInput 
          source="product_id" 
          reference="products" 
          label="Producto"
          filter={searchText => ({ name: searchText })}
          format={ (value) => `${value.name} ${value.id_type}`}
        >
          <AutocompleteInput 
            label="Producto" 
            optionText={(record) => `${record.name} - ${obj_types[record.id_type]}`}
          />
        </ReferenceInput>
        
        <ReferenceInput source="size_id" reference="sizes" >
          <SelectInput optionText="size" />
        </ReferenceInput>
        {/* <ReferenceInput source="size" reference="sizes"/> */}
      </SimpleForm>
    </Edit>
  )
}

