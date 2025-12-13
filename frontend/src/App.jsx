import { useState, useEffect } from 'react'
import './App.css'
import FlightList from './components/FlightList/FlightList'

function App() {

  useEffect(() => {
    console.log(import.meta.env.VITE_API_URL)
  }, [])
  
  return (
    <>
      <div>
        <h1>Airplane Tickets Booking</h1>
        <FlightList />
      </div>
    </>
  )
}

export default App
