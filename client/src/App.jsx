import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Destinations from './pages/Destinations';
import './App.css';

function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Destinations />} />
        <Route path="/destinations" element={<Destinations />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;