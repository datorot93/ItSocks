import React from 'react';
import {
  Edit,
  SimpleForm,
  TextInput,
  BooleanInput,
} from 'react-admin';

export const ContactInfoEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput disabled source="id" />
      <TextInput source="whatsapp_number"/>
    </SimpleForm>
  </Edit>
);
