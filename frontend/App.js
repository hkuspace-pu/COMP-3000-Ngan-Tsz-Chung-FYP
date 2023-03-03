import 'regenerator-runtime/runtime';
import React from 'react';

import './assets/global.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { EducationalText, SignInPrompt, SignOutButton } from './ui-components';
import {Container,Navbar,Nav,NavDropdown} from 'react-bootstrap'
import Home from './Components/Home'
import PollingStation from './Components/PollingStation'
import NewPoll from './Components/NewPoll'

import {
  BrowserRouter as Router,
  Route,Routes
} from "react-router-dom";
export default function App({ isSignedIn, contractId, wallet }) {

  return (  <Router>
              <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                <Container>
                  <Navbar.Brand href="/">E-voting</Navbar.Brand>
                  <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                  <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mx-auto">
                    </Nav>
                    <Nav>
                      <Nav.Link href="/NewPoll">NewPoll</Nav.Link>
                      <Nav.Link href="/NewPoll">check</Nav.Link>
                      <Nav.Link onClick={isSignedIn?wallet.signIn:wallet.signOut}>
                        {isSignedIn?'Login':wallet.accoundId}
                      </Nav.Link>
                    </Nav>
                  </Navbar.Collapse>
                </Container>
              </Navbar>
                <Routes>
                  <Route path="/" element={<Home/>}/>
                  <Route path="/PollingStation" element={<PollingStation/>}/>
                  <Route path="/NewPoll" element={<NewPoll/>}/>
                </Routes>
              </Router>
  )
}