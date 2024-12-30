// in src/users.js
import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  EditButton,
  ImageField,
  BooleanField,
} from 'react-admin';

export const SliderList = (props) => (
  <List {...props}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="link" />
      <TextField source="description" />
      <TextField source="alt" />
      <ImageField source="url" />
      <BooleanField source="state" />
      <EditButton />
    </Datagrid>
  </List>
);
