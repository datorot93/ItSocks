import React, { useState, useEffect } from 'react';
import { 
  TextField, 
  Box, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Button,
  Card,
  CardContent,
  Typography,
  Grid
} from '@mui/material';
import { useDataProvider, Loading, Error, useNotify } from 'react-admin';

const BulkShippingPricesForm = () => {
  // State for form inputs
    const [selectedCategory, setSelectedCategory] = useState('');
    const [price, setPrice] = useState('');
    
    // State for data fetching
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState();
    const [categories, setCategories] = useState([]);
    
    const dataProvider = useDataProvider();
    const notify = useNotify();
  
    // Fetch categories and types on component mount
    useEffect(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
          // Fetch categories
          const { data: categoriesData } = await dataProvider.getList('shippings', {
            pagination: { page: 1, perPage: 100 },
            sort: { field: 'departamento', order: 'ASC' }
          });
          
          // En lugar de mostrar todos los departamentos únicos,
          // solo queremos mostrar "Cundinamarca" y "Resto del país"
          const uniqueOptions = [
            { id: 'Cundinamarca', departamento: 'Cundinamarca' },
            { id: 'rest', departamento: 'Resto del país' }
          ];
          
          setCategories(uniqueOptions);
  
          setLoading(false);
        } catch (err) {
          setError(err);
          setLoading(false);
        }
      };
  
      fetchData();
    }, [dataProvider]);
  
    // Handle form submission
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!selectedCategory || !price) {
        notify('Please fill all fields', { type: 'warning' });
        return;
      }
  
      setSubmitting(true);
      
      try {
        // Si es "Resto del país", actualizamos todos los departamentos excepto Cundinamarca
        if (selectedCategory === 'rest') {
          // Llamada para actualizar todos los departamentos excepto Cundinamarca
          const apiUrl = `http://ec2-3-138-195-156.us-east-2.compute.amazonaws.com/api/v1/bulk_shipping/rest?price=${parseFloat(price)}`;
          // const apiUrl = `http://localhost/api/v1/bulk_shipping/rest?price=${parseFloat(price)}`;
          
          const response = await fetch(apiUrl, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            }
          });
          
          if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
          }
          
          const result = await response.json();
          notify(`Price updated successfully for all regions except Cundinamarca`, { type: 'success' });
        } else {
          // Actualizar solo Cundinamarca
          const apiUrl = `http://ec2-3-138-195-156.us-east-2.compute.amazonaws.com/api/v1/bulk_shipping/Cundinamarca?price=${parseFloat(price)}`;
          // const apiUrl = `http://localhost/api/v1/bulk_shipping/Cundinamarca?price=${parseFloat(price)}`;
          
          const response = await fetch(apiUrl, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            }
          });
          
          if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
          }
          
          const result = await response.json();
          notify(`Price updated successfully for Cundinamarca`, { type: 'success' });
        }
        
        setPrice('');
      } catch (err) {
        console.error('Error updating price:', err);
        notify('Error updating price. Please try again.', { type: 'error' });
      } finally {
        setSubmitting(false);
      }
    };
  
    if (loading) return <Loading />;
    if (error) return <Error error={error} />;
  
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Set Shipping Prices
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel id="category-select-label">Region</InputLabel>
                  <Select
                    labelId="category-select-label"
                    value={selectedCategory}
                    label="Region"
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    required
                  >
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.departamento}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  InputProps={{
                    inputProps: { min: 0, step: "0.01" }
                  }}
                  required
                />
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                type="submit"
                variant="contained"
                color="primary"
                disabled={submitting}
              >
                {submitting ? 'Saving...' : 'Save Price'}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
}


export default BulkShippingPricesForm;