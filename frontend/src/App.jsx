import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar/Navbar'
import FlightList from './components/FlightList/FlightList'
import FlightDetail from './components/FlightDetail/FlightDetail'
import RecentlyViewed from './components/RecentlyViewed/RecentlyViewed'
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'
import { AuthProvider } from './context/AuthContext'

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-[#f8f9fa]">
          <Navbar />
          <Routes>
            <Route path="/" element={<FlightList />} />
            <Route path="/flight/:id" element={<FlightDetail />} />
            <Route path="/recently-viewed" element={<RecentlyViewed />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  )
}

export default App
