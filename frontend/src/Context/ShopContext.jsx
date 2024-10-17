import React, { createContext, useState, useEffect } from "react";

export const ShopContext = createContext(null);

const getDefaultCart = () => {
    let cart = {};
    for (let index = 1; index <= 80; index++) { 
        cart[index] = 0;
    }
    return cart;
};

const ShopContextProvider = (props) => {
    const [all_product, setAll_Product] = useState([]);
    const [cartItems, setCartItems] = useState(getDefaultCart());
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        creditCardNumber: '',
        expirationDate: '',
        cvv: '',
        billingAddress: '',
        shippingAddress: '',
        phoneNumber: '',
        agreeTerms: false
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetch('http://localhost:4000/allproducts')
            .then((response) => response.json())
            .then((data) => setAll_Product(data));

        if (localStorage.getItem('auth-token')) {
            fetch('http://localhost:4000/getcart', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'auth-token': `${localStorage.getItem('auth-token')}`,
                    'Content-Type': 'application/json',
                },
                body:"",
            }).then((response) => response.json())
              .then((data) => {
                  setCartItems(data);
              });
        }
    }, [])

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (itemId) => {
        const authToken = localStorage.getItem('auth-token');
        if (!authToken) {
            alert('Please login to add items to your cart.');
            return;
        }
    
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
        fetch('http://localhost:4000/addtocart', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'auth-token': `${localStorage.getItem('auth-token')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ itemId }),
        })
        .then((response) => response.json())
        .then((data) => console.log(data));
    };

    const removeFromCart = (itemId) => {
        const authToken = localStorage.getItem('auth-token');
        if (!authToken) {
            alert('Please login to remove items from your cart.');
            return;
        }
    
        fetch('http://localhost:4000/removefromcart', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'auth-token': authToken,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ itemId }),
        })
        .then((response) => {
            if (response.ok) {
                setCartItems((prevCart) => {
                    const updatedCart = { ...prevCart };
                    delete updatedCart[itemId];
                    return updatedCart;
                });
            } else {
                console.error('Failed to remove item from cart:', response.statusText);
            }
        })
        .catch((error) => {
            console.error('Error removing item from cart:', error);
        });
    };

    const handleSubmit = async () => {
    try {
        const authToken = localStorage.getItem('auth-token');
        const response = await fetch('http://localhost:4000/checkout', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'auth-token': authToken,
            },
            body: JSON.stringify({
                cartData: cartItems, // Send the current cart data
            }),
        });

        if (!response.ok) {
            throw new Error('Checkout request failed');
        }

        resetCartCount();
        setIsFormSubmitted(true);
    } catch (error) {
        console.error('Error during checkout:', error);
    }
};


    const incrementCart = (itemId) => {
        const authToken = localStorage.getItem('auth-token');
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
        if (authToken) {
            fetch('http://localhost:4000/addtocart', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'auth-token': authToken,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ itemId }),
            })
            .then((response) => response.json())
            .then((data) => console.log(data));
        }
    };

    const decrementCart = (itemId) => {
        const authToken = localStorage.getItem('auth-token');
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
        if (authToken) {
            fetch('http://localhost:4000/removefromcart', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'auth-token': authToken,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ itemId }),
            })
            .then((response) => response.json())
            .then((data) => console.log(data));
        }
    };

    const resetCartCount = () => {
        setCartItems(getDefaultCart()); // Reset cart state to default
        localStorage.removeItem('cartItems'); // Clear cart items from local storage

        const authToken = localStorage.getItem('auth-token');
        if (authToken) {
            fetch('http://localhost:4000/resetcart', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'auth-token': authToken,
                    'Content-Type': 'application/json',
                },
            })
            .then((response) => response.json())
            .then((data) => console.log(data));
        }
    };

    const logout = () => {
        localStorage.removeItem('auth-token');
        localStorage.removeItem('cartItems'); // Clear cart items from local storage
        resetCartCount(); // Reset the cart state
    };

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = all_product.find((product) => product.id === Number(item));
                if (itemInfo) {
                    totalAmount += itemInfo.new_price * cartItems[item];
                }
            }
        }
        return totalAmount;
    };

    const getTotalCartItems = () => {
        let totalItem = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                totalItem += cartItems[item];
            }
        }
        return totalItem;
    };

    const validateForm = () => {
        let valid = true;
        const newErrors = {};

        if (!formData.creditCardNumber) {
            newErrors.creditCardNumber = 'Credit Card Number is required';
            valid = false;
        }

        if (!formData.expirationDate) {
            newErrors.expirationDate = 'Expiration Date is required';
            valid = false;
        }

        if (!formData.cvv) {
            newErrors.cvv = 'CVV is required';
            valid = false;
        }

        if (!formData.billingAddress) {
            newErrors.billingAddress = 'Billing Address is required';
            valid = false;
        }

        if (!formData.shippingAddress) {
            newErrors.shippingAddress = 'Shipping Address is required';
            valid = false;
        }

        if (!formData.phoneNumber) {
            newErrors.phoneNumber = 'Phone Number is required';
            valid = false;
        }

        if (!formData.agreeTerms) {
            newErrors.agreeTerms = 'Please agree to the terms and conditions';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: '' });
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setFormData({ ...formData, [name]: checked });
        setErrors({ ...errors, [name]: '' });
    };

    const contextValue = { 
        cartItems, 
        all_product, 

        getTotalCartItems, 
        getTotalCartAmount, 
        
        addToCart, 
        removeFromCart, 
        incrementCart, 
        decrementCart, 
        resetCartCount,
        handleInputChange,
        handleCheckboxChange,
        handleSubmit,
        isFormSubmitted,
        formData,
        errors,
        logout
    };

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;
