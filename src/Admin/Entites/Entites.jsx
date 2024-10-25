import React, { createContext, useContext, useEffect, useState } from "react";
import {
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Slide,
  Snackbar,
  Alert,
  CircularProgress,
  Box,
  circularProgressClasses,
  FormControl,
  InputLabel,
  OutlinedInput,
  MenuItem,
  Select,
  Autocomplete,
  ListSubheader,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import List from "@mui/material/List";

import Grid from "@mui/material/Grid";

import axios from "axios";
import { AppThemeContext } from "../AdminMainPage";
import { AuthenticatedUserContext } from "../../App";

const Demo = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Entite = React.lazy(() => import("./Entite"));
export const EditEntiteIdContext = createContext();
export const DeleteEntiteIdContext = createContext();
const Entites = () => {
  const authenticatedUser = useContext(AuthenticatedUserContext)[0];
  //=========================STATES===========================
  const [editEntiteId, setEditEntiteId] = useState(null);
  const appTheme = useContext(AppThemeContext)[0];
  const [deleteEntiteId, setDeleteEntiteId] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [showAddSnackBar, setAddShowSnackBar] = useState(false);
  const [showUpdateSnackBar, setUpdateShowSnackBar] = useState(false);
  const [showDeleteSnackBar, setDeleteShowSnackBar] = useState(false);
  const [entites, setEntites] = useState([]);
  const [newLabel, setNewLabel] = useState("");
  const [newTypeId, setNewTypeId] = useState(null);
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reloading, setReloading] = useState(false);

  const [formState, setFormState] = useState({
    label: "",
    typeId: null,
    entiteSupe: null,
  });
  const [error, setError] = useState({ hasError: false, message: "" });

  //========================================STATES========================================
  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false);
    setDeleteEntiteId(null);
  };

  const handleAddSnackBarOpen = () => {
    setAddShowSnackBar(true);
  };
  const handleDeleteSnackBarOpen = () => {
    setDeleteShowSnackBar(true);
    setDeleteEntiteId(null);
  };

  const handleUpdateSnackBarOpen = () => {
    setUpdateShowSnackBar(true);
  };
  const handleAddSnackBarClose = () => {
    setAddShowSnackBar(false);
    setDeleteEntiteId(null);
  };
  const handleDeleteSnackBarClose = () => {
    setDeleteShowSnackBar(false);
    setDeleteEntiteId(null);
  };

  const handleUpdateSnackBarClose = () => {
    setUpdateShowSnackBar(false);
  };

  const handleFormStateChange = (e) => {
    const { name, value } = e.target;
    setFormState((pre) => ({ ...pre, [name]: value }));
  };
  //===================================BACKEND======================================
  const handleAddEntitesubmit = async (e) => {
    e.preventDefault();
    if (formState.label.trim().length === 0) {
      setError({ hasError: true, message: "saisir un nom" });
      return;
    }
    if (
      entites.find(
        (t) => t["name"].toLowerCase() === formState.label.toLowerCase()
      )
    ) {
      setError({
        hasError: true,
        message: "entite deja existe avec ce nom",
      });
      return;
    }
    try {
      if (formState.entiteSupe === null) {
        const response = await axios.post(
          `http://localhost:8888/EMPLOYE-SERVICE/entites`,
          {
            name: formState.label,
            typeId: formState.typeId,
          },
          {
            headers: {
              Authorization: `Bearer ${authenticatedUser["access-token"]}`,
            },
          }
        );
        if (response.status === 200) {
          console.log(response);
          handleAddSnackBarOpen();
          setFormState({
            label: "",
            typeId: null,
            entiteSupe: null,
          });
          setReloading((pre) => !pre);
        }
      } else {
        const response = await axios.post(
          `http://localhost:8888/EMPLOYE-SERVICE/entites/${formState.entiteSupe}/ajouter-sous-entite`,
          {
            name: formState.label,
            typeId: formState.typeId,
          },
          {
            headers: {
              Authorization: `Bearer ${authenticatedUser["access-token"]}`,
            },
          }
        );
        if (response.status === 200) {
          console.log(response);
          handleAddSnackBarOpen();
          setFormState({
            label: "",
            typeId: null,
            entiteSupe: null,
          });
          setReloading((pre) => !pre);
        }
      }
    } catch (error) {
      console.error("Error posting entites", error);
      throw error;
    }
  };

  const handleDeleteEntitesubmit = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:8888/EMPLOYE-SERVICE/entites/${deleteEntiteId}`,
        {
          headers: {
            Authorization: `Bearer ${authenticatedUser["access-token"]}`,
          },
        }
      );
      if (response.status === 200) {
        console.log(response);
        handleDeleteSnackBarOpen();
        handleDeleteDialogClose();
        setDeleteEntiteId(null);
        setReloading((pre) => !pre);
      }
    } catch (error) {
      console.error("Error deleting entites ", error);
      throw error;
    }
  };

  const handleUpdateEntitesubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `http://localhost:8888/EMPLOYE-SERVICE/entites/${editEntiteId}`,
        {
          name: newLabel,
          typeId: newTypeId,
        },
        {
          headers: {
            Authorization: `Bearer ${authenticatedUser["access-token"]}`,
          },
        }
      );
      if (response.status === 200) {
        console.log(response);
        handleUpdateSnackBarOpen();
        setEditEntiteId(null);
        setReloading((pre) => !pre);
      }
    } catch (error) {
      console.error("Error updating entites ", error);
      throw error;
    }
  };

  const getSubEntities = (entiteId) => {
    const foundEntities = entites.filter((e) => e["entiteMereId"] === entiteId);
    return foundEntities;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [typesResponse, entitesResponse] = await Promise.all([
          axios.get("http://localhost:8888/EMPLOYE-SERVICE/types", {
            headers: {
              Authorization: `Bearer ${authenticatedUser["access-token"]}`,
            },
          }),
          axios.get("http://localhost:8888/EMPLOYE-SERVICE/entites", {
            headers: {
              Authorization: `Bearer ${authenticatedUser["access-token"]}`,
            },
          }),
        ]);
        setTypes(typesResponse.data);
        setEntites(entitesResponse.data);
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchDataOnReload = async () => {
      try {
        const [typesResponse, entitesResponse] = await Promise.all([
          axios.get("http://localhost:8888/EMPLOYE-SERVICE/types", {
            headers: {
              Authorization: `Bearer ${authenticatedUser["access-token"]}`,
            },
          }),
          axios.get("http://localhost:8888/EMPLOYE-SERVICE/entites", {
            headers: {
              Authorization: `Bearer ${authenticatedUser["access-token"]}`,
            },
          }),
        ]);
        setTypes(typesResponse.data);
        setEntites(entitesResponse.data);
        console.log(entitesResponse.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchDataOnReload();
  }, [reloading]);

  const handleEntiteSup = (newValue) => {
    let entiteId = entites.find((e) => e["name"] === newValue)?.id;
    setFormState((pre) => ({ ...pre, entiteSupe: entiteId }));
  };

  if (loading) {
    return (
      <Box sx={{ position: "relative" }}>
        <CircularProgress
          variant="indeterminate"
          disableShrink
          sx={{
            color: (theme) =>
              theme.palette.mode === "light" ? "#1a90ff" : "#308fe8",
            animationDuration: "550ms",
            position: "absolute",
            left: 0,
            [`& .${circularProgressClasses.circle}`]: {
              strokeLinecap: "round",
            },
          }}
          size={40}
          thickness={4}
        />
      </Box>
    );
  }
  return (
    <DeleteEntiteIdContext.Provider value={[deleteEntiteId, setDeleteEntiteId]}>
      <EditEntiteIdContext.Provider value={[editEntiteId, setEditEntiteId]}>
        <div className="container p-3">
          <form method="post" onSubmit={handleAddEntitesubmit}>
            <div className="row  mb-3">
              <div className="col-md-4">
                <TextField
                  sx={{
                    width: "100%",
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: appTheme !== "light" ? "#FFFFFF" : "", // Default border color
                      },
                      "& input::placeholder": {
                        color: appTheme !== "light" ? "#FFFFFF" : "", // Placeholder color
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: appTheme !== "light" ? "#FFFFFF" : "", // Label color
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: appTheme !== "light" ? "#FFFFFF" : "", // Label color when focused
                    },
                    "& input": {
                      color: appTheme !== "light" ? "#FFFFFF" : "#000000", // Text color
                    },
                  }}
                  id="outlined-basic"
                  error={error.hasError}
                  label="label"
                  name="label"
                  helperText={error.message}
                  value={formState.label}
                  onChange={handleFormStateChange}
                  variant="outlined"
                />
              </div>
              <div className="col-md-3">
                <FormControl
                  sx={{
                    width: "100%",
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: appTheme !== "light" ? "#FFFFFF" : "", // Default border color
                      },
                      "& input::placeholder": {
                        color: appTheme !== "light" ? "#FFFFFF" : "", // Placeholder color
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: appTheme !== "light" ? "#FFFFFF" : "", // Label color
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: appTheme !== "light" ? "#FFFFFF" : "", // Label color when focused
                    },
                    "& input": {
                      color: appTheme !== "light" ? "#FFFFFF" : "#000000", // Text color
                    },
                  }}
                >
                  <InputLabel id="demo-multiple-name-label">Type</InputLabel>
                  <Select
                    labelId="demo-multiple-name-label"
                    id="demo-multiple-name"
                    name="typeId"
                    value={formState.typeId}
                    onChange={handleFormStateChange}
                    input={
                      <OutlinedInput
                        label="Type"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                              borderColor:
                                appTheme !== "light" ? "#FFFFFF" : "", // Default border color
                            },
                            "& input::placeholder": {
                              color: appTheme !== "light" ? "#FFFFFF" : "", // Placeholder color
                            },
                          },
                          "& .MuiInputLabel-root": {
                            color: appTheme !== "light" ? "#FFFFFF" : "", // Label color
                          },
                          "& .MuiInputLabel-root.Mui-focused": {
                            color: appTheme !== "light" ? "#FFFFFF" : "", // Label color when focused
                          },
                          "& input": {
                            color: appTheme !== "light" ? "#FFFFFF" : "#000000", // Text color
                          },
                        }}
                      />
                    }
                  >
                    {types.map((c) => (
                      <MenuItem key={c.id} value={c.id}>
                        {c.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div className="col-md-3">
                <Autocomplete
                  sx={{
                    width: "100%",
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: appTheme !== "light" ? "#FFFFFF" : "", // Default border color
                      },
                      "& input::placeholder": {
                        color: appTheme !== "light" ? "#FFFFFF" : "", // Placeholder color
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: appTheme !== "light" ? "#FFFFFF" : "", // Label color
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: appTheme !== "light" ? "#FFFFFF" : "", // Label color when focused
                    },
                    "& input": {
                      color: appTheme !== "light" ? "#FFFFFF" : "#000000", // Text color
                    },
                  }}
                  disablePortal
                  id="combo-box-demo"
                  options={entites.map((e) => e["name"])}
                  onChange={(event, newValue) => handleEntiteSup(newValue)}
                  renderInput={(params) => (
                    <TextField {...params} label="Entité supérieure" />
                  )}
                />
              </div>
              <div className="col-md-2 mt-2">
                <Button
                  color="primary"
                  variant="contained"
                  type="submit"
                  sx={{ textTransform: "lowercase" }}
                >
                  ajouter
                </Button>
              </div>
            </div>
          </form>
          <h3 className="mt-3 mb-3">Liste des entites</h3>
          <Grid item xs={12} md={6}>
            <Demo>
              <List
                sx={{ width: "100%" }}
                component="nav"
                aria-labelledby="nested-list-subheader"
                className={`${
                  appTheme === "light" ? "text-bg-light" : "text-bg-dark"
                }`}
                subheader={
                  <ListSubheader
                    component="div"
                    id="nested-list-subheader"
                    className={`${
                      appTheme === "light" ? "text-bg-light" : "text-bg-dark"
                    }`}
                  >
                    Arboresence des entites
                  </ListSubheader>
                }
              >
                {entites.map((e) => (
                  <Entite
                    key={e["id"]}
                    entite={e}
                    subEntites={getSubEntities(e["id"])}
                    entites={entites}
                    types={types}
                  />
                ))}
              </List>
            </Demo>
          </Grid>
          <Dialog
            open={deleteEntiteId !== null}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleDeleteDialogClose}
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle>Etês-vous sûr de supprimer l'entité </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description">
                {entites.length > 0 &&
                  entites.find((t) => t["id"] === deleteEntiteId)?.name}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleDeleteDialogClose}
                color="secondary"
                variant="text"
              >
                Annuler
              </Button>
              <Button
                onClick={handleDeleteEntitesubmit}
                color="error"
                variant="contained"
              >
                Confirmer
              </Button>
            </DialogActions>
          </Dialog>
          <Snackbar
            open={showUpdateSnackBar}
            autoHideDuration={4000}
            onClose={handleUpdateSnackBarClose}
          >
            <Alert
              onClose={handleUpdateSnackBarClose}
              severity="info"
              variant="filled"
              sx={{ width: "100%" }}
            >
              Entite modifie avec succes!
            </Alert>
          </Snackbar>
          <Snackbar
            open={showAddSnackBar}
            autoHideDuration={4000}
            onClose={handleAddSnackBarClose}
          >
            <Alert
              onClose={handleAddSnackBarClose}
              severity="success"
              variant="filled"
              sx={{ width: "100%" }}
            >
              Entites ajoute avec succes!
            </Alert>
          </Snackbar>
          <Snackbar
            open={showDeleteSnackBar}
            autoHideDuration={4000}
            onClose={handleDeleteSnackBarClose}
          >
            <Alert
              onClose={handleDeleteSnackBarClose}
              severity="error"
              variant="filled"
              sx={{ width: "100%" }}
            >
              Entite supprimee avec succes!
            </Alert>
          </Snackbar>
        </div>
      </EditEntiteIdContext.Provider>
    </DeleteEntiteIdContext.Provider>
  );
};

export default React.memo(Entites, (prevProps, nextProps) =>
  Object.is(prevProps, nextProps)
);
