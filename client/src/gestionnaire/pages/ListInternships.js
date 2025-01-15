import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UseAuth from "../hooks/UseAuth";
import SideNav from '../components/SideNav'; // Assuming you have a SideNav component
import Header from '../components/Header'; // Assuming you have a Header component


const ListInternships = () => {
  const isAuthenticated = UseAuth();
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Récupérer tous les stages
    axios
      .get('http://localhost:3001/gestionnaire/internships')
      .then((response) => {
        setInternships(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des stages :', error);
        setError('Une erreur s\'est produite lors de la récupération des stages.');
        setLoading(false);
      });
  }, []);

  const handleGenerateConvention = (idStage) => {
    console.log(`Génération de la convention pour le stage ID: ${idStage}`);
  
    axios
      .post(
        `http://localhost:3001/gestionnaire/internships/${idStage}/generate-convention`, 
        {}, // Send an empty object if no body is required
        { responseType: 'blob' } // Expect a Blob (binary data) response
      )
      .then((response) => {
        // Create a URL for the binary data
        const pdfUrl = window.URL.createObjectURL(new Blob([response.data]));
        
        // Create a download link and trigger download
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.setAttribute('download', `convention-${idStage}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        
        // Revoke the object URL to free memory
        window.URL.revokeObjectURL(pdfUrl);
      })
      .catch((error) => {
        console.error('Erreur lors de la génération de la convention:', error);
        alert(`Erreur lors de la génération de la convention pour le stage ID: ${idStage}`);
      });
};

  

  if (loading) {
    return <p>Chargement des stages...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="d-flex">
      <SideNav />
      <div className="main-content w-100">
      <Header />

        <div style={{ margin:'10px',padding: '80px' }}>
              
              {/* Search Bar */}
              
              
              {/* Table */}
              <table className="table table-bordered table-striped">
                <thead>
                  <tr>
                    <th>ID Stage</th>
                    <th>ID Étudiant</th>
                    <th>Nom Étudiant</th>
                    <th>Date de Naissance</th>
                    <th>Email</th>
                    <th>Téléphone</th>
                    <th>Filière</th>
                    <th>Année</th>
                    <th>Nom de l'Entreprise</th>
                    <th>Adresse de l'Entreprise</th>
                    <th>Téléphone de l'Entreprise</th>
                    <th>Email de l'Entreprise</th>
                    <th>Titre de l'Offre</th>
                    <th>Description de l'Offre</th>
                    <th>Durée</th>
                    <th>Période</th>
                    <th>Tuteur</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {internships.map((stage) => (
                    <tr key={stage.ID_Stage}>
                      <td>{stage.ID_Stage}</td>
                      <td>{stage.ID_Etudiant}</td>
                      <td>{`${stage.Prenom_Etudiant} ${stage.Nom_Etudiant}`}</td>
                      <td>{stage.Date_Naissance_Etudiant}</td>
                      <td>{stage.Email_Etudiant}</td>
                      <td>{stage.Tel_Etudiant}</td>
                      <td>{stage.Filiere_Etudiant}</td>
                      <td>{stage.Annee_Etudiant}</td>
                      <td>{stage.Nom_Entreprise}</td>
                      <td>{stage.Adresse_Entreprise}</td>
                      <td>{stage.Tel_Entreprise}</td>
                      <td>{stage.Email_Entreprise}</td>
                      <td>{stage.Titre_Offre}</td>
                      <td>{stage.Description_Offre}</td>
                      <td>{stage.Durée}</td>
                      <td>{stage.Période}</td>
                      <td>{stage.Tuteur}</td>
                      <td>
                        <button
                          className="btn btn-primary"
                          onClick={() => handleGenerateConvention(stage.ID_Stage)}
                        >
                          Générer Convention
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
  );
};


export default ListInternships;
