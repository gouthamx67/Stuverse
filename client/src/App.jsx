import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Search from './pages/Search';
import Navbar from './components/Navbar';
import CreateListing from './pages/CreateListing';
import LostAndFound from './pages/LostAndFound';
import ReportLost from './pages/ReportLost';
import Chat from './pages/Chat';
import ProductDetails from './pages/ProductDetails';
import Profile from './pages/Profile';
import RideSharing from './pages/RideSharing';
import CreateRide from './pages/CreateRide';
import Buzz from './pages/Buzz';
import UniversityModal from './components/UniversityModal';
import { ChatProvider } from './context/ChatContext';

function App() {
  return (
    <Router>
      <div className="app-container" style={{ paddingBottom: '2rem' }}>
        <ChatProvider>
          <UniversityModal />
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/create-listing" element={<CreateListing />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/lost-and-found" element={<LostAndFound />} />
            <Route path="/report-lost" element={<ReportLost />} />
            <Route path="/search" element={<Search />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/rides" element={<RideSharing />} />
            <Route path="/create-ride" element={<CreateRide />} />
            <Route path="/buzz" element={<Buzz />} />
          </Routes>
        </ChatProvider>
      </div>
    </Router>
  );
}

export default App;
