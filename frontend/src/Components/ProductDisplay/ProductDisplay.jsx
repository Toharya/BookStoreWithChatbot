import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import './ProductDisplay.css';
import star_icon from '../Assets/star_icon.png';
import star_dull_icon from '../Assets/star_dull_icon.png';
import { ShopContext } from '../../Context/ShopContext';

const ProductDisplay = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const { addToCart } = useContext(ShopContext);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`http://localhost:4000/product/${productId}`);
                const data = await response.json();
                setProduct(data);
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        };

        fetchProduct();
    }, [productId]);

    if (!product) {
        return <div>Loading...</div>;
    }

    return (
        <div className='productdisplay'>
            <div className="productdisplay-left">
                <div className="productdisplay-img-list">
                    {product.images && product.images.map((img, index) => (
                        <img key={index} src={img} alt={`Product ${index}`} />
                    ))}
                </div>
                <div className="productdisplay-img">
                    <img className='productdisplay-main-img' src={product.mainImage || product.image} alt="Main product" />
                </div>
            </div>
            <div className="productdisplay-right">
                <h1>{product.name}</h1>
                <div className="productdisplay-right-author">
                    <span>Author: </span>{product.writer}
                </div>
                <div className="productdisplay-right-publisher">
                    <span>Publisher: </span>{product.publisher}
                </div>
                <div className="productdisplay-right-paperback">
                    <span>Paperback: </span>{product.page_number}
                </div>
                <div className="productdisplay-right-category">
                    <span>Category: </span>{product.category}
                </div>
                <div className="productdisplay-right-stars">
                    {[...Array(5)].map((_, index) => (
                        <img key={index} src={index < (product.rating || 0) ? star_icon : star_dull_icon} alt={`Star ${index + 1}`} />
                    ))}
                    <p>({product.reviews ? product.reviews.length : 0})</p>
                </div>
                <div className="productdisplay-right-prices">
                    <div className="productdisplay-right-price-new">${product.new_price}</div>
                    <div className="productdisplay-right-price-old">${product.old_price}</div>
                </div>
                <button onClick={() => addToCart(product.id)}>ADD TO CART</button>
            </div>
        </div>
    );
};

export default ProductDisplay;
