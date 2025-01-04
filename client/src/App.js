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

// New routes for viewing lists of accounts
import ListStudents from "./gestionnaire/ListStudents";
import ListChefsFiliere from "./gestionnaire/ListChefsFiliere";
import ListEntreprises from "./gestionnaire/ListEntreprises";


//Routes for chef de filiere
import ListeOffres from "./chefDeFiliere/ListeOffres";
import OffreApprouve from "./chefDeFiliere/OffreApprouve";
import OffreRejet from "./chefDeFiliere/OffreRejet";

//Routes for entreprise
import CreerOffre from "./entreprise/CreerOffre";
import ConsulterOffres from "./entreprise/ConsulterOffres";

function App() {
  return (
    <div className="App">
      <HelmetProvider>
        <Helmet>
          <title>Gestionnaire Dashboard</title>
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

            {/* Routes por le chef de filiere */}
            <Route path="/chefDeFiliere/listeOffres" element={<ListeOffres />} />
            <Route path="/chefDeFiliere/offresApprouvees" element={<OffreApprouve />} />  
            <Route path="/chefDeFiliere/offresRejetees" element={<OffreRejet />} />

            {/* Route entreprises */}
            <Route path="/entreprise/creerOffre" element={<CreerOffre />} />
            <Route path="/entreprise/consulterOffres" element={<ConsulterOffres />} />
          </Routes>
        </Router>
      </HelmetProvider>
    </div>
  );
}

export default App;
