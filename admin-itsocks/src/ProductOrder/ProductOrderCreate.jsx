import React from 'react';
import {
  Create,
  SimpleForm,
  TextInput,
  PasswordInput,
  BooleanInput,
  ReferenceInput,
} from 'react-admin';

/**
 * Componente para crear una nueva orden de producto.
 * 
 * Este componente renderiza un formulario para la creación de una nueva orden de producto,
 * permitiendo la selección de un producto y una orden asociada mediante campos de referencia.
 * 
 * Props:
 *   props (object): Propiedades pasadas al componente Create.
 * 
 * Ejemplo de uso:
 * ```jsx
 * <ProductOrderCreate {...props} />
 * ```
 */
export const ProductOrderCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <ReferenceInput source="product_id" reference="products"/>
      <ReferenceInput source="order_id" reference="tags"/>
    </SimpleForm>
  </Create>
);
