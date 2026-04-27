import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { ClerkProvider } from '@clerk/react'

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY! as string
createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <ClerkProvider publishableKey={publishableKey}>
      <App />
    </ClerkProvider>
  </BrowserRouter>

)
