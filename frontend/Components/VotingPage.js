import React , {useState}from 'react';
import { Container, Table, Col, Button} from 'react-bootstrap'
import React, { useEffect, useState }  from 'react';

export default function VotingPage({contract,isAdmin}) {
  const [candidateList, changeCandidateList] = useState([]);
  const [isVoted, changeIsVoted] = useState(false);
    let voteId = localStorage.getItem("voteId");
    let description = localStorage.getItem("description");
    
    console.log('VotingPage voteId = ' + voteId);
    console.log('contract = ' + contract.check());
    useEffect(() => {
      const getPrompts = async () => {
        try {
          changeCandidateList(await contract.getCandidates(voteId));
          var candidates = await contract.getCandidates(voteId)
          console.log('candidates = ' + JSON.stringify(candidates));

          changeIsVoted(await contract.isVoted(voteId))
        } catch (error) {
          console.log('error = ' + error);
        }
      };
      getPrompts();
    }, []);
    
    const gotoAddCandidatePage = async () => {
      console.log('voteId = ' + voteId);
      localStorage.setItem("voteId", voteId);
      window.location.replace("/AddCandidate");
    };
   
    const vote = async (candidateId) => {
      console.log('voteId = ' + voteId);
      console.log('candidateId = ' + candidateId);
      await contract.vote(voteId,candidateId);
      changeCandidateList(await contract.getCandidates(voteId));
    };

    const deleteCandidate = async (candidateId) => {
      console.log('voteId = ' + voteId);
      console.log('candidateId = ' + candidateId);
      await contract.deleteCandidate(voteId,candidateId);
      changeCandidateList(await contract.getCandidates(voteId));
    };
    return (    
      <Container>
       {isAdmin ? <Button className='m-3 btn-primary' onClick={()=>{gotoAddCandidatePage()}}>Add Candidate</Button> : null}
        
        <Col>
        <label className='m-3'>{'description : ' + description}</label>
        </Col>
      <Table style={{margin:'2vh'}} striped border >
        <thead>
          <tr>
            <th>Id</th>
            <th>Photo</th>
            <th>name</th>
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
                  <td><img width={100} src={candidate.image}/></td>
                  <td>{candidate.name}</td>
                  <td>{candidate.description}</td>
                  <td>{candidate.voteCount}</td>
                  <td><Button 
                  disabled={isVoted}
                  className='btn-primary' 
                  onClick={()=>{vote(candidate.cid)}}>
                    Vote
                  </Button>
                  {isAdmin ? 
                  <Button 
                  className='btn-primary' 
                  onClick={()=>{deleteCandidate(candidate.cid)}}>
                    Delete
                  </Button>:null}
                  
                  </td>
                </tr>
              );
            })
          }
        </tbody>
      </Table>
    </Container>
    )
  }