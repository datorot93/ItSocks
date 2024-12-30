import React from 'react';
import {
  Create,
  SimpleForm,
  TextInput,
  PasswordInput,
  BooleanInput,
} from 'react-admin';

export const ShippingCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="municipio_ciudad" />
      <TextInput source="departamento" />
      <TextInput source="tarifa" />
    </SimpleForm>
  </Create>
);
