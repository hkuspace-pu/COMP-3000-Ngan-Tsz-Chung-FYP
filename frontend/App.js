import 'regenerator-runtime/runtime';
import React, { useEffect, useState }  from 'react';
//css
import './assets/global.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container,Navbar,Nav,NavDropdown} from 'react-bootstrap'

//ui
import Home from './Components/Home'
import VotingPage from './Components/VotingPage'
import AddVoting from './Components/AddVoting'
import VotingPageAddCandidate from './Components/VotingPageAddCandidate'
// image
import votingLogo from './assets/voting_icon.png'

import {
  BrowserRouter as Router,
  Route,Routes
} from "react-router-dom";
export default function App({ isSignedIn, contractId, wallet, contract }) {

  const gotoVotingPage = async (voteId) => {

    console.log(' voteId = ' + voteId);
    localStorage.setItem("voteId", voteId);
    window.location.replace(window.location.href + "VotingPage");
  };

  return (  <Router>
              <Navbar className='color-nav' collapseOnSelect expand="lg" variant="dark">
                <Container>
                  <Navbar.Brand href="/"><img width={40} height={40} src={votingLogo}></img>
                    
                    </Navbar.Brand>
                    <Navbar.Brand href="/">{'E-voting'}
                    
                    </Navbar.Brand>

                    
                  <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                  <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mx-auto">
                    </Nav>
                    <Nav>
                      {isSignedIn?<Nav.Link  href="/">{(isSignedIn?wallet.accountId:'')}</Nav.Link>:null}
                      <Nav.Link href="/AddVoting">Add Voting</Nav.Link>
                      <Nav.Link onClick={isSignedIn?() => wallet.signOut():() => wallet.signIn()}>
                        {isSignedIn?'Logout':'Login'}
                      </Nav.Link>
                    </Nav>
                  </Navbar.Collapse>
                </Container>
              </Navbar>
                <Routes>
                <Route exact path="/" element={<Home contract={contract} gotoVotingPage={gotoVotingPage}/>}/>
                  <Route exact path="/VotingPage" element={<VotingPage contract={contract}/>}/>
                  <Route exact path="/AddVoting" element={<AddVoting contract={contract}/>}/>
                  <Route exact path="/VotingPageAddCandidate" element={<VotingPageAddCandidate contract={contract}/>}/>
                </Routes>
              </Router>
  )
}
