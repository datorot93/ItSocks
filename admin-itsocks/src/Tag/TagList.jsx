// in src/users.js
import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  EditButton,
  ImageField,
  BooleanField,
  NumberField,
} from 'react-admin';

export const TagList = (props) => (
  <List {...props}>
    <Datagrid rowClick="edit">
      <TextField source="name" />
      <ImageField source="image_url" label="Imagen"/>
      <EditButton />
    </Datagrid>
  </List>
);
