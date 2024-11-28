import React from 'react'
import Navbar from '../Components/Navbar/Navbar'
import Map from '../Components/Map/Map'

const Vigilancia = () => {
    return (
        <div className='flex'>
            <header className="">
                <Navbar />
            </header>
            <main className="border border-black w-full">
                <Map />
            </main>
        </div>
    )
}

export default Vigilancia