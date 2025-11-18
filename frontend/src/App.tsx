import './App.css'

import Header from './components/Header'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Chat from './pages/Chat'
import SignUp from './pages/SignUp'
import Login from './pages/Login'

function App() {

  return (
    <>
      <Header/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/chat' element={<Chat/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/singup' element={<SignUp/>}/>
      </Routes>
    </>
  )
}

export default App
