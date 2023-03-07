import 'regenerator-runtime/runtime';
import React , { useEffect, useState } from 'react';
import {Table,Container,Button} from 'react-bootstrap'
import { Candidate } from '../../contract/src/model'
import 'bootstrap/dist/css/bootstrap.min.css'
export default function Home({contract }) {

  const [votingList, changeVotingList] = useState([]);
    useEffect(() => {
      const getPrompts = async () => {
        try {
          changeVotingList(await contract.getVotings());
          var candidates = await contract.getVotings()
          console.log('votings = ' + JSON.stringify(candidates));
        } catch (error) {
          console.log('error = ' + error);
        }
      };
      getPrompts();
    }, []);

  function getVotings(){
    // use the wallet to query the contract's greeting
    return wallet.viewMethod({ method: 'getVotings', contractId })
  }
  const gotoVotingPage = async (voteId) => {
    console.log(' voteId = ' + voteId);
    localStorage.setItem("voteId", voteId);
    window.location.replace("/VotingPage");
  };
    return (  
      <Container>
        {/* <Button onClick={()=>{addVoting('voting 1')}}>Add Vote Activity</Button> */}
        <Table style={{margin:'2vh'}} striped border hover>
          <thead>
            <tr>
              <th>Id</th>
              <th>Voting</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {
              votingList == undefined ? null:
              votingList.map((voting,index) => {
                return (
                  <tr key={index}>
                    <td>{voting.vid}</td>
                    <td>{voting.title}</td>
                    <td><Button className='btn btn-primary' onClick={() => gotoVotingPage(voting.vid)}>Poll</Button></td>
                  </tr>
                );
              })
            }
          </tbody>
        </Table>

      </Container>
    )
  }