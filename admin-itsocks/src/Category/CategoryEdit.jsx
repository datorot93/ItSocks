import React from 'react';
import {
  Edit,
  NumberField,
  NumberInput,
  SimpleForm,
  TextInput,
} from 'react-admin';

export const CategoryEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput disabled source="id" />
      <TextInput source="name" />
      <NumberInput source="discount" />
    </SimpleForm>
  </Edit>
);
