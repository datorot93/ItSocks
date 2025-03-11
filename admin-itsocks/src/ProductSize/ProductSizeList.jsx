// in src/users.js
import React from 'react';
import {
  List,
  Datagrid,
  EditButton,
  ReferenceField,
  TextField,
  Filter,
  TextInput
} from 'react-admin';

const PostFilter = (props) => (
  <Filter {...props}>
      <TextInput label="Buscar" source="q" alwaysOn />
      {/* <TextInput label="Title" source="title" /> */}
  </Filter>
);

export const ProductSizeList = (props) => {

  return(
    <List {...props} filters={ <PostFilter /> }>
        <Datagrid rowClick="edit">

          <ReferenceField source="product_id" reference="products" link={false}> 
            <TextField source='name' />
            <span> - </span>
            <ReferenceField source="id_type" reference="types" link={false} />
          </ReferenceField>

          <ReferenceField source="size_id" reference="sizes" link={false}>
            <TextField source="size" />
          </ReferenceField>
          <EditButton />
        </Datagrid>
    </List>
  )
}
