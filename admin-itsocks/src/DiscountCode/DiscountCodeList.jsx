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

export const DiscountCodeList = (props) => (
  <List {...props}>
    <Datagrid rowClick="edit">
      <TextField source="code" />
      <NumberField source="discount" />
      <BooleanField source="state" />
      <EditButton />
    </Datagrid>
  </List>
);
