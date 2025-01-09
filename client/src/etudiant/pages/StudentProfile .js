import React, { useEffect, useState } from "react";
import axios from "axios";
import SideNav from '../components/SideNav'; // Assuming you have a SideNav component
import Header from '../components/Header'; // Assuming you have a Header component

const StudentProfile = () => {
  const [student, setStudent] = useState(null);
  const [cvFile, setCvFile] = useState(null);
  const [cvLink, setCvLink] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch student profile data
    axios
      .get("http://localhost:3001/etudiant/me", {
        headers: {
          accessToken: sessionStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        setStudent(response.data);
        // Assuming the CV file name is stored in 'CV_Etudiant' and you need to add the full URL path
        setCvLink(response.data.CV_Etudiant ? `http://localhost:3001/uploads/cvs/${response.data.CV_Etudiant}` : null);
        setLoading(false);
      })
      .catch((error) => {
        setError("Failed to fetch student profile.");
        console.error("Error fetching student profile:", error);
        setLoading(false);
      });
  }, []);

  const handleFileChange = (e) => {
    setCvFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!cvFile) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("cv", cvFile);

    try {
      const response = await axios.post("http://localhost:3001/etudiant/uploadCV", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          accessToken: sessionStorage.getItem("accessToken"),
        },
      });

      setSuccessMessage("CV uploaded successfully!");
      setCvLink(`http://localhost:3001/uploads/cvs/${response.data.cvFileName}`); // Update the link to the new CV
      setError(null);
    } catch (error) {
      setError("Failed to upload CV.");
      setSuccessMessage(null);
      console.error("Error uploading CV:", error);
    }
  };

  if (loading) {
    return <p>Loading profile...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="liste-offres-page">
      <SideNav />
      <div className="content-area">
        <Header />
        <main className="offers-main">
          <div className="container my-5" style={{ minHeight:"1500px",maxWidth: "800px", margin: "0 auto" }}>
            <div className="card p-4 shadow">
              <div className="mb-4">
                <p><strong>Nom:</strong> {student?.Nom_Etudiant} {student?.Prenom_Etudiant}</p>
                <p><strong>Email:</strong> {student?.Email_Etudiant}</p>
                <p><strong>Téléphone:</strong> {student?.Tel_Etudiant}</p>
                <p><strong>Filière:</strong> {student?.Filiere_Etudiant}</p>
                <p><strong>Date de Naissance:</strong> {student?.Date_Naissance_Etudiant}</p>
                <p><strong>Année:</strong> {student?.Annee_Etudiant}</p>
                <p>
                  <strong>Stage Trouvé :</strong> {student?.Statut_Recherche === 'false' ? 'Non' : 'Oui'}
                </p>
              </div>
              <strong>Votre CV: </strong>
              
                
                {cvLink ? (
                  <a href={cvLink} target="_blank" rel="noopener noreferrer">
                    Cliquez ici pour voir/télécharger votre CV
                  </a>
                ) : (
                  <p className="text-danger">Aucun CV téléchargé pour le moment.</p>
                )}

                <div className="mt-3">
                  <strong>Télécharger un nouveau CV</strong>
                  {successMessage && <p className="text-success">{successMessage}</p>}
                  {error && <p className="text-danger">{error}</p>}
                  <input type="file" className="form-control mb-2" onChange={handleFileChange} />
                  <button className="btn btn-outline-primary" onClick={handleFileUpload}>
                    Télécharger CV
                  </button>
                </div>
              
            </div>
          </div>
        </main>
      </div>
    </div>
  );
  
};

export default StudentProfile;
