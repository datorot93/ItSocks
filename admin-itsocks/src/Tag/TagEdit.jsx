import React from 'react';
import {
  Edit,
  SimpleForm,
  TextInput,
  NumberInput,
  FileInput,
  FileField,
  useNotify,
  useRedirect,
} from 'react-admin';

export const TagEdit = (props) => {

  const notify = useNotify();
  const redirect = useRedirect();


  const handleSave = async (data) => {
    const formData = new FormData();
    formData.append('file', data.file.rawFile);



    const response = await fetch(`http://localhost/api/v1/tags/${data.id}?tag_name=${data.name}&discount=${data.discount}`, {
    // const response = await fetch(`http://localhost/api/v1/tags?name=${data.name}`, {
      method: 'PUT',
      body: formData,
    });

    if (response.ok) {
      notify('File edited successfully!');
      redirect('/tags'); // Redirigir a la lista de recursos
    } else {
      notify('Failed to upload file', { type: 'error' });
    }
  };


  return (<Edit {...props}>
    <SimpleForm onSubmit={handleSave}>
      <TextInput source="id" />
      <TextInput source="name" />

      <FileInput source="file" label="Imagen" accept="image/*">
        <FileField source="src" title="title" />
      </FileInput>

    </SimpleForm>
  </Edit>)
};
