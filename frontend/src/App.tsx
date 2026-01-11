import './App.css'

import { type ReactNode } from "react";
import Header from './components/Header'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Chat from './pages/Chat'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import { Navigate } from "react-router-dom";
import { useAuth } from "../src/context/AuthContext";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const auth = useAuth();
  if (!auth?.user) {
    return <Navigate to="/login" replace />;
  }
  // Authenticated → allow access
  return children;
};

function App() {
const auth = useAuth();
  return (
    <>
      <Header/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Chat key={auth?.user?.name} />
            </ProtectedRoute>
          }
        />
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<SignUp/>}/>
      </Routes>
    </>
  )
}

export default App
