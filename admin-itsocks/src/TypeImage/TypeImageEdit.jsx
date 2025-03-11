import React from 'react';
import {
  Edit,
  FileField,
  FileInput,
  SimpleForm,
  TextInput,
  useNotify,
  useRedirect,
} from 'react-admin';

export const TypeImageEdit = (props) => {

  const notify = useNotify()
  const redirect = useRedirect()


  const handleSave = async (data) => {
    const formData = new FormData();
    console.log(data)
    formData.append('file', data.file.rawFile);

    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    const response = await fetch(
      // `http://localhost/api/v1/type_images/${data.id}?name=${data.name}&category=${data.category}&subcategory=${data.subcategory}&description=${data.description}&alt=${data.alt}`,
      `http://ec2-3-138-195-156.us-east-2.compute.amazonaws.com/api/v1/type_images/${data.id}?name=${data.name}&category=${data.category}&subcategory=${data.subcategory}&description=${data.description}&alt=${data.alt}`,
      {
        method: 'PUT',
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


  return(

    <Edit {...props}>
      <SimpleForm onSubmit={handleSave}>
        <TextInput source="id" />
        <TextInput source="name" label="Nombre tipo"/>
        <TextInput source="category" label="Categoría"/>
        <TextInput source="subcategory" label="Subcategoría"/>
        <TextInput source="description" label="Descripción"/>
        <TextInput source="alt" />

        {/* Imagen */}
        <FileInput source="file" label="Imagen" accept="image/*">
          <FileField source="src" title="title" />
        </FileInput>

      </SimpleForm>
    </Edit>
  )
};
