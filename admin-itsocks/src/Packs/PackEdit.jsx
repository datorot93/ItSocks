import React from 'react';
import {
  Edit,
  SimpleForm,
  TextInput,
  NumberInput,
  BooleanInput,
  useNotify,
  useRedirect,
  FileInput,
  FileField,
} from 'react-admin';

export const PackEdit = (props) => {

  const notify = useNotify();
  const redirect = useRedirect();

  const handleSave = async (data) => {
    
    if(data.file){
      const formData = new FormData();
      formData.append('file', data.file.rawFile);
  
      const response = await fetch(
        // `http://localhost/api/v1/subcategories/${data.id}?id_category=${data.id_category}&name=${data.name}&discount=${data.discount}&code=${data.code}`,
        `http://localhost/api/v1/packs/14?name=${data.name}&product_quantity=${data.product_quantity}&price=${data.price}&description=${data.description}&state=${data.state}&discount=${data.discount}`,
        {
          method: 'PUT',
          body: formData,
        }
      );
    }else{
      const response = await fetch(
        `http://localhost/api/v1/packs/14?name=${data.name}&product_quantity=${data.product_quantity}&price=${data.price}&description=${data.description}&state=${data.state}&discount=${data.discount}`,
        {
          method: 'PUT',
        }
      );
    }

    if (response.ok) {
      notify('File uploaded successfully!');
      redirect('/packs'); // Redirigir a la lista de recursos
    } else {
      notify('Failed to upload file', { type: 'error' });
      redirect('/packs'); // Redirigir a la lista de recursos
    }
  };

  return(
    <Edit {...props}>
      <SimpleForm onSubmit={handleSave}>
        <TextInput source="name" label="Nombre"/>
        <TextInput source="product_quantity" label="Productos por pack"/>
        <NumberInput source="price" label="Precio" options={{
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 2
        }}/>
        <TextInput source="description" label="Descripción"/>
        <NumberInput source="discount" label="Descuento"/>
        <BooleanInput source="state" label="Activo"/>
        <FileInput source="file" label="Imagen" accept="image/*">
          <FileField source="src" title="title" />
        </FileInput>
      </SimpleForm>
    </Edit>
  )
};
