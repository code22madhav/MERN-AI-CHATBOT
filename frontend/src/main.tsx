import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createTheme, ThemeProvider } from '@mui/material'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.tsx'
import axios from 'axios'
import { Toaster } from 'react-hot-toast'
import { ChatProvider } from './context/ChatContext.tsx'
axios.defaults.baseURL="http://localhost:8000/v1"
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
    <ChatProvider>
    <BrowserRouter>
    <ThemeProvider theme={theme}>
      <Toaster/>
    <App />
    </ThemeProvider>
    </BrowserRouter>
    </ChatProvider>
    </AuthProvider>
  </StrictMode>,
)
