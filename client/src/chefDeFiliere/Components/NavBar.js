import React from 'react';
import axios from 'axios';
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Gift, ShoppingCart,House, IdentificationCard, Storefront, User, Receipt } from 'phosphor-react';

const NavBar = () => {
    const navigate = useNavigate();


    const logout = () => {
        sessionStorage.removeItem('accessToken');
        navigate('/chefdefiliere/login');
    };

    // Navigation functions
    const navigateHome = () => {
        navigate('/chefdefiliere/listeoffres');
    };
    const navigatePanier = () => {
        navigate('/');
    };

    const navigateAchat = () => {
        navigate('/');
    };

    return (
        <Navbar variant="light" bg="light" expand="lg">
            <Container className='NavBar-container' fluid>
                <Navbar.Brand onClick={navigateHome}>
                    <img className='icon-img'
                        src={process.env.PUBLIC_URL + '/Logo.png'} 
                        alt="Your Icon"
                    />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="navbar-dark-example" />
                <Navbar.Collapse id="navbar-dark-example">
                    <Nav className="me-auto">
                    <Nav.Link ><House size={32} color="#3c43af" /></Nav.Link>
                        <Nav.Link onClick={navigateHome}><Storefront size={32} color="#3c43af" /></Nav.Link>
                        <Nav.Link onClick={navigatePanier}><ShoppingCart size={32} color="#3c43af" /></Nav.Link>
                        <Nav.Link onClick={navigateAchat}><Receipt size={32} color='#3C43AF' /></Nav.Link>
                        <NavDropdown id="nav-dropdown-dark-example" menuVariant="light" title={<User size={24} color="#3c43af" />}>
                            <NavDropdown.Item onClick={logout}>Se Déconnecter</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.2">Mes infos</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.3">Changer le mot de passe</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="/client/reclamations">Mes réclamations</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavBar;
