import React from 'react'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import Home from './Home'
import PaymentSuccess from './PaymentSuccess'
import LoginPage from './LoginPage'
import Dashboard from './Dashboard'
import Navbar from './Navbar'
import { Footer } from "./Footer";
export const App = () => {
  return (
   <BrowserRouter>
   <Navbar/>
   <Routes>
    <Route path='/' element={<Home/>}></Route>
    <Route path="/paymentsuccess" element={<PaymentSuccess/>} />
    <Route path='/login' element={<LoginPage/>}></Route>
    <Route path='/dashboard' element={<Dashboard/>}></Route>
   </Routes>
   <Footer/>
   </BrowserRouter>
  )
}
