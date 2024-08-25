import React from 'react'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import Home from './Home'
import PaymentSuccess from './PaymentSuccess'
export const App = () => {
  return (
   <BrowserRouter>
   <Routes>
    <Route path='/' element={<Home/>}></Route>
    <Route path="/paymentsuccess" element={<PaymentSuccess/>} />
   </Routes>
   </BrowserRouter>
  )
}
