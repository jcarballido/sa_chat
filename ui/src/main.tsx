import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './supabase/client'
import './app/index.css'
// import App from './app/App'
import AppGate from './app/AppGate'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppGate />
  </StrictMode>,
)
