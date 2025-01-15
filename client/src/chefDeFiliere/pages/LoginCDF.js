import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import '../css/LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [role, setRole] = useState("chefdefiliere"); // Default role is chefdefiliere
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loginRoute =
      role === "entreprise"
        ? "http://localhost:3001/entreprise/login"
        : role === "etudiant"
        ? "http://localhost:3001/etudiant/login"
        : role === "gestionnaire"
        ? "http://localhost:3001/gestionnaire/login"
        : "http://localhost:3001/chefdefiliere/login"; // Adjust routes as needed

    try {
      const response = await axios.post(loginRoute, {
        email,
        mot_de_passe: password,
      });
      const { accessToken } = response.data;
      sessionStorage.setItem("accessToken", accessToken);

      // Redirect based on role
      if (role === "entreprise") {
        navigate("/entreprise/consulteroffres");
      } else if (role === "etudiant") {
        navigate("/etudiant/home");
      } else if (role === "gestionnaire") {
        navigate("/gestionnaire/home");
      } else {
        navigate("/chefdefiliere/listeoffres");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.error || "Unexpected error during login.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2 className="login-title">Connexion</h2>
        {error && <div className="alert error-message">{error}</div>}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="role">Se connecter en tant que:</label>
            <select
              className="form-control"
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="entreprise">Entreprise</option>
              <option value="chefdefiliere">Chef de Filière</option>
              <option value="etudiant">Etudiant</option>
              <option value="gestionnaire">Gestionnaire</option>
            </select>
          </div>
          <button type="submit" className="btn login-btn">
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
};
export default LoginPage;
