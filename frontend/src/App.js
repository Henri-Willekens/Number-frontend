import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PhoneForm from './uploadPhoneNumbers'
import CSVNumbers from './CSVNumbers'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/numbers/:id' element={<CSVNumbers/>} /> 
        <Route path='/*' element={<PhoneForm/>} /> 
      </Routes>
    </BrowserRouter>
);  
}  

export default App;
