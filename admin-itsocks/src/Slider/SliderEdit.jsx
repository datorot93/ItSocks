import React from 'react';
import {
  Edit,
  SimpleForm,
  TextInput,
  BooleanInput,
} from 'react-admin';

export const SliderEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput disabled source="id" />
      <TextInput source="link" />
      <TextInput source="description" />
      <TextInput source="alto" />
      <TextInput source="url" />
      <BooleanInput source="state" />
    </SimpleForm>
  </Edit>
);
