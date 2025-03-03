import React from 'react';
import {
  Edit,
  SimpleForm,
  TextInput,
  ReferenceInput,
  SelectInput
} from 'react-admin';

export const ProductSizeEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput disabled source="id" />
      <ReferenceInput source="product_id" reference="products"/>
      <ReferenceInput source="size_id" reference="sizes" >
                <SelectInput optionText="size" />
              </ReferenceInput>
      {/* <ReferenceInput source="size" reference="sizes"/> */}
    </SimpleForm>
  </Edit>
);
