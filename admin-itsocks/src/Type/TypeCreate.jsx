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

export const TypeCreate = (props) => {

  const notify = useNotify();
  const redirect = useRedirect();

  const handleSave = async (data) => {
    const formData = new FormData();
    formData.append('file', data.file.rawFile);

    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    const response = await fetch(
      // `http://localhost/api/v1/types?name=${data.name}&discount=${data.discount}&code=${data.code}`,
      `http://ec2-3-138-195-156.us-east-2.compute.amazonaws.com/api/v1/types?name=${data.name}&discount=${data.discount}&code=${data.code}`,
      {
        method: 'POST',
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

  return (
    <Create {...props}>
      <SimpleForm >
        <TextInput source="name" />
        <TextInput source="code" />
        <TextInput source="discount" />
        
        {/* <FileInput source="file" label="Imagen" accept="image/*">
          <FileField source="src" title="title" />
        </FileInput> */}
      </SimpleForm>
    </Create>
  )
};
