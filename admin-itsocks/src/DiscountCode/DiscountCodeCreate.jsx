import React from 'react';
import {
  Create,
  SimpleForm,
  TextInput,
  PasswordInput,
  BooleanInput,
} from 'react-admin';

export const DiscountCodeCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="code" />
      <TextInput source="discount" />
      <BooleanInput source="state" />
    </SimpleForm>
  </Create>
);
