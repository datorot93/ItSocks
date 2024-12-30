import React from 'react';
import {
  Create,
  SimpleForm,
  TextInput,
  ReferenceInput,
  NumberInput,
  FileField,
  FileInput,
  useNotify,
  useRedirect,
} from 'react-admin';

export const SubcategoryCreate = (props) => {

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
      // `http://localhost/api/v1/images?id_product=${data.id_product}`,
      
      `http://localhost/api/v1/subcategories?id_category=${data.id_category}&name=${data.name}&discount=${data.discount? data.discount : "0"}&code=${data.code}`,
      {
        method: 'POST',
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

  return(
    <Create {...props}>
      <SimpleForm onSubmit={handleSave}>
        <ReferenceInput source="id_category" reference="categories" />
        <TextInput source="code" />
        <TextInput source="name" />
        <NumberInput source="discount"/>

        <FileInput source="file" label="Related files" accept="image/*">
          <FileField source="src" title="title" />
        </FileInput>
      </SimpleForm>
    </Create>
  )
}

