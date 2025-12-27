import React from 'react'

export default function AboutUs() {
  return (
    <div className='AboutUs' id='AboutUs'>
        <h1>About West End Market</h1>
        <div className="AboutSection">
          <img src="./About.jpg" alt="West End Market Storefront"  className='AboutImg'/>
          <p>
            Welcome to West End Market, conveniently located at <strong>74 Staniford St, Boston, MA</strong>. 
            We are more than just a convenience store; we are a staple of the West End community. 
            Whether you are looking for your morning coffee, a fresh deli sandwich for lunch, or late-night frozen treats like Ben & Jerry's, we have you covered.
            <br/><br/>
            Our shelves are stocked with a wide variety of essentials, from smoke shop accessories to daily household items and cold beverages.
            We pride ourselves on friendly service and keeping our neighborhood stocked with everything you need, right when you need it. 
            Stop by today and experience the best convenience in Boston!
          </p>
        </div>
    </div>
  )
}