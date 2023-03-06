import React, { useRef, useState } from "react";
import { Container, Form, Button } from "react-bootstrap";

export default function AddVoting({contract}) {
  const addNewvoting = async () => {
    changeDisable(true);
    contract.addVoting(voteNameRef.current.value)
    alert("head back to home page");
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
      disabled={disableButton}
      onClick={addNewvoting}
      variant='primary'
    >
      Submit
    </Button>
  </Container>
    )
  }