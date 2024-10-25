import { DeleteOutlined, Edit } from "@mui/icons-material";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Slide,
  Slider,
  Snackbar,
  TextField,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import React, { useContext, useEffect, useState } from "react";
import dayjs from "dayjs";
import { reloadingNecessiry } from "./Recrutements";
import axios from "axios";
import { AuthenticatedUserContext } from "../../App";
import { AppThemeContext } from "../AdminMainPage";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
function valuetext(value) {
  return `${value}`;
}

const Entretien = ({ entretien }) => {
  //=============================STATES====================================
  const authenticatedUser = useContext(AuthenticatedUserContext)[0];
  const appTheme = useContext(AppThemeContext)[0];
  const [formState, setFormState] = useState({
    label: "",
    description: "",
    dateEntretien: null,
    etatEntretien: "PLANIFIE",
  });
  const [evaluationState, setEvaluationState] = useState({
    score: 10,
    avis: "",
  });
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [showEditSnackBar, setEditShowSnackBar] = useState(false);
  const [showDeleteSnackBar, setDeleteShowSnackBar] = useState(false);
  const [reloading, setReloading] = useContext(reloadingNecessiry);
  //==============================STATES=========================================
  const handleEditSnackBarClose = () => {
    setEditShowSnackBar(false);
  };
  const handleDeleteSnackBarClose = () => {
    setDeleteShowSnackBar(false);
  };
  const handleDeleteSnackBarOpen = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:8888/RECRUTEMENT-SERVICE/entretiens/${entretien.id}`,
        {
          headers: {
            Authorization: `Bearer ${authenticatedUser["access-token"]}`,
          },
        }
      );
      if (response.status === 200) {
        console.log(response);
        setDeleteShowSnackBar(true);
        handleDeleteClose();
        setReloading((pre) => !pre);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditOpen = () => {
    setOpenEdit(true);
  };

  const handleDeleteOpen = () => {
    setOpenDelete(true);
  };

  const handleEditClose = () => {
    setOpenEdit(false);
  };

  const handleDeleteClose = () => {
    setOpenDelete(false);
  };
  const handleEditSnackBarOpen = async () => {
    try {
      if (entretien["evaluation"] == null) {
        const response = await axios.put(
          `http://localhost:8888/RECRUTEMENT-SERVICE/entretiens/${entretien.id}?etatEntretien=${formState.etatEntretien}`,
          {
            label: formState.label,
            dateEntretien: formState.dateEntretien,
            description: formState.description,
            condidatId: entretien.condidatId,
          },
          {
            headers: {
              Authorization: `Bearer ${authenticatedUser["access-token"]}`,
            },
          }
        );
        if (response.status === 200) {
          if (formState.etatEntretien === "PASSE") {
            const response2 = await axios.post(
              `http://localhost:8888/RECRUTEMENT-SERVICE/entretiens/entretien-evaluation`,
              {
                score: evaluationState.score,
                entretienId: entretien.id,
                avis: evaluationState.avis,
              },
              {
                headers: {
                  Authorization: `Bearer ${authenticatedUser["access-token"]}`,
                },
              }
            );
          }
        }
      } else {
        const response = await axios.put(
          `http://localhost:8888/RECRUTEMENT-SERVICE/entretiens/${entretien.id}?etatEntretien=${formState.etatEntretien}`,
          {
            label: formState.label,
            dateEntretien: formState.dateEntretien,
            description: formState.description,
            condidatId: entretien.condidatId,
          },
          {
            headers: {
              Authorization: `Bearer ${authenticatedUser["access-token"]}`,
            },
          }
        );
        if (response.status === 200) {
          const respons2 = await axios.put(
            `http://localhost:8888/RECRUTEMENT-SERVICE/entretiens/entretien-evaluation/${entretien["evaluation"]?.id}`,
            {
              score: evaluationState.score,
              entretienId: entretien.id,
              avis: evaluationState.avis,
            },
            {
              headers: {
                Authorization: `Bearer ${authenticatedUser["access-token"]}`,
              },
            }
          );
        }
      }
    } catch (err) {
      console.error(err);
    }
    setEditShowSnackBar(true);
    setReloading((pre) => !pre);
    setTimeout(() => {
      setOpenEdit(false);
    }, 1000);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };
  const handleAvisChange = (e) => {
    setEvaluationState({
      avis: e.target.value,
      score: evaluationState.score,
    });
  };

  useEffect(() => {
    setFormState({
      label: entretien["label"],
      description: entretien["description"],
      dateEntretien: dayjs(entretien["dateEntretien"]),
      etatEntretien: entretien["etatEntretien"],
    });
    setEvaluationState({
      score: entretien["evaluation"]?.score,
      avis: entretien["evaluation"]?.avis,
    });
  }, [entretien, reloading]);
  return (
    <>
      {openEdit === false ? (
        <div className="row">
          <div className="col-md-2  mb-2" style={{ fontSize: 14 }}>
            {entretien["label"]}
          </div>
          <div className="col-md-3 mb-2" style={{ fontSize: 14 }}>
            {entretien["description"]}
          </div>
          <div className="col-md-2 mb-2 " style={{ fontSize: 14 }}>
            {entretien["dateEntretien"]}
          </div>
          <div
            className={`col-md-1 text-light text-center ${
              entretien["etatEntretien"] === "PLANIFIE"
                ? "bg-info"
                : entretien["etatEntretien"] === "ANNULE"
                ? "bg-danger"
                : "bg-success"
            } rounded-pill text-lowercase mb-2`}
            style={{ height: 25, fontSize: 14 }}
          >
            {entretien["etatEntretien"]}
          </div>
          <div className="col-md-2 mb-2">
            {entretien["evaluation"] != null
              ? `${entretien["evaluation"]?.score}/100`
              : "pas encore"}
          </div>
          <div className="col-md-2 mb-2">
            <IconButton onClick={handleEditOpen}>
              <Edit fontSize="small" color="primary" />
            </IconButton>
            <IconButton onClick={handleDeleteOpen}>
              <DeleteOutlined fontSize="small" color="error" />
            </IconButton>
          </div>
        </div>
      ) : (
        <div>
          <div className="row">
            <div className="col-md mt-1 mb-1">
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
                label="nouveau titre"
                name="label"
                onChange={handleFormChange}
                value={formState.label}
                variant="outlined"
                className="me-2"
              />
            </div>
            <div className="col-md mt-1 mb-1">
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
                label="nouvelle description"
                variant="outlined"
                name="description"
                value={formState.description}
                onChange={handleFormChange}
                className="me-2"
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md mt-1 mb-1 ">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  name="dateEntretien"
                  onChange={(newValue) =>
                    setFormState({ ...formState, dateEntretien: newValue })
                  }
                  value={formState.dateEntretien}
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
                />
              </LocalizationProvider>
            </div>
            <div className="col-md mt-1 mb-1" style={{ height: 25 }}>
              <FormControl
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
              >
                <InputLabel id="demo-multiple-name-label">
                  Etat entretien
                </InputLabel>
                <Select
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
                  labelId="demo-multiple-name-label"
                  id="demo-multiple-name"
                  name="etatEntretien"
                  value={formState.etatEntretien}
                  onChange={handleFormChange}
                  input={<OutlinedInput label="Etat entretien" />}
                >
                  {["PLANIFIE", "PASSE", "ANNULE"].map((c, index) => (
                    <MenuItem key={index} value={c}>
                      {c}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </div>
          {formState.etatEntretien === "PASSE" && (
            <>
              <div className="row ms-1 fw-bold text-secondary mt-2">
                {entretien["evaluation"] === null
                  ? "ajouter une evaluation"
                  : "modifier l'evaluation"}
              </div>
              <div className="row">
                <div className="col-md">
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
                    id="outlined-basic"
                    label="avis"
                    required={
                      entretien["evaluation"] === null &&
                      formState.etatEntretien === "PASSE"
                    }
                    variant="outlined"
                    name="avis"
                    value={evaluationState.avis}
                    onChange={handleAvisChange}
                  />
                </div>
                <div className="col-md">
                  <p>Score</p>
                  <Slider
                    aria-label="Temperature"
                    getAriaValueText={valuetext}
                    valueLabelDisplay="auto"
                    shiftStep={30}
                    name="score"
                    value={evaluationState.score}
                    onChange={(event, newValue) => {
                      if (typeof newValue === "number") {
                        setEvaluationState((pre) => ({
                          ...pre,
                          score: newValue,
                        }));
                      }
                    }}
                    step={10}
                    marks
                    min={10}
                    max={100}
                  />
                </div>
              </div>
            </>
          )}
          <div className="row">
            <div className="col-md-6 mt-1 mb-1">
              <Button
                color="warning"
                size="large"
                onClick={handleEditSnackBarOpen}
                variant="contained"
                sx={{ textTransform: "lowercase" }}
              >
                modifier
              </Button>
              <Button
                color="secondary"
                size="large"
                onClick={handleEditClose}
                variant="outlined"
                sx={{ textTransform: "lowercase", m: 1 }}
              >
                annuler
              </Button>
            </div>
          </div>
        </div>
      )}
      <Dialog
        open={openDelete}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleDeleteClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>Etes-vous sur de supprimer</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            l'entretien: <span className="fw-bold">{entretien["label"]}</span>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={handleDeleteClose} variant="text">
            Annuler
          </Button>
          <Button
            onClick={handleDeleteSnackBarOpen}
            color="error"
            variant="contained"
          >
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={showEditSnackBar}
        autoHideDuration={6000}
        onClose={handleEditSnackBarClose}
      >
        <Alert
          onClose={handleEditSnackBarClose}
          severity="info"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Entretien modifiee avec succes!
        </Alert>
      </Snackbar>
      <Snackbar
        open={showDeleteSnackBar}
        autoHideDuration={6000}
        onClose={handleDeleteSnackBarClose}
      >
        <Alert
          onClose={handleDeleteSnackBarClose}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Entretien supprimee avec succes!
        </Alert>
      </Snackbar>
    </>
  );
};

export default React.memo(Entretien, (prevProps, nextProps) =>
  Object.is(prevProps, nextProps)
);
