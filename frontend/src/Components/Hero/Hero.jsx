import React from 'react'
import './Hero.css'
import hand_icon from '../Assets/hand_icon.png'
import book_image from '../Assets/book.jpg'
const Hero = () => {
    return (
        <div className='hero'>
            <div className="hero-left">
                <h2> </h2>
                <div>
                    <div className="hero-hand-icon">
                        <p></p>
                        <img src={hand_icon} alt="" />
                    </div>
                    <p>Books</p>
                    <p>for Everyone</p>
                </div>
                
            </div>
            <div className="hero-right">
                <img src={book_image} alt="" />
            </div>

        </div>
    )
}

export default Hero