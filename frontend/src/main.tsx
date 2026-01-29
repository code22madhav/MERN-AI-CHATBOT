import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createTheme, ThemeProvider } from '@mui/material'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.tsx'
import axios from 'axios'
import { Toaster } from 'react-hot-toast'
// import { ChatProvider } from './context/ChatContext.tsx'
import { ChatProviderWithAuthKey } from './context/ChatProviderWithAuthKey.tsx'
axios.defaults.baseURL="v1"
axios.defaults.withCredentials=true;

const theme=createTheme({
  typography: {
    fontFamily: "Roboto Slab, serif",
    allVariants: { color: "white"},
  },
})
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <ChatProviderWithAuthKey>
        <BrowserRouter>
          <ThemeProvider theme={theme}>
            <Toaster/>
            <App />
          </ThemeProvider>
        </BrowserRouter>
      </ChatProviderWithAuthKey>
    </AuthProvider>
  </StrictMode>,
)
