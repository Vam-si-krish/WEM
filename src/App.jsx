import Home from './components/Home';
import Shop from './components/Shop';
import NavBar from './components/NavBar';
import AdminLogin from './components/AdminLogin'; // Import new component
import AdminPage from './components/AdminPage';   // Import new component
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <> 
      <BrowserRouter>
        <NavBar></NavBar>
        <Routes>
          <Route path='/' element={<Home ></Home>} />
          <Route path='/Shop' element={<Shop></Shop>} />
          
          {/* Admin Routes */}
          <Route path='/admin-login' element={<AdminLogin />} />
          <Route path='/admin-dashboard' element={<AdminPage />} />
          
          {/* <Route path='/Cart' element={<Cart></Cart>} />
          <Route path='/Login' element={<Login></Login>} />
          <Route path='/SignUp' element={<SignUp></SignUp>} />
          <Route path='/Payment' element={<Payment></Payment>} /> 
          */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;