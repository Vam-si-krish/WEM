import React from 'react'
import CategoryItem from './CategoryItem'

export default function Category() {
  return (
    <div className='Category'>
      <h3 className='Cheading'>Our Selection</h3>
      <div className="CategoryList">
        {/* Reusing existing images but changing titles to match store inventory */}
        <CategoryItem imgUrl="./household.jpg" title="Smoke Shop"></CategoryItem> 
        <CategoryItem imgUrl="./snacks.jpg" title="Deli & Sandwiches"></CategoryItem>
        <CategoryItem imgUrl="./dairy.jpg" title="Frozen Foods"></CategoryItem>
        <CategoryItem imgUrl="./Drinks.jpg" title="Coffee & Drinks"></CategoryItem>
      </div>
      <div className="CategoryList">
        <CategoryItem imgUrl="./PersonalCare.jpg" title="Essentials"></CategoryItem>
        <CategoryItem imgUrl="./Petcare.jpg" title="Pet Needs"></CategoryItem>
        <CategoryItem imgUrl="./vegetables.jpg" title="Fresh Grocery"></CategoryItem>
        <CategoryItem imgUrl="./fruits.jpg" title="Snacks & Candy"></CategoryItem>
      </div>
    </div>
  )
}