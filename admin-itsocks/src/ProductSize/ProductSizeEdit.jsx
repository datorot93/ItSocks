import React from 'react';
import {
  Edit,
  SimpleForm,
  TextInput,
  ReferenceInput,
} from 'react-admin';

export const ProductSizeEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput disabled source="id" />
      <ReferenceInput source="product_id" reference="products"/>
      <ReferenceInput source="size_id" reference="sizes"/>
    </SimpleForm>
  </Edit>
);
