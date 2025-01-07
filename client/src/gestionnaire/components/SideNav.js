import React from 'react';
import { useNavigate } from 'react-router-dom';


function SideNav() {
  let navigate = useNavigate();

  const logout = () => {
    sessionStorage.removeItem('accessToken');
    navigate('/chefdefiliere/login');
};

  return (
    <div>
<aside className="main-sidebar sidebar-light-red elevation-4 " >
  {/* Brand Logo */}
  
  {/* Sidebar */}
  <div className="sidebar">
    {/* Sidebar user panel (optional) */}
    <div className="user-panel mt-3 pb-3 mb-3 d-flex">
      <div className="image">
        <img src="/dist/img/user2-160x160.jpg" className="img-circle elevation-2"  />
      </div>
      <div className="info">
        <a href="#" className="d-block">Gestionnaire</a>
      </div>
    </div>
    {/* SidebarSearch Form */}
    <div className="form-inline">
      <div className="input-group" data-widget="sidebar-search">
        <input className="form-control form-control-sidebar" type="search" placeholder="Search" aria-label="Search" />
        <div className="input-group-append">
          <button className="btn btn-sidebar">
            <i className="fas fa-search fa-fw" />
          </button>
        </div>
      </div>
    </div>
    {/* Sidebar Menu */}
    <nav className="mt-2">
      <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
        {/* Add icons to the links using the .nav-icon class
         with font-awesome or any other icon font library */}
        <li className="nav-item menu-open">
          <a href="/gestionnaire/home" className="nav-link active" >
            <i className="nav-icon fas fa-tachometer-alt"  />
            <p>
              Dashboard
            </p>
          </a>
        </li>
        <li className="nav-item">
          <a href='/gestionnaire/createStudent' className="nav-link">
            <i  className="nav-icon fas fa-check" />
            <p>
              Créer Etudiants
              
              <span className="badge badge-info right"></span>
            </p>
          </a>
          
        </li>
  
        <li className="nav-item">
          <a href='/gestionnaire/createChefFiliere' className="nav-link">
            <i  className="nav-icon fas fa-check" />
            <p>
              Créer Chef de filière
              
              <span className="badge badge-info right"></span>
            </p>
          </a>
          
        </li>
        <li className="nav-item">
          <a href='/gestionnaire/createEntreprise' className="nav-link">
            <i  className="nav-icon fas fa-check" />
            <p>
              Créer Entreprises
              
              <span className="badge badge-info right"></span>
            </p>
          </a>
          
        </li>
        <li className="nav-item">
          <a href="/gestionnaire/listStudents" className="nav-link">
            <i className="nav-icon fas fa-edit" />
            <p>
              Gérer Etudiant
            </p>
          </a>
        </li>
        <li className="nav-item">
          <a href="/gestionnaire/listChefsFiliere" className="nav-link">
            <i className="nav-icon fas fa-edit" />
            <p>
              Gérer Chef de filière
            </p>
          </a>
        </li>
        <li className="nav-item">
          <a href="/gestionnaire/listEntreprises" className="nav-link">
            <i className="nav-icon fas fa-edit" />
            <p>
              Gérer Entreprises
            </p>
          </a>
        </li>
        <li className="nav-item">
          <a href="/gestionnaire/listInternships" className="nav-link">
            <i className="nav-icon fas fa-eye" />
            <p>
              Consulter les stages
            </p>
          </a>
        </li>
        <li className="nav-header">Paramétres</li>
        <li className="nav-item">
          <a href="/gestionnaire/info" className="nav-link">
            <i className="nav-icon fas fa-wrench" />
            <p>
              Mes infos
              <span className="badge badge-info right"></span>
            </p>
          </a>
        </li>
        
        <li className="nav-item">
          <a  onClick={logout} className="nav-link active">
            <i   className="nav-icon fas fa-sign-out-alt" />
            <p>
              Se déconnecter
            </p>
          </a>
        </li>
      </ul>
    </nav>
    {/* /.sidebar-menu */}
  </div>
  {/* /.sidebar */}
</aside>

    </div>
  )
}

export default SideNav