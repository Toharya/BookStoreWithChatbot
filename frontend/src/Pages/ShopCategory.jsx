import React, { useContext, useState } from 'react';
import './CSS/ShopCategory.css';
import { ShopContext } from '../Context/ShopContext';
import dropdown_icon from '../Components/Assets/dropdown_icon.png';
import Item from '../Components/Item/Item';
import Chatbot from '../Components/Chatbot/Chatbot'; 

const ShopCategory = (props) => {
    const { all_product } = useContext(ShopContext);
    const [sortOption, setSortOption] = useState('');
    
    const validCategory = props.category || 'Unknown Category'; 

    const handleSortChange = (event) => {
        setSortOption(event.target.value);
    };

    const sortedProducts = [...all_product].sort((a, b) => {
        if (sortOption === 'priceAsc') {
            return a.new_price - b.new_price;
        } else if (sortOption === 'priceDesc') {
            return b.new_price - a.new_price;
        } else {
            return 0; 
        }
    });

    return (
        <div className='shop-category'>
            <img className='shopcategory-banner' src={props.banner} alt={validCategory} />
            <div className="shopcategory-indexSort">
                <p>
                    <span>Showing 1-12</span> out of 40 Products
                </p>
                <div className="shopcategory-sort">
                    Sort by
                    <div className="shopcategory-sort-dropdown">
                        <select onChange={handleSortChange} value={sortOption}>
                            <option value="">Select</option>
                            <option value="priceAsc">Price: Low to High</option>
                            <option value="priceDesc">Price: High to Low</option>
                        </select>
                        <img src={dropdown_icon} alt="Dropdown icon" />
                    </div>
                </div>
            </div>
            <div className="shopcategory-products">
                {sortedProducts.map((item, i) => {
                    if (validCategory === item.category) {
                        return <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price} />;
                    } else {
                        return null;
                    }
                })}
            </div>
            <div className="shopcategory-loadmore">
                Explore More
            </div>
            <Chatbot /> 
        </div>
    );
}

export default ShopCategory;
