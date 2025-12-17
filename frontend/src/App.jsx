import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import FlightList from './components/FlightList/FlightList'
import FlightDetail from './components/FlightDetail/FlightDetail'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <header className="bg-white border-b border-[#e8eaed] px-6 py-4">
          <h1 className="font-heading text-[22px] font-normal text-[#202124]">
            Airplane Tickets Booking
          </h1>
        </header>
        <Routes>
          <Route path="/" element={<FlightList />} />
          <Route path="/flight/:id" element={<FlightDetail />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
