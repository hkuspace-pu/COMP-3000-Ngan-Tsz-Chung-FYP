import React, { useRef, useState } from "react";
import { Container, Form, Button } from "react-bootstrap";

export default function AddVoting({contract}) {
  const addNewvoting = async () => {
    changeDisable(true);
    console.log('response = ' + await contract.addVoting(voteNameRef.current.value).then(() => {
      
      window.location.replace("/")
    
    }))
  };

  
  const [disableButton, changeDisable] = useState(false);
  const voteNameRef = useRef();
    return (      <Container style={{ marginTop: "10px" }}>
    <Form>
      <Form.Group className='mb-3'>
        <Form.Label>Vote Name</Form.Label>
        <Form.Control
          ref={voteNameRef}
          placeholder='Enter Vote Name'
        ></Form.Control>
      </Form.Group>
    </Form>

    <Button
    class='btn-primary'
      disabled={disableButton}
      onClick={addNewvoting}
    >
      Submit
    </Button>
  </Container>
    )
  }