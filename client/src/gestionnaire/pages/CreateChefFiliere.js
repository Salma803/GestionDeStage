import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SideNav from '../components/SideNav'; // Assuming you have a SideNav component
import Header from '../components/Header'; // Assuming you have a Header component

const CreateChefFiliere = () => {
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

    axios
      .post("http://localhost:3001/gestionnaire/upload/chefs", formData)
      .then((response) => {
        alert('ChefDeFiliere created successfully!');
        navigate('/gestionnaire/home');
      })
      .catch((error) => {
        console.error('Error uploading CSV:', error);
        alert('There was an error uploading the file.');
      });
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <SideNav />

      <div className="main-content w-100">
        {/* Header */}
        <Header />

        {/* Content */}
        <div className="container mt-4">
          <div className="card shadow-sm">
          <h2 style={{ paddingTop :20 +'px'}} className="card-title text-center mb-4">Télécharger le fichiers CSV pour Créer les Chef De Filiere</h2>

            <div className="card-body">
              <form onSubmit={handleSubmit} className="needs-validation" noValidate>
                <div className="mb-3">
                  <label htmlFor="fileInput" className="form-label">
                    Select CSV File
                  </label>
                  <input
                    type="file"
                    id="fileInput"
                    className="form-control"
                    accept=".csv"
                    onChange={handleFileChange}
                    required
                  />
                  <div className="form-text">Only CSV files are supported.</div>
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  Upload CSV
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateChefFiliere;
