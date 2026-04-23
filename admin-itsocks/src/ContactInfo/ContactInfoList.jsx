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

export const ContactInfoList = (props) => (
  <List {...props}>
    <Datagrid rowClick="edit">
      <TextField source="id"/>
      <TextField source="whatsapp_number" />
      <EditButton />
    </Datagrid>
  </List>
);
