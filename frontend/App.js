import 'regenerator-runtime/runtime';
import React, { useEffect, useState }  from 'react';

import './assets/global.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container,Navbar,Nav,NavDropdown} from 'react-bootstrap'

//ui
import Home from './Components/Home'
import PollingStation from './Components/PollingStation'
import NewPoll from './Components/NewPoll'

import votingLogo from './assets/voting_icon.png'


import {
  BrowserRouter as Router,
  Route,Routes
} from "react-router-dom";
export default function App({ isSignedIn, contractId, wallet }) {

  // console.log('candidates = ' +  candidates[0]);
 


//   wallet.callMethod({ method: 'addCandidate', args: {name:'candidate1',
//   image:'https://simple.wikipedia.org/wiki/File:Chain_link_icon.png',
//   description:'first one'}, contractId })
//   .then(async () => {
//     wallet.viewMethod({ method: 'getCandidate', contractId })

// })
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
                      <Nav.Link href="/NewPoll">New Poll</Nav.Link>
                      <Nav.Link onClick={isSignedIn?() => wallet.signOut():() => wallet.signIn()}>
                        {isSignedIn?'Logout':'Login'}
                      </Nav.Link>
                    </Nav>
                  </Navbar.Collapse>
                </Container>
              </Navbar>
                <Routes>
                <Route exact path="/" element={<Home wallet={wallet} contractId={contractId}/>}/>
                  <Route exact path="/PollingStation" element={<PollingStation wallet={wallet} contractId={contractId}/>}/>
                  <Route exact path="/NewPoll" element={<NewPoll wallet={wallet} contractId={contractId}/>}/>
                </Routes>
              </Router>
  )
}
