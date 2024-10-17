import React from 'react'
import Hero from '../Components/Hero/Hero'
import Popular from '../Components/Popular/Popular'
import NewBooks from '../Components/NewBooks/NewBooks'
import Chatbot from '../Components/Chatbot/Chatbot';
import Offers from '../Components/Offers/Offers'

const Shop = () => {
    return (
        <div>
            <Hero/>
            <Popular/>
            <NewBooks/>
            <Offers />
            <Chatbot />
        </div>
    )
}

export default Shop