import React from 'react';
import {
  Create,
  SimpleForm,
  TextInput,
  NumberInput,
  BooleanInput,
  ReferenceInput,
  useNotify,
  useRedirect,
  FileField,
  FileInput
} from 'react-admin';

export const PackCreate = (props) => {

  const notify = useNotify();
  const redirect = useRedirect();

  const handleSave = async (data) => {
    const formData = new FormData();
    if (data.file){
      formData.append('file', data.file.rawFile);
    }
    
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    const response = await fetch(
      `http://localhost/api/v1/packspack_create?name=${data.name}&product_quantity=${data.product_quantity}&price=${data.price}&description=${data.description}`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (response.ok) {
      notify('File uploaded successfully!');
      redirect('/packs'); // Redirigir a la lista de recursos
    } else {
      notify('Failed to upload file', { type: 'error' });
    }
  };

  return (
      <Create {...props}>
      <SimpleForm onSubmit={handleSave}>
        <TextInput source="name" label="Nombre"/>
        <TextInput source="product_quantity" label="Productos por pack"/>
        <NumberInput source="price" label="Precio" options={{
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 2
        }}/>
        <TextInput source="description" label="Descripción"/>
        <FileInput source="file" label="Imagen" accept="image/*">
          <FileField source="src" title="title" />
        </FileInput>
      </SimpleForm>
    </Create>
  )

};
