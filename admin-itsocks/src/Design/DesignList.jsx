// in src/users.js
import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  EditButton,
  NumberField,
} from 'react-admin';

export const DesignList = (props) => (
  <List {...props}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="code" />
      <NumberField source="discount" />
      <EditButton />
    </Datagrid>
  </List>
);
