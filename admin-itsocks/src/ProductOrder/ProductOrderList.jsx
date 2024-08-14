// in src/users.js
import React from 'react';
import {
  List,
  Datagrid,
  EditButton,
  ReferenceField,
} from 'react-admin';

export const ProductOrderList = (props) => (
  <List {...props}>
    <Datagrid rowClick="edit">
      <ReferenceField source="product_id" reference="products" />
      <ReferenceField source="order_id" reference="orders" />
      <EditButton />
    </Datagrid>
  </List>
);
