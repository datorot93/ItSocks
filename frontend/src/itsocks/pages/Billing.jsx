import React, { useEffect, useState } from 'react'
import { useShipping } from '../../hooks/useShipping'

import styles from '../../ui/styles/Billing.module.css'

import { BillingForm } from '../components/BillingForm'
import { ProductsBillingList } from '../components/ProductsBillingList'
import { Link, useNavigate } from 'react-router-dom'

export const Billing = () => {

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <section className={ styles.main_container }>
        <BillingForm />
        <ProductsBillingList />
    </section>
  )
}
