import React, { useState } from "react";
import styled from "styled-components";
import { useSearchPlayersQuery } from "../../services/playerProfile";
import { Link } from "react-router-dom";

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 2rem;
`;

const SearchContainer = styled.div`
  width: 100%;
  max-width: 500px;
  background-color: #1e1e1e;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.4);
  color: #f0f0f0;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border-radius: 6px;
  border: 1px solid #444;
  background-color: #2a2a2a;
  color: #fff;
  font-size: 1rem;
`;

const ResultList = styled.ul`
  margin-top: 1rem;
  list-style: none;
  padding: 0;
`;

const PlayerItem = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #fff;
  padding: 0.5rem 0;
  border-bottom: 1px solid #333;

  &:hover {
    background-color: #2d2d2d;
  }
`;

const Avatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 10px;
`;

const ErrorText = styled.p`
  color: red;
  margin-top: 1rem;
`;

export default function PlayerSearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [submittedTerm, setSubmittedTerm] = useState("");
  const {
    data: results = [],
    isFetching,
    error,
  } = useSearchPlayersQuery(submittedTerm, {
    skip: !submittedTerm,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmittedTerm(searchTerm.trim());
  };

  return (
    <Wrapper>
      <SearchContainer>
        <form onSubmit={handleSubmit}>
          <SearchInput
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for player..."
          />
        </form>

        {isFetching && <p style={{ marginTop: "1rem" }}>🔍 Searching...</p>}
        {error && <ErrorText>Error: {error.message}</ErrorText>}

        <ResultList>
          {[...results]
            .sort(
              (a, b) =>
                new Date(b.last_match_time) - new Date(a.last_match_time)
            )
            .map((player) => (
              <li key={player.account_id}>
                <PlayerItem to={`/player/${player.account_id}`}>
                  <Avatar src={player.avatarfull} alt={player.personaname} />
                  {player.personaname} ({player.account_id})
                </PlayerItem>
              </li>
            ))}
        </ResultList>
      </SearchContainer>
    </Wrapper>
  );
}
