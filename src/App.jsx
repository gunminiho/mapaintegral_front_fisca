import './App.css'
import Map from "./Components/Map/Map";
import Nav from "./Components/Navbar/Navbar";
import { useState } from "react"
import ToastComponent from './Components/Popups/ToastComponent';


function App() {
  return (
    <>
      <header className="">
        <Nav/>
      </header>
      <main className="border border-black w-full">
        <Map />
      </main>
      <ToastComponent/>
    </>
  )
}

export default App