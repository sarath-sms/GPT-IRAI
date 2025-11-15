import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { ThemeProvider } from 'styled-components'
import { GlobalStyle } from './styles/GlobalStyle'
import { theme } from './styles/theme'
import App from './App.tsx'

// ✅ Import the PWA virtual module provided by Vite
import { registerSW } from 'virtual:pwa-register'
import { ToastProvider } from './context/ToastContext.tsx'
import { AuthProvider } from './context/AuthContext.tsx'

// ✅ Register your service worker
registerSW({
  onNeedRefresh() {
    console.log('🔄 New content available! Please refresh the page.')
  },
  onOfflineReady() {
    console.log('✅ App ready to work offline.')
  },
})

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <ToastProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  // </StrictMode>
)
