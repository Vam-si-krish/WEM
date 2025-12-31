import React, { useEffect, useState } from 'react'
import LandingPage from './LandingPage'
import './Home.css'

import Category from './Category'
import Product from './Product'
import AboutUs from './AboutUs'

// 1. Import Firebase dependencies
import { db } from '../firebase' 
import { collection, getDocs, query, limit } from "firebase/firestore"

export default function Home() {
  // 2. State to store products for the Home page
  const [homeProducts, setHomeProducts] = useState([]);

  // 3. Fetch a limited number of products (e.g., 8) for the homepage
  useEffect(() => {
    const fetchHomeProducts = async () => {
      try {
        // Create a query to get only 8 products
        const q = query(collection(db, "products"), limit(8));
        const querySnapshot = await getDocs(q);
        
        const productsData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        
        setHomeProducts(productsData);
      } catch (error) {
        console.error("Error fetching home products:", error);
      }
    };

    fetchHomeProducts();
  }, []);

  return (
    <div>
      <LandingPage></LandingPage>
      <Category></Category>
      <h1 className='HProduct'>Product</h1>
      <div className="section">
        {/* 4. Pass the fetched data to the Product component */}
        <Product Margin={{ "margin": "100px" }} passedData={homeProducts}></Product>
      </div>
      <AboutUs></AboutUs>
    </div>
  )
}