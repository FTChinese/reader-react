import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import { StripeContext } from './features/stripesetup/StripeContext'


ReactDOM.render(
  <React.StrictMode>
    <StripeContext>
      <BrowserRouter basename="/reader">
          <RecoilRoot>
            <App />
          </RecoilRoot>
        </BrowserRouter>
    </StripeContext>
  </React.StrictMode>,
  document.getElementById('root')
)
