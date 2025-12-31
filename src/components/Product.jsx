

import React from 'react'
import ProductsItem from './ProductsItem'
// import { MOCK_PRODUCTS } from './Shop';
// import { MOCK_PRODUCTS } from '../MockData'; // <--- NEW IMPORT
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
        // .''
        ''
      )}
    </div>
  )
}