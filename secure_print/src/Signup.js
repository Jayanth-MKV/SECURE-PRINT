import React,{useState} from 'react'
import './Login.css'
import { useNavigate } from 'react-router-dom';
import axios from "axios";


function Signup() {
    const navigate = useNavigate();

    const gotoLogin = () => {
        navigate("/login")
    }

  const [phone, setphone] = useState("");
  const [password, setpassword] = useState("")
  const [errormessage, seterrormessage] = useState("");
  
  const submitForm = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000", {
        phone, password
      });

      if (response.status === 400) {
        seterrormessage(response.message);
      }

      const { token } = response;
      localStorage.setItem("token", token);
      
    } catch (err) {
      console.log(err)
    }
  }


  return (
      <div className='Auth-form-container'>
          <div className='absolute top-2 left-2' onClick={()=>navigate(-1)}>Back</div>
      <form className='Auth-form' onSubmit={submitForm}>
        <div className='Auth-form-content'>
          <h3 className='Auth-form-title'>Sign Up</h3>
          <div className='text-center'>
            Already registered?{" "}
            <span className='link-primary cursor-pointer' onClick={gotoLogin}>
              Sign In
            </span>
          </div>

          <div className='form-group mt-3'>
            <label>Phone Number</label>
            <input
                          type='Phone'
                          value={phone}
                          onChange={(e)=>setphone(e.target.value)}
              className='form-control mt-1'
              placeholder='Phone Number'
            />
          </div>
          <div className='form-group mt-3'>
            <label>Password</label>
            <input
                          type='password'
                          value={password}
                          onChange={(e)=>setpassword(e.target.value)}
              className='form-control mt-1'
              placeholder='Password'
            />
          </div>
          <div className='d-grid gap-2 mt-3'>
            <button type='submit' className='btn btn-primary'>
              Submit
            </button>
          </div>
          <p className='text-center mt-2'>
            Forgot password?
          </p>
          <p className='text-red-500'>{errormessage}</p>
        </div>
      </form>
    </div>
  );
}

export default Signup