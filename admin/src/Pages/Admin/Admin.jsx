import React from 'react';
import './Admin.css';
import Sidebar from '../../Components/Sidebar/Sidebar';
import { Routes, Route } from 'react-router-dom';
import ListProduct from '../../Components/ListProduct/ListProduct';
import AddProduct from '../../Components/AddProduct/AddProduct';
import UpdateProduct from '../../Components/UpdateProduct/UpdateProduct';

const Admin = () => {
  return (
    <div className='admin'>
      <Sidebar />
      <Routes>
        <Route path="/addproduct" element={<AddProduct />} />
        <Route path="/listproduct" element={<ListProduct />} />
        <Route path="/updateproduct/:id" element={<UpdateProduct />} /> {/* Note the ":id" here */}
      </Routes>
    </div>
  );
};

export default Admin;
