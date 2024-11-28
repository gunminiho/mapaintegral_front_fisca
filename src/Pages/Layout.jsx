
import React, { useState } from 'react'
import Sidebar from '../Components/Navbar/SidebarGeneral'
import { Outlet } from 'react-router-dom'
import Header from '../Components/Navbar/Header';

const Layout = () => {
    const [toggled, setToggled] = useState(false);

    return (
         <div className='flex h-full w-full'>
            <Sidebar toggled={toggled} setToggled={setToggled} />
            <div className='h-full flex flex-col flex-1 overflow-hidden'>
                <Header toggled={toggled} setToggled={setToggled} />
                <div className='content-body flex-1 bg-gray-100 p-4 overflow-hidden flex flex-col'>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default Layout