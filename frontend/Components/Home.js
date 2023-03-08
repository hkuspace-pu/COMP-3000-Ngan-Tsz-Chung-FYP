import 'regenerator-runtime/runtime';
import React , { useEffect, useState } from 'react';
import {Table,Container,Button} from 'react-bootstrap'
import { Candidate } from '../../contract/src/model'
import 'bootstrap/dist/css/bootstrap.min.css'
export default function Home({contract,isAdmin,accountId}) {
  const [deleteDisable, changeDeleteDisable] = useState(false);
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

  const gotoVotingPage = async (voteId,description) => {
    console.log(' voteId = ' + voteId);
    localStorage.setItem("voteId", voteId);
    localStorage.setItem("description", description);
    localStorage.setItem("accountId", accountId);
    window.location.replace("/VotingPage");
  };

  const deleteVoting = async (voteId) => {
    changeDeleteDisable(true)
    await contract.deleteVoting(voteId).then(async () => {
      changeVotingList(await contract.getVotings());
      changeDeleteDisable(false)
      alert('Voting deleted')
   
    })
  };
    return (  
      <Container>
        {/* <Button onClick={()=>{addVoting('voting 1')}}>Add Vote Activity</Button> */}
        <Table style={{margin:'2vh'}} striped border>
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
                    <td>
                      <Button 
                      className='btn btn-primary' 
                      onClick={() => gotoVotingPage(voting.vid,voting.description)}>
                        Go to Poll
                      </Button>
                      {isAdmin ? <Button
                       disabled={deleteDisable} 
                       className='btn btn-primary' 
                       onClick={() => deleteVoting(voting.vid)}>
                        Detele
                      </Button> : null}
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