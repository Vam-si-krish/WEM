// // import { UserContext } from '../Store'
// import Product from './Product'
// import React, { useContext, useEffect, useRef, useState } from 'react'
// export default function Shop() {
//     let store = useContext(UserContext)
//     const [topicsList, settopicsList] = useState([])
//     const [search, setSearch] = useState("");
//     const TopicOnClick = (e, name) => {
//         if (e.currentTarget.classList.contains('Topic')) {

//             e.currentTarget.classList.remove("Topic")
//             e.currentTarget.classList.add("targetTopic")
//             let temp = store.searchList
//             temp.add(name)
//             store.setsearchList(temp)
//         }
//         else {
//             e.currentTarget.classList.remove("targetTopic")
//             e.currentTarget.classList.add("Topic")
//             let temp = store.searchList
//             temp.delete(name)
//             store.setsearchList(temp)
//             // console.log(store.searchList)
//         }

//     }
//     const ref = useRef(null)
//     const scroll = (scrollOffset) => {
//         ref.current.scrollLeft += scrollOffset;
//         if (ref.current.scrollLeft === 0) {

//         }
//     };
//     let handleClick = () => {
//         let option;
//         let category = [];
//         if (store.searchList.has("All")) {
//             option = {
//                 all: true,
//                 search: search,
//                 category: category
//             }
//         }
//         else {
//             store.searchList.forEach(element => {
//                 category.push(element)
//             });
//             option = {
//                 all: false,
//                 search: search,
//                 category: category
//             }
//         }
//         fetch(process.env.REACT_APP_API_KEY + "getProducts", {
//             method: "POST",
//             mode: "cors",
//             cache: "no-cache",
//             credentials: "same-origin",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify(option),
//         }).then(
//             (res) => {
//                 return res.json();
//             }
//         ).then((data) => {
//             console.log(data)
//             if (data.status) {
//                 store.setSearchcartList(data.products)
//             }
//             else {
//                 alert("error")
//             }
//         })
//             .catch((err) => {
//                 console.log(err)
//                 alert("error")
//             })
//     }


//     let handleSort = (str) => {
//         let product = store.SearchcartList;
//         if (str === "lowToHighi") {
//             let newProduct = [...product].sort((a, b) => a.price - b.price);
//             // console.log(newProduct);
//             store.setSearchcartList(newProduct);
//         }
//         else if (str === "highiToLow") {
//             let newProduct = [...product].sort((a, b) => b.price - a.price);
//             // console.log(newProduct);
//             store.setSearchcartList(newProduct);
//         }
//         else if(str==="Name"){
//             let newProduct = [...product].sort((a, b) => a.name.localeCompare(b.name));
//             // console.log(newProduct);
//             store.setSearchcartList(newProduct);
//         }

//     }
//     useEffect(() => {
//         settopicsList(["All", "Dairy", "fruit", "Household", "Snacks", "Vegetables"]);
//         handleClick();
//     }, []);

//     return (
//         <div className='ShopMainPAge'>
//             <div className="Sticky">
//                 <div className="searchBox">
//                     <input type="text" name="Search" id="Search" placeholder='Search' value={search} onChange={(e) => { setSearch(e.target.value) }} />
//                     <button className='SearchBtn' onClick={handleClick}>
//                         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
//                             <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
//                         </svg>
//                     </button>
//                 </div>

//                 <div className="topic">

//                     <div className="boxTopic">
//                         <span className='leftBtnTopic' onClick={() => scroll(-30)}>
//                             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left-circle" viewBox="0 0 16 16">
//                                 <path fillRule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z" />
//                             </svg>
//                         </span>
//                         <div className="ScrollTipicBox" ref={ref}>

//                             {topicsList.map((ele, index) => {
//                                 let flag = store.searchList.has(ele);
//                                 return <span key={index} onClick={(event) => { TopicOnClick(event, ele) }} className={(flag) ? "topics targetTopic" : "topics Topic"}>{ele}</span>
//                             })}
//                         </div>
//                         <span className='rightBtnTopic' onClick={() => scroll(30)}>
//                             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-right-circle" viewBox="0 0 16 16">
//                                 <path fillRule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z" />
//                             </svg>
//                         </span>
//                     </div>

//                 </div>
//                 <button className="btn btn-Primary  " type="button" id="Apply" aria-haspopup="true" aria-expanded="false" onClick={handleClick}>
//                     Apply
//                 </button>
//                 <div className="dropdown">
//                     <button className="btn btn-secondary dropdown-toggle bg-dark " type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
//                         Filter
//                     </button>
//                     <div className="dropdown-menu" aria-labelledby="dropdownMenu2">
//                         <button className="dropdown-item" type="button" onClick={() => {
//                             handleSort("lowToHighi")
//                         }}>Price Low to High</button>
//                         <button className="dropdown-item" type="button"
//                             onClick={() => {
//                                 handleSort("highiToLow")
//                             }}
//                         >Price High to low</button>
//                         <button className="dropdown-item" type="button"
//                             onClick={() => {
//                                 handleSort("Name")
//                             }}
//                         >Sort by Name</button>

//                     </div>
//                 </div>

//             </div>
//             <div className='ShopPage'>

//                 <div className="ShopPageSecondSection">
//                     <Product Margin={{ "margin": "20px" }} type="Shop" ></Product>
//                 </div>
//             </div>
//         </div>
//     )
// }



import React, { useState, useRef, useEffect } from 'react';
import Product from './Product';

import './Shop.css'
// 1. STATIC MOCK DATA (Replaces API)
export const MOCK_PRODUCTS = [
    { name: "Pineapple", imgUrl: "/Grocify_files/S1.jpg", category: "fruit", text: "1kg", price: 200, stock: 5 },
    { name: "Avocado", imgUrl: "/Grocify_files/S2.jpg", category: "fruit", text: "1kg", price: 350, stock: 5 },
    { name: "Papaya", imgUrl: "/Grocify_files/S3.jpg", category: "fruit", text: "1kg", price: 100, stock: 5 },
    { name: "Apple", imgUrl: "/Grocify_files/S4.jpg", category: "fruit", text: "3kg", price: 100, stock: 5 },
    { name: "Kevin", imgUrl: "/Grocify_files/S5.jpg", category: "fruit", text: "1kg", price: 500, stock: 5 },
    { name: "Orange", imgUrl: "/Grocify_files/S6.jpg", category: "fruit", text: "1kg", price: 90, stock: 5 },
    { name: "Pear", imgUrl: "/Grocify_files/S7.jpg", category: "fruit", text: "1kg", price: 100, stock: 5 },
    { name: "Strawberry", imgUrl: "/Grocify_files/S8.jpg", category: "fruit", text: "1kg", price: 200, stock: 5 },
    { name: "Butter", imgUrl: "/Grocify_files/Butter.jpg", category: "Dairy", text: "100gm", price: 80, stock: 5 },
    { name: "Cheese", imgUrl: "/Grocify_files/cheese.jpg", category: "Dairy", text: "100gm", price: 100, stock: 5 },
    { name: "Milk", imgUrl: "/Grocify_files/Milk.jpg", category: "Dairy", text: "1lt", price: 30, stock: 5 },
    { name: "Yogurt", imgUrl: "/Grocify_files/Yogurt.jpg", category: "Dairy", text: "1kg", price: 180, stock: 5 },
    { name: "Tomatoes", imgUrl: "/Grocify_files/Tomatoes.jpg", category: "Vegetables", text: "1kg", price: 60, stock: 5 },
    { name: "Beets", imgUrl: "/Grocify_files/Beets.jpg", category: "Vegetables", text: "1kg", price: 50, stock: 5 },
    { name: "Broccoli", imgUrl: "/Grocify_files/Broccoli.jpg", category: "Vegetables", text: "1kg", price: 90, stock: 5 },
    { name: "Cabbage", imgUrl: "/Grocify_files/Cabbage.jpg", category: "Vegetables", text: "1kg", price: 80, stock: 5 },
    { name: "Cauliflower", imgUrl: "/Grocify_files/Cauliflower.jpg", category: "Vegetables", text: "1kg", price: 30, stock: 5 },
    { name: "Garlic", imgUrl: "/Grocify_files/Garlic.jpg", category: "Vegetables", text: "500gm", price: 100, stock: 5 },
    { name: "Onions", imgUrl: "/Grocify_files/Onions.jpg", category: "Vegetables", text: "1kg", price: 70, stock: 5 },
    { name: "Potatoes", imgUrl: "/Grocify_files/Potatoes.jpg", category: "Vegetables", text: "1kg", price: 100, stock: 5 },
    { name: "Popcorn", imgUrl: "/Grocify_files/Popcorn.jpg", category: "Snacks", text: "100gm", price: 30, stock: 5 },
    { name: "Almonds", imgUrl: "/Grocify_files/Almonds.jpg", category: "Snacks", text: "1kg", price: 500, stock: 5 },
    { name: "Candy", imgUrl: "/Grocify_files/Candy.jpg", category: "Snacks", text: "1kg", price: 500, stock: 5 },
    { name: "Cookies", imgUrl: "/Grocify_files/Cookies.jpg", category: "Snacks", text: "300gm", price: 30, stock: 5 },
    { name: "Sponges", imgUrl: "/Grocify_files/Sponges.jpg", category: "Household", text: "1kg", price: 80, stock: 5 },
    { name: "Batteries", imgUrl: "/Grocify_files/Batteries.jpg", category: "Household", text: "1PAck", price: 30, stock: 5 },
    { name: "soap", imgUrl: "/Grocify_files/soap.jpg", category: "Household", text: "1kg", price: 100, stock: 5 },
    { name: "Napkins", imgUrl: "/Grocify_files/Napkins.jpg", category: "Household", text: "1box", price: 20, stock: 5 },
    { name: "conditioner", imgUrl: "/Grocify_files/conditioner.jpg", category: "Household", text: "1lt", price: 200, stock: 8 },
    { name: "Shampoo", imgUrl: "/Grocify_files/Shampoo.jpg", category: "Household", text: "1lt", price: 150, stock: 7 }
];

// export default function Shop() {
//     // 2. STATE MANAGEMENT
//     const [displayProducts, setDisplayProducts] = useState(MOCK_PRODUCTS); // Stores the filtered list shown on screen
//     const [search, setSearch] = useState("");
//     const [selectedTopics, setSelectedTopics] = useState(new Set(["All"]));
//     const topicsList = ["All", "Dairy", "fruit", "Household", "Snacks", "Vegetables"];
    
//     const ref = useRef(null)

//     // 3. TOPIC SELECTION LOGIC
//     const handleTopicClick = (name) => {
//         const newTopics = new Set(selectedTopics);
        
//         if (newTopics.has(name)) {
//             // Don't allow deselecting if it's the only one, or handle toggle logic
//             if(newTopics.size > 1) newTopics.delete(name);
//         } else {
//             // If "All" is selected, selecting specific removes "All"
//             // If specific is selected, selecting "All" removes specifics (optional logic)
//             if (name === "All") {
//                 newTopics.clear();
//                 newTopics.add("All");
//             } else {
//                 newTopics.delete("All");
//                 newTopics.add(name);
//             }
//         }
        
//         // Safety: If nothing is selected, default to "All"
//         if(newTopics.size === 0) newTopics.add("All");
        
//         setSelectedTopics(newTopics);
//     }

//     // 4. APPLY FILTER (Search + Category)
//     const handleApply = () => {
//         let result = MOCK_PRODUCTS;

//         // A. Filter by Search Text
//         if (search.trim() !== "") {
//             result = result.filter(item => 
//                 item.name.toLowerCase().includes(search.toLowerCase())
//             );
//         }

//         // B. Filter by Category
//         if (!selectedTopics.has("All")) {
//             result = result.filter(item => selectedTopics.has(item.category));
//         }

//         setDisplayProducts(result);
//     }

//     // 5. SORT LOGIC
//     const handleSort = (str) => {
//         let sorted = [...displayProducts];
        
//         if (str === "lowToHigh") {
//             sorted.sort((a, b) => a.price - b.price);
//         } else if (str === "highToLow") {
//             sorted.sort((a, b) => b.price - a.price);
//         } else if (str === "Name") {
//             sorted.sort((a, b) => a.name.localeCompare(b.name));
//         }
        
//         setDisplayProducts(sorted);
//     }

//     const scroll = (scrollOffset) => {
//         if(ref.current) {
//             ref.current.scrollLeft += scrollOffset;
//         }
//     };

//     // Initial load
//     useEffect(() => {
//         handleApply();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, []); // Run once on mount

//     return (
//         <div className='ShopMainPAge'>
//             <div className="Sticky">
//                 {/* Search Bar */}
//                 <div className="searchBox">
//                     <input 
//                         type="text" 
//                         placeholder='Search' 
//                         value={search} 
//                         onChange={(e) => setSearch(e.target.value)} 
//                     />
//                     <button className='SearchBtn' onClick={handleApply}>
//                         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
//                             <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
//                         </svg>
//                     </button>
//                 </div>

//                 {/* Topics Scroller */}
//                 <div className="topic">
//                     <div className="boxTopic">
//                         <span className='leftBtnTopic' onClick={() => scroll(-30)}>
//                             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left-circle" viewBox="0 0 16 16">
//                                 <path fillRule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z" />
//                             </svg>
//                         </span>
//                         <div className="ScrollTipicBox" ref={ref}>
//                             {topicsList.map((ele, index) => {
//                                 const isActive = selectedTopics.has(ele);
//                                 return (
//                                     <span 
//                                         key={index} 
//                                         onClick={() => handleTopicClick(ele)} 
//                                         className={isActive ? "topics targetTopic" : "topics Topic"}
//                                     >
//                                         {ele}
//                                     </span>
//                                 )
//                             })}
//                         </div>
//                         <span className='rightBtnTopic' onClick={() => scroll(30)}>
//                             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-right-circle" viewBox="0 0 16 16">
//                                 <path fillRule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z" />
//                             </svg>
//                         </span>
//                     </div>
//                 </div>

//                 {/* Apply Button */}
//                 <button className="btn btn-Primary" type="button" onClick={handleApply}>
//                     Apply
//                 </button>

//                 {/* Sort Dropdown */}
//                 <div className="dropdown">
//                     <button className="btn btn-secondary dropdown-toggle bg-dark" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
//                         Filter
//                     </button>
//                     <div className="dropdown-menu" aria-labelledby="dropdownMenu2">
//                         <button className="dropdown-item" type="button" onClick={() => handleSort("lowToHigh")}>Price Low to High</button>
//                         <button className="dropdown-item" type="button" onClick={() => handleSort("highToLow")}>Price High to Low</button>
//                         <button className="dropdown-item" type="button" onClick={() => handleSort("Name")}>Sort by Name</button>
//                     </div>
//                 </div>
//             </div>

//             {/* Product Display */}
//             <div className='ShopPage'>
//                 <div className="ShopPageSecondSection">
//                     {/* IMPORTANT: We pass the filtered list as 'passedData' */}
//                     <Product 
//                         Margin={{ "margin": "20px" }} 
//                         type="Shop" 
//                         passedData={displayProducts} 
//                     />
//                 </div>
//             </div>
//         </div>
//     )
// }


// // 1. MOCK DATA (Your Database)
// const MOCK_PRODUCTS = [
//     { name: "Pineapple", imgUrl: "./S1.jpg", category: "fruit", text: "1kg", price: 200, stock: 5 },
//     { name: "Avocado", imgUrl: "./S2.jpg", category: "fruit", text: "1kg", price: 350, stock: 5 },
//     { name: "Papaya", imgUrl: "./S3.jpg", category: "fruit", text: "1kg", price: 100, stock: 5 },
//     { name: "Apple", imgUrl: "./S4.jpg", category: "fruit", text: "3kg", price: 100, stock: 5 },
//     { name: "Kevin", imgUrl: "./S5.jpg", category: "fruit", text: "1kg", price: 500, stock: 5 },
//     { name: "Orange", imgUrl: "./S6.jpg", category: "fruit", text: "1kg", price: 90, stock: 5 },
//     { name: "Pear", imgUrl: "./S7.jpg", category: "fruit", text: "1kg", price: 100, stock: 5 },
//     { name: "Strawberry", imgUrl: "./S8.jpg", category: "fruit", text: "1kg", price: 200, stock: 5 },
//     { name: "Butter", imgUrl: "./Butter.jpg", category: "Dairy", text: "100gm", price: 80, stock: 5 },
//     { name: "Cheese", imgUrl: "./cheese.jpg", category: "Dairy", text: "100gm", price: 100, stock: 5 },
//     { name: "Milk", imgUrl: "./Milk.jpg", category: "Dairy", text: "1lt", price: 30, stock: 5 },
//     { name: "Yogurt", imgUrl: "./Yogurt.jpg", category: "Dairy", text: "1kg", price: 180, stock: 5 },
//     { name: "Tomatoes", imgUrl: "./Tomatoes.jpg", category: "Vegetables", text: "1kg", price: 60, stock: 5 },
//     { name: "Beets", imgUrl: "./Beets.jpg", category: "Vegetables", text: "1kg", price: 50, stock: 5 },
//     { name: "Broccoli", imgUrl: "./Broccoli.jpg", category: "Vegetables", text: "1kg", price: 90, stock: 5 },
//     { name: "Cabbage", imgUrl: "./Cabbage.jpg", category: "Vegetables", text: "1kg", price: 80, stock: 5 },
//     { name: "Cauliflower", imgUrl: "./Cauliflower.jpg", category: "Vegetables", text: "1kg", price: 30, stock: 5 },
//     { name: "Garlic", imgUrl: "./Garlic.jpg", category: "Vegetables", text: "500gm", price: 100, stock: 5 },
//     { name: "Onions", imgUrl: "./Onions.jpg", category: "Vegetables", text: "1kg", price: 70, stock: 5 },
//     { name: "Potatoes", imgUrl: "./Potatoes.jpg", category: "Vegetables", text: "1kg", price: 100, stock: 5 },
//     { name: "Popcorn", imgUrl: "./Popcorn.jpg", category: "Snacks", text: "100gm", price: 30, stock: 5 },
//     { name: "Almonds", imgUrl: "./Almonds.jpg", category: "Snacks", text: "1kg", price: 500, stock: 5 },
//     { name: "Candy", imgUrl: "./Candy.jpg", category: "Snacks", text: "1kg", price: 500, stock: 5 },
//     { name: "Cookies", imgUrl: "./Cookies.jpg", category: "Snacks", text: "300gm", price: 30, stock: 5 },
//     { name: "Sponges", imgUrl: "./Sponges.jpg", category: "Household", text: "1kg", price: 80, stock: 5 },
//     { name: "Batteries", imgUrl: "./Batteries.jpg", category: "Household", text: "1PAck", price: 30, stock: 5 },
//     { name: "soap", imgUrl: "./soap.jpg", category: "Household", text: "1kg", price: 100, stock: 5 },
//     { name: "Napkins", imgUrl: "./Napkins.jpg", category: "Household", text: "1box", price: 20, stock: 5 },
//     { name: "conditioner", imgUrl: "./conditioner.jpg", category: "Household", text: "1lt", price: 200, stock: 8 },
//     { name: "Shampoo", imgUrl: "./Shampoo.jpg", category: "Household", text: "1lt", price: 150, stock: 7 }
// ];

export default function Shop() {
    // 2. STATE
    const [displayProducts, setDisplayProducts] = useState(MOCK_PRODUCTS);
    const [search, setSearch] = useState("");
    const [selectedTopics, setSelectedTopics] = useState(new Set(["All"]));
    // New state for dropdown visibility
    const [showFilter, setShowFilter] = useState(false); 
    
    const topicsList = ["All", "Dairy", "fruit", "Household", "Snacks", "Vegetables"];
    const ref = useRef(null);

    // 3. LOGIC: Handle Topic Selection
    const handleTopicClick = (name) => {
        const newTopics = new Set(selectedTopics);
        if (newTopics.has(name)) {
             // If clicked topic is already selected, prevent deselecting if it's the only one (optional)
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

    // 4. LOGIC: Apply Filter (Search + Topics)
    const handleApply = () => {
        let result = MOCK_PRODUCTS;

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
    }

    // 5. LOGIC: Sorting
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
        setShowFilter(false); // Close dropdown after selection
    }

    const scroll = (scrollOffset) => {
        if(ref.current) ref.current.scrollLeft += scrollOffset;
    };

    // Load initial data
    useEffect(() => {
        handleApply();
        // eslint-disable-next-line
    }, []); 

    return (
        <div className='ShopMainPAge'>
            <div className="Sticky">
                {/* Search Box */}
                <div className="searchBox">
                    <input 
                        type="text" 
                        placeholder='Search' 
                        value={search} 
                        onChange={(e) => setSearch(e.target.value)} 
                    />
                    <button className='SearchBtn' onClick={handleApply}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                        </svg>
                    </button>
                </div>

                {/* Topic Slider */}
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

                {/* Apply Button */}
                <button className="btn btn-Primary" type="button" onClick={handleApply}>
                    Apply
                </button>

                {/* --- FIXED DROPDOWN --- */}
                <div className="dropdown" style={{ position: 'relative', display: 'inline-block', marginLeft:'5px' }}>
                    <button 
                        className="btn btn-secondary dropdown-toggle bg-dark" 
                        type="button" 
                        // Toggle logic using state
                        onClick={() => setShowFilter(!showFilter)}
                    >
                        Filter ▾
                    </button>
                    
                    {/* Conditionally render the menu based on state */}
                    {showFilter && (
                        <div 
                            className="dropdown-menu" 
                            style={{
                                display: 'block', // Force display
                                position: 'absolute',
                                right: 0,
                                zIndex: 1000,
                                backgroundColor: '#fff',
                                border: '1px solid rgba(0,0,0,.15)',
                                borderRadius: '.25rem',
                                boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.15)',
                                minWidth: '10rem',
                                padding: '.5rem 0',
                                marginTop: '.125rem'
                            }}
                        >
                            <button className="dropdown-item" type="button" 
                                style={{ display: 'block', width: '100%', padding: '.25rem 1.5rem', clear: 'both', fontWeight: 400, color: '#212529', textAlign: 'inherit', whiteSpace: 'nowrap', backgroundColor: 'transparent', border: 0 }}
                                onClick={() => handleSort("lowToHigh")}
                            >
                                Price Low to High
                            </button>
                            <button className="dropdown-item" type="button" 
                                style={{ display: 'block', width: '100%', padding: '.25rem 1.5rem', clear: 'both', fontWeight: 400, color: '#212529', textAlign: 'inherit', whiteSpace: 'nowrap', backgroundColor: 'transparent', border: 0 }}
                                onClick={() => handleSort("highToLow")}
                            >
                                Price High to Low
                            </button>
                            <button className="dropdown-item" type="button" 
                                style={{ display: 'block', width: '100%', padding: '.25rem 1.5rem', clear: 'both', fontWeight: 400, color: '#212529', textAlign: 'inherit', whiteSpace: 'nowrap', backgroundColor: 'transparent', border: 0 }}
                                onClick={() => handleSort("Name")}
                            >
                                Sort by Name
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className='ShopPage'>
                <div className="ShopPageSecondSection">
                    {/* Pass the STATE data to the Product component */}
                    <Product 
                        Margin={{ "margin": "20px" }} 
                        type="Shop" 
                        passedData={displayProducts} 
                    />
                </div>
            </div>
        </div>
    )
}