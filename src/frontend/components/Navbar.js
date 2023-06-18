import {
    Link
} from "react-router-dom";
import { Navbar, Nav, Button, Container } from 'react-bootstrap'
import market from './market.png'

const Navigation = ({ web3Handler, account }) => {
    return (
        <Navbar className="Navbar">
            <Container>
                <Navbar.Brand as={Link} to="/"><img src={market} width="40" height="40" className="navbar_logo" alt="" /></Navbar.Brand>
                <Navbar.Brand as={Link} to="/" className="navbar_link">Accueil</Navbar.Brand>
                <Navbar.Brand as={Link} to="/create" className="navbar_link">Créer un NFT</Navbar.Brand>
                <Navbar.Brand as={Link} to="/my-listed-items" className="navbar_link">Mes NFT</Navbar.Brand>
                <Navbar.Brand as={Link} to="/my-purchases" className="navbar_link">Mes achats</Navbar.Brand>
                <Navbar.Toggle />
            </Container>
        </Navbar>
    );
}

export default Navigation;