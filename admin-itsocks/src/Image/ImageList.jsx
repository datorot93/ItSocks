// in src/users.js
import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  ImageField,
  EditButton,
  ReferenceField,
  Filter,
  TextInput,
} from 'react-admin';


const PostFilter = (props) => (
  <Filter {...props}>
      <TextInput label="Buscar" source="q" alwaysOn />
      {/* <TextInput label="Title" source="title" /> */}
  </Filter>
);

export const ImageList = (props) => (
  <List filters={ <PostFilter />} {...props}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <ReferenceField source="id_product" reference="products" link={false}> 
        <TextField source='name' />
        <span> - </span>
        <ReferenceField source="id_type" reference="types" link={false} />
      </ReferenceField>
      <TextField source="id_product" />
      <ImageField source="url" label="Imagen"/>
      <EditButton />
    </Datagrid>
  </List>
);
