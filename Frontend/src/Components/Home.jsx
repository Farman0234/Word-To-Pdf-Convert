/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { FaFileWord } from 'react-icons/fa';
import axios from 'axios';

function Home() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [convertMessage, setConvertMessage] = useState("");
  const [downloadError, setDownloadError] = useState("");

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      setConvertMessage("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post("http://localhost:5400/convertFile", formData, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", selectedFile.name.replace(/\.[^/.]+$/, "") + ".pdf");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);

      setSelectedFile(null);
      setConvertMessage("File converted successfully");
      setDownloadError("");
    } catch (error) {
      console.error("There was an error converting the file:", error);
      if (error.response) {
        // The request was made and the server responded with a status code
        setDownloadError(`Server responded with status code ${error.response.status}`);
      } else if (error.request) {
        // The request was made but no response was received
        setDownloadError("No response received from server");
      } else {
        // Something happened in setting up the request that triggered an Error
        setDownloadError("Error in setting up the request");
      }
      setConvertMessage("");
    }
  };

  return (
    <div className='max-w-screen-2xl mx-auto container px-6 py-3 md:px-40'>
      <div className='flex h-screen items-center justify-center'>
        <div className='border-2 border-dashed px-4 py-2 md:px-12 py-10 border-indigo-600 rounded-lg shadow-lg w-full sm:w-2/3 '>
          <h1 className='text-3xl font-bold text-center mb-5'>Word to PDF Converter</h1>
          <p className='text-sm text-center mb-5 font-bold'>
            Easily convert Word documents to PDF format online, without having to install any software.
          </p>

          <div className='flex flex-col items-center space-y-5'>
            <input
              type="file"
              accept=".doc,.docx"
              onChange={handleFileChange}
              className="hidden"
              id="FileInput"
            />

            <label
              htmlFor="FileInput"
              className="w-full flex items-center justify-center px-4 py-6 bg-gray-100 text-gray-700 rounded-lg shadow-lg cursor-pointer border-blue-300 hover:bg-blue-700 duration-300 hover:text-white"
            >
              <FaFileWord className="text-3xl mr-5" />
              <span className="text-2xl mr-2 font-bold">
                {selectedFile ? selectedFile.name : "Choose File"}
              </span>
            </label>

            <button
              onClick={handleSubmit}
              disabled={!selectedFile}
              className="text-white bg-blue-600 disabled:bg-gray-400 disabled:pointer-events-none hover:bg-blue-700 font-bold duration-300 px-4 py-2 rounded-lg"
            >
              Convert File
            </button>

            {convertMessage && <p className="text-green-500 mt-3">{convertMessage}</p>}
            {downloadError && <p className="text-red-500 mt-3">{downloadError}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
