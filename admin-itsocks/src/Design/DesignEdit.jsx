import React from 'react';
import {
  Edit,
  SimpleForm,
  TextInput,
} from 'react-admin';

export const DesignEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput disabled source="id" />
      <TextInput source="name" />
      <TextInput source="code" />
      <TextInput source="discount" />
    </SimpleForm>
  </Edit>
);
