import styled from "styled-components";

const SteamButton = styled.button`
  background: transparent;
  border: none; // removes default border
  outline: none; // removes focus ring
  padding: 0;
  margin: 0;
  cursor: pointer;
  display: inline-block;

  &:hover {
    opacity: 0.9;
  }

  &:focus {
    outline: none;
  }
`;

const SteamImage = styled.img`
  display: block;
  width: 90px;
  height: auto;
`;

const LoginButton = () => {
  const handleLogin = () => {
    window.location.href = "http://localhost:3001/auth/steam";
  };

  return (
    <SteamButton onClick={handleLogin}>
      <SteamImage src="/steam_login.png" alt="Login with Steam" />
    </SteamButton>
  );
};

export default LoginButton;
