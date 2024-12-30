// in src/users.js
import React from 'react';
import {
  List,
  Datagrid,
  EditButton,
  ReferenceField,
} from 'react-admin';

export const TagProductList = (props) => (
  <List {...props}>
    <Datagrid rowClick="edit">
      <ReferenceField source="product_id" reference="products" />
      <ReferenceField source="tag_id" reference="tags" />
      <EditButton />
    </Datagrid>
  </List>
);
