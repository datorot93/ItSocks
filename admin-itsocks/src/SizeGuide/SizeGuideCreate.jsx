import React from 'react';

import { Create, 
  SimpleForm, 
  FileInput, 
  FileField, 
  useNotify, 
  useRedirect, 
  ReferenceInput ,
  SelectInput,
  AutocompleteInput,
  TextInput,
} from 'react-admin';

export const SizeGuideCreate = (props) => {

  const notify = useNotify();
  const redirect = useRedirect();

  const handleSave = async (data) => {
    const formData = new FormData();
    formData.append('file', data.file.rawFile);


    
    const response = await fetch(`http://ec2-3-138-195-156.us-east-2.compute.amazonaws.com/api/v1/size_guides?size_guide=${data.size_guide}&alt=${data.alt}`, {
    // const response = await fetch(`http://localhost/api/v1/size_guides?size_guide=${data.size_guide}&alt=${data.alt}`, {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      notify('File uploaded successfully!');
      redirect('/size_guides'); // Redirigir a la lista de recursos
    } else {
      notify('Failed to upload file', { type: 'error' });
    }
  };


  return (
    <Create {...props}>
      <SimpleForm onSubmit={handleSave}>
        <TextInput source="size_guide" label="Guia talla"/>
        <TextInput source="alt" label="Alt"/>
        {/* <ConcatenatedReferenceInput source="id.name.id_type" reference="products" /> */}
        <FileInput source="file" label="Size Guide Image" accept="image/*">
          <FileField source="src" title="title" />
        </FileInput>
      </SimpleForm>
    </Create>
  );
};
