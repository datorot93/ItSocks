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

export const TypeEdit = (props) => {

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
      // `http://localhost/api/v1/types/${data.id}?name=${data.name}&discount=${data.discount}&code=${data.code}`,
      `http://ec2-3-138-195-156.us-east-2.compute.amazonaws.com/api/v1/types/${data.id}?name=${data.name}&discount=${data.discount}&code=${data.code}`,
      {
        method: 'PUT',
        body: formData,
      }
    );

    if (response.ok) {
      notify('File uploaded successfully!');
      redirect('/types'); // Redirigir a la lista de recursos
    } else {
      notify('Failed to upload file', { type: 'error' });
    }
  };


  return(

    <Edit {...props}>
      <SimpleForm>
        <TextInput source="id" />
        <TextInput source="name" />
        <TextInput source="code" />
        <TextInput source="discount" />

        {/* Imagen */}
        {/* <FileInput source="file" label="Imagen" accept="image/*">
          <FileField source="src" title="title" />
        </FileInput> */}

      </SimpleForm>
    </Edit>
  )
};
