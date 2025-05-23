import React from 'react';
import {
  Create,
  SimpleForm,
  TextInput,
  PasswordInput,
  BooleanInput,
  useNotify,
  useRedirect,
  FileInput,
  FileField,
} from 'react-admin';

export const TypeImageCreate = (props) => {

  const notify = useNotify();
  const redirect = useRedirect();

  const handleSave = async (data) => {
    const formData = new FormData();
    formData.append('file', data.file.rawFile);

    const response = await fetch(
      // `http://localhost/api/v1/type_images?name=${data.name}&category=${data.category}&subcategory=${data.subcategory}&description=${data.description}&alt=${data.alt}`,
      `http://ec2-3-138-195-156.us-east-2.compute.amazonaws.com/api/v1/type_images?name=${data.name}&category=${data.category}&subcategory=${data.subcategory}&description=${data.description}&alt=${data.alt}`,
      // `http://localhost/api/v1/type_images?type_name=${data.name}&category=${data.category}&subcategory=${data.subcategory}`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (response.ok) {
      notify('File uploaded successfully!');
      redirect('/type_images'); // Redirigir a la lista de recursos
    } else {
      notify('Failed to upload file', { type: 'error' });
    }
  };

  return (
    <Create {...props}>
      <SimpleForm onSubmit={handleSave}>
        <TextInput source="name" />
        <TextInput source="category" />
        <TextInput source="subcategory" />
        <TextInput source="description" />
        <TextInput source="alt" />
        
        <FileInput source="file" label="Imagen" accept="image/*">
          <FileField source="src" title="title" />
        </FileInput>
      </SimpleForm>
    </Create>
  )
};
