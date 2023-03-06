import 'regenerator-runtime/runtime';
import React , { useEffect, useState } from 'react';
import {Table,Container,Button} from 'react-bootstrap'
import { Candidate } from '../../contract/src/model'
export default function Home({contract,gotoVotingPage }) {

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

  function addVoting(title){
    wallet.callMethod({ method: 'addVoting', args: { title: title }, contractId })
    .then(async () => {    
     
        changeVotingList(await getVotings());

        // console.log('getVotings' + await getVotings());
  
    },[]);}
  
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
                    <td>{voting.id}</td>
                    <td>{voting.title}</td>
                    <td><Button onClick={() => gotoVotingPage(voting.id)}>Poll</Button></td>
                  </tr>
                );
              })
            }
          </tbody>
        </Table>

      </Container>
    )
  }