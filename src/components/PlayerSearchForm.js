import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setPlayerId } from "../features/counter/playerSlice";
import styled from "styled-components";

const Container = styled.div`
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.8);
  text-align: center;
  margin-top: 10rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Input = styled.input`
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

const Button = styled.button`
  background: #007bff;
  color: white;
  padding: 8px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background: #0056b3;
  }
`;

const PlayerSearchForm = () => {
  const [inputId, setInputId] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputId) return;
    dispatch(setPlayerId(inputId)); // Update Redux store
  };

  return (
    <Container>
      <h2>Search Dota Player</h2>
      <h5>Neptune ID: 112456116</h5>
      <h5>MERTKD ID: 133349867</h5>
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Enter Player ID"
          value={inputId}
          onChange={(e) => setInputId(e.target.value)}
        />
        <Button type="submit">Search</Button>
      </Form>
    </Container>
  );
};

export default PlayerSearchForm;
