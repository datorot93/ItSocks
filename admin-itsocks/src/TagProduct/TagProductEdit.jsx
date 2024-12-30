import React from 'react';
import {
  Edit,
  SimpleForm,
  TextInput,
  NumberInput,
  ReferenceInput,
} from 'react-admin';

export const TagProductEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput disabled source="id" />
      <ReferenceInput source="product_id" reference="products"/>
      <ReferenceInput source="tag_id" reference="tags"/>
    </SimpleForm>
  </Edit>
);
