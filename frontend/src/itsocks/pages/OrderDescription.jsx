import React from 'react'
import { useParams } from 'react-router-dom'

export const OrderDescription = () => {
  const { id_order } = useParams(); // Replace 'orderId' with your actual parameter name

  return (
    <div>
      <h1>Order ID: {id_order}</h1>
    </div>
  )
}