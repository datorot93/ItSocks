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

export const SubcategoryList = (props) => (
  <List {...props}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <ReferenceField source="id_category" reference="categories" label="Category"/>
      <TextField source="code" />
      <ImageField source="image_url" label="Imagen"/>
      <TextField source="name" />
      <NumberField source="discount" />
      <EditButton />
    </Datagrid>
  </List>
);
