// in src/users.js
import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  EditButton,
  ReferenceField,
  NumberField,
  ImageField
} from 'react-admin';

export const TypeImageList = (props) => (
  <List {...props}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="category" />
      <TextField source="subcategory" />
      <TextField source="name" />
      <ImageField source="image_url" label="Imagen"/>
      <EditButton />
    </Datagrid>
  </List>
);
