import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateStudent = () => {
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!file) {
      alert('Please select a CSV file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    // Send the file to the backend
    axios
      .post("http://localhost:3001/gestionnaire/upload/students", formData)
      .then((response) => {
        alert('Students created successfully!');
        navigate('/gestionnaire/home'); // Redirect to the homepage
      })
      .catch((error) => {
        console.error('Error uploading CSV:', error);
        alert('There was an error uploading the file.');
      });
  };

  return (
    <div className="create-student">
      <h2>Upload CSV to Create Students</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Select CSV file</label>
          <input type="file" accept=".csv" onChange={handleFileChange} required />
        </div>
        <button type="submit">Upload CSV</button>
      </form>
    </div>
  );
};

export default CreateStudent;
