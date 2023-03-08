import 'regenerator-runtime/runtime';
import React, { useEffect, useState }  from 'react';
//css
import './assets/global.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container,Navbar,Nav,NavDropdown,Button,Row} from 'react-bootstrap'

//ui
import Home from './Components/Home'
import VotingPage from './Components/VotingPage'
import AddVoting from './Components/AddVoting'
import AddCandidate from './Components/AddCandidate'
// image
import votingLogo from './assets/voting_icon.png'

import {
  BrowserRouter as Router,
  Route,Routes
} from "react-router-dom";
export default function App({ isSignedIn, contractId, wallet, contract }) {
  const addAmin= async () =>{
    await contract.addAdmin('ngantszchung.testnet')
  }
  addAmin()
  const [isAdmin, changeIsAdmin] = useState(false);
    useEffect(() => {
      const getPrompts = async () => {
        try {
          var admins = await contract.getAdmins()
          var checkIsAdmin = admins.some((admin) => admin.aid == wallet.accountId)
          changeIsAdmin(checkIsAdmin);
          
       
        } catch (error) {
          console.log('error = ' + error);
        }
      };
      getPrompts();
    }, []);

  console.log('wallet.accountId ' + wallet.accountId)
  console.log('isAdmin = ' + JSON.stringify(isAdmin));

  


  const getAdmins = async () => {
    await contract.getAdmins();
    changeVotingList(await contract.getVotings());
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
                      
                      {isAdmin ? (isSignedIn?<Nav.Link href="/AddVoting">Add Voting</Nav.Link>:null):null}
                      <Nav.Link onClick={isSignedIn?() => wallet.signOut():() => wallet.signIn()}>
                        {isSignedIn?'Logout':'Login'}
                      </Nav.Link>
                    </Nav>
                  </Navbar.Collapse>
                </Container>
              </Navbar>
                <Routes>
                <Route exact path="/" element={
                isSignedIn?<Home contract={contract} isAdmin={isAdmin}/>:
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100vh',
                }}>
                  <Row >
                  <label style={{
           width:'100%',
           alignItems: 'center',
           justifyContent: 'center',
         }}>{'Please Login to Continue'}</label>
                
                    <Button  className='btn-primary' onClick={() => wallet.signIn()}>Login</Button>
                  </Row>
                  
                </div>
             
              
              }/>
                  <Route exact path="/VotingPage" element={<VotingPage contract={contract} isAdmin={isAdmin}/>}/>
                  <Route exact path="/AddVoting" element={<AddVoting contract={contract} isAdmin={isAdmin}/>}/>
                  <Route exact path="/AddCandidate" element={<AddCandidate contract={contract} isAdmin={isAdmin}/>}/>
                </Routes>
              </Router>
  )
}
