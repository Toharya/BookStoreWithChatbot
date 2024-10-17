import React, { useContext, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import logo from '../Assets/booko_logo.jpg';
import cart_icon from '../Assets/cart_icon.png';
import { ShopContext } from '../../Context/ShopContext';
import nav_dropdown from '../Assets/nav_dropdown.png';

const Navbar = () => {
    const [menu, setMenu] = useState('shop');
    const { getTotalCartItems } = useContext(ShopContext);
    const menuRef = useRef();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const dropdown_toggle = (e) => {
        menuRef.current.classList.toggle('nav-menu-visible');
        e.target.classList.toggle('open');
    };

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query.trim() === '') {
            setSearchResults([]);
            return;
        }

        // Fetch search results from the backend
        fetch(`http://localhost:4000/search?q=${query}`)
            .then((response) => response.json())
            .then((data) => setSearchResults(data))
            .catch((error) => console.error('Error fetching search results:', error));
    };

    const handleResultClick = () => {
        setSearchQuery('');
        setSearchResults([]);
    };

    return (
        <div className='navbar'>
            <div className="nav-left">
                <div className="nav-logo">
                    <Link to="/">
                        <img src={logo} alt="Book Store logo" style={{ width: '100px' }} />
                        <p style={{ fontSize: '15px' }}>BOOK STORE</p>
                    </Link>
                </div>
                <div className="search-bar" style={{ marginLeft: '5px' }}>
                    <input 
                        type="text" 
                        placeholder="Search for books..." 
                        style={{ width: '305px' }} 
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                    {searchResults.length > 0 && (
                        <div className="search-results">
                            {searchResults.map((result) => (
                                <Link 
                                    key={result.id} 
                                    to={`/product/${result.id}`} 
                                    onClick={handleResultClick}
                                >
                                    {result.name}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <div className="nav-right">
                <img className='nav-dropdown' onClick={dropdown_toggle} src={nav_dropdown} alt="Navigation dropdown" />
                <ul ref={menuRef} className="nav-menu">
                    <li onClick={() => { setMenu("literature") }}>
                        <Link style={{ textDecoration: 'none' }} to='/literature'>Literature</Link>
                    </li>
                    <li onClick={() => { setMenu("novel") }}>
                        <Link style={{ textDecoration: 'none' }} to='/novel'>Novel</Link>
                    </li>
                    <li onClick={() => { setMenu("self-improvement") }}>
                        <Link style={{ textDecoration: 'none' }} to='/self-improvement'>Self-Improvement</Link>
                    </li>
                    <li onClick={() => { setMenu("children-youth") }}>
                        <Link style={{ textDecoration: 'none' }} to='/children-youth'>Children and Youth</Link>
                    </li>
                    <li onClick={() => { setMenu("research-history") }}>
                        <Link style={{ textDecoration: 'none' }} to='/research-history'>Research-History</Link>
                    </li>
                    <li onClick={() => { setMenu("comic-book") }}>
                        <Link style={{ textDecoration: 'none' }} to='/comic-book'>Comic Book</Link>
                    </li>
                    <li onClick={() => { setMenu("philosophy") }}>
                        <Link style={{ textDecoration: 'none' }} to='/philosophy'>Philosophy</Link>
                    </li>
                    <li onClick={() => { setMenu("biography-memoirs") }}>
                        <Link style={{ textDecoration: 'none' }} to='/biography-memoirs'>Biography and Memoirs</Link>
                    </li>
                </ul>
                <div className="nav-login-cart">
                    {localStorage.getItem('auth-token')
                        ? <button onClick={() => { localStorage.removeItem('auth-token'); window.location.replace('/') }}>Logout</button>
                        : <Link to='/login'><button>Login</button></Link>}
                    <Link to='/cart'><img src={cart_icon} alt="Cart icon" style={{ width: '30px' }} /></Link>
                    <div className="nav-cart-count">{getTotalCartItems()}</div>
                </div>
            </div>
        </div>
    )
}

export default Navbar;
