import React from 'react';
import {
  Create,
  SimpleForm,
  TextInput,
  ImageField,
  BooleanInput,
  useNotify,
  useRedirect,
  FileInput,
  FileField,
} from 'react-admin';

export const TagCreate = (props) => {


  const notify = useNotify();
  const redirect = useRedirect();

  const handleSave = async (data) => {
    const formData = new FormData();
    formData.append('file', data.file.rawFile);
    console.log('formData', formData.entries())

    const response = await fetch(`http://ec2-3-138-195-156.us-east-2.compute.amazonaws.com/api/v1/tags?name=${data.name}`, {
    // const response = await fetch(`http://localhost/api/v1/tags?name=${data.name}`, {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      notify('File uploaded successfully!');
      redirect('/tags'); // Redirigir a la lista de recursos
    } else {
      notify('Failed to upload file', { type: 'error' });
    }
  };

  return(

    <Create {...props}>
      <SimpleForm onSubmit={handleSave}>
        <TextInput source="name" />
        <FileInput source="file" label="Related files" accept="image/*">
          <FileField source="src" title="title" />
        </FileInput>
      </SimpleForm>
    </Create>
  )
};
