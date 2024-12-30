import React from 'react';
import {
  Edit,
  SimpleForm,
  TextInput,
  NumberInput,
} from 'react-admin';

export const ShippingEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput disabled source="id" />
      <TextInput source="municipio_ciudad" />
      <TextInput source="departamento" />
      <NumberInput source="tarifa" options={{
          style: 'currency',
          currency: 'COP',
          minimumFractionDigits: 2
      }}/>
    </SimpleForm>
  </Edit>
);
