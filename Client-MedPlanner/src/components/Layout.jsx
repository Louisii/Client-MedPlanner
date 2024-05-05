import React from 'react'
import MenuLateral from '../components/MenuLateral'

const Layout = ({ children }) => {

    return (
        <div className='flex bg-gray-200'>
            <div className='flex'>
                <MenuLateral />
            </div>
            <div className='w-5/6 bg-white m-6 shadow-md rounded-lg'>
                {children}

            </div>
        </div>
    )
}

export default Layout