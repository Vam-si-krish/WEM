import React, { useState, useRef, useEffect } from 'react';
import Product from './Product';
import { db } from '../firebase'; // Import DB
import { collection, getDocs } from "firebase/firestore"; // Import Firestore methods
import './Shop.css'
// import { MOCK_PRODUCTS } from .'../MockData'; // <--- NEW IMPORT

export default function Shop() {
    // 1. STATE MANAGEMENT
    const [allProducts, setAllProducts] = useState([]); // Stores ALL data from DB
    const [search, setSearch] = useState("");
    const [selectedTopics, setSelectedTopics] = useState(new Set(["All"]));
    const [showFilter, setShowFilter] = useState(false);
    const [displayProducts, setDisplayProducts] = useState([]);
    // Dynamic Topics List (Derived from DB data)
    const [topicsList, setTopicsList] = useState(["All"]);

    const ref = useRef(null)

    // 2. FETCH DATA FROM FIREBASE
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "products"));
                const productsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                
                setAllProducts(productsData);
                setDisplayProducts(productsData);

                // Dynamically build category buttons from data
                const categories = new Set(productsData.map(p => p.category));
                // Sort categories and add "All" at the start
                setTopicsList(["All", ...Array.from(categories).sort()]);

            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchProducts();
    }, []);

    // 3. TOPIC SELECTION LOGIC
    const handleTopicClick = (name) => {
        const newTopics = new Set(selectedTopics);
        if (newTopics.has(name)) {
             if (newTopics.size > 1) newTopics.delete(name);
        } else {
            if (name === "All") {
                newTopics.clear();
                newTopics.add("All");
            } else {
                newTopics.delete("All");
                newTopics.add(name);
            }
        }
        if (newTopics.size === 0) newTopics.add("All");
        setSelectedTopics(newTopics);
    }

    // 4. APPLY FILTER (Search + Category)
    // Run this whenever search, topics, or the raw data changes
    useEffect(() => {
        let result = allProducts;

        // Filter by Search Text
        if (search.trim() !== "") {
            result = result.filter(item => 
                item.name.toLowerCase().includes(search.toLowerCase())
            );
        }

        // Filter by Category
        if (!selectedTopics.has("All")) {
            result = result.filter(item => selectedTopics.has(item.category));
        }

        setDisplayProducts(result);
    }, [search, selectedTopics, allProducts]);

    // 5. SORT LOGIC
    const handleSort = (str) => {
        let sorted = [...displayProducts];
        if (str === "lowToHigh") {
            sorted.sort((a, b) => a.price - b.price);
        } else if (str === "highToLow") {
            sorted.sort((a, b) => b.price - a.price);
        } else if (str === "Name") {
            sorted.sort((a, b) => a.name.localeCompare(b.name));
        }
        setDisplayProducts(sorted);
        setShowFilter(false);
    }

    const scroll = (scrollOffset) => {
        if(ref.current) ref.current.scrollLeft += scrollOffset;
    };

    return (
        <div className='ShopMainPAge'>
            <div className="Sticky">
                {/* Search Box */}
                <div className="searchBox">
                    <input type="text" placeholder='Search' value={search} onChange={(e) => setSearch(e.target.value)} />
                    <button className='SearchBtn'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                        </svg>
                    </button>
                </div>

                {/* Topic Slider - Now uses DYNAMIC 'topicsList' */}
                <div className="topic">
                    <div className="boxTopic">
                        <span className='leftBtnTopic' onClick={() => scroll(-30)}>
                             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left-circle" viewBox="0 0 16 16"><path fillRule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z" /></svg>
                        </span>
                        <div className="ScrollTipicBox" ref={ref}>
                            {topicsList.map((ele, index) => {
                                const isActive = selectedTopics.has(ele);
                                return (
                                    <span 
                                        key={index} 
                                        onClick={() => handleTopicClick(ele)} 
                                        className={isActive ? "topics targetTopic" : "topics Topic"}
                                    >
                                        {ele}
                                    </span>
                                )
                            })}
                        </div>
                        <span className='rightBtnTopic' onClick={() => scroll(30)}>
                             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-right-circle" viewBox="0 0 16 16"><path fillRule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z" /></svg>
                        </span>
                    </div>
                </div>

                <button className="btn btn-Primary" type="button">Apply</button>

                {/* Filter Dropdown */}
                <div className="dropdown" style={{ position: 'relative', display: 'inline-block', marginLeft:'5px' }}>
                    <button className="btn btn-secondary dropdown-toggle bg-dark" type="button" onClick={() => setShowFilter(!showFilter)}>
                        Filter ▾
                    </button>
                    {showFilter && (
                        <div className="dropdown-menu" style={{ display: 'block', position: 'absolute', right: 0, zIndex: 1000, backgroundColor: '#fff', border: '1px solid rgba(0,0,0,.15)', minWidth: '10rem' }}>
                            <button className="dropdown-item" onClick={() => handleSort("lowToHigh")}>Price Low to High</button>
                            <button className="dropdown-item" onClick={() => handleSort("highToLow")}>Price High to Low</button>
                            <button className="dropdown-item" onClick={() => handleSort("Name")}>Sort by Name</button>
                        </div>
                    )}
                </div>
            </div>

            <div className='ShopPage'>
                <div className="ShopPageSecondSection">
                    <Product Margin={{ "margin": "20px" }} type="Shop" passedData={displayProducts} />
                </div>
            </div>
        </div>
    )
}