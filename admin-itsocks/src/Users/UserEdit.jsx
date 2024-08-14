import React from 'react';
import {
  Edit,
  SimpleForm,
  TextInput,
  PasswordInput,
  BooleanInput,
} from 'react-admin';

export const UserEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput disabled source="id" />
      <TextInput source="username" />
      <TextInput source="full_name" />
      <PasswordInput source="password" />
      <BooleanInput source="is_active" />
      <BooleanInput source="is_admin" />
    </SimpleForm>
  </Edit>
);
