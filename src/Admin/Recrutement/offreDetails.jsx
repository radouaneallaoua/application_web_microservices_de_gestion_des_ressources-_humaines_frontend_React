import {
  DeleteOutline,
  Edit,
  NavigateBeforeRounded,
  NavigateNextRounded,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  circularProgressClasses,
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
  Snackbar,
  Switch,
  TextField,
  Tooltip,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { offreIdContext, reloadingNecessiry } from "./Recrutements";
import axios from "axios";
import dayjs from "dayjs";
import { AuthenticatedUserContext } from "../../App";
import { AppThemeContext } from "../AdminMainPage";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const Condidature = React.lazy(() => import("./Condidature"));

const OffreDetails = () => {
  //==========================STATES==================================
  const authenticatedUser = useContext(AuthenticatedUserContext)[0];
  const [offre, setOffre] = useState({});
  const [typeContrats, setTypesContrats] = useState([]);
  const [contrats, setContrats] = useState([]);
  const appTheme = useContext(AppThemeContext)[0];
  const [offreId, setOffreId] = useContext(offreIdContext);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [showEditSnackBar, setEditShowSnackBar] = useState(false);
  const [showDeleteSnackBar, setDeleteShowSnackBar] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reloading, setReloading] = useContext(reloadingNecessiry);
  const [condidatures, setCondidatures] = useState([]);
  const [condidatureIndice, setCondidatureIndice] = useState(0);
  const [formState, setFormState] = useState({
    titre: "",
    poste: "",
    description: "",
    ville: "",
    nombreDePostes: 1,
    contratIds: [],
  });
  const [dateLimiteCondidature, setDateLimiteCondidature] = useState(null);
  const [estExpiree, setEstExpiree] = useState(false);
  //================================================================================

  const handleDeleteSnackBarOpen = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:8888/RECRUTEMENT-SERVICE/offres/${offreId}`,
        {
          headers: {
            Authorization: `Bearer ${authenticatedUser["access-token"]}`,
          },
        }
      );
      if (response.status === 200) {
        console.log(response.data);
        setDeleteShowSnackBar(true);
        setOffreId(null);
        setTimeout(() => {
          setOpenDelete(false);
        }, 2000);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleEditSnackBarOpen = () => {
    setEditShowSnackBar(true);
    setTimeout(() => {
      setOpenEdit(false);
    }, 2000);
  };
  const handleEditSnackBarClose = () => {
    setEditShowSnackBar(false);
  };
  const handleDeleteSnackBarClose = () => {
    setDeleteShowSnackBar(false);
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

  const handleFormStateChange = (e) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleChange = (event) => {
    setEstExpiree(event.target.checked);
  };

  //==================BACKEND============================================

  const handleSubmit = (e) => {
    e.preventDefault();
    updateOffre();
  };

  const getContrats = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8888/RECRUTEMENT-SERVICE/contrats",
        {
          headers: {
            Authorization: `Bearer ${authenticatedUser["access-token"]}`,
          },
        }
      );
      if (response.status === 200) {
        setContrats(response.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const updateOffre = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8888/RECRUTEMENT-SERVICE/offres/${offreId}?estExpiree=${estExpiree}`,
        {
          ...formState,
          dateLimiteCondidature: dateLimiteCondidature,
        },
        {
          headers: {
            Authorization: `Bearer ${authenticatedUser["access-token"]}`,
          },
        }
      );
      if (response.status === 200) {
        setOffre(response.data);
        setReloading((pre) => !pre);
      }
    } catch (err) {
      console.log(err);
    }
  };
  //=================================================================================
  useEffect(() => {
    const getOffreById = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8888/RECRUTEMENT-SERVICE/offres/${offreId}`,
          {
            headers: {
              Authorization: `Bearer ${authenticatedUser["access-token"]}`,
            },
          }
        );
        if (response.status === 200) {
          const foundOffre = response.data;
          setOffre(foundOffre);
          setFormState({
            titre: foundOffre.titre,
            poste: foundOffre.poste,
            description: foundOffre.description,
            ville: foundOffre.ville,
            nombreDePostes: foundOffre.nombreDePostes,
            contratIds: foundOffre.contrats.map((c) => c.id),
          });
          setEstExpiree(foundOffre.estExpiree);
          setDateLimiteCondidature(dayjs(foundOffre.dateLimiteCondidature));
          setTypesContrats(foundOffre.contrats);
          setCondidatures(foundOffre.condidats);
        }
      } catch (err) {
        console.log(err);
      }
    };
    getContrats();
    getOffreById();
    if (loading === true) {
      setLoading(false);
    }
  }, [reloading, loading, offreId]);

  const handleSuivant = () => {
    if (condidatureIndice < condidatures.length - 1) {
      setCondidatureIndice((pre) => pre + 1);
    }
  };
  const handlePrecedent = () => {
    if (condidatureIndice > 0) {
      setCondidatureIndice((pre) => pre - 1);
    }
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
    <reloadingNecessiry.Provider value={[reloading, setReloading]}>
      <div className="container p-3">
        <div className="fs-5 text-secondary">Details de l'offre</div>
        <center>
          <div
            className="fw-bold col-md-3 rounded-pill  mt-2 mb-2  p-3"
            style={{ backgroundColor: "#0096D6", color: "#FFFFFFF5" }}
          >
            {offre["condidats"]?.length} Condidatures
          </div>
        </center>
        <div
          className=" row col-md-10 mx-auto  p-3 rounded-4"
          style={{
            backgroundColor: appTheme === "light" ? "#F0F0F0A2" : "#213847",
          }}
        >
          <div className="row">
            <div className="col-md d-flex justify-content-end">
              <span
                style={{ position: "relative", right: -50 }}
                className={`rounded-pill text-light p-2 ${
                  offre["estExpiree"] ? "bg-danger" : "bg-success"
                }`}
              >
                {offre["estExpiree"] ? "Expirée" : "En cours"}
              </span>
            </div>
          </div>
          <div className="row">
            <div className="col-4 fw-bold mb-3">titre</div>
            <div className="col-8 mb-3">{offre["titre"]}</div>
          </div>
          <div className="row">
            <div className="col-4 mb-3 fw-bold">description</div>
            <div className="col-8 mb-3">{offre["description"]}</div>
          </div>
          <div className="row">
            <div className="col-4 mb-3 fw-bold">poste</div>
            <div className="col-8 mb-3">{offre["poste"]}</div>
          </div>
          <div className="row">
            <div className="col-4 mb-3 fw-bold">date de publication</div>
            <div className="col-8 mb-3">{offre["datePublication"]}</div>
          </div>
          <div className="row">
            <div className="col-4 mb-3 fw-bold">nombre de postes</div>
            <div className="col-8 mb-3">{offre["nombreDePostes"]}</div>
          </div>
          <div className="row">
            <div className="col-4 mb-3 fw-bold">type de contrats</div>
            <div className="col-8 mb-3">
              <ul>
                {typeContrats.map((t) => (
                  <li key={t["id"]}>{t["typeContrat"]}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="row">
            <div className="col-4 mb-3 fw-bold">date limite de condidature</div>
            <div className="col-8 mb-3">{offre["dateLimiteCondidature"]}</div>
          </div>
          <div className="row justify-content-end">
            <div className="col-5 col-md-3 ">
              <Tooltip title="modifier">
                <IconButton onClick={handleEditOpen}>
                  <Edit color="success" />
                </IconButton>
              </Tooltip>
              <Tooltip title="supprimer">
                <IconButton onClick={handleDeleteOpen}>
                  <DeleteOutline color="error" />
                </IconButton>
              </Tooltip>
            </div>
          </div>
        </div>
        {condidatures.length > 0 ? (
          <>
            {" "}
            <div className="fs-5 mt-4 mb-3 text-secondary">Condidatures</div>
            <Condidature
              key={condidatures.at(condidatureIndice)?.id}
              condidatureId={condidatures.at(condidatureIndice)?.id}
            />
            <div className="d-flex justify-content-between mt-2">
              <div>
                <Tooltip title="precedent">
                  <Button onClick={handlePrecedent}>
                    <NavigateBeforeRounded />
                    precedent
                  </Button>
                </Tooltip>
              </div>
              <div>
                {condidatureIndice + 1}
                {"/"}
                {condidatures.length}
              </div>
              <div>
                <Tooltip title="suivant">
                  <Button onClick={handleSuivant}>
                    suivant
                    <NavigateNextRounded />
                  </Button>
                </Tooltip>
              </div>
            </div>
          </>
        ) : (
          <div className="fs-5 mt-4 mb-3 text-secondary">
            Aucune condidature
          </div>
        )}

        <Dialog
          open={openEdit}
          fullWidth
          TransitionComponent={Transition}
          keepMounted
          onClose={handleEditClose}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle className="text-center fw-bold">
            Modifier l'Offre
          </DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit} method="post">
              <div className="row">
                <center>
                  <div className="col-md mb-2 mt-2">
                    <TextField
                      sx={{ width: "80%" }}
                      id="outlined-basic"
                      label="Titre"
                      name="titre"
                      value={formState.titre}
                      onChange={handleFormStateChange}
                      variant="outlined"
                      className="me-2"
                    />
                  </div>
                </center>
              </div>
              <div className="row">
                <center>
                  <div className="col-md mb-2 mt-2">
                    <TextField
                      sx={{ width: "80%" }}
                      id="outlined-basic"
                      label="Poste"
                      name="poste"
                      value={formState.poste}
                      onChange={handleFormStateChange}
                      variant="outlined"
                      className="me-2"
                    />
                  </div>
                </center>
              </div>

              <div className="row">
                <center>
                  <div className="col-md mb-2 mt-2">
                    <TextField
                      sx={{ width: "80%" }}
                      id="outlined-basic"
                      label="Description"
                      variant="outlined"
                      name="description"
                      className="me-2"
                      value={formState.description}
                      onChange={handleFormStateChange}
                    />
                  </div>
                </center>
              </div>

              <div className="row">
                <center>
                  <div className="col-md mb-2 mt-2">
                    <TextField
                      sx={{ width: "80%" }}
                      id="outlined-basic"
                      label="Ville"
                      name="ville"
                      variant="outlined"
                      className="me-2"
                      value={formState.ville}
                      onChange={handleFormStateChange}
                    />
                  </div>
                </center>
              </div>
              <div className="row">
                <center>
                  <div className="col-md mb-2 mt-2">
                    <TextField
                      sx={{ width: "80%" }}
                      id="outlined-basic"
                      label="Nombre de postes"
                      type="number"
                      name="nombreDePostes"
                      variant="outlined"
                      className="me-2"
                      value={formState.nombreDePostes}
                      onChange={handleFormStateChange}
                    />
                  </div>
                </center>
              </div>
              <div className="row">
                <center>
                  <FormControl sx={{ m: 1, width: "80%" }}>
                    <InputLabel id="demo-multiple-name-label">
                      Type de contrats
                    </InputLabel>
                    <Select
                      labelId="demo-multiple-name-label"
                      id="demo-multiple-name"
                      name="contratIds"
                      multiple
                      value={formState.contratIds}
                      onChange={handleFormStateChange}
                      input={<OutlinedInput label="Type de contrats" />}
                      MenuProps={MenuProps}
                    >
                      {contrats.map((c) => (
                        <MenuItem key={c.id} value={c.id}>
                          {c.typeContrat}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </center>
              </div>
              <div className="row ">
                <center>
                  <div className="col-md  mb-2 mt-2">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        closeOnSelect
                        name="dateLimiteCondidature"
                        value={dateLimiteCondidature}
                        onChange={(newValue) =>
                          setDateLimiteCondidature(newValue)
                        }
                        sx={{ width: "80%" }}
                        label="date de limite de condidature"
                      />
                    </LocalizationProvider>
                  </div>
                </center>
              </div>
              <div className="row ms-4">
                <div className="col-1">
                  <Switch checked={estExpiree} onChange={handleChange} />
                </div>
                <div className="col-2 offset-1 mt-2 fw-bold text-secondary">
                  Expiree
                </div>
              </div>
              <div className="row">
                <center>
                  <div className="col-md mb-2 mt-2">
                    <Button
                      onClick={handleEditSnackBarOpen}
                      variant="contained"
                      color="success"
                      size="large"
                      fullWidth
                      type="submit"
                      sx={{ width: "80%", mr: 1, textTransform: "lowercase" }}
                    >
                      Modifier
                    </Button>
                  </div>
                </center>
              </div>
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditClose} color="secondary" variant="text">
              Annuler
            </Button>
          </DialogActions>
        </Dialog>
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
              l'offre: <span className="fw-bold">{offre["poste"]}</span>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              color="secondary"
              variant="text"
              onClick={handleDeleteClose}
            >
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
            Offre modifiee avec succes!
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
            Offre supprimee avec succes!
          </Alert>
        </Snackbar>
      </div>
    </reloadingNecessiry.Provider>
  );
};

export default React.memo(OffreDetails, (prevProps, nextProps) =>
  Object.is(prevProps, nextProps)
);
