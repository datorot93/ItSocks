import React from 'react';
import {
  Edit,
  SimpleForm,
  TextInput
} from 'react-admin';

export const DiscountCodeEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput disabled source="id" />
      <TextInput source="code" />
      <TextInput source="discount" />
      <TextInput source="state" />
    </SimpleForm>
  </Edit>
);
