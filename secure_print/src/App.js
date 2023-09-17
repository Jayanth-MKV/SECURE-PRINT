import logo from './images/logo.svg';
import printer from './images/printer.jpg';
import send from './images/send.svg';
import './App.css';
import workflow from './images/Workflow.png'
import { setAuthToken } from './utils';
import { useEffect } from 'react';

function App() {

  useEffect(() => {
     const token = localStorage.getItem("token");
     if (token) {
       setAuthToken(token);
     }
  },  [])
  

  return (
    <div className='App bg-[#111827] text-slate-200 flex flex-col gap-10'>
      <div className='flex flex-col-reverse md:flex-row'>
        <div className='md:w-1/2 flex flex-col items-left text-left justify-center p-10 gap-10'>
          <h1 className='text-4xl font-bold text-slate-100'>
            <h2 className='text-6xl text-[#3362CC] font-extrabold'>
              Secure Print
            </h2>{" "}
            Enhancing Print Security
          </h1>
          <h3 className='text-xl font-mono font-semibold text-slate-400'>
            Introducing{" "}
            <span className='text-blue-200 text-2xl'> Secure Print</span> a
            revolutionary web and desktop application designed to bridge the gap
            between users and local print and photocopy shops while prioritizing
            data privacy and security.
          </h3>
          <div className='flex'>
            <a
              href='#howtouse'
              className='p-2 no-underline hover:border-[rgb(51,98,204)] text-slate-200 border-white border-2 rounded-md'>
              Get Started
            </a>
          </div>
        </div>
        <div className='md:w-1/2'>
          <img src={logo} alt='Secure Print' srcset='' />
        </div>
      </div>
      <div id='howtouse' className='md:mt-5 flex flex-col gap-5 items-center'>
        <h1 className=' text-3xl md:text-5xl text-[#3362CC] font-extrabold md:mb-5'>
          How To Use
        </h1>
        <div className='flex justify-center flex-col md:flex-row gap-5 md:w-4/5'>
          <div className='pb-8 flex flex-col items-center justify-between hover:scale-105 transition ease-in-out delay-150 md:w-2/5 p-3 shadow-[0_35px_60px_-15px_rgba(51,98,204,0.3)] border-[#3362cc] border-2 rounded-md'>
            <h2 className='text-2xl font-bold mb-5'>USER</h2>
            {/* <div className="border-2 border-solid border-blue-400" > */}
            <img src={send} className='h-[350px]' alt='send' />
            <div className='text-lg mt-5 text-justify p-5 mb-5'>
              The user is the one who wants a print of a document, where the
              user will share the documents for printing or photocopying
              purposes. The sending is done by uploading the files to the
              respective print shop using their ID.
            </div>
            <div>
              <a
                href='/upload'
                className='p-2 px-10 hover:bg-red-400 font-bold text-slate-200 border-red-400 border-2 rounded-md'>
                Send Doc
              </a>
            </div>
          </div>
          <div className='pb-8  flex flex-col items-center justify-between hover:scale-105 transition ease-in-out delay-150 md:w-2/5 p-3 shadow-[0_35px_60px_-15px_rgba(51,98,204,0.3)] border-[#3362cc] border-2 rounded-md'>
            <h2 className='text-2xl font-bold mb-5'>PRINT SHOP</h2>
            {/* <div className="border-2 border-solid border-blue-400" > */}
            <img src={printer} className='h-[350px]' alt='pic' />
            <div className='text-lg mt-5 text-justify p-5 mb-5'>
              The Print Shop is where the user will be sending the document for
              printing purposes. Each Print shop will be given a seperate ID so
              that the user can upload to the respective shop.
            </div>
            <div>
              <a
                href='/login'
                className='p-2 px-10 hover:bg-red-400 font-bold text-slate-200 border-red-400 border-2 rounded-md'>
                Login
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className='md:mt-20 flex flex-col gap-5 items-center'>
        <h1 className=' text-3xl md:text-5xl text-[#3362CC] font-extrabold md:mb-5'>
          What We Solve
        </h1>
        <div className='flex justify-center flex-col md:flex-row gap-5 md:w-4/5'>
          <div className='flex flex-col items-center  hover:scale-105 transition ease-in-out delay-150 md:w-2/5 p-3 shadow-[0_35px_60px_-15px_rgba(51,98,204,0.3)] border-[#3362cc] border-2 rounded-md'>
            <h2 className='text-2xl font-bold mb-5'>Data Security</h2>
            <div className='text-lg text-justify p-5 '>
              It prevents the print shop from downloading the document sent by
              the user.
            </div>
            <div></div>
          </div>
          <div className=' flex flex-col items-center  hover:scale-105 transition ease-in-out delay-150 md:w-2/5 p-3 shadow-[0_35px_60px_-15px_rgba(51,98,204,0.3)] border-[#3362cc] border-2 rounded-md'>
            <h2 className='text-2xl font-bold mb-5'>Confidentiality</h2>
            <div className='text-lg text-justify p-5'>
              The document is deleted automatically when the print is done.
            </div>
            <div></div>
          </div>
          <div className=' flex flex-col items-center justify-between hover:scale-105 transition ease-in-out delay-150 md:w-2/5 p-3 shadow-[0_35px_60px_-15px_rgba(51,98,204,0.3)] border-[#3362cc] border-2 rounded-md'>
            <h2 className='text-2xl font-bold mb-5'>Easy To Use</h2>
            <div className='text-lg text-justify p-5 mb-5'>
              The user can send the document simply using the print shop ID
            </div>
            <div></div>
          </div>
          <div className=' flex flex-col items-center justify-between hover:scale-105 transition ease-in-out delay-150 md:w-2/5 p-3 shadow-[0_35px_60px_-15px_rgba(51,98,204,0.3)] border-[#3362cc] border-2 rounded-md'>
            <h2 className='text-2xl font-bold mb-5'>Less Time and Maintainance</h2>
            <div className='text-lg text-justify p-5 mb-5'>
              The print shop wouldn't require maintainance, as the documents are deleted automatically
            </div>
            <div></div>
          </div>
        </div>
      </div>
      <div className='md:mt-20 flex flex-col gap-5 items-center'>
        <h1 className=' text-3xl md:text-5xl text-[#3362CC] font-extrabold md:mb-5'>
          Architecture
        </h1>
        <div className='flex justify-center flex-col md:flex-row gap-5 md:w-4/5'>
          <img src={workflow} className='h-[350px] object-contain' alt='pic' />
        </div>
      </div>
      <div className='md:mt-20  flex flex-col gap-5 items-center'>
        <h1 className=' text-3xl md:text-5xl text-[#3362CC] font-extrabold md:mb-5'>
        Future Scope
        </h1>
        <div className='w-full flex justify-center'>
          <ul className="w-auto text-xl flex flex-col text-left">
          <li>1. Extend for all the file formats</li>
            <li>2. Print preview can be implemented</li>
            <li>3. Register & Login Implementation</li>
            <li>4. QR for print shop to upload documents</li>
            <li>5. Print After Payment</li>
          </ul>
        </div>
      </div>
      <div className="footer h-['20px'] p-5 border-solid border-blue-300 border-t-2">
          Made with love from Alpha Coders @ 2023
      </div>
    </div>
  );
}

export default App;
