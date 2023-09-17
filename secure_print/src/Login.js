import React,{useEffect, useState} from 'react'
import './Login.css';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import {parseJwt, setAuthToken} from "./utils.js";
import jwt from 'jwt-decode' // import dependency

function Login() {
  const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
      const [errormessage, seterrormessage] = useState("");

    const navigate = useNavigate();

    const gotoSignup = () => {
        navigate("/signup")
    }

    useEffect(() => {

    const token = localStorage.getItem("token");
        if (token) {
            // const { id } = parseJwt(token)
            const obj = jwt(token);
            const id=obj.id
            const phone=obj.phone
            // console.log(jwt(token))
            // console.log(id)
        navigate(`/profile/${id}`, { state: {id,phone} })
    }
        
    }, [navigate])
    

    const handleLogin = async (e) => {
        e.preventDefault();
      try {
        
        const response = await axios.post("http://localhost:5000/login", {
          phoneNumber,
          password,
        });

        const { token } = response.data;
        // Store the token in local storage or a secure cookie
        localStorage.setItem("token", token);
        // console.log(response)

        //set token to axios common header
          setAuthToken(token);
          const { id } = parseJwt(token);
          console.log(jwt(token));
          console.log(id);
          // Redirect to a protected route or do something else
          navigate(`/profile/${id}`, { state: { id, "phone":phoneNumber } });
      } catch (error) {
          seterrormessage("Login Failed")
        console.error("Login failed", error);
      }
    };

  return (
    <div className='Auth-form-container'>
      <div className='absolute top-2 left-2 cursor-pointer' onClick={() => navigate("/")}>
        Back
      </div>
      <form className='Auth-form' onSubmit={handleLogin}>
        <div className='Auth-form-content'>
          <h3 className='Auth-form-title'>Sign In</h3>
          <div className='text-center'>
            Not registered yet?{" "}
            <span className='link-primary cursor-pointer' onClick={gotoSignup}>
              Sign Up
            </span>
          </div>
          <div className='form-group mt-3'>
            <label>Phone Number</label>
            <input
              type='phone'
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className='form-control mt-1'
              placeholder='Enter Phone Number'
            />
          </div>
          <div className='form-group mt-3'>
            <label>Password</label>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='form-control mt-1'
              placeholder='Enter password'
            />
          </div>
          <div className='d-grid gap-2 mt-3'>
            <button type='submit' className='btn btn-primary'>
              Submit
            </button>
          </div>
          <p className='text-center mt-2'>Forgot password?</p>
          <p className='text-red-500'>{errormessage}</p>
        </div>
      </form>
    </div>
  );
}

export default Login
