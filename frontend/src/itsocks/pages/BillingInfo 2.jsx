import React from 'react'
import styles from '../../ui/styles/Billing.module.css'
import { FinishOrderForm } from '../components/FinishOrderForm'
import { ProductsBillingList } from '../components/ProductsBillingList'
import { BillingInfoForm } from '../components/BillingInfoForm'



export const BillingInfo = () => {
  return (
    <section className={ styles.main_container }>
        <BillingInfoForm />
        <ProductsBillingList precio_envio={'Calculando para el siguiente paso'}/>
    </section>
  )
}
