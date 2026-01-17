import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar/Navbar'
import FlightList from './components/FlightList/FlightList'
import FlightDetail from './components/FlightDetail/FlightDetail'
import RecentlyViewed from './components/RecentlyViewed/RecentlyViewed'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#f8f9fa]">
        <Navbar />
        <Routes>
          <Route path="/" element={<FlightList />} />
          <Route path="/flight/:id" element={<FlightDetail />} />
          <Route path="/recently-viewed" element={<RecentlyViewed />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
