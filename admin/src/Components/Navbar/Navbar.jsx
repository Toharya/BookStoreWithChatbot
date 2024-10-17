import React from 'react'
import './Navbar.css'
import navlogo from '../../assets/booko_logo.jpg'
import navPhoto from '../../assets/admin_pic.jpg'

const Navbar = () => {
  return (
    <div className='navbar'>
      <div className='nav-left'>
        <img src={navlogo} alt="Logo" className="nav-logo" />
        <span className="nav-title">Admin Page</span>
      </div>
      <img src={navPhoto} className='navPhoto' alt="Profile-Photo" />
    </div>
  )
}

export default Navbar
