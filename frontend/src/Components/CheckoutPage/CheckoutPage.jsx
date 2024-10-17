import React, { useState, useContext } from 'react';
import './CheckoutPage.css'; 
import { ShopContext } from '../../Context/ShopContext'; 

const CheckoutPage = () => {
    const { resetCartCount } = useContext(ShopContext); // Access resetCartCount function from the context
    const [formData, setFormData] = useState({
        creditCardNumber: '',
        expirationDate: '',
        cvv: '',
        billingAddress: '',
        shippingAddress: '',
        phoneNumber: '',
        agreeTerms: false // Added for checkbox state
    });
    const [errors, setErrors] = useState({});
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        // Ensure only digits are entered
        const digitValue = value.replace(/\D/g, '');
        // Keep the credit card input at 16 digits
        const sixteenDigits = digitValue.slice(0, 16);
        setFormData({ ...formData, [name]: sixteenDigits });
        // Clear validation error when user starts typing
        setErrors({ ...errors, [name]: '' });
    };
    
    const handleCVVChange = (e) => {
        const { name, value } = e.target;
        // Ensure only digits are entered
        const digitValue = value.replace(/\D/g, '');
        // Keep the CVV input at 3 digits
        const threeDigits = digitValue.slice(0, 3);
        setFormData({ ...formData, [name]: threeDigits });
        // Check CVV length and set error if not 3 digits
        if (digitValue.length !== 3) {
            setErrors({ ...errors, [name]: 'CVV must be exactly 3 digits' });
        } else {
            // Clear validation error when CVV is correct
            setErrors({ ...errors, [name]: '' });
        }
    };
    
    
    
    const handleExpirationDateChange = (e) => {
        const { name, value } = e.target;
        const updatedDate = name === "expirationMonth" ? value + formData.expirationDate.substring(2) : formData.expirationDate.substring(0, 2) + value;
        setFormData({ ...formData, expirationDate: updatedDate });
        // Clear validation error when user starts typing
        setErrors({ ...errors, expirationDate: '' });
    };
    
    

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setFormData({ ...formData, [name]: checked });
        // Clear validation error when checkbox is checked
        setErrors({ ...errors, [name]: '' });
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        setIsFormSubmitted(true);
    
        // Check if the expiration date is entered fully
        const isExpirationDateEntered = formData.expirationDate.length === 6;
    
        if (validateForm() && isExpirationDateEntered) {
            // Perform form submission logic here, e.g., send data to the backend
            console.log(formData);
            // Show confirmation message only if the form is valid
            setIsFormSubmitted(true);
            // Reset cart count when form is submitted successfully
            resetCartCount();
        } else {
            // If the form is not valid or expiration date is not entered fully, display a warning message
            setIsFormSubmitted(false);
            alert("Please fill out all required fields correctly.");
        }
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
    
        if (!formData.cvv || formData.cvv.length !== 3) { // Check if CVV is empty or not exactly three digits
            newErrors.cvv = 'CVV must be exactly three digits';
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
    

    // Check if all form fields are filled out and the checkbox is checked
    const isFormValid = Object.values(formData).every(value => value !== '') && formData.agreeTerms;

    return (
        <div className="checkout-container">
            <h2>Checkout</h2>
            <form onSubmit={handleSubmit}>
            <div className="form-group">
    <label>Credit Card Number:</label>
    <input
        type="tel" // Use type="tel" for telephone numbers
        name="creditCardNumber"
        value={formData.creditCardNumber}
        onChange={handleInputChange}
        pattern="[0-9]*" // Enforce digit-only input
        minLength="16" // Set the minimum length to 16 characters
        maxLength="16" // Set the maximum length to 16 characters
    />
    {errors.creditCardNumber && isFormSubmitted && <span className="error">{errors.creditCardNumber}</span>}
</div>

<div className="form-group">
    <label>Expiration Date:</label>
    <div>
        <input
            type="text" // Use type="text" for expiration month
            name="expirationMonth"
            placeholder="MM"
            value={formData.expirationDate.substring(0, 2)}
            onChange={handleExpirationDateChange}
            maxLength="2"
        />
        <span> / </span>
        <input
            type="text" // Use type="text" for expiration year
            name="expirationYear"
            placeholder="YYYY"
            value={formData.expirationDate.substring(2, 6)}
            onChange={handleExpirationDateChange}
            maxLength="4"
        />
    </div>
    {errors.expirationDate && isFormSubmitted && <span className="error">{errors.expirationDate}</span>}
</div>



<div className="form-group">
    <label>CVV:</label>
    <input
        type="number"
        name="cvv"
        value={formData.cvv}
        onChange={handleCVVChange}
        maxLength="3" // This attribute will be enforced via JS, as `maxLength` doesn't work on `number` input
        onInput={(e) => e.target.value = e.target.value.slice(0, 3)} // Enforce max length in JS
    />
    {errors.cvv && isFormSubmitted && <span className="error">{errors.cvv}</span>}
</div>


                <div className="form-group">
                    <label>Billing Address:</label>
                    <input
                        type="text"
                        name="billingAddress"
                        value={formData.billingAddress}
                        onChange={handleInputChange}
                    />
                    {errors.billingAddress && isFormSubmitted && <span className="error">{errors.billingAddress}</span>}
                </div>
                <div className="form-group">
                    <label>Shipping Address:</label>
                    <input
                        type="text"
                        name="shippingAddress"
                        value={formData.shippingAddress}
                        onChange={handleInputChange}
                    />
                    {errors.shippingAddress && isFormSubmitted && <span className="error">{errors.shippingAddress}</span>}
                </div>
                <div className="form-group">
    <label>Phone Number:</label>
    <input
        type="tel" // Use type="tel" for telephone numbers
        name="phoneNumber"
        value={formData.phoneNumber}
        onChange={handleInputChange}
        pattern="[0-9]*" // Enforce digit-only input
        minLength="11" // Set the minimum length to 11 characters
        maxLength="11" // Set the maximum length to 11 characters
    />
    {errors.phoneNumber && isFormSubmitted && <span className="error">{errors.phoneNumber}</span>}
</div>


                <div className="form-group">
                    <input
                        type="checkbox"
                        name="agreeTerms"
                        checked={formData.agreeTerms}
                        onChange={handleCheckboxChange}
                    />
                    <label htmlFor="agreeTerms">I agree to the terms and conditions</label>
                    {errors.agreeTerms && isFormSubmitted && <span className="error">{errors.agreeTerms}</span>}
                </div>
                <button type="submit" disabled={!isFormValid}>Finish the Shopping</button>
            </form>
            {isFormSubmitted && isFormValid && (
                <div className="confirmation-message">
                    <p>Thanks for shopping!</p>
                </div>
            )}

{isFormSubmitted && !isFormValid && (
    <div className="warning-message">
        <p>Please fill out all required fields correctly.</p>
    </div>
)}
        </div>
    );
};

export default CheckoutPage;