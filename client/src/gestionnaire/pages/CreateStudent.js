import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SideNav from '../components/SideNav'; // Assuming you have a SideNav component
import Header from '../components/Header'; // Assuming you have a Header component
import UseAuth from "../hooks/UseAuth";


const CreateStudent = () => {
  const isAuthenticated = UseAuth();
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!file) {
      alert('Selectionner un CSV.');
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
    <div className="d-flex">
      {/* Barre latérale */}
      <SideNav />

      <div className="main-content w-100">
        {/* En-tête */}
        <Header />

        {/* Contenu */}
        <div className="container mt-4">
          <div className="card shadow-sm">
            <h2 style={{ paddingTop: 20 + 'px' }} className="card-title text-center mb-4">
              Télécharger le fichier CSV pour créer les étudiants
            </h2>

            <div className="card-body">
              <form onSubmit={handleSubmit} className="needs-validation" noValidate>
                <div className="mb-3">
                  <label htmlFor="fileInput" className="form-label">
                    Sélectionner un fichier CSV
                  </label>
                  <input
                    type="file"
                    id="fileInput"
                    className="form-control"
                    accept=".csv"
                    onChange={handleFileChange}
                    required
                  />
                  <div className="form-text">Seuls les fichiers CSV sont pris en charge.</div>
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  Télécharger le CSV
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateStudent;