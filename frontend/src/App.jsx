import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar/Navbar'
import Home from './components/Home/Home'
import FlightList from './components/FlightList/FlightList'
import FlightDetail from './components/FlightDetail/FlightDetail'
import RecentlyViewed from './components/RecentlyViewed/RecentlyViewed'
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'
import { AuthProvider } from './context/AuthContext'

const Layout = ({ children }) => {
  const location = useLocation();
  // Hide Navbar on Home page ('/') and Login/Register pages if desired, strictly requested for Home page
  const showNavbar = location.pathname !== '/';

  return (
    <div className={`min-h-screen ${showNavbar ? 'bg-[#f8f9fa]' : 'bg-white'}`}>
      {showNavbar && <Navbar />}
      {children}
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/flights" element={<FlightList />} />
            <Route path="/flight/:id" element={<FlightDetail />} />
            <Route path="/recently-viewed" element={<RecentlyViewed />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  )
}

export default App
