import 'regenerator-runtime/runtime';
import React , { useEffect, useState } from 'react';
import {Table,Container,Button} from 'react-bootstrap'
import { Candidate } from '../../contract/src/model'
export default function Home({wallet,contractId }) {

  const [votingList, changeVotingList] = useState([]);
    useEffect(() => {
      const getPrompts = async () => {
        try {
        var candidates = await getVotings()
        console.log('votings = ' + JSON.stringify(candidates));
        for (let index = 0; index < candidates.length; index++) {
          console.log('index = ' + index);
          
            console.log('candidate.name = ' + candidates[index].name);
            console.log('candidate.voteCount = ' + candidates[index].voteCount);
        
        
        }
      } catch (error) {
        console.log('error = ' + error);
      }
        changeVotingList(await getVotings());
      };
      getPrompts();
    }, []);

  function getVotings(){
    // use the wallet to query the contract's greeting
    return wallet.viewMethod({ method: 'getVotings', contractId })
  }

  function addVoting(title){
    wallet.callMethod({ method: 'addVoting', args: { title: title }, contractId })
    .then(async () => {    
     
        changeVotingList(await getVotings());

        // console.log('getVotings' + await getVotings());
  
    },[]);}
  
  // addVoting('candidate ');
  console.log('votingList = ' + votingList);
  // addVoteActivity('the first voting activity')
    return (  
      <Container>
        <Button onClick={()=>{addVoting('voting 1')}}>Add Vote Activity</Button>
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
                    <td>{voting.id}</td>
                    <td>{voting.title}</td>
                    <td><Button>Poll</Button></td>
                  </tr>
                );
              })
            }
          </tbody>
        </Table>

      </Container>
    )
  }