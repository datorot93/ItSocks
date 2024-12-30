// in src/users.js
import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  NumberField,
  ImageField,
  EditButton,
} from 'react-admin';

export const PackList = (props) => (
  <List {...props}>
    <Datagrid rowClick="edit">
      <TextField source="name" label="Nombre"/>
      <ImageField source="image_url" label="Imagen"/>
      <NumberField source="price" label="Precio" options={{
          style: 'currency',
          currency: 'COP',
          minimumFractionDigits: 2
      }}/>
      <TextField source="description" label="Descripción"/>
      <EditButton />
    </Datagrid>
  </List>
);
