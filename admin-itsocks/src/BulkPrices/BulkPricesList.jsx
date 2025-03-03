import React from 'react'
import { Edit, SimpleForm, Title } from 'react-admin';
import BulkPriceForm from './BulkPriceForm';
import BulkShippingPricesForm from './BulkShippingPricesForm';

// Generate the necesary imports for the component


export const BulkPricesList = (props) => {



  return (
    <>
        {/* Generate a combo box to select the Category, another to select the Type and a textbox to write the price. All of these with MaterialUI Styles and just react */}

        <BulkPriceForm />
        <BulkShippingPricesForm />
      
    </>
  )
}
