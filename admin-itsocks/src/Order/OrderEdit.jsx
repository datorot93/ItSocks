import React from 'react';
import {
  Edit,
  SimpleForm,
  TextInput,
  BooleanInput,
  ReferenceArrayField,
  ArrayField,
  Datagrid,
  TextField,
  NumberField,
  ChipField,
  List
} from 'react-admin';

export const OrderEdit = (props) => (

  <>
  
    <Edit {...props}>
      <h2>Productos</h2>
      <ArrayField source="products" label="Productos">
        <Datagrid rowClick="" bulkActionButtons={false}>
          <TextField source="code" label="Código" />
          <TextField source="name" disabled label="Nombre"/>
          <TextField source="type" disabled label="Tipo" />
          <TextField source="product_size" disabled label="Talla" />
          <TextField source="cantidad" label="Cantidad" disabled/>
          <TextField source="pack" label="Pack" />
          <TextField source="num_in_order" label="Número en orden" />
        </Datagrid>
      </ArrayField>
    </Edit>

    <Edit {...props}>
      <SimpleForm>
        <h2>Cliente</h2>
        <TextInput disabled source="id" />
        <TextInput source="first_name" label="Nombre" />
        <TextInput source="last_name" label="Apellido" />
        <TextInput source="document" label="Documento" />
        <TextInput source="phone_number" label="Teléfono" />
        <TextInput source="email" label="Correo" />
        <h2>Información de facturación</h2>
        <TextInput source="country" label="País" />
        <TextInput source="region" label="Región" />
        <TextInput source="city" label="Ciudad" />
        <TextInput source="billing_addess" label="Dirección facturación" />
        <TextInput source="extra_info" label="Información adicional" />
        <h2>Información de envío</h2>
        <TextInput source="address" label="Dirección envío" />
        <TextInput source="extra_info" label="Información adicional" />
        <BooleanInput source="isGift" label="¿Es un regalo?" />
        <TextInput source="de" label="De" />
        <TextInput source="para" label="Para" />
        
        <TextInput source="country" label="País envío"/>
        <TextInput source="region" label="Región envío" />
        <TextInput source="city" label="Ciudad envío" />

        


       
        <h2>Guía de envío</h2>
        <TextInput source="shipping_guide" label="Guía envío" />
        <TextInput source="shipping_guide_url" label="Link Guía envío" />

        <h2>Información de compra</h2>
        <h3>Cantidad productos: </h3>
        <TextField source="quantity" label="Cantidad productos" options={
          {style: 'currency', currency: 'COP'}
        }/>
        <h3>Constó envío</h3>
        <NumberField source="shipping_cost" label="Costo envío" options={
          {style: 'currency', currency: 'COP'}
        }/>
        <h3>Subtotal</h3>
        <NumberField source="subtotal" label="Subtotal" options={
          {style: 'currency', currency: 'COP'}
        }/>
        <h3>Total</h3>
        <NumberField source="total" label="Total" options={
          {style: 'currency', currency: 'COP'}
        }/>
        <h4>Estado</h4>
        <TextInput source="state" label="Estado" />
        <hr />
      </SimpleForm>
    </Edit>
  </>

  
);