// in src/users.js
import React from 'react';
import {
  List,
  Datagrid,
  EditButton,
  ReferenceField,
  TextField
} from 'react-admin';

export const TagProductList = (props) => (
  <List {...props}>
    <Datagrid rowClick="edit">
      {/* <ReferenceField source="product_id" reference="products" />  */}
      <ReferenceField source="product_id" reference="products" link={false}> 
        <TextField source='name' />
        <span> - </span>
        <ReferenceField source="id_type" reference="types" link={false} />
      </ReferenceField>
      <ReferenceField source="tag_id" reference="tags" />
      <EditButton />
    </Datagrid>
  </List>
);
