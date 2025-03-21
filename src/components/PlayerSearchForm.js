import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setPlayerId } from "../features/counter/playerSlice";
import styled from "styled-components";

const Container = styled.div`
  max-width: 400px;
  margin: 10rem auto 2rem;
  padding: 32px 24px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08);
  text-align: center;
`;

const Title = styled.h2`
  margin-bottom: 6px;
  font-size: 1.6rem;
  color: #222;
`;

const Hint = styled.p`
  font-size: 0.85rem;
  color: #666;
  margin: 4px 0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  gap: 12px;
`;

const Input = styled.input`
  padding: 12px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const Button = styled.button`
  background: #007bff;
  color: white;
  font-weight: 500;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.25s ease;

  &:hover {
    background: #0056b3;
  }
`;

const PlayerSearchForm = () => {
  const [inputId, setInputId] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputId.trim()) return;
    dispatch(setPlayerId(inputId.trim()));
  };

  return (
    <Container>
      <Title> Search Dota Player </Title> <Hint> Try Neptune→ 112456116 </Hint>{" "}
      <Hint> Try MERTKD→ 133349867 </Hint>{" "}
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Enter Player ID"
          value={inputId}
          onChange={(e) => setInputId(e.target.value)}
        />{" "}
        <Button type="submit"> Search </Button>{" "}
      </Form>{" "}
    </Container>
  );
};

export default PlayerSearchForm;
