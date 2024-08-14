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


    // const response = await fetch(`http://localhost/api/v1/images?id_product=${data.id_product}`, {
    const response = await fetch(`http://localhost/api/v1/size_guides?size_guide=${data.size_guide}&alt=${data.alt}`, {
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
        <FileInput source="file" label="Related files" accept="image/*">
          <FileField source="src" title="title" />
        </FileInput>
      </SimpleForm>
    </Create>
  );
};
