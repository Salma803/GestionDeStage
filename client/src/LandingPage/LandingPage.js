import React from 'react';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <header className="header">
        <div className="logo">
          <div className="triangle"></div>
          <h1 className="app-name">InterConnect</h1>
        </div>
        <nav className="navbar">
          <a href="#features">Fonctionnalités</a>
          <a href="#about">À propos</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <main>
        <section className="hero">
          <h2>Bienvenue sur InterConnect</h2>
          <p>Votre solution tout-en-un pour gérer les stages au sein de l'ENSIAS.</p>
          <a href="/chefdefiliere/login" className="cta-button">Se connecter </a>
        </section>

        <section id="features" className="features">
          <h2>Fonctionnalités</h2>
          <div className="feature-grid">
            <div className="feature">
              <h3>Suivi des Stages</h3>
              <p className='paragraphe'>Gérez facilement les stages et surveillez les performances des étudiants.</p>
            </div>
            <div className="feature">
              <h3>Plateforme Entreprises</h3>
              <p className='paragraphe'>Accédez à une base de données d'entreprises partenaires et facilitez les collaborations.</p>
            </div>
            <div className="feature">
              <h3>Visualisation des Données</h3>
              <p className='paragraphe'>Visualisez les données des stages et des entreprises à travers des graphiques.</p>
            </div>
          </div>
        </section>

        <section id="about" className="about">
          <h2>À propos d'InterConnect</h2>
          <p className='paragraphe'>
            InterConnect est une plateforme conçue pour simplifier et optimiser
            la gestion des stages, des entreprises et de leurs statistiques. Construite
            avec des technologies de pointe, elle offre aux administrateurs des
            insights exploitables et des outils pour rationaliser les opérations.
          </p>
        </section>

        <section id="contact" className="contact">
          <h2>Contactez-nous</h2>
          <p>Si vous avez des questions ou besoin de support, n'hésitez pas à nous contacter.</p>
          <button className="cta-button">Nous Contacter</button>
        </section>
      </main>

      <footer className="footer">
        <p>© 2025 ENSIAS Manager. Tous droits réservés.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
