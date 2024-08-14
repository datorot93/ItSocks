// in src/users.js
import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  NumberField,
  DateField,
  SingleFieldList,
  ChipField,
  ReferenceArrayField,
  ArrayField,
} from 'react-admin';

export const OrderList = (props) => (
  <>
    <List {...props}>
      <Datagrid rowClick="edit">
        <TextField source="id"/>
        <TextField source = "first_name" label="Nombre"/>
        {/* <TextField source = "last_name" label="Apellido"/>
        <TextField source="address" label="Dir. envío"/>
        <TextField source="city" label="Ciudad Envío"/>
        <TextField source="shipping_guide" label="Guía envío"/>
        <TextField source="state" label="Estado"/> */}
        <TextField source="quantity" label="Cantidad productos" />
        <TextField source="state" label="Estado orden"/>
        <TextField source="paid_status" label="Estado de pago"/>
        <NumberField source="subtotal" label="Subtotal" options={
          {style: 'currency', currency: 'COP'}
        } />
        <NumberField source="shipping_cost" label="Costo envío" options={
          {style: 'currency', currency: 'COP'}
        }/>
        <NumberField source="total" label="Costo total" options={
          {style: 'currency', currency: 'COP'}
        }/>
        <DateField source="created_at" label="Fecha creación" locales="es-CO"/>
        

        {/* <ArrayField source="product_order" label="Productos">
          <Datagrid bulkActionButtons={false}>
            <TextField source="product_id" />
            <TextField source="quantity" label="Cantidad"/> 
          </Datagrid>
        </ArrayField> */}

      </Datagrid>
    </List>

  </>


);
