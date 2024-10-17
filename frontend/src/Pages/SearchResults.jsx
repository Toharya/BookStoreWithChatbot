import React from 'react';
import { Link } from 'react-router-dom';

const SearchResults = ({ results }) => {
    return (
        <div>
            <h2>Search Results</h2>
            <ul>
                {results.map((product) => (
                    <li key={product.id}>
                        <Link to={`/product/${product.id}`}>{product.name}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SearchResults;
