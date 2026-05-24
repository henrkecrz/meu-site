import React from 'react'
import ReactDOM from 'react-dom/client'
import { Auth0Provider } from '@auth0/auth0-react'
import { App } from './App'
import './styles.css'

const domain = import.meta.env.VITE_AUTH0_DOMAIN || 'dev-placeholder.auth0.com'
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID || 'placeholder-client-id'
const audience = import.meta.env.VITE_AUTH0_AUDIENCE || 'https://api.nexus-commerce.local'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience,
      }}
      cacheLocation="localstorage"
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>,
)
