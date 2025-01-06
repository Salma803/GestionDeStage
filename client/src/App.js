import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import GestionnaireHome from "./gestionnaire/GestionnaireHome";
import { Helmet, HelmetProvider } from 'react-helmet-async';
import 'bootstrap/dist/css/bootstrap.min.css';

import CreateStudent from "./gestionnaire/CreateStudent";
import CreateEntreprise from "./gestionnaire/CreateEntreprise";
import CreateChefFiliere from "./gestionnaire/CreateChefFiliere";

// Individual modification and deletion routes for each user type
import ModifyStudent from "./gestionnaire/ModifyStudent";
import DeleteStudent from "./gestionnaire/DeleteStudent";
import ModifyChefFiliere from "./gestionnaire/ModifyChefFiliere";
import DeleteChefFiliere from "./gestionnaire/DeleteChefFiliere";
import ModifyEntreprise from "./gestionnaire/ModifyEntreprise";
import DeleteEntreprise from "./gestionnaire/DeleteEntreprise";

// Routes for viewing lists of accounts
import ListStudents from "./gestionnaire/ListStudents";
import ListChefsFiliere from "./gestionnaire/ListChefsFiliere";
import ListEntreprises from "./gestionnaire/ListEntreprises";

// Routes for chef de filiere
import ListeOffres from "./chefDeFiliere/pages/ListeOffres";
import OffreApprouve from "./chefDeFiliere/pages/OffreApprouve";
import OffreRejet from "./chefDeFiliere/pages/OffreRejet";
import LoginPage from "./chefDeFiliere/pages/LoginCDF";
import InfoCDF from "./chefDeFiliere/pages/InfoCDF";
import EtudiantsCDF from "./chefDeFiliere/pages/EtudiantsCDF";
import ListeCandidatures from "./chefDeFiliere/CandidatureCDF";
// Routes for entreprise
import CreerOffre from "./entreprise/CreerOffre";
import ConsulterOffres from "./entreprise/ConsulterOffres";
import CandidaturesEntreprise from "./entreprise/Candidatures";

// Routes for etudiant
import StudentHome from "./etudiant/StudentHome";  
import OfferDetails from "./etudiant/OfferDetails"; 
import StudentProfile from "./etudiant/StudentProfile ";
import Candidatures from "./etudiant/Candidatures";

function App() {
  return (
    <div className="App">
      <HelmetProvider>
        <Helmet>
          <title>Homepage</title>
        </Helmet>
        <Router>
          <Routes>
            {/* Gestionnaire routes */}
            <Route path="/gestionnaire/home" element={<GestionnaireHome />} />
            <Route path="/gestionnaire/createStudent" element={<CreateStudent />} />
            <Route path="/gestionnaire/createChefFiliere" element={<CreateChefFiliere />} />
            <Route path="/gestionnaire/createEntreprise" element={<CreateEntreprise />} />
            
            {/* Modification Routes */}
            <Route path="/gestionnaire/modifyStudent/:id" element={<ModifyStudent />} />
            <Route path="/gestionnaire/modifyChefFiliere/:id" element={<ModifyChefFiliere />} />
            <Route path="/gestionnaire/modifyEntreprise/:id" element={<ModifyEntreprise />} />

            {/* Deletion Routes */}
            <Route path="/gestionnaire/deleteStudent/:id" element={<DeleteStudent />} />
            <Route path="/gestionnaire/deleteChefFiliere/:id" element={<DeleteChefFiliere />} />
            <Route path="/gestionnaire/deleteEntreprise/:id" element={<DeleteEntreprise />} />

            {/* Routes for Viewing Lists of Accounts */}
            <Route path="/gestionnaire/listStudents" element={<ListStudents />} />
            <Route path="/gestionnaire/listChefsFiliere" element={<ListChefsFiliere />} />
            <Route path="/gestionnaire/listEntreprises" element={<ListEntreprises />} />
          
            {/* Routes for chef de filiere */}
            <Route path="/chefDeFiliere/listeOffres" element={<ListeOffres />} />
            <Route path="/chefDeFiliere/offresApprouvees" element={<OffreApprouve />} />  
            <Route path="/chefDeFiliere/offresRejetees" element={<OffreRejet />} />
            <Route path="/chefDeFiliere/login" element={<LoginPage />} />
            <Route path="/chefdefiliere/info"  element={<InfoCDF /> } />
            <Route path="/chefdefiliere/etudiants"  element={<EtudiantsCDF /> } />
            <Route path="/chefdefiliere/candidatures" element={<ListeCandidatures />} />

            {/* Routes for entreprise */}
            <Route path="/entreprise/creerOffre" element={<CreerOffre />} />
            <Route path="/entreprise/consulterOffres" element={<ConsulterOffres />} />
            <Route path="/entreprise/candidatures/:offerId" element={<CandidaturesEntreprise />} />

            {/* Routes for Etudiant */}
            <Route path="/etudiant/home" element={<StudentHome />} />
            <Route path="/etudiant/offer/:offerId" element={<OfferDetails />} />
            <Route path="/etudiant/profile" element={<StudentProfile />} />
            <Route path="/etudiant/candidatures" element={<Candidatures />} />

          
          </Routes>
        </Router>
      </HelmetProvider>
    </div>
  );
}

export default App;
