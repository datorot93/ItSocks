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

export const SizeGuideEdit = (props) => {

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
      `http://ec2-3-138-195-156.us-east-2.compute.amazonaws.com/api/v1/size_guides/${data.id}?size_guide=${data.size_guide}&alt=${data.alt}`,
      // `http://localhost/api/v1/size_guides/${data.id}?size_guide=${data.size_guide}&alt=${data.alt}`,
      {
        method: 'PUT',
        body: formData,
      }
    );

    if (response.ok) {
      notify('File uploaded successfully!');
      redirect('/size_guides'); // Redirigir a la lista de recursos
    } else {
      notify('Failed to upload file', { type: 'error' });
    }
  };

  return (
    <Edit {...props}>
      <SimpleForm onSubmit={handleSave}>
        <TextInput source="size_guide" label="Guia talla"/>
        <TextInput source="alt" label="Alt"/>
        {/* <ConcatenatedReferenceInput source="id.name.id_type" reference="products" /> */}
        <FileInput source="file" label="Size Guide Image" accept="image/*">
          <FileField source="src" title="title" />
        </FileInput>
      </SimpleForm>
    </Edit>
  )
}

