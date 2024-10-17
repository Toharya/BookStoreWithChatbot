import React, { useState } from 'react';
import axios from 'axios';
import './Chatbot.css';

const Chatbot = () => {
    const [preferences, setPreferences] = useState({
        book: '',
        author: '',
        publisher: '',
        paperback: '',
        price: '',
        category: ''
    });
    const [results, setResults] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const handleChange = (e) => {
        setPreferences({
            ...preferences,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitted(true);
        setError('');
        try {
            const response = await axios.post('http://localhost:4000/recommend', preferences);
            setResults(response.data);
        } catch (error) {
            console.error("There was an error!", error);
            setError('An error occurred while fetching recommendations. Please try again later.');
        }
    };

    const toggleChatbot = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="chatbot-container">
            <div className={`chatbot ${isOpen ? 'open' : 'closed'}`}>
                <div className="chatbot-header" onClick={toggleChatbot}>
                    <p>ChatBot Support</p>
                </div>
                {isOpen && (
                    <div className="chatbot-content">
                        <form onSubmit={handleSubmit}>
                            <input name="book" placeholder="Book" onChange={handleChange} />
                            <input name="author" placeholder="Author" onChange={handleChange} />
                            <input name="publisher" placeholder="Publisher" onChange={handleChange} />
                            <input name="paperback" placeholder="Paperback" onChange={handleChange} />
                            <input name="price" placeholder="Price" onChange={handleChange} />
                            <input name="category" placeholder="Category" onChange={handleChange} />
                            <button type="submit">Get Recommendations</button>
                        </form>
                        {error && <p className="error">{error}</p>}
                        {submitted && (
                            results.length > 0 ? (
                                <div className="results">
                                    {results.map((book, index) => (
                                        <div key={index} className="book-info">
                                            <h3>{book.book}</h3>
                                            <p><strong>Author:</strong> {book.author}</p>
                                            <p><strong>Publisher:</strong> {book.publisher}</p>
                                            <p><strong>Paperback:</strong> {book.paperback}</p>
                                            <p><strong>Description:</strong> {book.description}</p>
                                            <p><strong>Price:</strong> {book.price}</p>
                                            <p><strong>Category:</strong> {book.category}</p>
                                            <p><strong>Publication Year:</strong> {book.pyear}</p>
                                            {book.links ? (
                                                <a href={book.links} target="_blank" rel="noopener noreferrer">More Info</a>
                                            ) : (
                                                <p>No link available</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p>No books matching your preferences were found.</p>
                            )
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Chatbot;
