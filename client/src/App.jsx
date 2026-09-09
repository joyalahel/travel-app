import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Destinations from './pages/Destinations';
import Packages from './pages/Packages';
import Hotels from './pages/Hotels';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Admin from './pages/Admin';
import Wishlist from './pages/Wishlist';
import PackageDetail from './pages/PackageDetail';
import DestinationDetail from './pages/DestinationDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import CheckoutSuccess from './pages/CheckoutSuccess';
import HotelDetail from './pages/HotelDetail';
import './App.css';

function App() {
  return (
    <div className="app-shell">
      <Header />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/destinations" element={<Destinations />} />
          <Route path="/destinations/:destinationId" element={<DestinationDetail />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/packages/:packageId" element={<PackageDetail />} />
          <Route path="/hotels" element={<Hotels />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/checkout/success" element={<CheckoutSuccess />} />
          <Route path="/hotels/:hotelId" element={<HotelDetail />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;