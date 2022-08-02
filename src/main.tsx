import React from 'react'
import { RecoilRoot } from 'recoil'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { BrowserRouter } from 'react-router-dom'

import { StripeContext } from './components/routes/StripeContext';

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <StripeContext>
      <BrowserRouter basename="/reader">
          <RecoilRoot>
            <App />
          </RecoilRoot>
        </BrowserRouter>
    </StripeContext>
  </React.StrictMode>
)
