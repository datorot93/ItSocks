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

export const SizeGuideList = (props) => (
  <List {...props} >
    <Datagrid rowClick="edit">
      <TextField source="size_guide" />
      <TextField source="alt" />
      <ImageField source="image_url" />
    </Datagrid>
  </List>
);
