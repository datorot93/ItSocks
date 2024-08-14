import React from 'react';
import {
  Edit,
  SimpleForm,
  TextInput,
  NumberInput,
} from 'react-admin';

export const SizeEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput disabled source="id" />
      <TextInput source="size" />
    </SimpleForm>
  </Edit>
);
