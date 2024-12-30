import React from 'react';
import {
  Edit,
  SimpleForm,
  TextInput,
  NumberInput,
  ReferenceInput,
} from 'react-admin';

export const ProductOrderEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput disabled source="id" />
      <ReferenceInput source="product_id" reference="products"/>
      <ReferenceInput source="order_id" reference="orders"/>
    </SimpleForm>
  </Edit>
);
