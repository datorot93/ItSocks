import React from 'react'
import styles from '../../ui/styles/Billing.module.css'
import { FinishOrderForm } from '../components/FinishOrderForm'
import { ProductsBillingList } from '../components/ProductsBillingList'



export const FinishOrder = () => {
  return (
    <section className={ styles.main_container }>
        <FinishOrderForm />
        <ProductsBillingList precio_envio={'$ 5.600,00'}/>
    </section>
  )
}
