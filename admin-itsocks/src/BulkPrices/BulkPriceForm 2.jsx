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

const BulkPriceForm = () => {
  // State for form inputs
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [price, setPrice] = useState('');
  
  // State for data fetching
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState();
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  
  const dataProvider = useDataProvider();
  const notify = useNotify();

  // Fetch categories and types on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch categories
        const { data: categoriesData } = await dataProvider.getList('subcategories', {
          pagination: { page: 1, perPage: 100 },
          sort: { field: 'name', order: 'ASC' }
        });
        setCategories(
          categoriesData.filter(category => category.id_category === 1)
        );

        // Fetch types
        const { data: typesData } = await dataProvider.getList('types', {
          pagination: { page: 1, perPage: 100 },
          sort: { field: 'name', order: 'ASC' }
        });
        setTypes(typesData);

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
    if (!selectedCategory || !selectedType || !price) {
      notify('Please fill all fields', { type: 'warning' });
      return;
    }

    setSubmitting(true);
    
    try {
      // Crear el ID compuesto y construir la URL con el precio como query parameter
      const compositeId = `${selectedCategory}-${selectedType}`;
      // const apiUrl = `http://localhost/api/v1/bulk_prices/${compositeId}?price=${parseFloat(price)}`;
      const apiUrl = `http://ec2-3-138-195-156.us-east-2.compute.amazonaws.com/api/v1/bulk_prices/${compositeId}?price=${parseFloat(price)}`;
      
      // Hacer la solicitud fetch directamente en lugar de usar dataProvider
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
      
      // Mostrar cuántos productos se actualizaron
      notify(`Price updated successfully for ${result.updated_count} products`, { type: 'success' });
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
          Set Bulk Price
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel id="category-select-label">Category</InputLabel>
                <Select
                  labelId="category-select-label"
                  value={selectedCategory}
                  label="Category"
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  required
                >
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.name}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel id="type-select-label">Type</InputLabel>
                <Select
                  labelId="type-select-label"
                  value={selectedType}
                  label="Type"
                  onChange={(e) => setSelectedType(e.target.value)}
                  required
                >
                  {types.map((type) => (
                    <MenuItem key={type.id} value={type.name}>
                      {type.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={4}>
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
};

export default BulkPriceForm;
