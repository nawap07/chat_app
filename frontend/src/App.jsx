import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from "react-router-dom"
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Setting from './pages/Setting'
import Profile from './pages/Profile'
import { useAuthStores } from './store/useAuthStore'
import { Loader } from "lucide-react"
import { useThemeStore } from './store/useThemeStore'

const App = () => {
  const { checkAuth, authUser, isCheckingAuth ,onlineUsers} = useAuthStores();
  const {  theme } = useThemeStore()
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  console.log({ authUser });
  console.log({onlineUsers});
  
  if (isCheckingAuth && !authUser) return (
    <div className="flex items-center justify-center h-screen">
      <Loader className="size-10 animate-spin" />
    </div>
  )

  return (
    <div data-theme={theme}>
      <Navbar />
      <Routes>
        <Route path='/' element={authUser ? <Home /> : <Navigate to="/login" />} />
        <Route path='/signup' element={!authUser ? <Signup /> : <Navigate to="/" />} />
        <Route path='/login' element={!authUser ? <Login /> : <Navigate to="/" />} />
        <Route path='/setting' element={<Setting />} />
        <Route path='/profile' element={authUser ? <Profile /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  )
}

export default App