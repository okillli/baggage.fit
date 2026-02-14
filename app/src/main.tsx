import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ErrorBoundary } from './components/ErrorBoundary'
import './index.css'

const App = lazy(() => import('./App.tsx'))
const AirlinePage = lazy(() => import('./pages/AirlinePage.tsx').then(m => ({ default: m.AirlinePage })))
const AirlinesListPage = lazy(() => import('./pages/AirlinesListPage.tsx').then(m => ({ default: m.AirlinesListPage })))
const AboutPage = lazy(() => import('./pages/AboutPage.tsx').then(m => ({ default: m.AboutPage })))
const DataSourcesPage = lazy(() => import('./pages/DataSourcesPage.tsx').then(m => ({ default: m.DataSourcesPage })))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.tsx').then(m => ({ default: m.NotFoundPage })))

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <Suspense fallback={<div className="min-h-screen bg-background" />}>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/airlines" element={<AirlinesListPage />} />
            <Route path="/airlines/:slug" element={<AirlinePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/data-sources" element={<DataSourcesPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
)
