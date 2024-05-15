import React from 'react'
import MenuLateral from '../components/MenuLateral'
import Layout from '../components/Layout'
import logo from '../assets/logoMedPlanner.png'

const Home = () => {

  return (
    <Layout>
      {<div className='text-center'>
        <img src={logo} alt="logo sga" className='w-4/12 opacity-20 mx-auto  mt-32' />
      </div>}
    </Layout>
  )
}

export default Home