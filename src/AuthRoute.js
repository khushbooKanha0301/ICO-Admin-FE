import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const AuthRoute = ({ children }) => {
  const authToken = useSelector(
    (state) => state.authenticationReducer?.authToken
  );
  return authToken ? children : <Navigate to={"/"} />;
};

export default AuthRoute;
