import React, { useRef, useState } from "react";
import { Container, Form, Button } from "react-bootstrap";

export default function AddCandidate({voteId}) {
    const [disableButton, changeDisable] = useState(false);
    const candidateNameRef = useRef();
    const candidateImageRef = useRef();
    const candidateDescriptionRef = useRef();
  const addNewCandidate = async () => {
    changeDisable(true);
    contract.addCandidate(
        voteId,
        candidateNameRef.current.value,
        candidateImageRef.current.value,
        candidateDescriptionRef.current.value,
        )
    alert("head back to home page");
  };

    return (      <Container style={{ marginTop: "10px" }}>
    <Form>
      <Form.Group className='mb-3'>
        <Form.Label>Candidate Name</Form.Label>
        <Form.Control
          ref={candidateNameRef}
          placeholder='Enter Candidate Name'
        ></Form.Control>
      </Form.Group>
      <Form.Group className='mb-3'>
        <Form.Label>Candidate Image</Form.Label>
        <Form.Control
          ref={candidateNameRef}
          placeholder='Enter Candidate Image'
        ></Form.Control>
      </Form.Group>
      <Form.Group className='mb-3'>
        <Form.Label>Candidate Description</Form.Label>
        <Form.Control
          ref={candidateNameRef}
          placeholder='Enter Candidate Description'
        ></Form.Control>
      </Form.Group>
    </Form>

    <Button
      disabled={disableButton}
      onClick={addNewCandidate}
      variant='primary'
    >
      Submit
    </Button>
  </Container>
    )
  }