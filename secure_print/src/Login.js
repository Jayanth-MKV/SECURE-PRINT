import React, { useEffect, useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { api, getSession, saveSession } from './utils';

function Login() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (getSession()) navigate('/profile', { replace: true });
  }, [navigate]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    try {
      const { data } = await api.post('/auth/login', { phoneNumber, password });
      saveSession(data.token);
      navigate('/profile', { replace: true });
    } catch {
      setErrorMessage('Sign in failed. Check your credentials and try again.');
    }
  };

  return (
    <div className='Auth-form-container'>
      <button className='absolute top-2 left-2' onClick={() => navigate('/')}>Back</button>
      <form className='Auth-form' onSubmit={handleLogin}>
        <div className='Auth-form-content'>
          <h1 className='Auth-form-title'>Sign in</h1>
          <p className='text-center'>
            Need an account?{' '}
            <button type='button' className='link-primary' onClick={() => navigate('/signup')}>Sign up</button>
          </p>
          <div className='form-group mt-3'>
            <label htmlFor='phoneNumber'>Phone number</label>
            <input id='phoneNumber' type='tel' value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className='form-control mt-1' autoComplete='tel' required />
          </div>
          <div className='form-group mt-3'>
            <label htmlFor='password'>Password</label>
            <input id='password' type='password' value={password} onChange={(e) => setPassword(e.target.value)} className='form-control mt-1' autoComplete='current-password' required />
          </div>
          <div className='d-grid gap-2 mt-3'>
            <button type='submit' className='btn btn-primary'>Sign in</button>
          </div>
          {errorMessage && <p role='alert' className='text-danger mt-3'>{errorMessage}</p>}
        </div>
      </form>
    </div>
  );
}

export default Login;
