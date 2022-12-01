import 'regenerator-runtime/runtime';
import React from 'react';
import './assets/global.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container,Navbar,Nav,NavDropdown} from 'react-bootstrap'
import { EducationalText, SignInPrompt, SignOutButton } from './ui-components';
import {
  BrowserRouter as Router
} from "react-router-dom";

export default function App({ isSignedIn, contractId, wallet ,accountId}){
  console.log('isSignedIn = ' + isSignedIn);
  console.log('accountId = ' + wallet.accountId);
  return    (<Router>
               <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                <Container>
                  <Navbar.Brand href="/">E-Voting System</Navbar.Brand>
                  <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                  <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                      <Nav.Link href="/NewPoll">New Poll</Nav.Link>
                      <Nav.Link onClick={wallet.accountId === '' ? "login" : "logout"}>{wallet.accountId  === '' ? "Login":wallet.accountId}</Nav.Link>
                    </Nav>
                  </Navbar.Collapse>
                </Container>
              </Navbar>
            </Router>
            )
}