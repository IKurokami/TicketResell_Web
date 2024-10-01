'use client';
import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter } from 'react-icons/fa';
import '@/Css/Search.css';

const Search: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [priceRange, setPriceRange] = useState(1000); // Initial price range value
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    const [selectedLocation, setSelectedLocation] = useState(''); // Location filter
    const [filteredImages, setFilteredImages] = useState([]); // Store filtered images
    
    const itemsPerPage = 15;
    
    // Generate 20 images with varying prices and genres
    const images = Array.from({ length: 20 }, (_, index) => ({
        imageUrl: 'https://media.stubhubstatic.com/stubhub-v2-catalog/d_defaultLogo.jpg/q_auto:low,f_auto/products/11655/8932451',
        title: `Movie ${index + 1}`,
        genre: ['action', 'comedy', 'drama', 'sci-fi', 'horror'][index % 5], // Cycle through the genres
        price: Math.floor(Math.random() * 1001), // Random price between 0 and 1000
        location: ['ny', 'la', 'chicago'][index % 3], // Cycle through locations
        date: `2023-10-${String(index + 1).padStart(2, '0')}` // Set date in October
    }));

    const totalPages = Math.ceil(filteredImages.length / itemsPerPage);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // Handle price range change
    const handlePriceRangeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(event.target.value);
        setPriceRange(value);
    };

    // Handle genre checkbox change
    const handleGenreChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = event.target;
        if (checked) {
            setSelectedGenres((prevGenres) => [...prevGenres, value]);
        } else {
            setSelectedGenres((prevGenres) => prevGenres.filter((genre) => genre !== value));
        }
    };

    // Handle location select change
    const handleLocationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedLocation(event.target.value);
    };

    // Function to filter images based on selected filters (genres, location, and price)
    const filterImages = () => {
        let filtered = images;

        // Filter by price range
        filtered = filtered.filter(image => image.price <= priceRange);

        // Filter by selected genres
        if (selectedGenres.length > 0) {
            filtered = filtered.filter(image => selectedGenres.includes(image.genre));
        }

        // Filter by location
        if (selectedLocation) {
            filtered = filtered.filter(image => image.location === selectedLocation);
        }

        setFilteredImages(filtered);
    };

    // Update the filtered images whenever filters change
    useEffect(() => {
        filterImages();
        setCurrentPage(1); // Reset to page 1 after filtering
    }, [priceRange, selectedGenres, selectedLocation]);

    // Update range slider background on initial load
    useEffect(() => {
        const rangeInput = document.querySelector('.range-slider input[type="range"]') as HTMLInputElement;
        if (rangeInput) {  // Ensure that rangeInput is not null
            const percentage = (priceRange / 1000) * 100; // Calculate percentage based on max value (1000)
            rangeInput.style.background = `linear-gradient(to right, #28a745 ${percentage}%, #e9ecef ${percentage}%)`;
        }
    }, [priceRange]);

    // Get the current page's images to display (after filtering)
    const paginatedImages = filteredImages.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="search-ticket-container">
            <div className="search-header">
                <div className="search-ticket-bar">
                    <input
                        type="text"
                        placeholder="Search for movie tickets..."
                        className="search-ticket-input"
                    />
                    <button className="search-ticket-button">
                        <FaSearch />
                    </button>
                </div>
                <button className="filter-toggle" onClick={() => setIsFilterOpen(!isFilterOpen)}>
                    <FaFilter /> Filters
                </button>
            </div>

            {isFilterOpen && (
                <div className="ticket-filters">
                    {/* Genres Filter */}
                    <div className="ticket-filter-category">
                        <label>Genres</label>
                        <div className="checkbox-group">
                            {['Action', 'Comedy', 'Drama', 'Sci-Fi', 'Horror'].map((genre) => (
                                <label key={genre} className="checkbox-label">
                                    <input 
                                        type="checkbox" 
                                        name="genre" 
                                        value={genre.toLowerCase()} 
                                        onChange={handleGenreChange}
                                    />
                                    <span className="checkbox-custom"></span>
                                    {genre}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Price Range Filter */}
                    <div className="ticket-filter-category">
                        <label>Price Range</label>
                        <div className="range-slider">
                            <input
                                type="range"
                                min="0"
                                max="1000"
                                step="5"
                                value={priceRange}
                                onChange={handlePriceRangeChange}
                            />
                            <span className="range-value">$0 - ${priceRange}</span>
                        </div>
                    </div>

                    {/* Location Filter */}
                    <div className="ticket-filter-category">
                        <label>Location</label>
                        <select className="location-select" value={selectedLocation} onChange={handleLocationChange}>
                            <option value="">Select a location</option>
                            <option value="ny">New York</option>
                            <option value="la">Los Angeles</option>
                            <option value="chicago">Chicago</option>
                        </select>
                    </div>
                </div>
            )}

            {/* Products Display */}
            <div className="ticket-search-results">
                {paginatedImages.length > 0 ? (
                    paginatedImages.map((item, index) => (
                        <div key={index} className="ticket-card">
                            <div className="ticket-card-image">
                                <img src={item.imageUrl} alt={item.title} />
                            </div>
                            <div className="ticket-card-details">
                                <h3 className="ticket-card-title">{item.title}</h3>
                                <p className="ticket-card-price">${item.price}</p>
                                <p className="ticket-card-location">{item.location}</p>
                                <p className="ticket-card-date">{item.date}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No results match your search criteria.</p>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="pagination">
                    <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                        &lt;
                    </button>
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index}
                            onClick={() => handlePageChange(index + 1)}
                            className={currentPage === index + 1 ? 'active' : ''}
                        >
                            {index + 1}
                        </button>
                    ))}
                    <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                        &gt;
                    </button>
                </div>
            )}
        </div>
    );
};

export default Search;
