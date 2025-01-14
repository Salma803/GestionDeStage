import React from 'react';

import DashboardCalendar from '../utils/DashboardCalendar';
import StudentsCount from '../utils/StudentsCount';
import CompanyCount from '../utils/CompanyCount';
import OffersCount from '../utils/OffersCount';
import StudentsInternshipCount from '../utils/StudentsInternshipCount';
import InternshipStatsPieChart from '../utils/InternshipStatsPieChar';
import InternshipStats from '../utils/InternshipStats';

function Home() {
  return (
    <div>
 <div className="content-wrapper">
  {/* Content Header (Page header) */}
  
  <div className="content-header">
    <div className="container-fluid">
      <div className="row mb-2">
        <div className="col-sm-6">
          <h1 className="m-0">Dashboard</h1>
        </div>{/* /.col */}
        <div className="col-sm-6">
          <ol className="breadcrumb float-sm-right">
            <li className="breadcrumb-item"><a href="#">Home</a></li>
            <li className="breadcrumb-item active">Dashboard v1</li>
          </ol>
        </div>{/* /.col */}
      </div>{/* /.row */}
    </div>{/* /.container-fluid */}
  </div>
  {/* /.content-header */}
  {/* Main content */}
  <section className="content">
  <div className='screen-content'>
                            
    <div className="container-fluid">
      {/* Small boxes (Stat box) */}
      <div className="row">
     
        <div className="col-lg-3 col-6">
          {/* small box */}
        <div>
            <StudentsCount />
        </div>
        </div>
        {/* ./col */}
          <div className="col-lg-3 col-6">
          {/* small box */}
          <div>
            <CompanyCount />
        </div>
        </div>
        <div className="col-lg-3 col-6">
          {/* small box */}
          <div>
            <OffersCount />
        </div>
        </div>
        {/* ./col */}
        <div className="col-lg-3 col-6">
        <div>
            <StudentsInternshipCount />
        </div>
        </div>
        
        {/* ./col */}
        <div className="col-lg-3 col-6">

        </div>
      </div>
      {/* /.row */}
      {/* Main row */}
      <div style={{display: 'flex', justifyContent: 'space-between'}}>
        {/* Left col */}
          
        <section className="col-lg-5 connectedSortable">
        <div >
            <div className="card-header border-0">
              <h3 className="card-title">
                <i className="far fa-chart-bar mr-2" />
                Nombre de Stages par Entreprise
              </h3>
              {/* tools card */}
              
              {/* /. tools */}
            </div>
            <InternshipStats/>
          </div>
        </section>
        
          
          
          
           


<section className="col-lg-5 connectedSortable">
        <div >
            <div className="card-header border-0">
              <h3 className="card-title">
                <i className="fas fa-chart-pie mr-2" />
                Statistiques des Stages
              </h3>
              {/* tools card */}
              
              {/* /. tools */}
            </div>
            <InternshipStatsPieChart/>
          </div>
        </section>
        
          
      </div>
    </div>
    </div>
  </section>
  {/* /.content */}
</div>

    </div>
  )
}

export default Home
