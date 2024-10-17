import React from 'react'
import './Offers.css'
import book_chatbot_image from '../Assets/book_chatbot.jpg'

const Offers = () => {
    return (
        <div className='offers'>
            <div className='offers-left'>
                <h1>Best</h1>
                <h1>Recommendations For You</h1>
            </div>
            <div className='offers-right'>
                <img src={book_chatbot_image} alt="" />
            </div>
        </div>
    )
}

export default Offers
