import React , {useState}from 'react';
import { Container, Table, Col, Button} from 'react-bootstrap'
import React, { useEffect, useState }  from 'react';

export default function VotingPage({contract}) {
  const [candidateList, changeCandidateList] = useState([]);
    let voteId = localStorage.getItem("voteId");
    console.log('VotingPage voteId = ' + voteId);
    console.log('contract = ' + contract.check());
    useEffect(() => {
      const getPrompts = async () => {
        try {
          changeCandidateList(await contract.getCandidates(voteId));
          var candidates = await contract.getCandidates(voteId)
          console.log('candidates = ' + JSON.stringify(candidates));
        } catch (error) {
          console.log('error = ' + error);
        }
      };
      getPrompts();
    }, []);
    
    const gotoAddCandidatePage = async () => {
      console.log('voteId = ' + voteId);
      localStorage.setItem("voteId", voteId);
      window.location.replace(window.location.href + "AddCandidate");
    };
   
    return (    
      <Container>
      <Button onClick={()=>{gotoAddCandidatePage()}}>Add Candidate</Button>
      <Table style={{margin:'2vh'}} striped border hover>
        <thead>
          <tr>
            <th>Id</th>
            <th>Photo</th>
            <th>Candidate</th>
            <th>Description</th>
            <th>count</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {
            candidateList == undefined ? null:
            candidateList.map((candidate,index) => {
              return (
                <tr key={index}>
                  <td>{candidate.cid}</td>
                  <td>{candidate.image}</td>
                  <td>{candidate.name}</td>
                  <td>{candidate.description}</td>
                  <td>{candidate.voteCount}</td>
                  <td><Button>vote</Button></td>
                </tr>
              );
            })
          }
        </tbody>
      </Table>
    </Container>
    )
  }