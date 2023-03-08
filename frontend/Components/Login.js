import 'regenerator-runtime/runtime';
import React , { useEffect, useState } from 'react';
import {Table,Container,Button,Row,Col} from 'react-bootstrap'
import { Candidate } from '../../contract/src/model'
import 'bootstrap/dist/css/bootstrap.min.css'

// image
import votingLogo from '../assets/voting_front.png'

export default function Login({contract,wallet}) {
  
    return (  
        <Container >
              <ul class=" text-center m-5">
                <li class="list-group-item border-0"><img width={200} height={180} src={votingLogo}></img></li>
                <li class="list-group-item border-0"> <label style={{
                  
                        
                  }}>{'Please Login to Continue'}</label></li>
              <li class="list-group-item border-0"> <Button style={{
                    width:'200px',
                    alignItems: 'center',
                    justifyContent: 'center',
                }} className='btn-primary' onClick={() => wallet.signIn()}>Login</Button></li>
            </ul>
      
          
           
            
          </Container>
    )
  }