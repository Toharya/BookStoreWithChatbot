import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './UpdateProduct.css';
import upload_area from '../../assets/upload_area.svg';

const UpdateProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [image, setImage] = useState(null);
    const [productDetails, setProductDetails] = useState({
        name: "",
        writer: "",
        image: "",
        category: "literature",
        new_price: "",
        old_price: "",
        description: "",
        publisher: "",
        page_number: ""
    });

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const response = await fetch(`http://localhost:4000/product/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch product details');
                }
                const data = await response.json();
                setProductDetails(data);
                setImage(data.image);
            } catch (error) {
                console.error('Error fetching product details:', error);
            }
        };
        fetchProductDetails();
    }, [id]);

    const imageHandler = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setProductDetails({ ...productDetails, image: file });
        }
    };

    const changeHandler = (e) => {
        setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
    };

    const updateProduct = async () => {
        let responseData;
        let product = productDetails;

        if (image && typeof image !== 'string') {
            let formData = new FormData();
            formData.append('product', image);

            await fetch('http://localhost:4000/upload', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                },
                body: formData,
            }).then((resp) => resp.json()).then((data) => { responseData = data });

            if (responseData.success) {
                product.image = responseData.image_url;
            }
        }

        await fetch(`http://localhost:4000/updateproduct/${id}`, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(product),
        }).then((resp) => resp.json()).then((data) => {
            if (data.success) {
                alert("Product Updated");
                navigate('/listproduct'); // Redirect to the product list after update
            } else {
                alert("Update Failed");
            }
        });
    };

    return (
        <div className='update-product'>
            <div className="updateproduct-itemfield">
                <p>Product title</p>
                <input value={productDetails.name} onChange={changeHandler} type="text" name='name' placeholder='Type here' />
            </div>
            <div className="updateproduct-itemfield">
                <p>Writer</p>
                <input value={productDetails.writer} onChange={changeHandler} type="text" name='writer' placeholder='Type here' />
            </div>
            <div className="updateproduct-price">
                <div className="updateproduct-itemfield">
                    <p>Price</p>
                    <input value={productDetails.old_price} onChange={changeHandler} type="text" name="old_price" placeholder='Type here' />
                </div>
                <div className="updateproduct-itemfield">
                    <p>Offer Price</p>
                    <input value={productDetails.new_price} onChange={changeHandler} type="text" name="new_price" placeholder='Type here' />
                </div>
            </div>
            <div className="updateproduct-itemfield">
                <p>Product Category</p>
                <select value={productDetails.category} onChange={changeHandler} name="category" className='update-product-selector'>
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
            <div className="updateproduct-itemfield">
                <p>Publisher</p>
                <input value={productDetails.publisher} onChange={changeHandler} type="text" name='publisher' placeholder='Type here' />
            </div>
            <div className="updateproduct-itemfield">
                <p>Page Number</p>
                <input value={productDetails.page_number} onChange={changeHandler} type="text" name='page_number' placeholder='Type here' />
            </div>
            <div className="updateproduct-itemfield">
                <p>Description</p>
                <textarea value={productDetails.description} onChange={changeHandler} name='description' placeholder='Type here' />
            </div>
            <div className="updateproduct-itemfield">
                <label htmlFor="file-input">
                    <img
                        src={
                            image
                                ? (typeof image === 'string'
                                    ? image
                                    : URL.createObjectURL(image))
                                : upload_area
                        }
                        className='updateproduct-thumbnail-img'
                        alt=""
                    />
                </label>
                <input onChange={imageHandler} type="file" name='image' id='file-input' hidden />
            </div>
            <button onClick={updateProduct} className='updateproduct-btn'>UPDATE</button>
        </div>
    );
};

export default UpdateProduct;
