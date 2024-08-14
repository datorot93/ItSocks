// in src/users.js
import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  EditButton,
  BooleanField,
  NumberField,
} from 'react-admin';

export const SizeList = (props) => (
  <List {...props}>
    <Datagrid rowClick="edit">
      <TextField source="size" label="Talla"/>
      <EditButton />
    </Datagrid>
  </List>
);
