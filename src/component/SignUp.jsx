import React, { useState } from "react";

import {
  Box,
  Button,
  CircularProgress,
  circularProgressClasses,
} from "@mui/material";
import "../App.css";
import { Link, useNavigate } from "react-router-dom";
import CustomSnackBar from "../Admin/CustomSnackBar";
import axios from "axios";

const SignUp = () => {
  const navigator = useNavigate();
  const [signUpFormState, setSignUpFormState] = useState({
    email: "",
    password: "",
  });

  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const handleCloseSnackBar = () => setSnackBarOpen(false);
  const handleOpenSnackBar = () => setSnackBarOpen(true);
  const [type, setType] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSignUpFormStateChange = (event) => {
    const { name, value } = event.target;
    setSignUpFormState((pre) => ({ ...pre, [name]: value }));
  };

  const handleCreateSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8888/AUTH-SERVICE/auth/create",
        {
          email: signUpFormState.email,
          password: signUpFormState.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        setType("success");
        setMessage("compte créer avec succès");
        handleOpenSnackBar();
        setTimeout(() => {
          navigator("/login");
        }, 2000);
      }
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container-fluid p-0 m-0"
      style={{
        backgroundColor: "#010238",
        minHeight: "100vh",
        width: "100%",
        alignContent: "center",
        position: "relative",
      }}
    >
      <div style={{ zIndex: 1, position: "absolute" }} className="container">
        <div className="row">
          <div className="col-4 offset-3 ">
            <div
              className="bg-primary"
              style={{
                width: "200px",
                height: "200px",
                borderRadius: "50%",
              }}
            ></div>
          </div>
        </div>
        <div className="row  mt-5"></div>
        <div className="row justify-content-end ">
          <div className="col-3 ">
            <div
              className="bg-primary"
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
              }}
            ></div>
          </div>
        </div>
        <div className="row ">
          <div className="col-3 offset-1 ">
            <div
              className="bg-primary "
              style={{
                width: "150px",
                height: "150px",
                borderRadius: "50%",
              }}
            ></div>
          </div>
        </div>
      </div>

      <div className="container">
        <div
          className="text-light row col-md-7  mx-auto rounded-5 p-4"
          style={{
            backdropFilter: "blur(10px)",
            backgroundColor: "#CFCFCF33",
            zIndex: 2,
            position: "relative",
          }}
        >
          <div className="text-light fw-bold mb-3 fs-4">Créer un compte</div>

          <center>
            <form method="post" onSubmit={handleCreateSubmit}>
              <div className="mt-3 row col-md-10">
                <p className="text-start mb-1">Email</p>
                <input
                  type="email"
                  className="rounded-5 p-3 loginInput"
                  placeholder="email"
                  name="email"
                  required
                  value={signUpFormState.email}
                  onChange={handleSignUpFormStateChange}
                />
              </div>
              <div className="mt-3 row col-md-10">
                <p className="text-start mb-1">Mot de passe</p>
                <input
                  type="password"
                  className="rounded-5 p-3 loginInput"
                  name="password"
                  required
                  value={signUpFormState.password}
                  onChange={handleSignUpFormStateChange}
                  placeholder="mot de passe"
                />
              </div>
              <div className="mt-3 row col-md-10">
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  className="w-100 text-lowercase text-light p-2 rounded-pill fs-5"
                >
                  {loading && (
                    <Box sx={{ position: "relative" }}>
                      <CircularProgress
                        variant="indeterminate"
                        disableShrink
                        sx={{
                          color: (theme) =>
                            theme.palette.mode === "light"
                              ? "#FFFFFFFF"
                              : "#FFFFFFFF",
                          animationDuration: "750ms",
                          position: "absolute",
                          left: 0,
                          [`& .${circularProgressClasses.circle}`]: {
                            strokeLinecap: "round",
                          },
                        }}
                        size={25}
                        thickness={10}
                      />
                    </Box>
                  )}{" "}
                  Créer
                </Button>
              </div>
            </form>
            <div className="mt-3 row d-flex flex-row mb-1 col-md-10">
              <hr />
              <p>Avez-vous un compte?</p>
            </div>
            <div className="mt-3 row col-md-10">
              <Link to="/login">
                <Button
                  variant="outlined"
                  color="inherit"
                  className="w-100 text-lowercase text-light p-2 rounded-pill fs-6"
                >
                  Se connecter
                </Button>
              </Link>
            </div>
          </center>
        </div>
        <CustomSnackBar
          duration={4000}
          isOpen={snackBarOpen}
          message={message}
          onClose={handleCloseSnackBar}
          type={type}
        />
      </div>
    </div>
  );
};

export default SignUp;
