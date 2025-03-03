// in src/users.js
import { Button } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import React, { useEffect, useState } from 'react';
import {
  List,
  Datagrid,
  TextField,
  TextInput,
  NumberField,
  Filter,
  DateField,
  // CardHeader,
} from 'react-admin';


import { getDetailedOrders, getProductSum, getReportsOrders } from '../helpers/getReports';
import JSZip from 'jszip';
import * as XLSX from 'xlsx';

const PostFilter = (props) => (
  <Filter {...props}>
      <TextInput label="Buscar" source="q" alwaysOn />
      {/* <TextInput label="Title" source="title" /> */}
  </Filter>
);



export const SellsReportList = (props) => {

  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [detailedOrders, setDetailedOrders] = useState([]);
  
 

  useEffect(() => {

      
    getDetailedOrders()
      .then((data) => {
        // console.log(data)
        setDetailedOrders(data);
      })
      .catch((error) => {
        console.log(error);
      });

  }, []);

 
  console.log(detailedOrders)

  const handleDetailedExport = () => {
    // Prepare detailed orders data with clean headers
    const exportData = detailedOrders.map(order => ({
      'ID': order.id,
      'Nombre': order.first_name,
      'Apellido': order.last_name,
      'Dirección': order.address,
      'Teléfono': order.phone_number,
      'Dirección Facturación': order.billing_addess,
      'País': order.country,
      'Región': order.region,
      'Ciudad': order.city,
      'Documento': order.document,
      'Email': order.email,
      'Info Extra': order.extra_info,
      'De': order.de,
      'Para': order.para,
      'Es Regalo': order.isGift ? 'Sí' : 'No',
      'Estado': order.state,
      'Numero en orden': order.num_en_orden,
      'Valor unidad': order.valor_unitario,
      'Cantidad': order.quantity,
      'Subtotal': order.subtotal,
      'Costo Envío': order.costo_envio,
      'Total': order.total,
      'Fecha Orden': new Date(order.fecha_orden).toLocaleDateString('es-CO'),
      'Producto': order.nombre_producto,
      'Talla': order.size,
      'Compresión': order.compresion,
      'Subcategoría': order.subcategoria,
      'Tipo': order.tipo,
      'Diseño': order.disenio
    }));

    // Create workbook and add worksheets
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(exportData);
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "Órdenes Detalladas");

    // Save the file
    XLSX.writeFile(wb, `ordenes_detalladas_${new Date().toISOString()}.xlsx`);
  };

  return (

    <>
      <List {...props}>
        <Datagrid rowClick="edit">
          <TextField source="id"/>
          <TextField source = "first_name" label="Nombre"/>
          <TextField source="quantity" label="Cantidad productos" />
          <TextField source="state" label="Estado orden"/>
          <TextField source="paid_status" label="Estado de pago"/>
          <NumberField source="subtotal" label="Subtotal" options={
            {style: 'currency', currency: 'COP'}
          }/>
          <NumberField source="shipping_cost" label="Costo envío" options={
            {style: 'currency', currency: 'COP'}
          }/>
          <NumberField source="total" label="Costo total" options={
            {style: 'currency', currency: 'COP'}
          }/>
          <DateField source="created_at" label="Fecha creación" locales="es-CO"/>

        </Datagrid>
      </List>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div>
          <label>From:</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
          <label>To:</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>
        <div>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<FileDownloadIcon />}
            onClick={handleDetailedExport}
          >
            Exportar Detallado
          </Button>
        </div>
      </div>
    </>
  )
};
