import React from 'react';
import {
  Create,
  SimpleForm,
  TextInput,
} from 'react-admin';

export const DesignCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="name" />
      <TextInput source="code" />
      <TextInput source="discount" />
    </SimpleForm>
  </Create>
);
