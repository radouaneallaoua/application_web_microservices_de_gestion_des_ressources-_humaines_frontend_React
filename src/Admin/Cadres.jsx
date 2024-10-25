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
  FormControl,
  InputLabel,
  OutlinedInput,
  MenuItem,
  Select,
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

const Cadres = () => {
  //=========================STATES===========================
  const authenticatedUser = useContext(AuthenticatedUserContext)[0];
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [showAddSnackBar, setAddShowSnackBar] = useState(false);
  const [showUpdateSnackBar, setUpdateShowSnackBar] = useState(false);
  const [showDeleteSnackBar, setDeleteShowSnackBar] = useState(false);
  const appTheme = useContext(AppThemeContext)[0];
  const [cadres, setCadres] = useState([]);
  const [newLabel, setNewLabel] = useState("");
  const [newCorpsId, setNewCorpsId] = useState(null);
  const [corps, setCorps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reloading, setReloading] = useState(false);
  const [formState, setFormState] = useState({
    label: "",
    corpsId: null,
  });
  const [error, setError] = useState({ hasError: false, message: "" });
  //========================================STATES========================================
  const handleDeleteDialogOpen = () => {
    setOpenDeleteDialog(true);
  };
  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false);
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
    let item = cadres.find((t) => t["id"] === index);
    setNewLabel(item?.label);
    setNewCorpsId(item?.corps?.name);
  };
  const handleNewLabelChange = (e) => {
    setNewLabel(e.target.value);
  };
  const handleNewCorpsChange = (e) => {
    setNewCorpsId(e.target.value);
  };
  const handleFormStateChange = (e) => {
    const { name, value } = e.target;
    setFormState((pre) => ({ ...pre, [name]: value }));
  };
  //===================================BACKEND======================================
  const handleAddCadresubmit = async (e) => {
    e.preventDefault();
    if (formState.label.trim().length === 0) {
      setError({ hasError: true, message: "saisir un nom" });
      return;
    }
    if (
      cadres.find(
        (t) => t["label"].toLowerCase() === formState.label.toLowerCase()
      )
    ) {
      setError({
        hasError: true,
        message: "cadre deja existe avec ce nom",
      });
      return;
    }
    try {
      const response = await axios.post(
        `http://localhost:8888/EMPLOYE-SERVICE/cadres?label=${formState.label}&corpsId=${formState.corpsId}`,
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

        setFormState({
          label: "",
          corpsId: null,
        });
        setReloading((pre) => !pre);
      }
    } catch (error) {
      console.error("Error posting cadres", error);
      throw error;
    }
  };

  const handleDeleteCadresubmit = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:8888/EMPLOYE-SERVICE/cadres/${deleteItem}`,
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
        handleDeleteItem(null);
        setReloading((pre) => !pre);
      }
    } catch (error) {
      console.error("Error deleting cadres ", error);
      throw error;
    }
  };

  const handleUpdateCadresubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:8888/EMPLOYE-SERVICE/cadres/${editItem}?label=${newLabel}&
      corpsId=${newCorpsId}`,
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
    } catch (error) {
      console.error("Error updating cadre ", error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [corpsResponse, cadresResponse] = await Promise.all([
          axios.get("http://localhost:8888/EMPLOYE-SERVICE/corps", {
            headers: {
              Authorization: `Bearer ${authenticatedUser["access-token"]}`,
            },
          }),
          axios.get("http://localhost:8888/EMPLOYE-SERVICE/cadres", {
            headers: {
              Authorization: `Bearer ${authenticatedUser["access-token"]}`,
            },
          }),
        ]);
        setCorps(corpsResponse.data);
        setCadres(cadresResponse.data);
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
        const [cadresResponse, corpsResponse] = await Promise.all([
          axios.get("http://localhost:8888/EMPLOYE-SERVICE/cadres", {
            headers: {
              Authorization: `Bearer ${authenticatedUser["access-token"]}`,
            },
          }),
          axios.get("http://localhost:8888/EMPLOYE-SERVICE/corps", {
            headers: {
              Authorization: `Bearer ${authenticatedUser["access-token"]}`,
            },
          }),
        ]);
        setCadres(cadresResponse.data);
        setCorps(corpsResponse.data);
      } catch (err) {
        console.log(err);
      }
    };

    if (reloading) {
      reloadData();
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
      <form method="post" onSubmit={handleAddCadresubmit}>
        <div className="row ">
          <div className="col-md-5 mb-2">
            <TextField
              sx={{
                width: "100%",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: appTheme !== "light" ? "#FFFFFF" : "", // Default border color
                  },
                  "& input::placeholder": {
                    color: appTheme !== "light" ? "#FFFFFF" : "#000000", // Placeholder color
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
              className="me-2"
            />
          </div>
          <div className="col-md-3 mb-2">
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
              <InputLabel id="demo-multiple-name-label">Corps</InputLabel>
              <Select
                labelId="demo-multiple-name-label"
                id="demo-multiple-name"
                name="corpsId"
                value={formState.corpsId}
                onChange={handleFormStateChange}
                input={<OutlinedInput label="Corps" />}
              >
                {corps.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className="col-md-3 mt-2">
            <Button
              color="primary"
              variant="contained"
              type="submit"
              sx={{ textTransform: "lowercase", px: 3 }}
            >
              ajouter
            </Button>
          </div>
        </div>
      </form>
      <h3 className="mt-3 mb-3">Liste des cadres</h3>
      <Grid item xs={12} md={6}>
        <Demo>
          <List
            dense={false}
            className={`${appTheme === "light" ? "text-bg-light" : "text-bg-dark"
              }`}
          >
            {cadres.length > 0 &&
              cadres.map((co) => (
                <ListItem
                  className="border border-1 rounded-4 mb-2"
                  key={co["id"]}
                  secondaryAction={
                    co["id"] === editItem ? (
                      <Button
                        variant="text"
                        sx={{ mt: 1 }}
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
                              handleDeleteItem(co["id"]);
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
                            onClick={() => handleEditItem(co["id"])}
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
                    primary={co["label"]}
                    secondary={
                      editItem === co["id"] ? (
                        <form method="post" onSubmit={handleUpdateCadresubmit}>
                          <div className="row">
                            <div className="col-md-3">
                              <TextField
                                sx={{ width: "90%" }}
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
                            <div className="col-md-3">
                              <FormControl sx={{ width: "90%" }}>
                                <InputLabel id="demo-multiple-name-label">
                                  Corps
                                </InputLabel>
                                <Select
                                  labelId="demo-multiple-name-label"
                                  id="demo-multiple-name"
                                  name="categorieId"
                                  value={newCorpsId}
                                  onChange={handleNewCorpsChange}
                                  input={<OutlinedInput label="Corps" />}
                                >
                                  {corps?.map((c) => (
                                    <MenuItem key={c.id} value={c.id}>
                                      {c.label}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </div>
                            <div className="col-md-3 text-lowercase justify-content-between">
                              <Button
                                color="primary"
                                type="submit"
                                sx={{ mt: 1 }}
                                variant="outlined"
                              >
                                modifier
                              </Button>
                            </div>
                          </div>
                        </form>
                      ) : (
                        <div
                          className={`${appTheme === "dark" ? "text-bg-dark" : " "
                            }`}
                        >
                          corps: {co["corps"]?.label}
                        </div>
                      )
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
        <DialogTitle>Etes-vous sur de supprimer le cadres</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {cadres.length > 0 &&
              cadres.find((t) => t["id"] === deleteItem)?.label}
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
            onClick={handleDeleteCadresubmit}
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
          Cadres modifie avec succes!
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
          Cadres ajoute avec succes!
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
          Cadres supprime avec succes!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Cadres;
