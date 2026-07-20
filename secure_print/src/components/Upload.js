import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils';

const MAX_COUNT = 5;

function Upload() {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleFiles = (event) => {
    const selected = Array.from(event.target.files || []).slice(0, MAX_COUNT);
    if (selected.some((file) => file.type !== 'application/pdf')) {
      setFiles([]);
      setMessage('Only PDF files are accepted.');
      return;
    }
    setFiles(selected);
    setMessage(selected.length ? `${selected.length} PDF file(s) ready.` : '');
  };

  const upload = async (event) => {
    event.preventDefault();
    if (!files.length) return setMessage('Choose at least one PDF.');
    const data = new FormData();
    files.forEach((file) => data.append('file', file));
    setSubmitting(true);
    try {
      await api.post('/documents', data);
      setFiles([]);
      setMessage('Documents uploaded to your authenticated queue.');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Upload failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className='h-screen flex flex-col p-5 justify-center items-center'>
      <button className='absolute top-2 left-2 btn btn-outline-primary' onClick={() => navigate('/')}>Home</button>
      <form onSubmit={upload} className='d-flex flex-column gap-3'>
        <h1>Upload PDFs</h1>
        <p>Choose up to five PDFs. The API enforces authentication, size limits, and PDF signatures.</p>
        <input type='file' multiple accept='application/pdf' onChange={handleFiles} />
        <ul>{files.map((file) => <li key={`${file.name}-${file.size}`}>{file.name}</li>)}</ul>
        <button type='submit' className='btn btn-primary' disabled={submitting || !files.length}>
          {submitting ? 'Uploading…' : 'Upload securely'}
        </button>
        <p role='status'>{message}</p>
      </form>
    </main>
  );
}

export default Upload;
