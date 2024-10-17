import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './DescriptionBox.css';

const DescriptionBox = () => {
    const { productId } = useParams();
    const [description, setDescription] = useState('');
    const [reviews, setReviews] = useState([]);
    const [activeTab, setActiveTab] = useState('description');

    useEffect(() => {
        const fetchProductDescription = async () => {
            try {
                const response = await fetch(`http://localhost:4000/product/${productId}`);
                const data = await response.json();
                setDescription(data.description || '');
                setReviews(data.reviews || []); 
            } catch (error) {
                console.error('Error fetching product description:', error);
            }
        };

        fetchProductDescription();
    }, [productId]);

    return (
        <div className='descriptionbox'>
            <div className="descriptionbox-navigator">
                <div
                    className={`descriptionbox-nav-box ${activeTab === 'description' ? '' : 'fade'}`}
                    onClick={() => setActiveTab('description')}
                >
                    Description
                </div>
                <div
                    className={`descriptionbox-nav-box ${activeTab === 'reviews' ? '' : 'fade'}`}
                    onClick={() => setActiveTab('reviews')}
                >
                    Reviews ({reviews.length})
                </div>
            </div>
            <div className="descriptionbox-description">
                {activeTab === 'description' ? (
                    <>
                        <h2>Description</h2>
                        <p>{description}</p>
                    </>
                ) : (
                    <>
                        <h2>Reviews</h2>
                        <ul>
                            {reviews.map((review, index) => (
                                <li key={index}>{review}</li>
                            ))}
                        </ul>
                    </>
                )}
            </div>
        </div>
    );
};

export default DescriptionBox;
