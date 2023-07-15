import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { CircularProgress } from "@mui/material";

const Logger = () => {
  const [searchParam] = useSearchParams();

  const [cookies, setCookie, removeCookie] = useCookies(["jwt"]);

  const navigator = useNavigate();

  useEffect(() => {
    if (searchParam.get("token")) {
      const token = searchParam.get("token");
      //   cookies.set("jwt", token);
      removeCookie("jwt");
      setCookie("jwt", `${token}`, domain=process.env.REACT_APP_BASE_BACKEND_URL);
    }
  });

  useEffect(() => {
    if (cookies.jwt) {
      navigator("/dashboard");
    }
  }, [cookies]);

  return (
    <>
      <div className="backgound_main">
        <CircularProgress />
      </div>
    </>
  );
};

export default Logger;
