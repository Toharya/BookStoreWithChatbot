import React, { useState } from 'react';
import './CSS/LoginSignup.css';

const LoginSignup = () => {
    const [state, setState] = useState("Login");
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        email: ""
    });
    const [responseData, setResponseData] = useState(null);
    const [agreeChecked, setAgreeChecked] = useState(false); // State to manage checkbox status

    const changeHandler = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const login = async () => {
        console.log("Login Function Executed", formData);
        await fetch('http://localhost:4000/login', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
            .then((response) => response.json())
            .then((data) => {
                setResponseData(data);
                if (data.success) {
                    localStorage.setItem('auth-token', data.token);
                    window.location.replace("/");
                } else if (data.errors) {
                    alert(data.errors);
                } else {
                    alert("Login failed. Please try again.");
                }
            })
            .catch((error) => {
                console.error("Error during login:", error);
                alert("An error occurred. Please try again.");
            });
    };

    const signup = async () => {
        console.log("Signup Function Executed", formData);
        if (!agreeChecked) {
            alert("Please agree to the terms to continue.");
            return;
        }

        // Check if all required fields are filled
        if (!formData.username || !formData.email || !formData.password) {
            alert("Please fill in all required fields.");
            return;
        }

        await fetch('http://localhost:4000/signup', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
            .then((response) => response.json())
            .then((data) => {
                setResponseData(data);
                if (data.success) {
                    localStorage.setItem('auth-token', data.token);
                    window.location.replace("/");
                } else if (data.errors) {
                    alert(data.errors);
                } else {
                    alert("Signup failed. Please try again.");
                }
            })
            .catch((error) => {
                console.error("Error during signup:", error);
                alert("An error occurred. Please try again.");
            });
    };

    return (
        <div className='loginsignup'>
            <div className="loginsignup-container">
                <h1>{state}</h1>
                <div className="loginsignup-fields">
                    {state === "Sign Up" ? <input name='username' value={formData.username} onChange={changeHandler} type="text" placeholder='Your Name' /> : null}
                    <input name='email' value={formData.email} onChange={changeHandler} type="email" placeholder='Email Address' />
                    <input name='password' value={formData.password} onChange={changeHandler} type="password" placeholder='Password' />
                </div>
                <button onClick={() => { state === "Login" ? login() : signup() }}>Login</button>
                {state === "Sign Up"
                    ? <>
                        <div className="loginsignup-agree">
                            <input type="checkbox" checked={agreeChecked} onChange={() => setAgreeChecked(!agreeChecked)} />
                            <p>By continuing, I agree to the terms of use & privacy policy.</p>
                        </div>
                      </>
                    : null}
                {state === "Sign Up"
                    ? <p className="loginsignup-login">Already have an account? <span onClick={() => { setState("Login") }}>Login Here</span></p>
                    : <p className="loginsignup-login">Don't have an account? <span onClick={() => { setState("Sign Up") }}>Click here</span></p>}
            </div>
        </div>
    );
};

export default LoginSignup;
