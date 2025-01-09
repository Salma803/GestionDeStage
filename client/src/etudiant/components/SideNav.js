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
<aside className="main-sidebar sidebar-dark-danger elevation-4 " >
  {/* Brand Logo */}
  
  {/* Sidebar */}
  <div className="sidebar">
    {/* Sidebar user panel (optional) */}
    <div className="user-panel mt-3 pb-3 mb-3 d-flex">
      <div className="image">
        <img src="/dist/img/user2-160x160.jpg" className="img-circle elevation-2"  />
      </div>
      <div className="info">
        <a href="#" className="d-block">Chef de filière</a>
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
          <a href="/etudiant/acceuil" className="nav-link active" >
            <i className="nav-icon fas fa-tachometer-alt"  />
            <p>
              Acceuil
            </p>
          </a>
        </li>
        <li className="nav-item">
          <a href='/etudiant/home' className="nav-link">
            <i  className="nav-icon fas fa-check" />
            <p>
               Offres
              
              <span className="badge badge-info right"></span>
            </p>
          </a>
          
        </li>
        <li className="nav-item">
          <a href='/etudiant/candidatures' className="nav-link">
            <i  className="nav-icon fas fa-check" />
            <p>
               Mes Candidatures
              
              <span className="badge badge-info right"></span>
            </p>
          </a>
          
        </li>
  
        <li className="nav-item">
          <a href='/etudiant/entretiens' className="nav-link">
            <i  className="nav-icon fas fa-check" />
            <p>
              Mes Entretiens
              
              <span className="badge badge-info right"></span>
            </p>
          </a>
          
        </li>
        <li className="nav-header">Paramétres</li>
        <li className="nav-item">
          <a href="/etudiant/profile" className="nav-link">
            <i className="nav-icon fas fa-user" />
            <p>
              Mon profil
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
