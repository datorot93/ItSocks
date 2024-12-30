// in src/users.js
import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  BooleanField,
  EmailField,
  EditButton,
} from 'react-admin';

export const UserList = (props) => (
  <List {...props}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <EmailField source="username" />
      <TextField source="full_name" />
      <BooleanField source="is_active" />
      <BooleanField source="is_admin" />
      <EditButton />
    </Datagrid>
  </List>
);
