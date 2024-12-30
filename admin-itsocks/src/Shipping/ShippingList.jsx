// in src/users.js
import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  NumberField,
  EditButton,
} from 'react-admin';

export const ShippingList = (props) => (
  <List {...props}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="municipio_ciudad" />
      <TextField source="departamento" />
      <NumberField source="tarifa" options={{
          style: 'currency',
          currency: 'COP',
          minimumFractionDigits: 2
      }}/>
      <EditButton />
    </Datagrid>
  </List>
);
