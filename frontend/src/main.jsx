import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import"./i18n.jsx"
import {
  SiteSettingsProvider
} from "./context/SiteSettingsContext";
// import "leaflet/dist/leaflet.css";
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SiteSettingsProvider>

    <App />

 </SiteSettingsProvider>

  </StrictMode>,
)
