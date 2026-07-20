import React from 'react';
import { useNavigate } from 'react-router-dom';
import { clearSession, getSession } from '../utils';

function Profile() {
  const navigate = useNavigate();
  const session = getSession();

  const logout = () => {
    clearSession();
    navigate('/login', { replace: true });
  };

  return (
    <main className='container py-5'>
      <h1>Secure Print session</h1>
      <p>Signed in as {session?.payload.phone}.</p>
      <div className='d-flex gap-3'>
        <button className='btn btn-primary' onClick={() => navigate('/upload')}>Upload PDFs</button>
        <button className='btn btn-outline-secondary' onClick={logout}>Sign out</button>
      </div>
    </main>
  );
}

export default Profile;
