import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import GestionnaireHome from "./gestionnaire/pages/GestionnaireHome";
import { Helmet, HelmetProvider } from 'react-helmet-async';
import 'bootstrap/dist/css/bootstrap.min.css';

import CreateStudent from "./gestionnaire/pages/CreateStudent";
import CreateEntreprise from "./gestionnaire/pages/CreateEntreprise";
import CreateChefFiliere from "./gestionnaire/pages/CreateChefFiliere";
import Home from "./gestionnaire/components/Home";
import InfoGestionnaire from "./gestionnaire/pages/InfoGestionnaire";
import ListInternships from "./gestionnaire/pages/ListInternships";

// Individual modification and deletion routes for each user type
import ModifyStudent from "./gestionnaire/pages/ModifyStudent";
import DeleteStudent from "./gestionnaire/pages/DeleteStudent";
import ModifyChefFiliere from "./gestionnaire/pages/ModifyChefFiliere";
import DeleteChefFiliere from "./gestionnaire/pages/DeleteChefFiliere";
import ModifyEntreprise from "./gestionnaire/pages/ModifyEntreprise";
import DeleteEntreprise from "./gestionnaire/pages/DeleteEntreprise";

// Routes for viewing lists of accounts
import ListStudents from "./gestionnaire/pages/ListStudents";
import ListChefsFiliere from "./gestionnaire/pages/ListChefsFiliere";
import ListEntreprises from "./gestionnaire/pages/ListEntreprises";

// Routes for chef de filiere
import ListeOffres from "./chefDeFiliere/pages/ListeOffres";
import OffreApprouve from "./chefDeFiliere/pages/OffreApprouve";
import OffreRejet from "./chefDeFiliere/pages/OffreRejet";
import LoginPage from "./chefDeFiliere/pages/LoginCDF";
import InfoCDF from "./chefDeFiliere/pages/InfoCDF";
import EtudiantsCDF from "./chefDeFiliere/pages/EtudiantsCDF";
import ListeCandidatures from "./chefDeFiliere/pages/CandidatureCDF";
// Routes for entreprise
import CreerOffre from "./entreprise/pages/CreerOffre";
import ConsulterOffres from "./entreprise/pages/ConsulterOffres";
import CandidaturesEntreprise from "./entreprise/pages/Candidatures";
import InfoEntreprise from "./entreprise/pages/InfoEntreprise";
import ListeStagesEntreprise from "./entreprise/pages/Internships";
// Routes for etudiant
import StudentHome from "./etudiant/pages/StudentHome";  
import OfferDetails from "./etudiant/pages/OfferDetails"; 
import StudentProfile from "./etudiant/pages/StudentProfile ";
import Candidatures from "./etudiant/pages/Candidatures";
import Entretiens from "./etudiant/pages/Entretiens";


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
            <Route path="/gestionnaire/info" element={<InfoGestionnaire />} />
            <Route path="/home" element={<Home />} />
            
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

            <Route path="/gestionnaire/listInternships" element={<ListInternships />} />

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
            <Route path="/entreprise/info" element={<InfoEntreprise />} />
            <Route path="/entreprise/stages" element={<ListeStagesEntreprise />} />


            {/* Routes for Etudiant */}
            <Route path="/etudiant/home" element={<StudentHome />} />
            <Route path="/etudiant/offer/:offerId" element={<OfferDetails />} />
            <Route path="/etudiant/profile" element={<StudentProfile />} />
            <Route path="/etudiant/candidatures" element={<Candidatures />} />
            <Route path="/etudiant/entretiens" element={<Entretiens />} />
            
          
          
          </Routes>
        </Router>
      </HelmetProvider>
    </div>
  );
}

export default App;
