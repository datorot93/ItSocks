// in src/users.js
import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  NumberField,
  EditButton,
  ImageField,
} from 'react-admin';

export const TypeList = (props) => (
  <List {...props}>
    <Datagrid rowClick="edit">
      <TextField source="name" label="Nombre tipo"/>
      {/* <ImageField source="image_url" label="Imagen"/> */}
      <TextField source="code" />
      <NumberField source="discount" />
      <EditButton />
    </Datagrid>
  </List>
);
