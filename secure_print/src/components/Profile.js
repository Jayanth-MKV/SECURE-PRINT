import React, { useEffect } from 'react'
import { useLocation, redirect,useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";

function Profile() {
  const location = useLocation();
  const navigate = useNavigate();

  const {id,phone} = location.state;
  

  useEffect(() => {
      if (!location) {
        navigate("/login");  
      }
  }, [location])
  


const handleLogout = () => {
  // Remove the token from local storage
  console.log("logout")
  localStorage.removeItem("token");
  navigate("/login");
  // Redirect to the login page or do something else
};
  return (
    <div className='h-screen container flex flex-col text-xl pt-5'>
      <div className='flex justify-between flex-col md:flex-row mb-10'>
        <h1>Your Profile - {id}</h1>
        <div>
        <button className='cursor-pointer mx-5 my-2 border-2 rounded-md border-blue-500 md:p-2 p-1 ' onClick={()=>navigate("/")}>
          Home
        </button>
        <button className='cursor-pointer mx-5 my-2 border-2 rounded-md border-blue-500 md:p-2 p-1 ' onClick={handleLogout}>
          Logout
        </button>
        </div>
      </div>
      <h3>
        <h3>ID - {phone}</h3>
      </h3>
      <div className='flex items-center justify-center p-10'>
        <QRCode
          title='GeeksForGeeks'
          value={phone}
          bgColor={"white"}
          fgColor={"black"}
          size={400}
        />
      </div>
    </div>
  );
}

export default Profile
