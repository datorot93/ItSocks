// in src/users.js
import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  TextInput,
  EditButton,
  ReferenceField,
  BooleanField,
  NumberField,
  Filter,
} from 'react-admin';

const PostFilter = (props) => (
  <Filter {...props}>
      <TextInput label="Buscar" source="q" alwaysOn />
      {/* <TextInput label="Title" source="title" /> */}
  </Filter>
);

export const ProductList = (props) => (
    <List filters={<PostFilter />} {...props} >
    <Datagrid rowClick="edit">
      <TextField source="code" label="Código"/>
      <TextField source="name" label="Nombre"/>
      <NumberField source="price" label="Precio" options={{
          style: 'currency',
          currency: 'COP',
          minimumFractionDigits: 2
      }}/>
      <ReferenceField source="id_subcategory" reference="subcategories" label="Categoría" link={false}>
        <ReferenceField source="id_category" reference="categories" label="Categoría" link={false}>
          <TextField source="name" label="Categoría"/>
        </ReferenceField>
      </ReferenceField>
      <ReferenceField source="id_subcategory" reference="subcategories" label="Subcategoría" />
      <ReferenceField source="id_type" reference="types" label="Tipo" />
      <ReferenceField source="id_design" reference="designs" label="Diseño" />
      <BooleanField source="state" label="Activo"/>
      {/* <TextField source="description" label="Descripción"/> */}
      <EditButton />
    </Datagrid>
  </List>
);
