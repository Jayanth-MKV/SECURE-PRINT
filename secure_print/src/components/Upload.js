import React,{useState} from 'react'
import axios from "axios";
import { useLocation,useNavigate } from "react-router-dom";

const MAX_COUNT = 5;

function Upload() {

  const location = useLocation();
  // console.log(location.pathname);
  const navigate = useNavigate();
  const id=location.state
  console.log(location)
  // let id = location.pathname.split('/')[2]
  // console.log(id);
  


const [uploadedFiles, setUploadedFiles] = useState([]);
const [fileLimit, setFileLimit] = useState(false);
const [message, setMessage] = useState('')
  
const handleUploadFiles = (files) => {
  const uploaded = [...uploadedFiles];
  let limitExceeded = false;
  files.some((file) => {
    if (uploaded.findIndex((f) => f.name === file.name) === -1) {
      uploaded.push(file);
      if (uploaded.length === MAX_COUNT) setFileLimit(true);
      if (uploaded.length > MAX_COUNT) {
        alert(`You can only add a maximum of ${MAX_COUNT} files`);
        setFileLimit(false);
        limitExceeded = true;
        return true;
      }
    }
  });
  if (!limitExceeded) setUploadedFiles(uploaded);
};

const handleFileEvent = (e) => {
  const chosenFiles = Array.prototype.slice.call(e.target.files);
  handleUploadFiles(chosenFiles);
  };
  
  const handleClick = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    uploadedFiles.forEach((file) => {
      formData.append("file", file);
    })

    formData.append("phoneNumber", id);
    try {
      const response = await axios.post("http://localhost:5000/upload?phoneNumber="+id,formData);

      console.log(response)

      setMessage(response.data.message);
      
    } catch (err) {
      console.log(err)
    }
  }

return (
  <div className=' h-screen flex flex-col p-5 justify-center items-center'>
    <button
      className='absolute top-2 left-2 cursor-pointer border-2 rounded-md border-blue-500 md:p-2 p-1 '
      onClick={() => navigate("/")}>
      Home
    </button>
    <input
      id='fileUpload'
      type='file'
      multiple
      name='file'
      accept='application/pdf, image/png'
      onChange={handleFileEvent}
      disabled={fileLimit}
    />

    <label htmlFor='fileUpload'>
      <div
        onClick={handleClick}
        className={`btn btn-primary ${!fileLimit ? "" : "disabled"} `}>
        Upload Files
      </div>
    </label>

    <div className='uploaded-files-list'>
      {uploadedFiles.map((file) => (
        <div>{file.name}</div>
      ))}
    </div>
    <div>{message}</div>
  </div>
);
}

export default Upload;
