import {
  Alert,
  Autocomplete,
  Backdrop,
  Box,
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
  MenuItem,
  OutlinedInput,
  Select,
  Slide,
  Snackbar,
  styled,
  Tab,
  Tabs,
  TextField,
} from "@mui/material";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import React, { createContext, useContext, useEffect, useState } from "react";
import Paiement from "./Paiement";
import axios from "axios";
import { Add } from "@mui/icons-material";
import {
  LocalizationProvider,
  MobileDateTimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import ResultatRecherche from "../ResultatRecherche";
import { AppThemeContext } from "../AdminMainPage";
import { AuthenticatedUserContext } from "../../App";

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

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

//===========================================CONTEXTS============================================

export const AddPaiementClickedContext = createContext();
export const EditPaiementContext = createContext();
export const DeletePaiementContext = createContext();
export const SelectedEmployeIdForPaiementContext = createContext();

//===========================================CONTEXTS============================================
const Paiements = () => {
  const authenticatedUser = useContext(AuthenticatedUserContext)[0];
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const appTheme = useContext(AppThemeContext)[0];
  const handleCloseBackdrop = () => {
    setOpenBackdrop(false);
  };
  const handleOpenBackdrop = () => {
    setOpenBackdrop(true);
  };
  const [paiementsList, setPaiementsList] = useState([]);
  const [addPaiementClicked, setAddPaiementClicked] = useState(false);
  const [editPaiement, setEditPaiement] = useState(null);
  const [deletePaiement, setDeletePaiement] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [categories, setCategories] = useState([]);
  const [corps, setCorps] = useState([]);
  const [cadres, setCadres] = useState([]);
  const [grades, setGrades] = useState([]);
  const [indices, setIndices] = useState([]);
  const [entites, setEntites] = useState([]);
  const [postes, setPostes] = useState([]);
  const [employes, setEmployes] = useState([]);
  const [resultRechercheAvancee, setResultRechercheAvancee] = useState([]);
  const [salaire, setSalaire] = useState("");
  const [showAddPaiementSnackBar, setShowAddPaiementSnackBar] = useState(false);
  const [showUpdatePaiementSnackBar, setShowUpdatePaiementSnackBar] =
    useState(false);
  const [showDeletePaiementSnackBar, setShowDeletePaiementSnackBar] =
    useState(false);
  const [categorieId, setCategorieId] = useState(null);
  const [corpsId, setCorpsId] = useState(null);
  const [cadreId, setCadreId] = useState(null);
  const [gradeId, setGradeId] = useState(null);
  const [indiceId, setIndiceId] = useState(null);
  const [entiteId, setEntiteId] = useState(null);
  const [posteId, setPosteId] = useState(null);
  const [periode, setPeriode] = useState("cette semaine");
  const handlePeriodeChange = (e) => {
    setPeriode(e.target.value);
    handleOpenBackdrop();
    setTimeout(() => {
      handleCloseBackdrop();
    }, 2000);
  };
  const [rechercheAvanceeClicked, setRechercheAvanceeClicked] = useState(false);
  const [page, setPage] = React.useState(1);
  const [displayedPaiements, setDisplayedPaiements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reloading, setReloading] = useState(false);
  const [paiementFormState, setPaiementFormState] = useState({
    montant: 0,
    datePaiement: null,
    typePaiement: null,
    recu: null,
    employeId: "",
  });
  const [selectedEmployeId, setSelectedEmployeId] = useState(null);
  window.addEventListener("resize", function () {
    setWindowWidth(window.innerWidth);
  });
  const handleAddPaiementSnackBarClose = () => {
    setShowAddPaiementSnackBar(false);
  };
  const handleAddPaiementSnackBarOpen = () => {
    setShowAddPaiementSnackBar(true);
  };
  const handleUpdatePaiementSnackBarClose = () => {
    setShowUpdatePaiementSnackBar(false);
  };
  const handleUpdatePaiementSnackBarOpen = () => {
    setShowUpdatePaiementSnackBar(true);
  };
  const handleDeletePaiementSnackBarClose = () => {
    setShowDeletePaiementSnackBar(false);
  };
  const handleDeletePaiementSnackBarOpen = () => {
    setShowDeletePaiementSnackBar(true);
  };
  const handleAddPaiementClose = () => {
    setAddPaiementClicked(false);
    setPaiementFormState({
      montant: 0,
      datePaiement: null,
      typePaiement: null,
      recu: null,
      employeId: "",
    });
    setCurrentTab(0);
  };
  const [typePaiement, setTypePaiement] = useState("TOUS");
  const handleTypePaiementChange = (e) => {
    setTypePaiement(e.target.value);
    handleOpenBackdrop();
    setTimeout(() => {
      handleCloseBackdrop();
    }, 2000);
  };
  const handleAddPaiementOpen = () => {
    setAddPaiementClicked(true);
    handleEditPaiementClose();
  };
  const handleEditPaiementClose = () => {
    setEditPaiement(null);
    setPaiementFormState({
      montant: 0,
      datePaiement: null,
      typePaiement: null,
      recu: null,
      employeId: "",
    });
  };
  const handleDeletePaiementClose = () => {
    setDeletePaiement(null);
  };

  const handleCalculerSalaire = async () => {
    try {
      let response = await axios.get(
        `http://localhost:8888/PAIE-SERVICE/paies/calculer-salaire/${selectedEmployeId}`,
        {
          headers: {
            Authorization: `Bearer ${authenticatedUser["access-token"]}`,
          },
        }
      );
      if (response.status === 200) {
        alert(response.data);
        setSalaire(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePaiementFormStateChange = (e) => {
    let { name, value } = e.target;
    setPaiementFormState((pre) => ({ ...pre, [name]: value }));
  };
  const handleDeletePaiement = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:8888/PAIE-SERVICE/paies/${deletePaiement}`,
        {
          headers: {
            Authorization: `Bearer ${authenticatedUser["access-token"]}`,
          },
        }
      );
      if (response.status === 200) {
    
        handleDeletePaiementClose();
        handleDeletePaiementSnackBarOpen();
        setReloading((pre) => !pre);
      }
    } catch (error) {
      console.error("Error deleting paiement ", error);
      throw error;
    }
  };
  const handleSelectedEmploye = (newValue) => {
    setSelectedEmployeId(
      employes.find((e) => e.nom + " " + e.prenom === newValue)?.id
    );
    setCurrentTab(1);
  };
  useEffect(() => {
    if (editPaiement != null) {
      handleAddPaiementClose();
      const targetPaiement = paiementsList.find(
        (e) => e["id"] === editPaiement
      );
      setPaiementFormState({
        employeId: targetPaiement["employeId"],
        montant: targetPaiement["montant"],
        datePaiement: dayjs(targetPaiement["datePaiement"]),
        typePaiement: targetPaiement["typePaiement"],
        recu: targetPaiement["recu"],
      });
    }
  }, [editPaiement, paiementsList]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const paiementsResponse = await axios.get(
          `http://localhost:8888/PAIE-SERVICE/paies`,
          {
            headers: {
              Authorization: `Bearer ${authenticatedUser["access-token"]}`,
            },
          }
        );
        setPaiementsList(paiementsResponse.data);
        setDisplayedPaiements(
          paiementsResponse.data.slice(page * 2 - 2, page * 2)
        );
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [reloading]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const paiementsResponse = await axios.get(
          `http://localhost:8888/PAIE-SERVICE/paies`,
          {
            headers: {
              Authorization: `Bearer ${authenticatedUser["access-token"]}`,
            },
          }
        );
        setPaiementsList(paiementsResponse.data.reverse());
        setDisplayedPaiements(
          paiementsResponse.data.reverse().slice(page * 2 - 2, page * 2)
        );

        const employesResponse = await axios.get(
          "http://localhost:8888/EMPLOYE-SERVICE/employes",
          {
            headers: {
              Authorization: `Bearer ${authenticatedUser["access-token"]}`,
            },
          }
        );
        setEmployes(employesResponse.data);

        const categoriesResponse = await axios.get(
          "http://localhost:8888/EMPLOYE-SERVICE/categories",
          {
            headers: {
              Authorization: `Bearer ${authenticatedUser["access-token"]}`,
            },
          }
        );
        setCategories(categoriesResponse.data);

        const corpsResponse = await axios.get(
          "http://localhost:8888/EMPLOYE-SERVICE/corps",
          {
            headers: {
              Authorization: `Bearer ${authenticatedUser["access-token"]}`,
            },
          }
        );
        setCorps(corpsResponse.data);

        const cadresResponse = await axios.get(
          "http://localhost:8888/EMPLOYE-SERVICE/cadres",
          {
            headers: {
              Authorization: `Bearer ${authenticatedUser["access-token"]}`,
            },
          }
        );
        setCadres(cadresResponse.data);

        const gradesResponse = await axios.get(
          `http://localhost:8888/EMPLOYE-SERVICE/grades`,
          {
            headers: {
              Authorization: `Bearer ${authenticatedUser["access-token"]}`,
            },
          }
        );
        setGrades(gradesResponse.data);

        const indicesResponse = await axios.get(
          "http://localhost:8888/EMPLOYE-SERVICE/indices",
          {
            headers: {
              Authorization: `Bearer ${authenticatedUser["access-token"]}`,
            },
          }
        );
        setIndices(indicesResponse.data);

        const entitesResponse = await axios.get(
          "http://localhost:8888/EMPLOYE-SERVICE/entites",
          {
            headers: {
              Authorization: `Bearer ${authenticatedUser["access-token"]}`,
            },
          }
        );
        setEntites(entitesResponse.data);

        const postesResponse = await axios.get(
          "http://localhost:8888/EMPLOYE-SERVICE/postes",
          {
            headers: {
              Authorization: `Bearer ${authenticatedUser["access-token"]}`,
            },
          }
        );
        setPostes(postesResponse.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page]);

  const handleDoSearch = () => {
    const result = employes.filter((e) => {
      let entitesList = e["entites"];
      let lastEntiteId = entitesList[entitesList?.length - 1]["entiteId"];

      return (
        entiteId === lastEntiteId &&
        e["poste"]["id"] === posteId &&
        e["indiceEchelon"]["id"] === indiceId
      );
    });
    setResultRechercheAvancee(result);
    setSelectedEmployeId(null);
    setCurrentTab(1);
  };

  const handlePaiementSubmit = async (e) => {
    e.preventDefault();
    try {
      if (addPaiementClicked) {
        const response = await axios.post(
          `http://localhost:8888/PAIE-SERVICE/paies`,
          {
            ...paiementFormState,
            datePaiement: dayjs(paiementFormState.datePaiement).format(
              "YYYY-MM-DD HH:mm:ss"
            ),
            employeId: selectedEmployeId,
          },
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${authenticatedUser["access-token"]}`,
            },
          }
        );

        handleAddPaiementClose();
        handleEditPaiementClose();
        handleAddPaiementSnackBarOpen();
        setReloading((pre) => !pre);
      }
      if (editPaiement != null) {
        const response2 = await axios.put(
          `http://localhost:8888/PAIE-SERVICE/paies/${editPaiement}`,
          {
            ...paiementFormState,
            datePaiement: dayjs(paiementFormState.datePaiement).format(
              "YYYY-MM-DD"
            ),
          },
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${authenticatedUser["access-token"]}`,
            },
          }
        );

        handleAddPaiementClose();
        handleEditPaiementClose();
        handleUpdatePaiementSnackBarOpen();
        setReloading((pre) => !pre);
      }
    } catch (error) {
      console.error("Error ", error);
      throw error;
    }
  };
  const handleTabChange = (event, newValue) => {
    if (
      (selectedEmployeId === null &&
        !rechercheAvanceeClicked &&
        newValue === 1) ||
      (selectedEmployeId === null && rechercheAvanceeClicked && newValue === 2)
    ) {
      return;
    }
    setCurrentTab(newValue);
  };

  const handleChange = (event, value) => {
    setPage(value);
    setDisplayedPaiements(paiementsList.slice(value * 2 - 2, value * 2));
  };

  const handleToggleRechercheAvancee = () => {
    setRechercheAvanceeClicked((pre) => !pre);
  };

  const handleCategorieChange = (e) => {
    setCategorieId(e.target.value);
  };
  const handleCorpsChange = (e) => {
    setCorpsId(e.target.value);
  };
  const handlePosteChange = (e) => {
    setPosteId(e.target.value);
  };
  const handleCadreChange = (e) => {
    setCadreId(e.target.value);
  };
  const handleIndiceChange = (e) => {
    setIndiceId(e.target.value);
  };
  const handleEntiteChange = (e) => {
    setEntiteId(e.target.value);
  };
  const handleGradeChange = (e) => {
    setGradeId(e.target.value);
  };
  const getCorpsWithCategorieId = (categorieId) => {
    const result = corps.filter((c) => c["categorie"]["id"] === categorieId);
    return result;
  };
  const getCadresWithCorpsId = (corpsId) => {
    const result = cadres.filter((c) => c["corps"]["id"] === corpsId);
    return result;
  };

  const getGradesWithCadreId = (cadreId) => {
    const result = grades.filter((c) => c["cadre"]["id"] === cadreId);
    return result;
  };
  const getIndicesWithGradeId = (gradeId) => {
    const result = indices.filter((c) => c["gradeId"] === gradeId);
    return result;
  };
  const employeOptions = employes.map(
    (e) => e.id !== authenticatedUser.employeId && e.nom + " " + e.prenom
  );

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
    <SelectedEmployeIdForPaiementContext.Provider
      value={[selectedEmployeId, setSelectedEmployeId]}
    >
      <AddPaiementClickedContext.Provider
        value={[addPaiementClicked, setAddPaiementClicked]}
      >
        <EditPaiementContext.Provider value={[editPaiement, setEditPaiement]}>
          <DeletePaiementContext.Provider
            value={[deletePaiement, setDeletePaiement]}
          >
            <div className="container">
              <div className="row  mt-2">
                <div className="offset-md-11 col-md-1 ">
                  <Button
                    color="primary"
                    onClick={handleAddPaiementOpen}
                    variant="contained"
                    style={{ borderRadius: "50%", minHeight: 60 }}
                  >
                    <Add />
                  </Button>
                </div>
              </div>

              <div className="row justify-content-end">
                <div className="col-md-3 mt-3">
                  <FormControl
                    sx={{
                      width: "100%",
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: appTheme !== "light" ? "#FFFFFF" : "",
                          borderRadius: "10px",
                        },
                      },
                      "& .MuiInputLabel-root": {
                        color: appTheme !== "light" ? "#FFFFFF" : "",
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: appTheme !== "light" ? "#FFFFFF" : "",
                      },
                    }}
                    size="small"
                  >
                    <InputLabel id="demo-controlled-open-select-label">
                      periode
                    </InputLabel>
                    <Select
                      className="rounded-3"
                      labelId="demo-controlled-open-select-label"
                      id="demo-controlled-open-select"
                      value={periode}
                      label="periode"
                      onChange={handlePeriodeChange}
                      sx={{
                        width: "100%",
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: appTheme !== "light" ? "#FFFFFF" : "",
                            borderRadius: "10px",
                          },
                        },
                        "& .MuiSelect-select": {
                          color: appTheme !== "light" ? "#FFFFFF" : "#000000",
                        },
                        "& .MuiSvgIcon-root": {
                          color: appTheme !== "light" ? "#FFFFFF" : "#000000",
                        },
                      }}
                    >
                      <MenuItem value={"cette semaine"}>cette semaine</MenuItem>
                      <MenuItem value={"derniere semaine"}>
                        derniere semaine
                      </MenuItem>
                      <MenuItem value={"dernier mois"}>dernier mois</MenuItem>
                      <MenuItem value={"derniere annee"}>
                        derniere annee
                      </MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div className="col-md-3 mt-3">
                  <FormControl
                    sx={{
                      width: "100%",
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: appTheme !== "light" ? "#FFFFFF" : "",
                          borderRadius: "10px",
                        },
                      },
                      "& .MuiInputLabel-root": {
                        color: appTheme !== "light" ? "#FFFFFF" : "",
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: appTheme !== "light" ? "#FFFFFF" : "",
                      },
                    }}
                    size="small"
                  >
                    <InputLabel id="demo-controlled-open-select-label">
                      Type paiement
                    </InputLabel>
                    <Select
                      className="rounded-3"
                      labelId="demo-controlled-open-select-label"
                      id="demo-controlled-open-select"
                      value={typePaiement}
                      label="Type paiement"
                      onChange={handleTypePaiementChange}
                      sx={{
                        width: "100%",
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: appTheme !== "light" ? "#FFFFFF" : "",
                            borderRadius: "10px",
                          },
                        },

                        "& .MuiSelect-select": {
                          color: appTheme !== "light" ? "#FFFFFF" : "#000000",
                        },

                        "& .MuiSvgIcon-root": {
                          color: appTheme !== "light" ? "#FFFFFF" : "#000000",
                        },
                      }}
                    >
                      {["CASH", "ESPECE", "CHEQUE",
                        "CARTE_BANCAIRE",
                        "VIREMENT_BANCAIRE"].map((c) => (
                        <MenuItem key={c} value={c}>
                          {c}
                        </MenuItem>
                      ))}
                      <MenuItem key={"TOUS"} value={"TOUS"}>
                        TOUS
                      </MenuItem>
                    </Select>
                  </FormControl>
                </div>
              </div>
              <div className="row mt-2 text-secondary fs-4 mb-2 p-2">
                Derniers paiements effectues <Divider color="info" />
              </div>

              {windowWidth > 1000 && (
                <div className="row fw-bold p-2">
                  <div className="col-md-4 mb-3">employé</div>
                  <div className="col-md-2 mb-3">montant</div>
                  <div className="col-md-2 mb-3">date de paiement</div>
                  <div className="col-md-2 mb-3">type paiement</div>
                  <div className="col-md-2 mb-3">reçu</div>
                </div>
              )}

              {paiementsList?.map((paiement) => {
                return (
                  <Paiement
                    key={paiement.id}
                    paiement={paiement}
                    windowWidth={windowWidth}
                    entites={entites}
                  />
                );
              })}
              <form
                method={addPaiementClicked ? "POST" : "PUT"}
                onSubmit={handlePaiementSubmit}
              >
                <Dialog
                  open={addPaiementClicked || editPaiement != null}
                  fullWidth
                  maxWidth="md"
                  TransitionComponent={Transition}
                  keepMounted
                  onClose={
                    addPaiementClicked
                      ? handleAddPaiementClose
                      : handleEditPaiementClose
                  }
                  aria-describedby="alert-dialog-slide-description"
                >
                  <DialogTitle className="text-center fw-bold">
                    {addPaiementClicked
                      ? "Ajouter un paiement"
                      : "modifier un paiement"}
                  </DialogTitle>
                  <DialogContent>
                    {editPaiement == null ? (
                      <>
                        <div className="row ">
                          <Tabs value={currentTab} onChange={handleTabChange}>
                            <Tab
                              label="Rechercher un employe"
                              sx={{ textTransform: "lowercase" }}
                            />
                            {rechercheAvanceeClicked && (
                              <Tab
                                label="Resultat recherche"
                                sx={{ textTransform: "lowercase" }}
                              />
                            )}
                            <Tab
                              label="Ajouter un paiement"
                              sx={{ textTransform: "lowercase" }}
                            />
                          </Tabs>
                        </div>

                        <CustomTabPanel value={currentTab} index={0}>
                          <div className="row">
                            <div className="col-md-7 mt-2">
                              <Autocomplete
                                disabled={rechercheAvanceeClicked}
                                size="small"
                                options={employeOptions}
                                sx={{ width: "100%" }}
                                onChange={(event, newValue) =>
                                  handleSelectedEmploye(newValue)
                                }
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="rechercher employé par nom complet"
                                  />
                                )}
                              />
                            </div>

                            <div className="col-md-3 offset-md-2 mt-2">
                              <center>
                                <Button
                                  style={{ backgroundColor: "#1976D2" }}
                                  onClick={handleToggleRechercheAvancee}
                                  className="text-light border border-1 text-lowercase border-info rounded-pill"
                                >
                                  Recherche avancée
                                </Button>
                              </center>
                            </div>
                          </div>
                          {rechercheAvanceeClicked && (
                            <>
                              <div className="row">
                                <div className="col-md mt-2">
                                  <FormControl fullWidth size="small">
                                    <InputLabel id="demo-simple-select-label">
                                      Catégorie
                                    </InputLabel>
                                    <Select
                                      label="Catégorie"
                                      name="categorieId"
                                      value={categorieId}
                                      onChange={handleCategorieChange}
                                    >
                                      {categories.map((c) => (
                                        <MenuItem value={c["id"]} key={c["id"]}>
                                          {c.name}
                                        </MenuItem>
                                      ))}
                                    </Select>
                                  </FormControl>
                                </div>
                                <div className="col-md mt-2">
                                  <FormControl fullWidth size="small">
                                    <InputLabel id="demo-simple-select-label">
                                      Corps
                                    </InputLabel>
                                    <Select
                                      labelId="demo-simple-select-label"
                                      id="demo-simple-select"
                                      label="Corps"
                                      name="corpsId"
                                      value={corpsId}
                                      onChange={handleCorpsChange}
                                    >
                                      {getCorpsWithCategorieId(categorieId).map(
                                        (c) => (
                                          <MenuItem
                                            value={c["id"]}
                                            key={c["id"]}
                                          >
                                            {c.label}
                                          </MenuItem>
                                        )
                                      )}
                                    </Select>
                                  </FormControl>
                                </div>
                              </div>
                              <div className="row">
                                <div className="col-md mt-2">
                                  <FormControl fullWidth size="small">
                                    <InputLabel id="demo-simple-select-label">
                                      Cadre
                                    </InputLabel>
                                    <Select
                                      labelId="demo-simple-select-label"
                                      id="demo-simple-select"
                                      label="Cadre"
                                      name="cadreId"
                                      value={cadreId}
                                      onChange={handleCadreChange}
                                    >
                                      {getCadresWithCorpsId(corpsId).map(
                                        (c) => (
                                          <MenuItem
                                            value={c["id"]}
                                            key={c["id"]}
                                          >
                                            {c.label}
                                          </MenuItem>
                                        )
                                      )}
                                    </Select>
                                  </FormControl>
                                </div>
                                <div className="col-md mt-2">
                                  <FormControl fullWidth size="small">
                                    <InputLabel id="demo-simple-select-label">
                                      Grade
                                    </InputLabel>
                                    <Select
                                      labelId="demo-simple-select-label"
                                      id="demo-simple-select"
                                      label="Grade"
                                      name="gradeId"
                                      value={gradeId}
                                      onChange={handleGradeChange}
                                    >
                                      {getGradesWithCadreId(cadreId).map(
                                        (c) => (
                                          <MenuItem
                                            value={c["id"]}
                                            key={c["id"]}
                                          >
                                            {c.label}
                                          </MenuItem>
                                        )
                                      )}
                                    </Select>
                                  </FormControl>
                                </div>
                              </div>
                              <div className="row">
                                <div className="col-md mt-2">
                                  <FormControl fullWidth size="small">
                                    <InputLabel id="demo-simple-select-label">
                                      Indice Echelon
                                    </InputLabel>
                                    <Select
                                      labelId="demo-simple-select-label"
                                      id="demo-simple-select"
                                      label="Indice Echelon"
                                      name="indiceEchelonId"
                                      value={indiceId}
                                      onChange={handleIndiceChange}
                                    >
                                      {getIndicesWithGradeId(gradeId).map(
                                        (c) => (
                                          <MenuItem
                                            value={c["id"]}
                                            key={c["id"]}
                                          >
                                            {c.indice}
                                            {"-"}
                                            {c.echelon}
                                          </MenuItem>
                                        )
                                      )}
                                    </Select>
                                  </FormControl>
                                </div>
                                <div className="col-md mt-2">
                                  <FormControl fullWidth size="small">
                                    <InputLabel id="demo-simple-select-label">
                                      Entité
                                    </InputLabel>
                                    <Select
                                      labelId="demo-simple-select-label"
                                      id="demo-simple-select"
                                      label="Entité"
                                      name="entiteId"
                                      value={entiteId}
                                      onChange={handleEntiteChange}
                                    >
                                      {entites.map((e) => (
                                        <MenuItem key={e["id"]} value={e["id"]}>
                                          {e["name"]}
                                        </MenuItem>
                                      ))}
                                    </Select>
                                  </FormControl>
                                </div>
                              </div>
                              <div className="row">
                                <div className="col-md-6 mt-2">
                                  <FormControl fullWidth size="small">
                                    <InputLabel id="demo-simple-select-label">
                                      Poste
                                    </InputLabel>
                                    <Select
                                      labelId="demo-simple-select-label"
                                      id="demo-simple-select"
                                      label="Poste"
                                      name="posteId"
                                      value={posteId}
                                      onChange={handlePosteChange}
                                    >
                                      {postes.map((e) => (
                                        <MenuItem value={e["id"]}>
                                          {e["label"]}
                                        </MenuItem>
                                      ))}
                                    </Select>
                                  </FormControl>
                                </div>
                              </div>
                              <div className="row p-3">
                                <Button
                                  variant="contained"
                                  color="success"
                                  onClick={handleDoSearch}
                                >
                                  rechercher
                                </Button>
                              </div>
                            </>
                          )}
                        </CustomTabPanel>
                        <CustomTabPanel
                          value={currentTab}
                          index={rechercheAvanceeClicked ? 2 : 1}
                        >
                          <form method="post" onSubmit={handlePaiementSubmit}>
                            <center className="fw-bold text-primary fs-4 mb-3">
                              {
                                employes.find(
                                  (e) => e["id"] === selectedEmployeId
                                )?.nom
                              }{" "}
                              {
                                employes.find(
                                  (e) => e["id"] === selectedEmployeId
                                )?.prenom
                              }
                            </center>
                            {selectedEmployeId !== null && (
                              <div className="row mb-3">
                                <Button
                                  variant="contained"
                                  size="large"
                                  color="primary"
                                  onClick={handleCalculerSalaire}
                                >
                                  Calculer le salaire
                                </Button>
                              </div>
                            )}
                            {salaire.length > 0 && (
                              <div className="text-center mb-2 fw-bold">{salaire.slice(0,salaire.lastIndexOf("."))}</div>
                            )}
                            <div className="row">
                              <div className="col-md mt-2">
                                <TextField
                                  required
                                  sx={{ width: "100%" }}
                                  id="outlined-basic"
                                  label="Montant"
                                  name="montant"
                                  type="number"
                                  value={paiementFormState.montant}
                                  onChange={handlePaiementFormStateChange}
                                  variant="outlined"
                                  className="me-2"
                                />
                              </div>
                              <div className="col-md mt-2">
                                <LocalizationProvider
                                  dateAdapter={AdapterDayjs}
                                >
                                  <MobileDateTimePicker
                                    closeOnSelect
                                    value={paiementFormState.datePaiement}
                                    onChange={(newValue) =>
                                      setPaiementFormState((pre) => ({
                                        ...pre,
                                        datePaiement: newValue,
                                      }))
                                    }
                                    sx={{ width: "100%" }}
                                    label="Date de paiement"
                                  />
                                </LocalizationProvider>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-md mt-3">
                                <FormControl sx={{ width: "100%" }}>
                                  <InputLabel id="demo-multiple-name-label">
                                    Type de paiement
                                  </InputLabel>
                                  <Select
                                    labelId="demo-multiple-name-label"
                                    id="demo-multiple-name"
                                    name="typePaiement"
                                    value={paiementFormState.typePaiement}
                                    onChange={handlePaiementFormStateChange}
                                    input={
                                      <OutlinedInput label="Type de paiement" />
                                    }
                                  >
                                    {["CASH", "ESPECE", "CHEQUE",
                                      "CARTE_BANCAIRE",
                                      "VIREMENT_BANCAIRE"].map((c) => (
                                      <MenuItem key={c} value={c}>
                                        {c}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              </div>
                              <div className="col-md mt-3">
                                <div className="row">
                                  <div className="col-md-5">
                                    <Button
                                      component="label"
                                      variant="contained"
                                      tabIndex={-1}
                                      sx={{
                                        textTransform: "lowercase",
                                        width: "100%",
                                      }}
                                      startIcon={
                                        paiementFormState.recu === null ? (
                                          <CloudUploadIcon />
                                        ) : null
                                      }
                                    >
                                      {paiementFormState.recu === null
                                        ? "recu"
                                        : `${paiementFormState.recu.name.slice(
                                            0,
                                            12
                                          )}${paiementFormState.recu.name.slice(
                                            paiementFormState.recu.name.lastIndexOf(
                                              "."
                                            )
                                          )}`}
                                      <VisuallyHiddenInput
                                        required
                                        name="recu"
                                        onChange={(e) => {
                                          setPaiementFormState((pre) => ({
                                            ...pre,
                                            recu: e.target.files[0],
                                          }));
                                        }}
                                        type="file"
                                      />
                                    </Button>
                                  </div>
                                  <div className="col-md-7 mt-2">
                                    <span
                                      className={`rounded-pill text-light p-2 ${
                                        paiementFormState.recu === null
                                          ? "bg-danger"
                                          : "bg-success"
                                      }`}
                                    >
                                      {paiementFormState.recu === null
                                        ? "Aucun recu selectionne"
                                        : "recu selectionne"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="row mt-3 p-2">
                              <Button
                                variant="contained"
                                color="secondary"
                                type="submit"
                              >
                                ajouter
                              </Button>
                            </div>
                          </form>
                        </CustomTabPanel>
                        {rechercheAvanceeClicked && (
                          <CustomTabPanel value={currentTab} index={1}>
                            {resultRechercheAvancee.length === 0 ? (
                              <center>aucun résultat</center>
                            ) : (
                              <>
                                <div className="text-info d-flex justify-content-between fs-4">
                                  <div>
                                    {resultRechercheAvancee?.length} resultats
                                  </div>
                                  <div>
                                    <Button
                                      variant="contained"
                                      onClick={() => setCurrentTab(2)}
                                      disabled={selectedEmployeId === null}
                                      color="warning"
                                    >
                                      continuer
                                    </Button>
                                  </div>
                                </div>
                              </>
                            )}
                            {resultRechercheAvancee?.map((item) => (
                              <ResultatRecherche
                                target="paiement"
                                employe={item}
                                key={item.id}
                              />
                            ))}
                          </CustomTabPanel>
                        )}
                      </>
                    ) : (
                      <>
                        <div className="row">
                          <div className="col-md mt-3">
                            <TextField
                              required
                              sx={{ width: "100%" }}
                              id="outlined-basic"
                              label="montant"
                              name="montant"
                              type="number"
                              value={paiementFormState.montant}
                              onChange={handlePaiementFormStateChange}
                              variant="outlined"
                              className="me-2"
                            />
                          </div>

                          <div className="col-md mt-2">
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DemoContainer
                                components={["MobileDateTimePicker"]}
                              >
                                <MobileDateTimePicker
                                  closeOnSelect
                                  value={paiementFormState.datePaiement}
                                  onChange={(newValue) =>
                                    setPaiementFormState((pre) => ({
                                      ...pre,
                                      datePaiement: newValue,
                                    }))
                                  }
                                  sx={{ width: "100%" }}
                                  label="Date de paiement"
                                />
                              </DemoContainer>
                            </LocalizationProvider>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md mt-3">
                            <FormControl sx={{ width: "100%" }}>
                              <InputLabel id="demo-multiple-name-label">
                                Type de paiement
                              </InputLabel>
                              <Select
                                labelId="demo-multiple-name-label"
                                id="demo-multiple-name"
                                name="typePaiement"
                                value={paiementFormState.typePaiement}
                                onChange={handlePaiementFormStateChange}
                                input={
                                  <OutlinedInput label="Type de paiement" />
                                }
                              >
                                  {["CASH", "ESPECE", "CHEQUE",
                                    "CARTE_BANCAIRE",
                                    "VIREMENT_BANCAIRE"].map((c) => (
                                  <MenuItem key={c} value={c}>
                                    {c}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </div>
                          <div className="col-md mt-3 ">
                            <Button
                              component="label"
                              variant="contained"
                              tabIndex={-1}
                              sx={{ textTransform: "lowercase", width: "100%" }}
                              startIcon={<CloudUploadIcon />}
                            >
                              modifier le recu
                              <VisuallyHiddenInput
                                name="recu"
                                onChange={(e) => {
                                 
                                  setPaiementFormState((pre) => ({
                                    ...pre,
                                    recu: e.target.files[0],
                                  }));
                                }}
                                type="file"
                              />
                            </Button>
                          </div>
                        </div>

                        <div className="row mt-3 p-2">
                          <Button variant="contained" color="info">
                            modifier
                          </Button>
                        </div>
                      </>
                    )}
                  </DialogContent>

                  <DialogActions>
                    <Button
                      onClick={
                        addPaiementClicked
                          ? handleAddPaiementClose
                          : handleEditPaiementClose
                      }
                      color="secondary"
                      variant="text"
                    >
                      Annuler
                    </Button>
                  </DialogActions>
                </Dialog>
              </form>
              <Dialog
                open={deletePaiement != null}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleDeletePaiementClose}
                aria-describedby="alert-dialog-slide-description"
              >
                <DialogTitle>
                  Etes-vous sur de supprimer le paiement
                </DialogTitle>
                <DialogContent>
              
                </DialogContent>
                <DialogActions>
                  <Button
                    onClick={handleDeletePaiementClose}
                    color="secondary"
                    variant="text"
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={handleDeletePaiement}
                    color="error"
                    variant="contained"
                  >
                    Confirmer
                  </Button>
                </DialogActions>
              </Dialog>
              <Snackbar
                open={showAddPaiementSnackBar}
                autoHideDuration={4000}
                onClose={handleAddPaiementSnackBarClose}
              >
                <Alert
                  onClose={handleAddPaiementSnackBarClose}
                  severity="success"
                  variant="filled"
                  sx={{ width: "100%" }}
                >
                  Paiement ajoute avec succes!
                </Alert>
              </Snackbar>

              <Snackbar
                open={showUpdatePaiementSnackBar}
                autoHideDuration={4000}
                onClose={handleUpdatePaiementSnackBarClose}
              >
                <Alert
                  onClose={handleUpdatePaiementSnackBarClose}
                  severity="success"
                  variant="filled"
                  sx={{ width: "100%" }}
                >
                  Paiement modifie avec succes!
                </Alert>
              </Snackbar>
              <Snackbar
                open={showDeletePaiementSnackBar}
                autoHideDuration={4000}
                onClose={handleDeletePaiementSnackBarClose}
              >
                <Alert
                  onClose={handleDeletePaiementSnackBarClose}
                  severity="success"
                  variant="filled"
                  sx={{ width: "100%" }}
                >
                  Paiement supprime avec succes!
                </Alert>
              </Snackbar>
              <Backdrop
                sx={(theme) => ({
                  color: "green",
                  zIndex: theme.zIndex.drawer + 1,
                })}
                open={openBackdrop}
                onClick={handleCloseBackdrop}
              >
                <CircularProgress color="inherit" />
              </Backdrop>
            </div>
          </DeletePaiementContext.Provider>
        </EditPaiementContext.Provider>
      </AddPaiementClickedContext.Provider>
    </SelectedEmployeIdForPaiementContext.Provider>
  );
};

export default React.memo(Paiements, (prevProps, nextProps) =>
  Object.is(prevProps, nextProps)
);
