import React, { useEffect, useState } from 'react'
import './NewBooks.css'
import Item from '../Item/Item'

const NewBooks = () => {

    const [new_books,setNew_books] = useState([]);


    useEffect(()=>{
        fetch('http://localhost:4000/newbooks')
        .then((response)=>response.json())
        .then((data)=>setNew_books(data));
    },[])
    return (
        <div className='new-books'>
            <h1>NEW BOOKS</h1>
            <hr />
            <div className="books">
                {new_books.map((item,i)=>{
                    return <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price ={item.old_price}/>
                })}
            </div>
        </div>
    )
}

export default NewBooks