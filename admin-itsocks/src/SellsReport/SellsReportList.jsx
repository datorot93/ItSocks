// in src/users.js
import { Card, CardContent, CardHeader, Button } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import React, { useEffect, useState } from 'react';
import {
  List,
  Datagrid,
  TextField,
  SearchInput,
  TextInput,
  EditButton,
  ReferenceField,
  BooleanField,
  NumberField,
  Filter,
  ArrayField,
  ImageField,
  SimpleForm,
  DateField,
  useListContext,
  useGetList,
  // CardHeader,
} from 'react-admin';

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  BarChart,
  Bar,
  Line
} from 'recharts';
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

  const [cityData, setCityData] = useState([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [detailedOrders, setDetailedOrders] = useState([]);
  const [productsQuantity, setProductsQuantity] = useState([]);
  

  useEffect(() => {
    getReportsOrders()
      .then((data) => {
        setCityData(data);
      })
      .catch((error) => {
        console.log(error);
      });

    getProductSum()
      .then((data) => {
        setProductsQuantity(data);
      })
      .catch((error) => {
        console.log(error);
      });
      
    getDetailedOrders()
      .then((data) => {
        setDetailedOrders(data);
      })
      .catch((error) => {
        console.log(error);
      });

  }, []);


  console.log(cityData);


  const filteredCityData = cityData.filter(item => {
    const date = new Date(item.created_at);
    return (
      (!fromDate || date >= new Date(fromDate)) &&
      (!toDate || date <= new Date(toDate))
    );
  });

  const handleExport = () => {
    // Prepare sales summary data
    const salesData = filteredCityData.map(item => ({
      id: item.id,
      nombre: item.first_name,
      cantidad_productos: item.quantity,
      estado_orden: item.state,
      estado_pago: item.paid_status,
      subtotal: item.subtotal,
      costo_envio: item.shipping_cost,
      total: item.total,
      fecha: new Date(item.created_at).toLocaleDateString('es-CO')
    }));

    // Prepare city summary data
    const citySummary = Object.values(filteredCityData.reduce((acc, item) => {
      if (!acc[item.city]) {
        acc[item.city] = {
          ciudad: item.city,
          total_ventas: 0,
          cantidad_ordenes: 0
        };
      }
      acc[item.city].total_ventas += item.total;
      acc[item.city].cantidad_ordenes += 1;
      return acc;
    }, {}));

    // Create workbook and add worksheets
    const wb = XLSX.utils.book_new();
    
    const ws1 = XLSX.utils.json_to_sheet(salesData);
    const ws2 = XLSX.utils.json_to_sheet(citySummary);
    
    XLSX.utils.book_append_sheet(wb, ws1, "Ventas Detalle");
    XLSX.utils.book_append_sheet(wb, ws2, "Resumen Ciudades");

    // Save the file
    XLSX.writeFile(wb, `reporte_ventas_${new Date().toISOString()}.xlsx`);
  };

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
      'Cantidad': order.quantity,
      'Costo Envío': order.costo_envio,
      'Subtotal': order.subtotal,
      'Total': order.total,
      'Fecha Orden': new Date(order.fecha_orden).toLocaleDateString('es-CO'),
      'Producto': order.nombre_producto,
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

      {/* Gráficos */}
      {/* <Card>
        <CardHeader title="Reporte de ventas">
        </CardHeader>
      </Card> */}

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
            color="primary"
            startIcon={<FileDownloadIcon />}
            onClick={handleExport}
            style={{ marginRight: '10px' }}
          >
            Exportar Resumen
          </Button>
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

      {/* <LineChart width={730} height={250} data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="pv" stroke="#8884d8" />
        <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
      </LineChart> */}


      <BarChart width={730} height={250} data={filteredCityData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="city" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="quantity" fill="#8884d8"/>
        {/* <Bar dataKey="uv" fill="#82ca9d" /> */}
      </BarChart>

      <BarChart width={730} height={250} data={filteredCityData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="city" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="orders" fill="#8884d8" />
        {/* <Bar dataKey="uv" fill="#82ca9d" /> */}
      </BarChart>

      <BarChart width={730} height={250} data={productsQuantity}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="sum" fill="#8884d8" />
        {/* <Bar dataKey="uv" fill="#82ca9d" /> */}
      </BarChart>

    </>
  )
};
