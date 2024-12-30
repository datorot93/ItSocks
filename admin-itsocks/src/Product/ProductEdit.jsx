import React from 'react';
import {
  Edit,
  SimpleForm,
  TextInput,
  NumberInput,
  ReferenceInput,
  BooleanInput,
  ArrayInput,
  FileInput,
  FileField,
  ImageInput,
  ImageField,
} from 'react-admin';

export const ProductEdit = (props) => (
  <Edit {...props}>
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
      <ReferenceInput source="id_subcategory" reference="subcategories" label="Subcategoría" />
      <ReferenceInput source="id_type" reference="types" label="Tipo" />
      <ReferenceInput source="id_design" reference="designs" label="Diseño" />
      <BooleanInput source="state" label="Activo"/>
      <BooleanInput source="compresion" label="¿De compresión?"/>
      <NumberInput source="discount" label="Descuento"/>
      <NumberInput source="quantity" label="Cantidad"/>
      {/* <ArrayInput source="images" label="Imágenes">
          <ImageField source="url" label="Related images" accept="image/*" />
          <FileInput source="file" label="Related files" accept="image/*">
            <FileField source="src" title="title" />
          </FileInput>

      </ArrayInput> */}
    </SimpleForm>
  </Edit>
);





