// import React, { useEffect, useState } from 'react'
// import ProductsItem from './ProductsItem'
// import { useContext } from 'react'
// import { UserContext } from '../Store'
// export default function Product(props) {
//   const SearchcartList=useContext(UserContext).SearchcartList
//   const [product, setProduct]=useState([]);
//   useEffect(()=>{
//     fetch(process.env.REACT_APP_API_KEY + "getProducts").then((res)=>{
//       return res.json();
//     }).then((data)=>{
//       if(data.status){
//         setProduct(data.products)
//       }
//     })
//   },[])
//   return (
//     <div className='Product' style={{ marginTop: props["Margin"].margin }} >
//       {
//         props.type === "Shop" ? (SearchcartList.map((ele) => {
//           return <ProductsItem data={ele} key={ele.name} fulldata={ele}></ProductsItem>
//         })) : (product.map((ele) => {
//           // console.log(ele.name)
//           return <ProductsItem data={ele} key={ele.name} fulldata={ele}></ProductsItem>
//         }))

//       }
//     </div>
//   )
// }
// import React, { useState } from 'react'
// import ProductsItem from './ProductsItem'
// // Removed useContext and UserContext imports

// // 1. Mock Data: Products
// const MOCK_PRODUCTS = [
//   { 
//     name: "Mock Product 1", 
//     price: 199, 
//     image: '/PersonalCare.jpg' // null image triggers the gray background
//   },
//   { 
//     name: "Mock Product 2", 
//     price: 250, 
//     image: null 
//   },
//   { 
//     name: "Mock Product 3", 
//     price: 99, 
//     image: null 
//   },
//   { 
//     name: "Mock Product 2", 
//     price: 250, 
//     image: null 
//   },
//   { 
//     name: "Mock Product 3", 
//     price: 99, 
//     image: null 
//   },
//   { 
//     name: "Mock Product 2", 
//     price: 250, 
//     image: null 
//   },
//   { 
//     name: "Mock Product 3", 
//     price: 99, 
//     image: null 
//   },
//   { 
//     name: "Mock Product 2", 
//     price: 250, 
//     image: null 
//   },
//   { 
//     name: "Mock Product 3", 
//     price: 99, 
//     image: null 
//   },
//   { 
//     name: "Mock Product 2", 
//     price: 250, 
//     image: null 
//   }
// ];

// // 2. Mock Data: Search Cart (Replacing Context)
// const MOCK_SEARCH_CART = [
//   { name: "Cart Item 1", price: 50, image: null }
// ];

// export default function Product(props) {
//   // REPLACEMENT: Using local mock data instead of Context
//   const SearchcartList = MOCK_SEARCH_CART;

//   // Initialize state directly with mock data
//   const [product, setProduct] = useState(MOCK_PRODUCTS);

//   // Removed useEffect (No API calls)

//   return (
//     // Added optional chaining (?.) to props["Margin"] to prevent crashes if undefined
//     <div className='Product' style={{ marginTop: props["Margin"]?.margin }} >
//       {
//         props.type === "Shop" ? (SearchcartList.map((ele) => {
//           return <ProductsItem data={ele} key={ele.name} fulldata={ele}></ProductsItem>
//         })) : (product.map((ele) => {
//           return <ProductsItem data={ele} key={ele.name} fulldata={ele}></ProductsItem>
//         }))
//       }
//     </div>
//   )
// }
// import React, { useState } from 'react'
// import ProductsItem from './ProductsItem'

// // 1. New Mock Data provided
// const MOCK_PRODUCTS = [
//   {
//     name: "Pineapple",
//     imgUrl: "./Grocify_files/S1.jpg",
//     category: "fruit",
//     text: "1kg",
//     price: 200,
//     stock: 5
//   }, {
//     name: "Avocado",
//     imgUrl: "./Grocify_files/S2.jpg",
//     category: "fruit",
//     text: "1kg",
//     price: 350,
//     stock: 5
//   }, {
//     name: "Papaya",
//     imgUrl: "./Grocify_files/S3.jpg",
//     category: "fruit",
//     text: "1kg",
//     price: 100,
//     stock: 5
//   }, {
//     name: "Apple",
//     imgUrl: "./Grocify_files/S4.jpg",
//     category: "fruit",
//     text: "3kg",
//     price: 100,
//     stock: 5
//   }, {
//     name: "Kevin",
//     imgUrl: "./Grocify_files/S5.jpg",
//     category: "fruit",
//     text: "1kg",
//     price: 500,
//     stock: 5
//   }, {
//     name: "Orange",
//     imgUrl: "./Grocify_files/S6.jpg",
//     category: "fruit",
//     text: "1kg",
//     price: 90,
//     stock: 5
//   }, {
//     name: "Pear",
//     imgUrl: "./Grocify_files/S7.jpg",
//     category: "fruit",
//     text: "1kg",
//     price: 100,
//     stock: 5
//   }, {
//     name: "Strawberry",
//     imgUrl: "./Grocify_files/S8.jpg",
//     category: "fruit",
//     text: "1kg",
//     price: 200,
//     stock: 5
//   }, {
//     name: "Butter",
//     imgUrl: "./Grocify_files/Butter.jpg",
//     category: "Dairy",
//     text: "100gm",
//     price: 80,
//     stock: 5
//   }, {
//     name: "Cheese",
//     imgUrl: "./Grocify_files/cheese.jpg",
//     category: "Dairy",
//     text: "100gm",
//     price: 100,
//     stock: 5
//   }, {
//     name: "Milk",
//     imgUrl: "./Grocify_files/Milk.jpg",
//     category: "Dairy",
//     text: "1lt",
//     price: 30,
//     stock: 5
//   }, {
//     name: "Yogurt",
//     imgUrl: "./Grocify_files/Yogurt.jpg",
//     category: "Dairy",
//     text: "1kg",
//     price: 180,
//     stock: 5
//   }, {
//     name: "Tomatoes",
//     imgUrl: "./Grocify_files/Tomatoes.jpg",
//     category: "Vegetables",
//     text: "1kg",
//     price: 60,
//     stock: 5
//   }, {
//     name: "Beets",
//     imgUrl: "./Grocify_files/Beets.jpg",
//     category: "Vegetables",
//     text: "1kg",
//     price: 50,
//     stock: 5
//   }, {
//     name: "Broccoli",
//     imgUrl: "./Grocify_files/Broccoli.jpg",
//     category: "Vegetables",
//     text: "1kg",
//     price: 90,
//     stock: 5
//   }, {
//     name: "Cabbage",
//     imgUrl: "./Grocify_files/Cabbage.jpg",
//     category: "Vegetables",
//     text: "1kg",
//     price: 80,
//     stock: 5
//   }, {
//     name: "Cauliflower",
//     imgUrl: "./Grocify_files/Cauliflower.jpg",
//     category: "Vegetables",
//     text: "1kg",
//     price: 30,
//     stock: 5
//   }, {
//     name: "Garlic",
//     imgUrl: "./Grocify_files/Garlic.jpg",
//     category: "Vegetables",
//     text: "500gm",
//     price: 100,
//     stock: 5
//   }, {
//     name: "Onions",
//     imgUrl: "./Grocify_files/Onions.jpg",
//     category: "Vegetables",
//     text: "1kg",
//     price: 70,
//     stock: 5
//   }, {
//     name: "Potatoes",
//     imgUrl: "./Grocify_files/Potatoes.jpg",
//     category: "Vegetables",
//     text: "1kg",
//     price: 100,
//     stock: 5
//   }, {
//     name: "Popcorn",
//     imgUrl: "./Grocify_files/Popcorn.jpg",
//     category: "Snacks",
//     text: "100gm",
//     price: 30,
//     stock: 5
//   }, {
//     name: "Almonds",
//     imgUrl: "./Grocify_files/Almonds.jpg",
//     category: "Snacks",
//     text: "1kg",
//     price: 500,
//     stock: 5
//   }, {
//     name: "Candy",
//     imgUrl: "./Grocify_files/Candy.jpg",
//     category: "Snacks",
//     text: "1kg",
//     price: 500,
//     stock: 5
//   }, {
//     name: "Cookies",
//     imgUrl: "./Grocify_files/Cookies.jpg",
//     category: "Snacks",
//     text: "300gm",
//     price: 30,
//     stock: 5
//   }, {
//     name: "Sponges",
//     imgUrl: "./Grocify_files/Sponges.jpg",
//     category: "Household",
//     text: "1kg",
//     price: 80,
//     stock: 5
//   }, {
//     name: "Batteries",
//     imgUrl: "./Grocify_files/Batteries.jpg",
//     category: "Household",
//     text: "1PAck",
//     price: 30,
//     stock: 5
//   }, {
//     name: "soap",
//     imgUrl: "./Grocify_files/soap.jpg",
//     category: "Household",
//     text: "1kg",
//     price: 100,
//     stock: 5
//   }, {
//     name: "Napkins",
//     imgUrl: "./Grocify_files/Napkins.jpg",
//     category: "Household",
//     text: "1box",
//     price: 20,
//     stock: 5
//   }, {
//     name: "conditioner",
//     imgUrl: "./Grocify_files/conditioner.jpg",
//     category: "Household",
//     text: "1lt",
//     price: 200,
//     stock: 8
//   }, {
//     name: "Shampoo",
//     imgUrl: "./Grocify_files/Shampoo.jpg",
//     category: "Household",
//     text: "1lt",
//     price: 150,
//     stock: 7
//   }
// ];

// // 2. Mock Data: Search Cart
// const MOCK_SEARCH_CART = [
//   { name: "Cart Item 1", price: 50, imgUrl: null }
// ];

// export default function Product(props) {
//   const SearchcartList = MOCK_SEARCH_CART;
//   const [product, setProduct] = useState(MOCK_PRODUCTS);

//   return (
//     <div className='Product' style={{ marginTop: props["Margin"]?.margin }} >
//       {
//         props.type === "Shop" ? (SearchcartList.map((ele) => {
//           return <ProductsItem data={ele} key={ele.name} fulldata={ele}></ProductsItem>
//         })) : (product.map((ele) => {
//           return <ProductsItem data={ele} key={ele.name} fulldata={ele}></ProductsItem>
//         }))
//       }
//     </div>
//   )
// }


import React from 'react'
import ProductsItem from './ProductsItem'
// import { MOCK_PRODUCTS } from './Shop';
import { MOCK_PRODUCTS } from '../MockData'; // <--- NEW IMPORT
export default function Product(props) {
  // 1. Determine which data to show.
  // If 'passedData' comes from Shop.js, use it. Otherwise use internal/empty list.
  const productList = props.passedData || [];

  return (
    <div className='Product' style={{ marginTop: props.Margin?.margin }} >
      {productList.length > 0 ? (
        productList.map((ele) => {
          // ensure key is unique
          return <ProductsItem data={ele} key={ele.name} fulldata={ele}></ProductsItem>
        })
      ) : (
        // Optional: Message when no products match the filter
        // <div style={{ padding: '20px', width: '100%', textAlign: 'center' }}>
        //   <h3>No products found</h3>
        // </div>
        MOCK_PRODUCTS.map((ele) => {
          // ensure key is unique
          return <ProductsItem data={ele} key={ele.name} fulldata={ele}></ProductsItem>
        })
      )}
    </div>
  )
}