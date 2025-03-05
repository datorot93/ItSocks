// in src/users.js
import React from 'react';
import {
  List,
  Datagrid,
  EditButton,
  ReferenceField,
  TextField,
} from 'react-admin';

export const ProductSizeList = (props) => (
  <List {...props}>
    <Datagrid rowClick="edit">

      <ReferenceField source="product_id" reference="products" link={false}> 
        <TextField source='name' />
        <span> - </span>
        <ReferenceField source="id_type" reference="types" link={false} />
      </ReferenceField>

      <ReferenceField source="size_id" reference="sizes" link={false}>
        <TextField source="size" />
      </ReferenceField>
      <EditButton />
    </Datagrid>
  </List>
);
