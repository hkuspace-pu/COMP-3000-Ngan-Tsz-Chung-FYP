import React, { useRef, useState } from "react";
import { Container, Form, Button } from "react-bootstrap";

export default function AddCandidate({contract}) {
    const [disableButton, changeDisable] = useState(true);
    const candidateNameRef = useRef();
    const candidateImageRef = useRef();
    const candidateDescriptionRef = useRef();

    let voteId = localStorage.getItem("voteId");
    console.log('voteId = ' + voteId);
    const addNewCandidate = async () => {
      console.log('voteId = ' + voteId);
        changeDisable(true);
        await contract.addCandidate(
            voteId,
            candidateNameRef.current.value,
            candidateImageRef.current.value,
            candidateDescriptionRef.current.value,
            ).then(() => {
              changeDisable(false);
              window.location.replace("/VotingPage")
            
            })
      
    };

    return (      <Container style={{ marginTop: "10px" }}>
    <Form>
      <Form.Group className='mb-3'>
        <Form.Label>Candidate Name</Form.Label>
        <Form.Control
          ref={candidateNameRef}
          placeholder='Enter Candidate Name'
          onChange={(text) => {
            changeDisable(candidateNameRef.current.value == "" ||
             candidateImageRef.current.value == "" ||
              candidateDescriptionRef.current.value == "");
        }}
        ></Form.Control>
      </Form.Group>
      <Form.Group className='mb-3'>
        <Form.Label>Candidate Image</Form.Label>
        <Form.Control
          ref={candidateImageRef}
          placeholder='Enter Candidate Image'
          onChange={(text) => {
            changeDisable(candidateNameRef.current.value == "" ||
             candidateImageRef.current.value == "" ||
              candidateDescriptionRef.current.value == "");
        }}
        ></Form.Control>
      </Form.Group>
      <Form.Group className='mb-3'>
        <Form.Label>Candidate Description</Form.Label>
        <Form.Control
          ref={candidateDescriptionRef}
          placeholder='Enter Candidate Description'
          onChange={(text) => {
            changeDisable(candidateNameRef.current.value == "" ||
             candidateImageRef.current.value == "" ||
              candidateDescriptionRef.current.value == "");
        }}
        ></Form.Control>
      </Form.Group>
    </Form>

    <Button
     className='btn-primary'
      disabled={disableButton}
      onClick={addNewCandidate}
    >
      Submit
    </Button>
   
  </Container>
    )
  }