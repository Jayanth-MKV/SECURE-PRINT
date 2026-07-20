import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { api, saveSession } from './utils';

function Signup() {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const submitForm = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    try {
      const { data } = await api.post('/auth/signup', { phoneNumber, password });
      saveSession(data.token);
      navigate('/profile', { replace: true });
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Account creation failed.');
    }
  };

  return (
    <div className='Auth-form-container'>
      <button className='absolute top-2 left-2' onClick={() => navigate(-1)}>Back</button>
      <form className='Auth-form' onSubmit={submitForm}>
        <div className='Auth-form-content'>
          <h1 className='Auth-form-title'>Create account</h1>
          <div className='form-group mt-3'>
            <label htmlFor='signupPhone'>Phone number</label>
            <input id='signupPhone' type='tel' value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className='form-control mt-1' autoComplete='tel' required />
          </div>
          <div className='form-group mt-3'>
            <label htmlFor='signupPassword'>Password</label>
            <input id='signupPassword' type='password' value={password} onChange={(e) => setPassword(e.target.value)} className='form-control mt-1' minLength='10' maxLength='128' autoComplete='new-password' required />
          </div>
          <div className='d-grid gap-2 mt-3'>
            <button type='submit' className='btn btn-primary'>Create account</button>
            <button type='button' className='btn btn-link' onClick={() => navigate('/login')}>Back to sign in</button>
          </div>
          {errorMessage && <p role='alert' className='text-danger mt-3'>{errorMessage}</p>}
        </div>
      </form>
    </div>
  );
}

export default Signup;
