import React from 'react'
import { useShipping } from '../../hooks/useShipping'

import styles from '../../ui/styles/Billing.module.css'

import { BillingForm } from '../components/BillingForm'
import { ProductsBillingList } from '../components/ProductsBillingList'

export const Billing = () => {

  const {shipping} = useShipping()

  console.log(shipping)
  return (
    <section className={ styles.main_container }>
        <BillingForm />
        <ProductsBillingList />
    </section>
  )
}
