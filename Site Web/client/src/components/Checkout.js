import React from 'react'
import Axios from 'axios'
import StripeCheckout from 'react-stripe-checkout'
import Button from '@mui/material/Button'

const BASE_URL = process.env.REACT_APP_API_URL
const CURRENCY = 'EUR'

const fromEuroToCent = amount => amount * 100
const successPayment = response => {
  console.log('RESPONSE', response)
  const { status } = response
  console.log('STATUS', status)
  Axios.post(BASE_URL + '/shop/NewOrder', {
    idUser: response.data.user.id,
    prix: response.data.result.price,
    type: response.data.result.title
  }, {
    headers: {
      'x-access-token': window.localStorage.getItem('token')
    }
  })
    .then((response) => {
      console.log(response)
    })
}

function errorPayment (data) {
  console.log(data)
}
Axios.defaults.withCredentials = true
const onToken = (amount, description) => token =>
  Axios.post(BASE_URL + '/shop/payment',
    {
      token: token,
      product: {
        title: description,
        currency: CURRENCY,
        price: fromEuroToCent(amount)
      }

    }, {
      headers: {
        'x-access-token': window.localStorage.getItem('token')
      }
    })
    .then(successPayment)
    .catch(errorPayment)

const Checkout = ({ name, description, amount }) =>
  <StripeCheckout
    name={name}
    description={description}
    amount={fromEuroToCent(amount)}
    token={onToken(amount, description)}
    currency={CURRENCY}
    stripeKey={process.env.REACT_APP_KEY}
  >
    <Button fullWidth variant='contained'>Sélectionner</Button>
  </StripeCheckout>

export default Checkout
