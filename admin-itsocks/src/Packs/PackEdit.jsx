import React from 'react';
import {
  Edit,
  SimpleForm,
  TextInput,
  NumberInput,
  BooleanInput,
} from 'react-admin';

export const PackEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="name" label="Nombre"/>
      <TextInput source="image_url" label="URL imagen"/>
      <TextInput source="product_queantity" label="Productos por pack"/>
      <NumberInput source="price" label="Precio" options={{
          style: 'currency',
          currency: 'COP',
          minimumFractionDigits: 2
      }}/>
      <TextInput source="description" label="Descripción"/>
      <NumberInput source="discount" label="Descuento"/>
      <BooleanInput source="state" label="Activo"/>
      
    </SimpleForm>
  </Edit>
);
