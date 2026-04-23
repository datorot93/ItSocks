// in src/users.js
import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  NumberField,
  EditButton,
  TextInput,
  Filter
} from 'react-admin';


const PostFilter = (props) => (
  <Filter {...props}>
      <TextInput label="Buscar" source="q" alwaysOn />
      {/* <TextInput label="Title" source="title" /> */}
  </Filter>
);

export const ShippingList = (props) => {

  return (

    <List {...props} filters={<PostFilter />} >
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
  )
}

