import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UseAuth from "../hooks/UseAuth";
import SideNav from "../components/SideNav";
import Header from "../components/Header";


const ListeStagesEntreprise = () => {
  const [stages, setStages] = useState([]);
  const [userId, setUserId] = useState(null); // To store the authenticated entreprise's ID
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isAuthenticated = UseAuth();


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch the authenticated entreprise's data
        const response = await axios.get('http://localhost:3001/entreprise/me', {
          headers: {
            accessToken: sessionStorage.getItem('accessToken'), // Pass access token from sessionStorage
          },
        });

        const entrepriseEmail = response.data.Email_Entreprise;
        setUserId(entrepriseEmail);

        // Fetch the stages for this entreprise using its ID
        const stagesResponse = await axios.get(`http://localhost:3001/entreprise/${entrepriseEmail}/stages`);
        setStages(stagesResponse.data);
        setLoading(false);
      } catch (err) {
        setStages([]);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <p>Chargement des stages...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

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
            <h2 style={{ paddingTop: "20px" }} className="card-title text-center mb-4">
              Stages 
            </h2>

            <div className="card-body">
              <table className="table table-bordered table-hover">
                <thead className="thead">
                  <tr>
                    <th>ID Stage</th>
                    <th>ID Étudiant</th>
                    <th>Nom de l'Étudiant</th>
                    <th>Date de Naissance</th>
                    <th>Email</th>
                    <th>Téléphone</th>
                    <th>Filière</th>
                    <th>Année</th>
                    <th>Titre de l'Offre</th>
                    <th>Description de l'Offre</th>
                    <th>Durée</th>
                    <th>Période</th>
                    <th>Tuteur</th>
                  </tr>
                </thead>
                <tbody>
                  {stages.length === 0 ? (
                    <tr>
                      <td colSpan="13" className="text-center">
                        Pas encore de stages
                      </td>
                    </tr>
                  ) : (
                    stages.map((stage) => (
                      <tr key={stage.ID_Stage}>
                        <td>{stage.ID_Stage}</td>
                        <td>{stage.ID_Etudiant}</td>
                        <td>
                          {stage.Prenom_Etudiant} {stage.Nom_Etudiant}
                        </td>
                        <td>{stage.Date_Naissance_Etudiant}</td>
                        <td>{stage.Email_Etudiant}</td>
                        <td>{stage.Tel_Etudiant}</td>
                        <td>{stage.Filiere_Etudiant}</td>
                        <td>{stage.Annee_Etudiant}</td>
                        <td>{stage.Titre_Offre}</td>
                        <td>{stage.Description_Offre}</td>
                        <td>{stage.Durée}</td>
                        <td>{stage.Période}</td>
                        <td>{stage.Tuteur}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListeStagesEntreprise;
