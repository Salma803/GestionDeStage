import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

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

      alert(`Login successful! Welcome ${response.data.email}`);

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
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2 className="text-center">Login</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
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
            <div className="form-group mb-3">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="role">Login as:</label>
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
            <button type="submit" className="btn btn-primary w-100">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
