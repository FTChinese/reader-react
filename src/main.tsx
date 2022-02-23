import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { Elements } from '@stripe/react-stripe-js'
import { stripePromise } from './features/checkout/loadStripe'
import { BrowserRouter } from 'react-router-dom'
import { RecoilRoot } from 'recoil'

ReactDOM.render(
  <React.StrictMode>
    <Elements stripe={stripePromise}>
      <BrowserRouter basename="/reader">
        <RecoilRoot>
          <App />
        </RecoilRoot>
      </BrowserRouter>
    </Elements>
  </React.StrictMode>,
  document.getElementById('root')
)
