import React, { useRef, useState } from "react";
import { Container, Form, Button,Col } from "react-bootstrap";

export default function AddVoting({contract}) {
  const addNewvoting = async () => {
    changeDisable(true);
    console.log('response = ' + await contract.addVoting(
      voteNameRef.current.value,
      voteDescriptionRef.current.value).then(() => 
      {
        changeDisable(false);
        window.location.replace("/")
    }))
  };

  
  const [disableButton, changeDisable] = useState(false);
  const voteNameRef = useRef();
  const voteDescriptionRef = useRef();
    return (      <Container style={{ marginTop: "10px" }}>
    <Form>
      <Form.Group as={Col} className='mb-3'>
        <Form.Label>Vote Name</Form.Label>
        <Form.Control  
          ref={voteNameRef}
          placeholder='Enter Vote Name'
        ></Form.Control>
      </Form.Group>
      <Form.Group as={Col} className='mb-3'>
      <Form.Label >Vote Description</Form.Label>
        <Form.Control
          ref={voteDescriptionRef}
          placeholder='Enter Vote Description'
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