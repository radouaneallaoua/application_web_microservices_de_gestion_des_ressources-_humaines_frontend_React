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

const Mutuelles = () => {
  //=========================STATES===========================
  const authenticatedUser = useContext(AuthenticatedUserContext)[0];
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [showAddSnackBar, setAddShowSnackBar] = useState(false);
  const [showUpdateSnackBar, setUpdateShowSnackBar] = useState(false);
  const [showDeleteSnackBar, setDeleteShowSnackBar] = useState(false);
  const [mutuelleLabel, setMutuelleLabel] = useState("");
  const [mutuelles, setMutuelles] = useState([]);
  const [newLabel, setNewLabel] = useState("");
  const [loading, setLoading] = useState(true);
  const appTheme = useContext(AppThemeContext)[0];
  const [reloading, setReloading] = useState(false);
  const [error, setError] = useState({ hasError: false, message: "" });
  const handleDeleteDialogOpen = () => {
    setOpenDeleteDialog(true);
  };
  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false);
  };

  const handleAddMutuelleChange = (e) => {
    setMutuelleLabel(e.target.value);
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
    const item = mutuelles.find((t) => t["id"] === index);
    setNewLabel(item?.label);
  };
  const handleNewLabelChange = (e) => {
    setNewLabel(e.target.value);
  };
  //===================================BACKEND======================================
  const handleAddMutuelleSubmit = async (e) => {
    e.preventDefault();
    if (mutuelleLabel.trim().length === 0) {
      setError({ hasError: true, message: "saisir un label" });
      return;
    }
    if (
      mutuelles.find(
        (t) => t["label"].toLowerCase() === mutuelleLabel?.toLowerCase()
      )
    ) {
      setError({
        hasError: true,
        message: "mutuelle deja existe avec ce label",
      });
      return;
    }
    try {
      const response = await axios.post(
        `http://localhost:8888/EMPLOYE-SERVICE/mutuelles?label=${mutuelleLabel}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authenticatedUser["access-token"]}`,
          },
        }
      );
      if (response.status === 200) {
        console.log(response);
        handleAddSnackBarOpen();
        setReloading((pre) => !pre);
        setMutuelleLabel("");
      }
    } catch (error) {
      console.error("Error posting mutuelle", error);
      throw error;
    }
  };

  const handleDeleteMutuelleSubmit = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:8888/EMPLOYE-SERVICE/mutuelles/${deleteItem}`,
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
        setReloading((pre) => !pre);
        handleDeleteItem(null);
      }
    } catch (error) {
      console.error("Error deleting mutuelle ", error);
      throw error;
    }
  };

  const handleUpdateMutuelleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.put(
        `http://localhost:8888/EMPLOYE-SERVICE/mutuelles/${editItem}?label=${newLabel}`,
        {},
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
      return response.data;
    } catch (error) {
      console.error("Error updating mutuelle ", error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8888/EMPLOYE-SERVICE/mutuelles",
          {
            headers: {
              Authorization: `Bearer ${authenticatedUser["access-token"]}`,
            },
          }
        );
        setMutuelles(response.data);
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const reloadData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8888/EMPLOYE-SERVICE/mutuelles",
          {
            headers: {
              Authorization: `Bearer ${authenticatedUser["access-token"]}`,
            },
          }
        );
        setMutuelles(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    reloadData();
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
      <form method="post" onSubmit={handleAddMutuelleSubmit}>
        <div className="row mb-3">
          <div className="col-md-5">
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
              label="Ajouter un mutuelle"
              value={mutuelleLabel}
              helperText={error.message}
              onChange={handleAddMutuelleChange}
              variant="outlined"
            />
          </div>
          <div className="col-md-3 mt-2">
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
      <h3 className="mt-3 mb-3">Liste des mutuelles</h3>
      <Grid item xs={12} md={6}>
        <Demo>
          <List
            dense={false}
            className={`${
              appTheme === "light" ? "text-bg-light" : "text-bg-dark"
            }`}
          >
            {mutuelles.length > 0 &&
              mutuelles.map((mutuelle) => (
                <ListItem
                  className="border border-1 rounded-4 mb-2 "
                  key={mutuelle["id"]}
                  secondaryAction={
                    mutuelle["id"] === editItem ? (
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
                              handleDeleteItem(mutuelle["id"]);
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
                            onClick={() => handleEditItem(mutuelle["id"])}
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
                    primary={mutuelle["label"]}
                    secondary={
                      editItem === mutuelle["id"] ? (
                        <form
                          method="post"
                          onSubmit={handleUpdateMutuelleSubmit}
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
        <DialogTitle>Etes-vous sur de supprimer le mutuelle</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {mutuelles.length > 0 &&
              mutuelles.find((t) => t["id"] === deleteItem)?.label}
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
            onClick={handleDeleteMutuelleSubmit}
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
          Mutuelle modifie avec succes!
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
          Mutuelle ajoute avec succes!
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
          Mutuelle supprime avec succes!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Mutuelles;
