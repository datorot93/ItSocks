import React from 'react';
import {
  Create,
  SimpleForm,
  TextInput,
  PasswordInput,
  BooleanInput,
} from 'react-admin';

export const UserCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="username" />
      <TextInput source="full_name" />
      <PasswordInput source="password" />
      <BooleanInput source="is_admin" />
      <BooleanInput source="is_active" />
    </SimpleForm>
  </Create>
);
