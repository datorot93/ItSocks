import React, { useEffect, useState } from 'react';
import {
  Edit,
  SimpleForm,
  TextInput,
  NumberInput,
  ReferenceInput,
  BooleanInput,
  useRecordContext, 
  useDataProvider,
  SelectInput
} from 'react-admin';


const MyConcatenatedField = () => {
  const record = useRecordContext();
  const dataProvider = useDataProvider();
  const [typeName, setTypeName] = useState('');

  useEffect(() => {
      if (record && record.id_type) {
          dataProvider.getOne('types', { id: record.id_type })
              .then(({ data }) => {
                  setTypeName(data.name);
              })
              .catch(error => {
                  console.error(error);
              });
      }
  }, [record, dataProvider]);

  return record ? <span>{record.name} - {typeName}</span> : null;
};

export default MyConcatenatedField;

const ConcatenatedReferenceInput = ({ source, reference, ...props }) => {
  const [firstField, secondField] = source.split('.');

  const obj_types = {
    "1": "Termos",
    "2": "Pines",
    "3": "Viseras",
    "4": "Largas",
    "5": "Media caña",
    "6": "Pantorrilleras",
    "7": "Canguros",
    "8": "Tobilleras",
  }

  return (
    <ReferenceInput
      source={firstField}
      reference={reference}
      {...props}
    >
      <SelectInput
        optionText={(record) => `${record[firstField]} ${obj_types[record[secondField]].toUpperCase()}`}
      />
    </ReferenceInput>
  );
};


export const ImageEdit = (props) => {
  

  return (
    <Edit {...props}>
      <SimpleForm>
        <ReferenceInput source="id_product" reference="products" label="Producto" filter={searchText => ({ name: searchText })}/>
        {/* <ConcatenatedReferenceInput source="name.id_type" reference="products" /> */}
        <TextInput source="url" label="Imagen" />
      </SimpleForm>
    </Edit>
  );
}
