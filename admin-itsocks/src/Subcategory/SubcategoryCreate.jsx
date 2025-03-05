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
    // Construye la URL base con todos los parámetros obligatorios
    const baseUrl = `http://localhost/api/v1/subcategories?id_category=${data.id_category}&name=${data.name}&discount=${data.discount || "0"}&code=${data.code || ""}`;
    
    // Si hay un archivo, usa FormData para enviarlo
    if (data.file && data.file.rawFile) {
      const formData = new FormData();
      formData.append('file', data.file.rawFile);
      
      const response = await fetch(baseUrl, {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        notify('Subcategory created with image successfully!');
        redirect('/subcategories');
      } else {
        notify('Failed to create subcategory', { type: 'error' });
      }
    } else {
      // Si no hay archivo, envía la solicitud sin FormData
      const response = await fetch(baseUrl, {
        method: 'POST',
        // No incluyas body aquí, todos los datos necesarios están en la URL
      });
      
      if (response.ok) {
        notify('Subcategory created successfully!');
        redirect('/subcategories');
      } else {
        notify('Failed to create subcategory', { type: 'error' });
      }
    }
  };

  return(
    <Create {...props}>
      <SimpleForm onSubmit={handleSave}>
        <ReferenceInput source="id_category" reference="categories" />
        <TextInput source="code" />
        <TextInput source="name" required />
        <NumberInput source="discount" defaultValue={0} />

        <FileInput source="file" label="Related files" accept="image/*">
          <FileField source="src" title="title" />
        </FileInput>
      </SimpleForm>
    </Create>
  )
}

