import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import BulkPriceForm from '../BulkPrices/BulkPriceForm';

const BulkPriceEditor = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Bulk Price Editor
        </Typography>
        <BulkPriceForm />
      </Box>
    </Container>
  );
};

export default BulkPriceEditor;
