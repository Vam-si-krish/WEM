import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Re-using your existing styles

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin-dashboard'); // Redirect to empty admin page on success
    } catch (err) {
      setError('Invalid Admin Credentials');
    }
  };

  return (
    <div className='LoginWindow'>
      <div className='LoginForm'>
        <h2 className='LoginTitle'>Admin Access</h2>
        
        <form onSubmit={handleLogin} style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <div className='inputBox'>
            <label>Admin Email</label>
            <input 
              type="email" 
              placeholder="admin@grocify.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className='inputBox'>
            <label>Password</label>
            <input 
              type="password" 
              placeholder="******" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          {error && <p style={{color: 'red', fontSize: '0.8rem', marginTop: '10px'}}>{error}</p>}

          <button type="submit" className='LoginBtn'>Enter System</button>
        </form>
      </div>
    </div>
  );
}