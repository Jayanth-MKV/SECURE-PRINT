import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";

function Userside() {
    const [id, setid] = useState('')
    const navigate = useNavigate();

  const handleClick = () => {
    console.log(id)
    navigate(`/upload/${id}`,{state:id});
  }
  

  return (
    <div className='h-screen flex flex-col p-5 justify-center items-center'>
      <div className='flex justify-between flex-col md:flex-row mb-10'>
        <h1>Share Documents Using ID</h1>
        <button
          className='absolute top-2 left-2 cursor-pointer border-2 rounded-md border-blue-500 md:p-2 p-1 '
          onClick={() => navigate("/")}>
          Home
        </button>
      </div>
      <div className='flex flex-col justify-between w-full md:w-2/5 p-2 h-1/4 text-xl border-2 border-solid border-black rounded-md'>
        <label htmlFor='id' className='text-xl'>
          Enter ID:
        </label>
        <input
          type='text'
          name='phone'
          className='px-2 border-2 border-solid border-black rounded-md'
          value={id}
          onChange={(e) => setid(e.target.value)}
          id='id'
        />
        <div
          className='border-2 cursor-pointer border-solid border-black rounded-md w-fit px-2 py-1'
          onClick={handleClick}>
          Enter
        </div>
      </div>
      <div>Scan QR To get the ID</div>
    </div>
  );
}

export default Userside
