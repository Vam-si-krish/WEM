import Home from './components/Home';
import Shop from './components/Shop';
import NavBar from './components/NavBar';
import AdminLogin from './components/AdminLogin'; // Import new component
import AdminPage from './components/AdminPage';   // Import new component
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Chatbot from './components/Chatbot';
function App() {
  return (
    <> 
      <BrowserRouter>
        <NavBar></NavBar>
        
        <Chatbot />
        <Routes>
             {/* ... your existing routes ... */}
             <Route path='/' element={<Home ></Home>} />
             <Route path='/Shop' element={<Shop></Shop>} />
             <Route path='/admin-login' element={<AdminLogin />} />
             <Route path='/admin-dashboard' element={<AdminPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
export default App;