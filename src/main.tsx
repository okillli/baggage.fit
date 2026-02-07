import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { AirlinePage } from './pages/AirlinePage.tsx'
import { AirlinesListPage } from './pages/AirlinesListPage.tsx'
import { NotFoundPage } from './pages/NotFoundPage.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/airlines" element={<AirlinesListPage />} />
        <Route path="/airlines/:slug" element={<AirlinePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
