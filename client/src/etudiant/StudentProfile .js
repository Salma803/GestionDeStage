import React, { useEffect, useState } from "react";
import axios from "axios";

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
      setError("Please select a file to upload.");
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
    <div className="student-profile">
      <h1>Your Profile</h1>

      <div className="profile-info">
        <p><strong>Name:</strong> {student?.Nom_Etudiant} {student?.Prenom_Etudiant}</p>
        <p><strong>Email:</strong> {student?.Email_Etudiant}</p>
        <p><strong>Phone:</strong> {student?.Tel_Etudiant}</p>
        <p><strong>Field of Study:</strong> {student?.Filiere_Etudiant}</p>
        <p><strong>Date of Birth:</strong> {student?.Date_Naissance_Etudiant}</p>
        <p><strong>Search Status:</strong> {student?.Statut_Recherche === 'false' ? "Not Searching" : "Searching"}</p>
      </div>

      <div className="cv-section">
        <h2>Your CV</h2>
        {cvLink ? (
          <a href={cvLink} target="_blank" rel="noopener noreferrer">
            Click here to view/download your CV
          </a>
        ) : (
          <p>No CV uploaded yet.</p>
        )}

        <div>
          <h3>Upload New CV</h3>
          {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
          <input type="file" onChange={handleFileChange} />
          <button onClick={handleFileUpload}>Upload CV</button>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
