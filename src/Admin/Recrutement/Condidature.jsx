import { CalendarMonth, Info, RemoveRedEye } from "@mui/icons-material";
import React, { useContext, useEffect, useState } from "react";
import { Alert, Button, Snackbar, TextField } from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import axios from "axios";
import { reloadingNecessiry } from "./Recrutements";
import { AuthenticatedUserContext } from "../../App";
import { AppThemeContext } from "../AdminMainPage";
const Entretien = React.lazy(() => import("./Entretien"));
//=============================COMPONENT======================================================
const Condidature = ({ condidatureId }) => {
  //=========================STATES===============================================
  const authenticatedUser = useContext(AuthenticatedUserContext)[0];
  const [planifierButtonClicked, setPlanifierButtonClicked] = useState(false);
  const [condidature, setCondidature] = useState({});
  const appTheme = useContext(AppThemeContext)[0];
  const [showAddSnackBar, setShowAddSnackBar] = useState(false);
  const [addEntretienFormState, setAddEntretienFormState] = useState({
    label: "",
    description: "",
    dateEntretien: null,
  });
  const [reloading, setReloading] = useContext(reloadingNecessiry);
  //=========================STATES===============================================
  const handleAddEntretienFormStateChange = (e) => {
    const { name, value } = e.target;
    setAddEntretienFormState((pre) => ({ ...pre, [name]: value }));
  };
  const togglePlanifierButton = () => {
    setPlanifierButtonClicked(!planifierButtonClicked);
  };

  const handleAddSnackBarClose = () => {
    setShowAddSnackBar(false);
  };
  const handleAddSnackBarOpen = () => {
    setShowAddSnackBar(true);
  };

  //====================================BACKEND====================================
  const handleAddEntretienSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:8888/RECRUTEMENT-SERVICE/entretiens`,
        {
          ...addEntretienFormState,
          condidatId: condidature.id,
        },
        {
          headers: {
            Authorization: `Bearer ${authenticatedUser["access-token"]}`,
          },
        }
      );
      if (response.status === 200) {
        handleAddSnackBarOpen();
        togglePlanifierButton();
        setAddEntretienFormState({
          label: "",
          description: "",
          dateEntretien: null,
        });
        setReloading((pre) => !pre);
      }
    } catch (err) {
      console.error(err);
    }
  };

  //========================================BACKEND==================================
  useEffect(() => {
    const getCondidatureById = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8888/RECRUTEMENT-SERVICE/condidatures/${condidatureId}`,
          {
            headers: {
              Authorization: `Bearer ${authenticatedUser["access-token"]}`,
            },
          }
        );
        setCondidature(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    if (condidatureId) {
      getCondidatureById();
    }
  }, [condidatureId, reloading]);

  return (
    <div className="rounded-4 border border-1 p-4 border-secondary">
      <div className="row">
        <div className="col-md-6 mb-3">
          <div className="row">
            <div className="col-5 fw-bold">Nom:</div>
            <div className="col-7">{condidature["nom"]}</div>
          </div>
        </div>
        <div className="col-md-6 mb-3">
          <div className="row">
            <div className="col-5 fw-bold">Prenom:</div>
            <div className="col-7">{condidature["prenom"]}</div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6 mb-3">
          <div className="row">
            <div className="col-5 fw-bold">Email:</div>
            <div className="col-7">{condidature["email"]}</div>
          </div>
        </div>
        <div className="col-md-6 mb-3">
          <div className="row">
            <div className="col-5 fw-bold">Tel:</div>
            <div className="col-7">{condidature["tel"]}</div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6 mb-3">
          <div className="row">
            <div className="col-5 fw-bold">Adresse:</div>
            <div className="col-7">{condidature["adresse"]}</div>
          </div>
        </div>
        <div className="col-md-6 mb-3">
          <div className="row">
            <div className="col-5 fw-bold">Ville:</div>
            <div className="col-7">{condidature["ville"]}</div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6 mb-3">
          <div className="row">
            <div className="col-5 fw-bold">Genre:</div>
            <div className="col-7">{condidature["genre"]}</div>
          </div>
        </div>
        <div className="col-md-6 mb-3">
          <div className="row">
            <div className="col-5 fw-bold">date de condidature:</div>
            <div className="col-7">{condidature["dateCondidature"]}</div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6 mb-3">
          <div className="row">
            <div className="col-5 fw-bold">Motivation:</div>
            <div className="col-7">{condidature["motivation"]}</div>
          </div>
        </div>
        <div className="col-md-6 mb-3">
          <div className="row">
            <div className="col-5 fw-bold">CV:</div>
            <div className="col-7">
              <Button
                onClick={() => {
                  window.open(
                    `http://localhost:8888/RECRUTEMENT-SERVICE/condidatures/CV/${condidature.id}`
                  );
                }}
                color="info"
                sx={{ textTransform: "lowercase" }}
                variant="contained"
              >
                <RemoveRedEye /> Voir CV
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="col-12 mt-2 mb-2 text-primary fw-bold">
        <Info color="primary" fontSize="large" sx={{ mr: 1 }} />
        {condidature["entretiens"]?.length === 0
          ? "aucun entretien"
          : `${condidature["entretiens"]?.length}
        entretiens existent deja: ${
          condidature["entretiens"]?.filter(
            (e) => e["etatEntretien"] === "PLANIFIE"
          )?.length
        } planifies , ${
              condidature["entretiens"]?.filter(
                (e) => e["etatEntretien"] === "PASSE"
              )?.length
            } passes , ${
              condidature["entretiens"]?.filter(
                (e) => e["etatEntretien"] === "ANNULE"
              )?.length
            } annules`}
      </div>
      {condidature["entretiens"]?.length > 0 && (
        <div className="row fw-bold">
          <div className="col-md-2 mb-2">titre</div>
          <div className="col-md-3 mb-2">description</div>
          <div className="col-md-2 mb-2">date</div>
          <div className="col-md-1 mb-2">etat</div>
          <div className="col-md-2 mb-2">score</div>
          <div className="col-md-2 mb-2">actions</div>
        </div>
      )}

      {condidature["entretiens"]?.map((e) => (
        <Entretien key={e["id"]} entretien={e} />
      ))}
      <div className="row">
        <Button
          color="secondary"
          onClick={togglePlanifierButton}
          variant="contained"
        >
          <CalendarMonth sx={{ mr: 1 }} />
          Planifier un entretien
        </Button>
      </div>
      {planifierButtonClicked && (
        <form method="post" onSubmit={handleAddEntretienSubmit}>
          <div className="border col-12 col-md-8 mt-3 mx-auto border-1 rounded-4 border-secondary-subtle p-3">
            <div className="col-12 col-md-10  mx-auto mt-2 mb-3">
              <TextField
                sx={{
                  width: "100%",
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: appTheme !== "light" ? "#FFFFFF" : "",
                      borderRadius: "10px",
                    },
                    "& input::placeholder": {
                      color: appTheme !== "light" ? "#FFFFFF" : "",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: appTheme !== "light" ? "#FFFFFF" : "",
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: appTheme !== "light" ? "#FFFFFF" : "",
                  },
                  "& input": {
                    color: appTheme !== "light" ? "#FFFFFF" : "#000000",
                    borderRadius: "10px", // Text color
                  },
                }}
                id="outlined-basic"
                label="Label"
                name="label"
                value={addEntretienFormState.label}
                onChange={handleAddEntretienFormStateChange}
                variant="outlined"
                className="me-2"
              />
            </div>
            <div className="col-12 col-md-10  mx-auto mt-2 mb-3">
              <TextField
                sx={{
                  width: "100%",
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: appTheme !== "light" ? "#FFFFFF" : "",
                      borderRadius: "10px",
                    },
                    "& input::placeholder": {
                      color: appTheme !== "light" ? "#FFFFFF" : "",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: appTheme !== "light" ? "#FFFFFF" : "",
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: appTheme !== "light" ? "#FFFFFF" : "",
                  },
                  "& input": {
                    color: appTheme !== "light" ? "#FFFFFF" : "#000000",
                    borderRadius: "10px", // Text color
                  },
                }}
                id="outlined-basic"
                label="description"
                name="description"
                value={addEntretienFormState.description}
                onChange={handleAddEntretienFormStateChange}
                variant="outlined"
                className="me-2"
              />
            </div>
            <div className="col-12 col-md-10  mx-auto mb-3">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="Date d'entretien"
                  sx={{
                    width: "100%",
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: appTheme !== "light" ? "#FFFFFF" : "",
                        borderRadius: "10px",
                      },
                      "& input::placeholder": {
                        color: appTheme !== "light" ? "#FFFFFF" : "",
                      },
                    },
                    "& .MuiSvgIcon-root": {
                      color: appTheme !== "light" ? "#FFFFFF" : "#000000",
                    },
                    "& .MuiInputLabel-root": {
                      color: appTheme !== "light" ? "#FFFFFF" : "",
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: appTheme !== "light" ? "#FFFFFF" : "",
                    },
                    "& input": {
                      color: appTheme !== "light" ? "#FFFFFF" : "#000000",
                      borderRadius: "10px", // Text color
                    },
                  }}
                  value={addEntretienFormState.dateEntretien}
                  onChange={(newValue) =>
                    setAddEntretienFormState((pre) => ({
                      ...pre,
                      dateEntretien: newValue,
                    }))
                  }
                />
              </LocalizationProvider>
            </div>
            <div className="col-12 col-md-10 row  mx-auto mb-3">
              <Button
                type="submit"
                variant="contained"
                color="success"
                sx={{ textTransform: "lowercase" }}
              >
                Confirmer
              </Button>
            </div>
          </div>
        </form>
      )}
      <Snackbar
        open={showAddSnackBar}
        autoHideDuration={6000}
        onClose={handleAddSnackBarClose}
      >
        <Alert
          onClose={handleAddSnackBarClose}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Entretien ajoute avec succes!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default React.memo(Condidature, (prevProps, nextProps) =>
  Object.is(prevProps, nextProps)
);
