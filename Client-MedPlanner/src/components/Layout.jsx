import React from 'react'
import MenuLateral from '../components/MenuLateral'

const Layout = ({ children }) => {

    return (
        <div className='flex bg-gray-200 '>
            <div className='flex'>
                <MenuLateral />
            </div>
            <div className='w-9/12  bg-white mx-auto my-8 shadow-md rounded-lg'>
                {children}
            </div>
        </div>
    )
}

export default Layout