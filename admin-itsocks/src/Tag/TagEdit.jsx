import React from 'react';
import {
  Edit,
  SimpleForm,
  TextInput,
  NumberInput,
} from 'react-admin';

export const TagEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput disabled source="id" />
      <TextInput source="name" />
    </SimpleForm>
  </Edit>
);
