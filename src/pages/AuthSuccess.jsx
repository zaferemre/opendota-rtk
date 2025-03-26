// AuthSuccess.js
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../features/counter/steam/authSlice";
import { useNavigate } from "react-router-dom";

const AuthSuccess = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const steamid = params.get("steamid");
    const username = params.get("username");

    if (steamid && username) {
      dispatch(loginSuccess({ steamid, username }));
      navigate("/");
    }
  }, []);

  return <div> Logging you in ... </div>;
};

export default AuthSuccess;
