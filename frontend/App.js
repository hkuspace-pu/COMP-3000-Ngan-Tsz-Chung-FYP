import 'regenerator-runtime/runtime';
import React from 'react';
import './assets/global.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container,Navbar,Nav,NavDropdown} from 'react-bootstrap'
import Home from './Components/Home'
import PollingStation from './Components/PollingStation'
import NewPoll from './Components/NewPoll'
import voteIcon from './assets/vote_icon.png'
import { EducationalText, SignInPrompt, SignOutButton } from './ui-components';
import {
  BrowserRouter as Router,
  Route,Routes
} from "react-router-dom";
export default function App({ isSignedIn, contractId, wallet ,accountId}){
  console.log('isSignedIn = ' + isSignedIn);
  console.log('accountId = ' + wallet.accountId);
  return    (<Router>
               <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                <Container>
                  <Navbar.Brand href="/">
                    <img style={{paddingRight: 10, alignSelf: 'flex-start'}}  width={50} height={50} src={voteIcon}/>{"E-Voting System"}
                    </Navbar.Brand>
                  <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                  <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                      <Nav.Link href="/NewPoll">New Poll</Nav.Link>
                      <Nav.Link onClick={wallet.accountId === '' ? "login" : "logout"}>{wallet.accountId  === '' ? "Login":wallet.accountId}</Nav.Link>
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