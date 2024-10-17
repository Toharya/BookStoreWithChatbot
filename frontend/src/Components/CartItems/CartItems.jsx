import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import './CartItems.css';
import { ShopContext } from '../../Context/ShopContext';
import remove_icon from '../Assets/cart_cross_icon.png';

const CartItems = () => {
    const { getTotalCartAmount, all_product, cartItems, removeFromCart, incrementCart, decrementCart } = useContext(ShopContext);

    const proceedToCheckout = () => {
        if (getTotalCartAmount() > 0) {
            // Proceed to checkout if total cart amount is greater than 0
            return <Link to="/checkout"><button>PROCEED TO CHECKOUT</button></Link>;
        } else {
            // Display an error message if total cart amount is 0
            return <p>Please add a product to proceed to checkout.</p>;
        }
    };

    return (
        <div className='cartitems'>
            <div className="cartitems-format-main">
                <p>Products</p>
                <p>Title</p>
                <p>Price</p>
                <p>Quantity</p>
                <p>Total</p>
                <p>Remove</p>
            </div>
            <hr />
            {all_product.map((product) => {
                if (cartItems[product.id] > 0) {
                    return (
                        <div key={product.id}>
                            <div className="cartitems-format cartitems-format-main">
                                <img src={product.image} alt="" className='carticon-product-icon' />
                                <p>{product.name}</p>
                                <p>${product.new_price}</p>
                                <div className='cartitems-quantity'>
                                    <button onClick={() => decrementCart(product.id)}>-</button>
                                    <div className="quantity-container">
                                        <span className="quantity-value">{cartItems[product.id]}</span>
                                        <button onClick={() => incrementCart(product.id)}>+</button>
                                    </div>
                                </div>
                                <p>${product.new_price * cartItems[product.id]}</p>
                                <img className='cartitems-remove-icon' src={remove_icon} onClick={() => { removeFromCart(product.id) }} alt="Remove" />
                            </div>
                            <hr />
                        </div>
                    );
                }

                return null; // Return null for products that are not in the cart
            })}
            <div className="cartitems-down">
                <div className="cartitems-total">
                    <h1>Cart Totals</h1>
                    <div>
                        <div className="cartitems-total-item">
                            <p>Subtotal</p>
                            <p>${getTotalCartAmount()}</p> {/* Call getTotalCartAmount to display the total amount */}
                        </div>
                        <hr />
                        <div className="cartitems-total-item">
                            <p>Shipping Fee</p>
                            <p>Free</p>
                        </div>
                        <hr />
                        <div className="cartitems-total-item">
                            <h3>Total</h3>
                            <h3>${getTotalCartAmount()}</h3> {/* Call getTotalCartAmount to display the total amount */}
                        </div>
                    </div>
                    {/* Display the proceed to checkout button or error message based on the condition */}
                    {proceedToCheckout()}
                </div>
                <div className="cartitems-promocode">
                    <p>If you have a promo code, enter it here</p>
                    <div className="cartitems-promobox">
                        <input type="text" placeholder='promo code' />
                        <button>Submit</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartItems;
