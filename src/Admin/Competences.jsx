import React, { useContext, useEffect, useState } from "react";
import {
  TextField,
  Button,
  Stack,
  Tooltip,
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
} from "@mui/material";
import { styled } from "@mui/material/styles";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import FolderIcon from "@mui/icons-material/Folder";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import { AppThemeContext } from "./AdminMainPage";
import { AuthenticatedUserContext } from "../App";
const Demo = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Competences = () => {
  //=========================STATES===========================
  const authenticatedUser = useContext(AuthenticatedUserContext)[0];
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [showAddSnackBar, setAddShowSnackBar] = useState(false);
  const [showUpdateSnackBar, setUpdateShowSnackBar] = useState(false);
  const [showDeleteSnackBar, setDeleteShowSnackBar] = useState(false);
  const [competenceLabel, setCompetenceLabel] = useState("");
  const [competenceDescription, setCompetenceDescription] = useState("");
  const [competences, setCompetences] = useState([]);
  const [newLabel, setNewLabel] = useState("");
  const [loading, setLoading] = useState(true);
  const [reloading, setReloading] = useState(false);
  const appTheme = useContext(AppThemeContext)[0];
  const [error, setError] = useState({ hasError: false, message: "" });
  const handleDeleteDialogOpen = () => {
    setOpenDeleteDialog(true);
  };
  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false);
  };

  const handleAddCompetenceChange = (e) => {
    const { name, value } = e.target;
    name === "label"
      ? setCompetenceLabel(value)
      : setCompetenceDescription(value);
  };

  const handleAddSnackBarOpen = () => {
    setAddShowSnackBar(true);
  };
  const handleDeleteSnackBarOpen = () => {
    setDeleteShowSnackBar(true);
  };

  const handleUpdateSnackBarOpen = () => {
    setUpdateShowSnackBar(true);
  };
  const handleAddSnackBarClose = () => {
    setAddShowSnackBar(false);
  };
  const handleDeleteSnackBarClose = () => {
    setDeleteShowSnackBar(false);
  };

  const handleUpdateSnackBarClose = () => {
    setUpdateShowSnackBar(false);
  };

  const handleDeleteItem = (index) => {
    setDeleteItem(index);
  };

  const handleEditItem = (index) => {
    setEditItem(index);
    const item = competences.find((t) => t["id"] === index);
    setNewLabel(item?.label);
  };
  const handleNewLabelChange = (e) => {
    setNewLabel(e.target.value);
  };
  //===================================BACKEND======================================
  const handleAddCompetenceSubmit = async (e) => {
    e.preventDefault();
    if (competenceLabel.trim().length === 0) {
      setError({ hasError: true, message: "saisir un label" });
      return;
    }
    if (
      competences.find(
        (t) => t["label"].toLowerCase() === competenceLabel.toLowerCase()
      )
    ) {
      setError({
        hasError: true,
        message: "competence deja existe avec ce label",
      });
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8888/FORMATION-SERVICE/competences?label=${competenceLabel}&description=${competenceDescription}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authenticatedUser["access-token"]}`,
          },
        }
      );
      if (response.status === 200) {
        console.log(response.data);
        handleAddSnackBarOpen();
        setReloading((pre) => !pre);
        setCompetenceLabel("");
        setCompetenceDescription("");
      }
    } catch (error) {
      console.error("Error posting competence", error);
      throw error;
    }
  };

  const handleDeleteCompetenceSubmit = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:8888/FORMATION-SERVICE/competences/${deleteItem}`,
        {
          headers: {
            Authorization: `Bearer ${authenticatedUser["access-token"]}`,
          },
        }
      );
      if (response.status === 200) {
        handleDeleteSnackBarOpen();
        handleDeleteDialogClose();
        handleDeleteItem(null);
        setReloading((pre) => !pre);
      }
    } catch (error) {
      console.error("Error deleting competence ", error);
      throw error;
    }
  };

  const handleUpdateCompetenceSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:8888/FORMATION-SERVICE/competences/${editItem}`,
        {
          label: newLabel,
          description: competenceDescription,
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
        handleEditItem(null);
        setReloading((pre) => !pre);
      }
    } catch (error) {
      console.error("Error updating competence ", error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchCompetences = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8888/FORMATION-SERVICE/competences",
          {
            headers: {
              Authorization: `Bearer ${authenticatedUser["access-token"]}`,
            },
          }
        );
        setCompetences(response.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCompetences();
  }, []);

  useEffect(() => {
    const fetchCompetences = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8888/FORMATION-SERVICE/competences",
          {
            headers: {
              Authorization: `Bearer ${authenticatedUser["access-token"]}`,
            },
          }
        );
        setCompetences(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    if (reloading) {
      fetchCompetences();
    }
  }, [reloading]);

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
    <div className="container p-3">
      <form method="post" onSubmit={handleAddCompetenceSubmit}>
        <div className="row mb-3">
          <div className="col-md-5">
            <TextField
              sx={{
                width: "100%",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: appTheme !== "light" ? "#FFFFFF" : "",
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
                },
              }}
              error={error.hasError}
              label="Label"
              name="label"
              value={competenceLabel}
              helperText={error.message}
              onChange={handleAddCompetenceChange}
              variant="outlined"
              className="mb-2"
            />
          </div>
          <div className="col-md-5">
            <TextField
              multiline
              sx={{
                width: "100%",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: appTheme !== "light" ? "#FFFFFF" : "",
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
                },
              }}
              error={error.hasError}
              label="Description"
              name="description"
              value={competenceDescription}
              helperText={error.message}
              onChange={handleAddCompetenceChange}
              variant="outlined"
              className="me-2"
            />
          </div>
          <div className="col-md-2 mt-2">
            <Button
              color="primary"
              variant="contained"
              type="submit"
              sx={{ textTransform: "lowercase" }}
            >
              + ajouter
            </Button>
          </div>
        </div>
      </form>
      <h3 className="mt-3 mb-3">Liste des competences</h3>
      <Grid item xs={12} md={6}>
        <Demo>
          <List
            dense={false}
            className={`${
              appTheme === "light" ? "text-bg-light" : "text-bg-dark"
            }`}
          >
            {competences.length > 0 &&
              competences.map((competence) => (
                <ListItem
                  className="border border-1 rounded-4 mb-2 "
                  key={competence["id"]}
                  secondaryAction={
                    competence["id"] === editItem ? (
                      <Button
                        variant="text"
                        className="text-lowercase"
                        color="warning"
                        onClick={() => handleEditItem(null)}
                      >
                        annuler
                      </Button>
                    ) : (
                      <Stack direction="row" spacing="4">
                        <Tooltip title="supprimer">
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={() => {
                              handleDeleteItem(competence["id"]);
                              handleDeleteDialogOpen();
                            }}
                          >
                            <DeleteIcon color="error" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="modifier">
                          <IconButton
                            edge="end"
                            aria-label="edit"
                            onClick={() => handleEditItem(competence["id"])}
                          >
                            <EditIcon color="success" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    )
                  }
                >
                  <ListItemAvatar>
                    <Avatar>
                      <FolderIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={competence["label"]}
                    secondary={
                      editItem === competence["id"] ? (
                        <form
                          method="post"
                          onSubmit={handleUpdateCompetenceSubmit}
                        >
                          <div className="row">
                            <div className="col-md-3 mt-2 mb-2">
                              <TextField
                                id="outlined-basic"
                                label="nouveau label"
                                variant="outlined"
                                value={newLabel}
                                onChange={handleNewLabelChange}
                                autoFocus
                                required
                                className="me-2"
                              />
                            </div>
                            <div className="col-md-1 mt-3 text-lowercase mb-2">
                              <Button
                                color="primary"
                                type="submit"
                                variant="outlined"
                              >
                                modifier
                              </Button>
                            </div>
                          </div>
                        </form>
                      ) : null
                    }
                  />
                </ListItem>
              ))}
          </List>
        </Demo>
      </Grid>
      <Dialog
        open={openDeleteDialog}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleDeleteDialogClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>Etes-vous sur de supprimer le competence</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {competences.length > 0 &&
              competences.find((t) => t["id"] === deleteItem)?.label}
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
            onClick={handleDeleteCompetenceSubmit}
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
          Competence modifie avec succes!
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
          Competence ajoute avec succes!
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
          Competence supprime avec succes!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Competences;
