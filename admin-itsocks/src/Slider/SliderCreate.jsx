import React from 'react';

import { Create, SimpleForm, FileInput, FileField, useNotify, useRedirect, TextInput } from 'react-admin';

export const SliderCreate = (props) => {

  const notify = useNotify();
  const redirect = useRedirect();

  const handleSave = async (data) => {
    const formData = new FormData();
    formData.append('file', data.file.rawFile);
    console.log('formData', formData.entries())
    const response = await fetch('http://localhost/api/v1/sliders', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      notify('File uploaded successfully!');
      redirect('/sliders'); // Redirigir a la lista de recursos
    } else {
      notify('Failed to upload file', { type: 'error' });
    }
  };


  return (
    <Create {...props}>
      <SimpleForm onSubmit={handleSave}>
        {/* <TextInput source="description" label="Descripción"/>
        <TextInput source="alt" label="Alt"/>
        <TextInput source="link" label="Enlace página"/> */}
        <FileInput source="file" label="Related files" accept="image/*">
          <FileField source="src" title="title" />
        </FileInput>
      </SimpleForm>
    </Create>
  );
};
