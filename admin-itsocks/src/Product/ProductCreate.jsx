import React from 'react';
import {
  Create,
  SimpleForm,
  TextInput,
  NumberInput,
  BooleanInput,
  ReferenceInput,
  ArrayInput,
  ImageInput,
  FileInput,
  FileField,
} from 'react-admin';

export const ProductCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="code" label="Código"/>
      <TextInput source="name" label="Nombre"/>
      <NumberInput source="discount" label="Descuento"/>
      <TextInput source="description" label="Descripción"/>
      <NumberInput source="price" label="Precio" options={{
          style: 'currency',
          currency: 'COP',
          minimumFractionDigits: 2
      }}/>
      <ReferenceInput 
        label="Subcategoría" 
        source="id_subcategory" 
        reference="subcategories" 
        sort={{ field: 'name', order: 'ASC' }}
      />
      <ReferenceInput source="id_type" reference="types" label="Tipo" />
      <ReferenceInput source="id_design" reference="designs" label="Diseño" />
      <BooleanInput source="state" label="Activo"/>
      <BooleanInput source="compresion" label="¿De compresión?"/>
      <NumberInput source="discount" label="Descuento"/>
      <NumberInput source="quantity" label="Cantidad"/>
      <ArrayInput source="images" label="Imágenes">
        <SimpleForm>
          <FileInput source="file" label="Related files" accept="image/*">
            <FileField source="src" title="title" />
          </FileInput>
        </SimpleForm>
      </ArrayInput>
    </SimpleForm>
  </Create>
);
