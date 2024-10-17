import React, { useState } from 'react';
import './AddProduct.css';
import upload_area from '../../assets/upload_area.svg';

const AddProduct = () => {
    const [image, setImage] = useState(false);

    const [productDetails, setProductDetails] = useState({
        name: "",
        writer:"",
        image: "",
        category: "literature",
        new_price: "",
        old_price: "",
        description: "",
        publisher: "",
        page_number:""
    });

    const imageHandler = (e) => {
        const file = e.target.files[0];
        setImage(file);
        setProductDetails({...productDetails, image: file});
    }

    const changeHandler = (e) => {
        setProductDetails({...productDetails, [e.target.name]: e.target.value});
    }

    const addProduct = async () => {
        console.log(productDetails);
        let responseData;
        let product = productDetails;

        let formData = new FormData();
        formData.append('product',image);

        await fetch('http://localhost:4000/upload',{
            method:'POST',
            headers:{
                Accept:'application/json',
            },
            body:formData,
        }).then((resp) => resp.json()).then((data)=>{responseData=data});

        if(responseData.success)
        {
            product.image = responseData.image_url;
            console.log(product);
            await fetch('http://localhost:4000/addproduct',{
                method:'POST',
                headers:{
                    Accept: 'application/json',
                    'Content-Type':'application/json',
                },
                body:JSON.stringify(product),
            }).then((resp)=>resp.json()).then((data)=>{
                data.success?alert("Product Added"):alert("Failed")
            })
        }
    }

    return (
        <div className='add-product'>
            <div className="addproduct-itemfield">
                <p>Product title</p>
                <input value={productDetails.name} onChange={changeHandler} type="text" name='name' placeholder='Type here' />
            </div>
            <div className="addproduct-itemfield">
                <p>Writer</p>
                <input value={productDetails.writer} onChange={changeHandler} type="text" name='writer' placeholder='Type here' />
            </div>
            <div className="addproduct-price">
                <div className="addproduct-itemfield">
                    <p>Price</p>
                    <input value={productDetails.old_price} onChange={changeHandler} type="text" name="old_price" placeholder='Type here' />
                </div>
                <div className="addproduct-itemfield">
                    <p>Offer Price</p>
                    <input value={productDetails.new_price} onChange={changeHandler} type="text" name="new_price" placeholder='Type here' />
                </div>
            </div>
            <div className="addproduct-itemfield">
                <p>Product Category</p>
                <select value={productDetails.category} onChange={changeHandler} name="category" className='add-product-selector'>
                    <option value="literature">literature</option>
                    <option value="novel">novel</option>
                    <option value="self-improvement">self improvement</option>
                    <option value="children-youth">children and youth</option>
                    <option value="research-history">research and history</option>
                    <option value="comic-book">comic book</option>
                    <option value="philosophy">philosophy</option>
                    <option value="biography-memoirs">biography and memoirs</option>
                </select>
            </div>
            <div className="addproduct-itemfield">
                <p>Publisher</p>
                <input value={productDetails.publisher} onChange={changeHandler} type="text" name='publisher' placeholder='Type here' />
            </div>
            <div className="addproduct-itemfield">
                <p>Page Number</p>
                <input value={productDetails.page_number} onChange={changeHandler} type="text" name='page_number' placeholder='Type here' />
            </div>
            <div className="addproduct-itemfield">
                <p>Description</p>
                <textarea value={productDetails.description} onChange={changeHandler} name='description' placeholder='Type here' />
            </div>
            <div className="addproduct-itemfield">
                <label htmlFor="file-input">
                    <img src={image ? URL.createObjectURL(image) : upload_area} className='addproduct-thumbnail-img' alt="" />
                </label>
                <input onChange={imageHandler} type="file" name='image' id='file-input' hidden />
            </div>
            <button onClick={addProduct} className='addproduct-btn'>ADD</button>
        </div>
    );
}

export default AddProduct;
