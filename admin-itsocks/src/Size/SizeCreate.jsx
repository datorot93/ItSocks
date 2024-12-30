import React from 'react';
import {
  Create,
  SimpleForm,
  TextInput,
  PasswordInput,
  BooleanInput,
} from 'react-admin';

export const SizeCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="size" />
    </SimpleForm>
  </Create>
);
