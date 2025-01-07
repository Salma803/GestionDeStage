import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Home from '../components/Home';
import SideNav from '../components/SideNav';
import UseAuth from '../hooks/UseAuth'

function Page() {
  const isAuthenticated = UseAuth();

  return (
    <div className='wrapper'>
      <Header/>
     <Home/>
      <SideNav/>
      <Footer/>
    </div>
  )
}

export default Page
