import React from 'react';
import {
  Edit,
  SimpleForm,
  TextInput,
  FileInput,
  FileField,
  ReferenceInput,
  useNotify,
  useRedirect,
} from 'react-admin';

export const SubcategoryEdit = (props) => {

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
      
      `http://ec2-3-138-195-156.us-east-2.compute.amazonaws.com/api/v1/subcategories/${data.id}?id_category=${data.id_category}&name=${data.name}&discount=${data.discount}&code=${data.code}`,
      // `http://localhost/api/v1/subcategories/${data.id}?id_category=${data.id_category}&name=${data.name}&discount=${data.discount}&code=${data.code}`,
      {
        method: 'PUT',
        body: formData,
      }
    );

    if (response.ok) {
      notify('File uploaded successfully!');
      redirect('/subcategories'); // Redirigir a la lista de recursos
    } else {
      notify('Failed to upload file', { type: 'error' });
    }
  };

  return (
    <Edit {...props}>
      <SimpleForm onSubmit={ handleSave }>
        <TextInput source="id" />
        {/* <TextInput source="id_category" /> */}
        <ReferenceInput source="id_category" reference="categories" label="Category"/>
          
        <TextInput source="code" />
        <TextInput source="name" />
        <TextInput source="discount"/>

        {/* Imagen */}
        <FileInput source="file" label="Imagen" accept="image/*">
          <FileField source="src" title="title" />
        </FileInput>
      </SimpleForm>
    </Edit>
  )
}

