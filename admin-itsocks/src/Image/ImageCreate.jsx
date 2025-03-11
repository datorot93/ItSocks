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
} from 'react-admin';

export const ImageCreate = (props) => {

  const notify = useNotify();
  const redirect = useRedirect();

  const handleSave = async (data) => {
    const formData = new FormData();
    formData.append('file', data.file.rawFile);

    const response = await fetch(`http://ec2-3-138-195-156.us-east-2.compute.amazonaws.com/api/v1/images?id_product=${data.id_product}`, {
    // const response = await fetch(`http://localhost/api/v1/images?id_product=${data.id_product}`, {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      notify('File uploaded successfully!');
      redirect('/#/sliders'); // Redirigir a la lista de recursos
    } else {
      notify('Failed to upload file', { type: 'error' });
    }
  };


  const obj_types = {
    "1": "Termos",
    "2": "Pines",
    "3": "Viseras",
    "4": "Largas",
    "5": "Media caña",
    "6": "Pantorrilleras",
    "7": "Canguros",
    "8": "Tobilleras",
    "11": "Mangas"
  }

  return (
    <Create {...props}>
      <SimpleForm onSubmit={handleSave}>
        <ReferenceInput 
          source="id_product" 
          reference="products" 
          label="Producto"
          filter={searchText => ({ name: searchText })}
          format={ (value) => `${value.name} ${value.id_type}`}
        >

          <AutocompleteInput 
            label="Producto" 
            optionText={(record) => `${record.name} - ${obj_types[record.id_type]}`}
          />
        </ReferenceInput>

        {/* <ConcatenatedReferenceInput source="id.name.id_type" reference="products" /> */}
        <FileInput source="file" label="Related files" accept="image/*">
          <FileField source="src" title="title" />
        </FileInput>
      </SimpleForm>
    </Create>
  );
};
