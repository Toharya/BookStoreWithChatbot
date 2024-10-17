import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar';
import ShopCategory from './Pages/ShopCategory';
import Product from './Pages/Product';
import LoginSignup from './Pages/LoginSignup';
import Shop from './Pages/Shop';
import Cart from './Pages/Cart';
import Footer from './Components/Footer/Footer';
import Checkout from './Components/CheckoutPage/CheckoutPage'; 
import SearchResults from './Pages/SearchResults'; // Import the SearchResults component
import literature_banner from './Components/Assets/literature.png';

function App() {
  return (
    <div>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' element={<Shop />} />
          <Route path='/literature' element={<ShopCategory banner={literature_banner} category="literature" />} />
          <Route path='/novel' element={<ShopCategory banner={literature_banner} category="novel" />} />
          <Route path='/self-improvement' element={<ShopCategory banner={literature_banner} category="self-improvement" />} />
          <Route path='/children-youth' element={<ShopCategory banner={literature_banner} category="children-youth" />} />
          <Route path='/research-history' element={<ShopCategory banner={literature_banner} category="research-history" />} />
          <Route path='/comic-book' element={<ShopCategory banner={literature_banner} category="comic-book" />} />
          <Route path='/philosophy' element={<ShopCategory banner={literature_banner} category="philosophy" />} />
          <Route path='/biography-memoirs' element={<ShopCategory banner={literature_banner} category="biography-memoirs" />} />

          <Route path='/product/:productId' element={<Product />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/checkout' element={<Checkout />} />
          <Route path='/login' element={<LoginSignup />} />
          <Route path='/search/:query' element={<SearchResults />} /> {/* Add route for search results */}
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
