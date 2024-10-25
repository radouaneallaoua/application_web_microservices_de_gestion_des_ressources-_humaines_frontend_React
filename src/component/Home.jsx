import React, { createContext, Suspense, useContext, useEffect, useState } from "react";
import notification from "../assets/notification.png";
import "../App.css";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import {
  Alert,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  circularProgressClasses,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Slide,
  Snackbar,
  styled,
  TextField,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {

  SearchOutlined,
} from "@mui/icons-material";

import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

// import required modules
import { Pagination } from "swiper/modules";
import { AuthenticatedUserContext } from "../App";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});
const Offre = React.lazy(() => import("./Offre"));
export const TargetOffreContext = createContext();

const Home = () => {
  const authenticatedUser = useContext(AuthenticatedUserContext)[0];
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [offreData, setOffreData] = useState([]);
  const [contrats, setContrats] = useState([]);
  const [targetOffre, setTargetOffre] = useState(null);
  const [estUneRecherche, setEstUneRecherche] = useState(false);
  const [condidatureFormState, setCondidatureFormState] = useState({
    nom: "",
    prenom: "",
    tel: "",
    adresse: "",
    ville: "",
    email: "",
    motivation: "",
    genre: "HOMME",
    CV: null,
  });
  const [resulatsRecherche, setResultatsRecherche] = useState([]);
  const handleCondidatureFormStateChange = (e) => {
    const { name, value } = e.target;
    setCondidatureFormState((pre) => ({ ...pre, [name]: value }));
  };
  const [showSnackBar, setShowSnackBar] = useState(false);
  const handleClose = () => {
    setTargetOffre(null);
  };
  const handleCloseSnackBar = () => {
    setShowSnackBar(false);
  };
  const handleOpenSnackBar = () => {
    setShowSnackBar(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("genre", condidatureFormState.genre);
    form.append("prenom", condidatureFormState.prenom);
    form.append("nom", condidatureFormState.nom);
    form.append("adresse", condidatureFormState.adresse);
    form.append("ville", condidatureFormState.ville);
    form.append("CV", condidatureFormState.CV);
    form.append("motivation", condidatureFormState.motivation);
    form.append("tel", condidatureFormState.tel);
    form.append("email", condidatureFormState.email);
    form.append("offreId", targetOffre);
    try {
      const response = await axios.post(
        "http://localhost:8888/RECRUTEMENT-SERVICE/condidatures",
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("////OFFRES/////////////////////////////////")
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
    handleOpenSnackBar();
    handleClose();
  };
  const [formSearchState, setFormSearchState] = useState({
    poste: "Tous",
    ville: "Toutes",
    contrat: 0,
    dateLimiteCondidatureAvant: null,
    nombreDePostes: "Tous",
  });
  const handleCloseBackdrop = () => {
    setOpenBackdrop(false);
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
  const handleSearch = async (e) => {
    e.preventDefault();

    const searchParams = formSearchState;
    setOpenBackdrop(true);
    let url = "";

    try {
      if (
        searchParams.poste !== "Tous" &&
        searchParams.ville !== "Toutes" &&
        searchParams.contrat !== 0 &&
        searchParams.dateLimiteCondidatureAvant !== null &&
        searchParams.nombreDePostes !== "Tous"
      ) {
        url = `http://localhost:8888/RECRUTEMENT-SERVICE/offres/recherche-ville-poste-date-condidature-avant-nombre-poste-min-type-contrat?posteRecherche=${searchParams.poste}&villeRecherchee=${searchParams.ville}&dateCondidatureAvant=${searchParams.dateLimiteCondidatureAvant}&typeContratId=${searchParams.contrat}`;
      } else if (
        searchParams.poste !== "Tous" &&
        searchParams.ville !== "Toutes" &&
        searchParams.contrat === 0 &&
        searchParams.dateLimiteCondidatureAvant !== null &&
        searchParams.nombreDePostes === "Tous"
      ) {
        url = `http://localhost:8888/RECRUTEMENT-SERVICE/offres/recherche-ville-poste?posteRecherche=${searchParams.poste}&villeRecherchee=${searchParams.ville}&dateCondidatureAvant=${searchParams.dateLimiteCondidatureAvant}`;
      } else if (
        searchParams.poste !== "Tous" &&
        searchParams.ville === "Toutes" &&
        searchParams.contrat === 0 &&
        searchParams.dateLimiteCondidatureAvant === null &&
        searchParams.nombreDePostes === "Tous"
      ) {
        url = `http://localhost:8888/RECRUTEMENT-SERVICE/offres/poste-contient-titre?posteRecherche=${searchParams.poste}`;
      } else if (
        searchParams.poste === "Tous" &&
        searchParams.ville !== "Toutes" &&
        searchParams.contrat === 0 &&
        searchParams.dateLimiteCondidatureAvant === null &&
        searchParams.nombreDePostes === "Tous"
      ) {
        url = `http://localhost:8888/RECRUTEMENT-SERVICE/offres/ville?villeRecherchee=${searchParams.ville}`;
      } else if (
        searchParams.poste === "Tous" &&
        searchParams.ville !== "Toutes" &&
        searchParams.contrat === "Tous" &&
        searchParams.dateLimiteCondidatureAvant !== null &&
        searchParams.nombreDePostes === "Tous"
      ) {
        url = `http://localhost:8888/RECRUTEMENT-SERVICE/offres/recherche-ville-date-limite-condidature-avant?villeRecherchee=${searchParams.ville}&dateLimiteCondidature=${searchParams.dateLimiteCondidatureAvant}`;
      } else if (
        searchParams.poste !== "Tous" &&
        searchParams.ville === "Toutes" &&
        searchParams.contrat === 0 &&
        searchParams.dateLimiteCondidatureAvant !== null &&
        searchParams.nombreDePostes === "Tous"
      ) {
        url = `http://localhost:8888/RECRUTEMENT-SERVICE/offres/recherche-poste-date-limite-condidature-avant?posteRecherche=${searchParams.poste}&dateLimiteCondidature=${searchParams.dateLimiteCondidatureAvant}`;
      } else if (
        searchParams.poste === "Tous" &&
        searchParams.ville === "Toutes" &&
        searchParams.contrat === 0 &&
        searchParams.dateLimiteCondidatureAvant !== null &&
        searchParams.nombreDePostes === "Tous"
      ) {
        url = `http://localhost:8888/RECRUTEMENT-SERVICE/offres/date-limite-condidature-avant?dateLimiteCondidatureAvant=${searchParams.dateLimiteCondidatureAvant}`;
      } else if (
        searchParams.poste === "Tous" &&
        searchParams.ville === "Toutes" &&
        searchParams.contrat === 0 &&
        searchParams.dateLimiteCondidatureAvant === null &&
        searchParams.nombreDePostes !== "Tous"
      ) {
        url = `http://localhost:8888/RECRUTEMENT-SERVICE/offres/nombre-postes-sup?nombreDePostesSup=${searchParams.nombreDePostes}`;
      } else if (
        searchParams.poste === "Tous" &&
        searchParams.ville === "Toutes" &&
        searchParams.contrat !== 0 &&
        searchParams.dateLimiteCondidatureAvant === null &&
        searchParams.nombreDePostes === "Tous"
      ) {
        url = `http://localhost:8888/RECRUTEMENT-SERVICE/offres/contrat?contrat=${searchParams.contrat}`;
      }

      if (url) {
        const resp = await axios.get(url);
        setResultatsRecherche(resp.data);
        setEstUneRecherche(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setOpenBackdrop(false);
    }
  };

  const handleFormSearchStateChange = (e) => {
    const { name, value } = e.target;
    setFormSearchState((pre) => ({ ...pre, [name]: value }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [offreResponse, contratsResponse] = await Promise.all([
          axios.get("http://localhost:8888/RECRUTEMENT-SERVICE/offres"),
          axios.get(
            "http://localhost:8888/RECRUTEMENT-SERVICE/contrats"
          ),
        ]);

        setOffreData(offreResponse.data);
        setContrats(contratsResponse.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);


  return (
    <Suspense
      fallback={
        <div>
          <center>
            <Box sx={{ position: "relative" }}>
              <CircularProgress
                variant="indeterminate"
                disableShrink
                sx={{
                  color: (theme) =>
                    theme.palette.mode === "light" ? "#1a90ff" : "#308fe8",
                  animationDuration: "550ms",
                  position: "relative",
                  [`& .${circularProgressClasses.circle}`]: {
                    strokeLinecap: "round",
                  },
                }}
                size={40}
                thickness={4}
                value={100}
              />
            </Box>
          </center>
        </div>
      }
    >
      <TargetOffreContext.Provider value={[targetOffre, setTargetOffre]}>
        <div className="container">
          <div className="row mx-1 mt-5 fw-bold text-light p-3 fs-3 rounded-4 offres">
            <div className="col">
              <img
                src={notification}
                width="60"
                height="60"
                alt=""
                className="noti"
              />
              {"    Découverez nos dernières offres de recrutement !!! "}
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
            <div className="row mt-4">
              <div className="col-md mb-2">
                <TextField
                  sx={{ width: "100%" }}
                  id="outlined-basic"
                  label="Poste"
                  multiline
                  name="poste"
                  value={formSearchState.poste}
                  onChange={handleFormSearchStateChange}
                  variant="outlined"
                />
              </div>
              <div className="col-md mb-2">
                <TextField
                  sx={{ width: "100%" }}
                  id="outlined-basic"
                  label="Ville"
                  name="ville"
                  value={formSearchState.ville}
                  onChange={handleFormSearchStateChange}
                  variant="outlined"
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
                    sx={{ width: "100%" }}
                    label="date  limite de condidature avant"
                  />
                </LocalizationProvider>
              </div>
              <div className="col-md-2 mb-2">
                <FormControl sx={{ width: "100%" }}>
                  <InputLabel id="demo-multiple-name-label">
                    Type de contrat
                  </InputLabel>
                  <Select
                    labelId="demo-multiple-name-label"
                    id="demo-multiple-name"
                    name="contrat"
                    value={formSearchState.contrat}
                    onChange={handleFormSearchStateChange}
                    input={<OutlinedInput label="Type de contrat" />}
                  >
                    {contrats.map((contrat) => (
                      <MenuItem key={contrat.id} value={contrat.id}>
                        {contrat.typeContrat}
                      </MenuItem>
                    ))}

                    <MenuItem key={0} value={0}>
                      <em>Tous</em>
                    </MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="col-md mb-2">
                <TextField
                  sx={{ width: "100%" }}
                  id="outlined-basic"
                  type="number"
                  placeholder="Tous"
                  label="Nombre de postes"
                  name="nombreDePostes"
                  value={formSearchState.nombreDePostes}
                  onChange={handleFormSearchStateChange}
                  variant="outlined"
                />
              </div>
              <div className="col-md-1 mb-2">
                <Button variant="contained" type="submit" color="warning">
                  <SearchOutlined />
                </Button>
              </div>
            </div>
          </form>
          <div className="row ms-2 text-secondary mt-3 fw-bold fs-5">
            {estUneRecherche
              ? `${resulatsRecherche.length} ${resulatsRecherche.length > 1 ? "Resultats" : "Resultat"
              }`
              : null}
          </div>
          <Swiper
            direction={"vertical"}
            pagination={{
              clickable: true,
            }}
            style={{ width: "100%", height: 400, marginTop: 7 }}
            modules={[Pagination]}
            className="mySwiper"
          >
            {estUneRecherche
              ? resulatsRecherche.map((offre) => (
                <SwiperSlide>
                  <Offre offre={offre} key={offre["offreId"]} />
                </SwiperSlide>
              ))
              : offreData.map((offre) => (
                <SwiperSlide>
                  <Offre offre={offre} key={offre["offreId"]} />
                </SwiperSlide>
              ))}
          </Swiper>
          <Dialog
            open={targetOffre != null}
            fullWidth
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle className="text-center fw-bold">
              Remplir vos informations
            </DialogTitle>
            <DialogContent>
              <form
                onSubmit={handleSubmit}
                method="post"
                encType="multipart/form-data"
              >
                <div className="row">
                  <div className="col-md mb-2 mt-2">
                    <TextField
                      sx={{ width: "100%" }}
                      id="outlined-basic"
                      label="Nom"
                      name="nom"
                      required
                      value={condidatureFormState.nom}
                      onChange={handleCondidatureFormStateChange}
                      variant="outlined"
                    />
                  </div>
                  <div className="col-md mb-2 mt-2">
                    <TextField
                      sx={{ width: "100%" }}
                      id="outlined-basic"
                      label="Prenom"
                      name="prenom"
                      required
                      value={condidatureFormState.prenom}
                      onChange={handleCondidatureFormStateChange}
                      variant="outlined"
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md mb-2 mt-2">
                    <TextField
                      sx={{ width: "100%" }}
                      id="outlined-basic"
                      label="Tel"
                      required
                      name="tel"
                      value={condidatureFormState.tel}
                      onChange={handleCondidatureFormStateChange}
                      variant="outlined"
                    />
                  </div>
                  <div className="col-md mb-2 mt-2">
                    <TextField
                      sx={{ width: "100%" }}
                      id="outlined-basic"
                      label="Adresse"
                      required
                      name="adresse"
                      value={condidatureFormState.adresse}
                      onChange={handleCondidatureFormStateChange}
                      variant="outlined"
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md mb-2 mt-2">
                    <TextField
                      sx={{ width: "100%" }}
                      id="outlined-basic"
                      label="Ville"
                      name="ville"
                      required
                      value={condidatureFormState.ville}
                      onChange={handleCondidatureFormStateChange}
                      variant="outlined"
                    />
                  </div>
                  <div className="col-md mb-2 mt-2">
                    <TextField
                      sx={{ width: "100%" }}
                      id="outlined-basic"
                      label="Email"
                      name="email"
                      required
                      value={condidatureFormState.email}
                      onChange={handleCondidatureFormStateChange}
                      variant="outlined"
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md mb-2 mt-2">
                    <FormControl sx={{ width: "100%" }}>
                      <InputLabel id="demo-multiple-name-label">
                        Genre
                      </InputLabel>
                      <Select
                        labelId="demo-multiple-name-label"
                        id="demo-multiple-name"
                        name="genre"
                        value={condidatureFormState.genre}
                        onChange={handleCondidatureFormStateChange}
                        input={<OutlinedInput label="Genre" />}
                      >
                        {["HOMME", "FEMME"].map((c) => (
                          <MenuItem key={c} value={c}>
                            {c}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                  <div className="col-md mb-2 mt-2 py-2">
                    <Button
                      component="label"
                      variant="contained"
                      tabIndex={-1}
                      sx={{ width: "100%" }}
                      startIcon={<FileUploadIcon />}
                    >
                      CV
                      <VisuallyHiddenInput
                        required
                        name="file"
                        onChange={(e) => {
                          setCondidatureFormState((pre) => ({
                            ...pre,
                            CV: e.target.files[0],
                          }));
                        }}
                        type="file"
                      />
                    </Button>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md mb-2 mt-2">
                    <TextField
                      multiline
                      sx={{ width: "100%" }}
                      id="outlined-basic"
                      label="Motivation"
                      variant="outlined"
                      required
                      name="motivation"
                      value={condidatureFormState.motivation}
                      onChange={handleCondidatureFormStateChange}
                    />
                  </div>
                </div>
                <div className="row mx-1">
                  <Button
                    variant="contained"
                    color="info"
                    className="special"
                    type="submit"
                  >
                    Comfirmer
                  </Button>
                </div>
              </form>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="secondary" variant="text">
                Annuler
              </Button>
            </DialogActions>
          </Dialog>
          <Snackbar
            open={showSnackBar}
            autoHideDuration={6000}
            onClose={handleCloseSnackBar}
          >
            <Alert
              onClose={handleCloseSnackBar}
              severity="success"
              variant="filled"
              sx={{ width: "100%" }}
            >
              Condidature enregistrée avec succès!!{" "}
              <span className="fw-bold "> Bonne Chance</span>
            </Alert>
          </Snackbar>
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
        </div>
      </TargetOffreContext.Provider>
    </Suspense>
  );
};
export default Home;
