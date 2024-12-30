// in src/users.js
import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  BooleanField,
  EmailField,
  EditButton,
  NumberField,
} from 'react-admin';

export const CategoryList = (props) => (
  <List {...props}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <EmailField source="name" />
      <NumberField source="discount" label="Descuento"/>
      <EditButton />
    </Datagrid>
  </List>
);
