import {
  Alert,
  Backdrop,
  Box,
  Breadcrumbs,
  Button,
  CircularProgress,
  circularProgressClasses,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  InputLabel,
  Link,
  MenuItem,
  OutlinedInput,
  Pagination,
  Select,
  Slide,
  Snackbar,
  TextField,
} from "@mui/material";
import React, {
  createContext,
  Suspense,
  useContext,
  useEffect,
  useState,
} from "react";
import axios from "axios";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Add, SearchOutlined } from "@mui/icons-material";
import { AppThemeContext } from "../AdminMainPage";
import { AuthenticatedUserContext } from "../../App";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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
//=====================CONTEXTS====================================
export const offreIdContext = createContext();
export const reloadingNecessiry = createContext();
//=================================================================

const Offre = React.lazy(() => import("./Offre"));
const OffreDetails = React.lazy(() => import("./offreDetails"));

const Recrutement = () => {
  //========================STATES=========================
  const authenticatedUser = useContext(AuthenticatedUserContext)[0];
  const [offreId, setOffreId] = useState(null);
  const [open, setOpen] = useState(false);
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [estUneRecherche, setEstUneRecherche] = useState(false);
  const [showSnackBar2, setShowSnackBar2] = useState(false);
  const [contrats, setContrats] = useState([]);
  const [offres, setOffres] = useState([]);
  const [reloading, setReloading] = useState(false);
  const [page, setPage] = React.useState(1);
  const [displayedOffres, setDisplayedOffres] = useState([]);
  const [dateLimiteCondidature, setDateLimiteCondidature] = useState(null);
  const [loading, setLoading] = useState(true);
  const appTheme = useContext(AppThemeContext)[0];
  //============================================================

  const [formState, setFormState] = useState({
    titre: "",
    poste: "",
    description: "",
    ville: "",
    nombreDePostes: 1,
    contratIds: [],
  });
  const [resulatsRecherche, setResultatsRecherche] = useState([]);
  const [formSearchState, setFormSearchState] = useState({
    poste: "Tous",
    ville: "Toutes",
    contrat: 0,
    dateLimiteCondidatureAvant: null,
    nombreDePostes: "Tous",
  });

  const handleChange = (event, value) => {
    setPage(value);
    setDisplayedOffres(offres.slice(value * 2 - 2, value * 2));
  };

  const handleCancelSearch = () => {
    setEstUneRecherche(false);
    setFormSearchState({
      poste: "Tous",
      ville: "Toutes",
      contrat: 0,
      dateLimiteCondidatureAvant: null,
      nombreDePostes: "Tous",
    });
  };

  const handleCloseBackdrop = () => {
    setOpenBackdrop(false);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      setOpenBackdrop(true);

      let url = "";
      if (
        formSearchState.poste !== "Tous" &&
        formSearchState.ville !== "Toutes" &&
        formSearchState.contrat !== 0 &&
        formSearchState.dateLimiteCondidatureAvant !== null &&
        formSearchState.nombreDePostes !== "Tous"
      ) {
        url = `http://localhost:8888/RECRUTEMENT-SERVICE/offres/recherche-ville-poste-date-condidature-avant-nombre-poste-min-type-contrat?posteRecherche=${formSearchState.poste}&villeRecherchee=${formSearchState.ville}&dateCondidatureAvant=${formSearchState.dateLimiteCondidatureAvant}&typeContratId=${formSearchState.contrat}`;
      } else if (
        formSearchState.poste !== "Tous" &&
        formSearchState.ville !== "Toutes" &&
        formSearchState.contrat === 0 &&
        formSearchState.dateLimiteCondidatureAvant !== null &&
        formSearchState.nombreDePostes === "Tous"
      ) {
        url = `http://localhost:8888/RECRUTEMENT-SERVICE/offres/recherche-ville-poste?posteRecherche=${formSearchState.poste}&villeRecherchee=${formSearchState.ville}&dateCondidatureAvant=${formSearchState.dateLimiteCondidatureAvant}`;
      } else if (
        formSearchState.poste !== "Tous" &&
        formSearchState.ville === "Toutes" &&
        formSearchState.contrat === 0 &&
        formSearchState.dateLimiteCondidatureAvant === null &&
        formSearchState.nombreDePostes === "Tous"
      ) {
        url = `http://localhost:8888/RECRUTEMENT-SERVICE/offres/poste-contient-titre?posteRecherche=${formSearchState.poste}`;
      }

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${authenticatedUser["access-token"]}`,
        },
      });
      if (response.status === 200) {
        setResultatsRecherche(response.data);
        setEstUneRecherche(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setOpenBackdrop(false);
    }
  };

  const handleClickedOffreId = (offreId) => {
    setOffreId(offreId);
  };

  const handleClickSnackBar2Open = () => {
    setShowSnackBar2(true);
  };

  const handleSnackBar2Close = () => {
    setShowSnackBar2(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleFormStateChange = (e) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleFormSearchStateChange = (e) => {
    const { name, value } = e.target;
    setFormSearchState((pre) => ({ ...pre, [name]: value }));
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
    } catch (error) {
      console.error(error);
    }
  };

  const getOffres = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8888/RECRUTEMENT-SERVICE/offres",
        {
          headers: {
            Authorization: `Bearer ${authenticatedUser["access-token"]}`,
          },
        }
      );
      if (response.status === 200) {
        setOffres(response.data);
        setDisplayedOffres([...response.data].slice(page * 2 - 2, page * 2));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `http://localhost:8888/RECRUTEMENT-SERVICE/offres`,
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
        handleClickSnackBar2Open();
        setFormState({
          titre: "",
          poste: "",
          description: "",
          ville: "",
          nombreDePostes: 1,
          contratIds: [],
        });
        setDateLimiteCondidature(null);
        setReloading((pre) => !pre);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getContrats();
    getOffres();
    setLoading(false);
  }, [offreId, reloading]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <reloadingNecessiry.Provider value={[reloading, setReloading]}>
        <offreIdContext.Provider value={[offreId, setOffreId]}>
          <div className="container">
            <Breadcrumbs aria-label="breadcrumb">
              <Link
                underline="hover"
                color="inherit"
                style={{
                  color: appTheme === "light" ? "#000000FF" : "#FFFFFFFF",
                }}
                onClick={() => handleClickedOffreId(null)}
              >
                offres
              </Link>
              {offreId != null && (
                <Link
                  underline="hover"
                  color="inherit"
                  href="#"
                  style={{
                    color: appTheme === "light" ? "#000000FF" : "#FFFFFFFF",
                  }}
                >
                  détails offre
                </Link>
              )}
            </Breadcrumbs>
            {offreId != null ? (
              <OffreDetails />
            ) : (
              <>
                <div className="row  mt-2">
                  <div className="col-md d-flex justify-content-end">
                    <Button
                      color="primary"
                      onClick={handleClickOpen}
                      variant="contained"
                      style={{ borderRadius: "50%", minHeight: 60 }}
                    >
                      <Add />
                    </Button>
                  </div>
                </div>
                {estUneRecherche ? (
                  <div className="row  mt-3">
                    <div className="col-md d-flex justify-content-end">
                      <Button
                        variant="outlined"
                        color="success"
                        onClick={handleCancelSearch}
                      >
                        Toutes les offres
                      </Button>
                    </div>
                  </div>
                ) : null}
                <form method="post" onSubmit={handleSearch}>
                  <div className="row mt-3">
                    <div className="col-md mb-2">
                      <TextField
                        sx={{
                          width: "100%",
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                              borderColor:
                                appTheme !== "light" ? "#FFFFFF" : "",
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
                        label="Poste"
                        multiline
                        name="poste"
                        value={formSearchState.poste}
                        onChange={handleFormSearchStateChange}
                        variant="outlined"
                        className="me-2"
                      />
                    </div>
                    <div className="col-md mb-2">
                      <TextField
                        sx={{
                          width: "100%",
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                              borderColor:
                                appTheme !== "light" ? "#FFFFFF" : "",
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
                        label="Ville"
                        name="ville"
                        value={formSearchState.ville}
                        onChange={handleFormSearchStateChange}
                        variant="outlined"
                        className="me-2"
                      />
                    </div>
                    <div className="col-md-3 mb-2">
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          closeOnSelect
                          value={formSearchState.dateLimiteCondidatureAvant}
                          onChange={(newValue) =>
                            setFormSearchState((pre) => ({
                              ...pre,
                              dateLimiteCondidatureAvant: newValue,
                            }))
                          }
                          sx={{
                            width: "100%",
                            "& .MuiOutlinedInput-root": {
                              "& fieldset": {
                                borderColor:
                                  appTheme !== "light" ? "#FFFFFF" : "",
                                borderRadius: "10px",
                              },
                              "& input::placeholder": {
                                color: appTheme !== "light" ? "#FFFFFF" : "",
                              },
                            },
                            "& .MuiSvgIcon-root": {
                              color:
                                appTheme !== "light" ? "#FFFFFF" : "#000000",
                            },
                            "& .MuiInputLabel-root": {
                              color: appTheme !== "light" ? "#FFFFFF" : "",
                            },
                            "& .MuiInputLabel-root.Mui-focused": {
                              color: appTheme !== "light" ? "#FFFFFF" : "",
                            },
                            "& input": {
                              color:
                                appTheme !== "light" ? "#FFFFFF" : "#000000",
                              borderRadius: "10px", // Text color
                            },
                          }}
                          label="date de limite de condidature"
                        />
                      </LocalizationProvider>
                    </div>
                    <div className="col-md-2 mb-2">
                      <FormControl
                        sx={{
                          width: "100%",
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                              borderColor:
                                appTheme !== "light" ? "#FFFFFF" : "",
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
                          Type de contrat
                        </InputLabel>
                        <Select
                          labelId="demo-multiple-name-label"
                          id="demo-multiple-name"
                          name="contrat"
                          defaultChecked={"Tous"}
                          value={formSearchState.contrat}
                          onChange={handleFormSearchStateChange}
                          input={<OutlinedInput label="Type de contrat" />}
                          MenuProps={MenuProps}
                        >
                          {contrats.map((c) => (
                            <MenuItem key={c.id} value={c.id}>
                              {c.typeContrat}
                            </MenuItem>
                          ))}
                          <MenuItem selected value="Tous">
                            <em>Tous</em>
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                    <div className="col-md mb-2">
                      <TextField
                        sx={{
                          width: "100%",
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                              borderColor:
                                appTheme !== "light" ? "#FFFFFF" : "",
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
                        type="number"
                        placeholder="Tous"
                        label="Nombre de postes"
                        name="nombreDePostes"
                        value={formSearchState.nombreDePostes}
                        onChange={handleFormSearchStateChange}
                        variant="outlined"
                        className="me-2"
                      />
                    </div>
                    <div className="col-md-1 mb-2">
                      <Button
                        variant="contained"
                        sx={{ mt: 1 }}
                        type="submit"
                        color="warning"
                      >
                        <SearchOutlined />
                      </Button>
                    </div>
                  </div>
                </form>
                {estUneRecherche ? (
                  <>
                    <div className="row">
                      {resulatsRecherche.length > 1 ? "Resultats" : "Resultat"}
                    </div>
                    <div className="row">
                      {displayedOffres.map((offre, index) => {
                        return (
                          <div className="col-md-6" key={index}>
                            <Offre
                              key={offre.offreId}
                              offreId={offre.offreId}
                              onClick={handleClickedOffreId}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="row mt-4 text-secondary fs-4 mb-2 p-2">
                      Dernières offres <Divider color="info" />
                    </div>
                    {loading === true ? (
                      <Box sx={{ position: "relative" }}>
                        <CircularProgress
                          variant="indeterminate"
                          disableShrink
                          sx={{
                            color: (theme) =>
                              theme.palette.mode === "light"
                                ? "#1a90ff"
                                : "#308fe8",
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
                    ) : !loading && offres?.length === 0 ? (
                      <center className="fw-bold text-secondary">
                        aucune offre
                      </center>
                    ) : (
                      <>
                        <div className="row ">
                          {displayedOffres.map((offre, index) => {
                            return (
                              <div className="col-md-6" key={index}>
                                <Offre
                                  key={offre.offreId}
                                  offreId={offre.offreId}
                                  onClick={handleClickedOffreId}
                                />
                              </div>
                            );
                          })}
                        </div>
                        <div className="row ">
                          <div style={{ flex: "auto" }}></div>
                          <Pagination
                            count={Math.round(offres.length / 2)}
                            page={page}
                            color="primary"
                            onChange={handleChange}
                          />
                        </div>
                      </>
                    )}
                  </>
                )}
                <Dialog
                  open={open}
                  fullWidth
                  TransitionComponent={Transition}
                  keepMounted
                  onClose={handleClose}
                  aria-describedby="alert-dialog-slide-description"
                >
                  <DialogTitle className="text-center fw-bold">
                    Ajouter une nouvelle offre
                  </DialogTitle>
                  <DialogContent>
                    <form onSubmit={handleSubmit} method="post">
                      <div className="row">
                        <center>
                          <div className="col-md mb-2 mt-2">
                            <TextField
                              sx={{ width: "100%" }}
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
                              sx={{ width: "100%" }}
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
                              sx={{ width: "100%" }}
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
                              sx={{ width: "100%" }}
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
                              sx={{ width: "100%" }}
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
                                sx={{ width: "100%" }}
                                label="date de limite de condidature"
                              />
                            </LocalizationProvider>
                          </div>
                        </center>
                      </div>
                      <div className="row">
                        <center>
                          <div className="col-md mb-2 mt-2">
                            <Button
                              variant="contained"
                              color="success"
                              size="large"
                              fullWidth
                              type="submit"
                              sx={{ width: "100%", mr: 1 }}
                            >
                              Ajouter
                            </Button>
                          </div>
                        </center>
                      </div>
                    </form>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      onClick={handleClose}
                      color="secondary"
                      variant="text"
                    >
                      Annuler
                    </Button>
                  </DialogActions>
                </Dialog>
                <Snackbar
                  open={showSnackBar2}
                  autoHideDuration={4000}
                  onClose={handleSnackBar2Close}
                >
                  <Alert
                    onClose={handleSnackBar2Close}
                    severity="success"
                    variant="filled"
                    sx={{ width: "100%" }}
                  >
                    Offre ajoutee avec succes!
                  </Alert>
                </Snackbar>
              </>
            )}
          </div>
          <Backdrop
            sx={(theme) => ({
              color: "darkgreen",
              zIndex: theme.zIndex.drawer + 1,
            })}
            open={openBackdrop}
            onClick={handleCloseBackdrop}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        </offreIdContext.Provider>
      </reloadingNecessiry.Provider>
    </Suspense>
  );
};

export default React.memo(Recrutement, (prevProps, nextProps) =>
  Object.is(prevProps, nextProps)
);
