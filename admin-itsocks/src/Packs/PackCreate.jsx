import React from 'react';
import {
  Create,
  SimpleForm,
  TextInput,
  NumberInput,
  BooleanInput,
  ReferenceInput,
} from 'react-admin';

export const PackCreate = (props) => (
  <Create {...props}>
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
  </Create>
);
