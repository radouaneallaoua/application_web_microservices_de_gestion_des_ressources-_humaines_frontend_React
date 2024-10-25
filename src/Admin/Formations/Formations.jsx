import React, {
  createContext,
  Suspense,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  Button,
  Breadcrumbs,
  Autocomplete,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slide,
  Link,
  CircularProgress,
  Box,
  circularProgressClasses,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  DialogContentText,
  IconButton,
  Backdrop,
  Divider,
} from "@mui/material";

import { GridFilterAltIcon } from "@mui/x-data-grid";
import "../../App.css";
import FormationDetails from "./FormationDetails";

import {
  LocalizationProvider,
  MobileDateTimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import axios from "axios";
import CustomSnackBar from "../CustomSnackBar";
import dayjs from "dayjs";
import { Add, Cancel, Search } from "@mui/icons-material";
import {
  AppThemeContext,
} from "../AdminMainPage";
import { AuthenticatedUserContext } from "../../App";

const Formation = React.lazy(() => import("./Formation"));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const SharedDataContext = createContext();
export const DeleteFormationIdContext = createContext();
export const EditFormationIdContext = createContext();
export const ReloadingContext = createContext();

/////////////////////////COMPONENT///////////////////////////////
const Formations = () => {
  const authenticatedUser = useContext(AuthenticatedUserContext)[0];
  const [openAddFormationDialog, setOpenAddFormationDialog] = useState(false);
  const [formations, setFormations] = useState([]);
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [searchDone, setSearchDone] = useState(false);
  const [deleteFormationId, setDeleteFormationId] = useState(null);
  const [editFormationId, setEditFormationId] = useState(null);
  const appTheme = useContext(AppThemeContext)[0];

  const [showAddFormationSnackBar, setShowAddFormationSnackBar] =
    useState(false);
  const [showDeleteFormationSnackBar, setShowDeleteFormationSnackBar] =
    useState(false);
  const [showEditFormationSnackBar, setShowEditFormationSnackBar] =
    useState(false);

  const [sharedData, setSharedData] = useState({
    competences: [],
    entites: [],
    types: [],
  });
  const [clickedFormation, setClickedFormation] = useState(null);
  const [formSearchState, setFormSearchState] = useState({
    competence: "Toutes",
    prestataire: "Tous",
    dureeMaximale: "Toutes",
  });
  const [reloading, setReloading] = useState(false);
  const [competenceLabel, setCompetenceLabel] = useState(
    sharedData["competences"][0]?.label
  );
  const [prestataires, setPrestataires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formationFormState, setFormationFormState] = useState({
    label: "",
    description: "",
    dateDebut: null,
    dateFin: null,
    dureeEnJours: 1,
    prestataireFormation: "",
    competenceId: null,
    entiteId: "Toutes",
  });
  const [searchResult, setSearchResult] = useState([]);
  const [allEmployeFormations, setAllEmployeFormations] = useState([]);
  const [estUneRecherche, setEstUneRecherche] = useState(false);

  const handleFormationClick = (formationId) => {
    setClickedFormation(formationId);
  };
  const [targetDeleteOrEditFormation, setTargetDeleteOrEditFormation] =
    useState(null);

  const handleFormationFormStateChange = (e) => {
    const { name, value } = e.target;
    setFormationFormState((pre) => ({ ...pre, [name]: value }));
  };

  const handleOpenAddFormationDialog = () => {
    setOpenAddFormationDialog(true);
  };
  const handleCloseAddFormationDialog = () => {
    setOpenAddFormationDialog(false);
  };
  const formationTitresOptions = formations.map((f) => f["label"]);

  const handleSearchCompetenceChange = (newValue) => {
    setFormSearchState((pre) => ({ ...pre, competence: newValue }));
  };
  const handleSearchPrestataireChange = (newValue) => {
    setFormSearchState((pre) => ({ ...pre, prestataire: newValue }));
  };

  const handleCompetenceChange = (newValue) => {
    setCompetenceLabel(newValue);
    const targetCompetence = sharedData["competences"].find(
      (r) => r["label"] === newValue
    );
    setFormationFormState((pre) => ({
      ...pre,
      competenceId: targetCompetence?.id,
    }));
  };

  const handleAddFormationSnackBarClose = () => {
    setShowAddFormationSnackBar(false);
  };

  const handleAddFormationSnackBarOpen = () => {
    setShowAddFormationSnackBar(true);
  };

  const handleDeleteFormationSnackBarClose = () => {
    setShowDeleteFormationSnackBar(false);
  };

  const handleDeleteFormationSnackBarOpen = () => {
    setShowDeleteFormationSnackBar(true);
  };

  const handleEditFormationSnackBarClose = () => {
    setShowEditFormationSnackBar(false);
  };

  const handleEditFormationSnackBarOpen = () => {
    setShowEditFormationSnackBar(true);
  };
  const resetFormationFormState = () => {
    setFormationFormState({
      label: "",
      description: "",
      dateDebut: null,
      dateFin: null,
      dureeEnJours: 1,
      prestataireFormation: "",
      competenceId: 1,
      entiteId: "Toutes",
    });
  };
  const handleResetAllOperations = () => {
    setDeleteFormationId(null);
    setEditFormationId(null);
    handleCloseAddFormationDialog();
    resetFormationFormState();
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const formationsResponse = await axios.get(
          "http://localhost:8888/FORMATION-SERVICE/formations", {
          headers: {
            Authorization: `Bearer ${authenticatedUser["access-token"]}`,
          },
        }
        );
        let result = formationsResponse.data;
        result = result.reverse();
        setFormations(result);
        setPrestataires(result.map((r) => r["prestataireFormation"]));

        const competencesResponse = await axios.get(
          "http://localhost:8888/FORMATION-SERVICE/competences", {
          headers: {
            Authorization: `Bearer ${authenticatedUser["access-token"]}`,
          },
        }
        );
        setSharedData((pre) => ({
          ...pre,
          competences: competencesResponse.data,
        }));

        const entitesResponse = await axios.get(
          "http://localhost:8888/EMPLOYE-SERVICE/entites", {
          headers: {
            Authorization: `Bearer ${authenticatedUser["access-token"]}`,
          },
        }
        );
        setSharedData((pre) => ({ ...pre, entites: entitesResponse.data }));

        const typesResponse = await axios.get(
          "http://localhost:8888/EMPLOYE-SERVICE/types", {
          headers: {
            Authorization: `Bearer ${authenticatedUser["access-token"]}`,
          },
        }
        );
        setSharedData((pre) => ({ ...pre, types: typesResponse.data }));
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();

    if (loading) {
      setLoading(false);
    }
  }, [reloading, loading]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (authenticatedUser.role === "EMPLOYE") {
          const response = await axios.get(
            "http://localhost:8888/FORMATION-SERVICE/formations/employe-formations",
            {
              headers: {
                Authorization: `Bearer ${authenticatedUser["access-token"]}`,
              },
            }
          );
          const result = response.data;
          const authenticatedEmployeFormations = result.filter(
            (f) => f["employeId"] === authenticatedUser.employeId
          );
          setAllEmployeFormations(authenticatedEmployeFormations);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [formations, authenticatedUser.employeId,]);

  const handleCloseBackdrop = () => setOpenBackdrop(false);
  const handleOpenBackdrop = () => setOpenBackdrop(true);

  useEffect(() => {
    if (editFormationId !== null) {
      let f = formations.find((f) => f["id"] === editFormationId);
      setFormationFormState({
        label: f.label,
        description: f.description,
        dateDebut: dayjs(f.dateDebut),
        dateFin: dayjs(f.dateFin),
        dureeEnJours: f.dureeEnJours,
        prestataireFormation: f.prestataireFormation,
        competenceId: f.competenceId,
        entiteId: "Toutes",
      });
      setTargetDeleteOrEditFormation(f);
    } else if (deleteFormationId !== null) {
      let f = formations.find((f) => f["id"] === deleteFormationId);
      setFormationFormState({
        label: f.label,
        description: f.description,
        dateDebut: dayjs(f.dateDebut),
        dateFin: dayjs(f.dateFin),
        dureeEnJours: f.dureeEnJours,
        prestataireFormation: f.prestataireFormation,
        competenceId: f.competenceId,
        entiteId: "Toutes",
      });
      setTargetDeleteOrEditFormation(f);
    }
  }, [editFormationId, deleteFormationId, formations]);

  ///////////////////////////ADD FORMATION/////////////////////////
  const handleAddFormation = async (event) => {
    event.preventDefault();
    try {
      if (formationFormState.entiteId !== "Toutes") {
        const response = await axios.post(
          "http://localhost:8888/FORMATION-SERVICE/formations",
          {
            label: formationFormState.label,
            description: formationFormState.description,
            dureeEnJours: formationFormState.dureeEnJours,
            dateDebut: formationFormState.dateDebut,
            dateFin: formationFormState.dateFin,
            competenceId: formationFormState.competenceId,
            prestataireFormation: formationFormState.prestataireFormation,
          }, {
          headers: {
            Authorization: `Bearer ${authenticatedUser["access-token"]}`,
          },
        }
        );
        const result = response.data;

        await axios.post(
          "http://localhost:8888/FORMATION-SERVICE/formations/entite-formation",
          {
            entiteId: formationFormState.entiteId,
            formationId: result.id,
            dateAjout: formationFormState.dateDebut,
            dateFin: formationFormState.dateFin,
          }, {
          headers: {
            Authorization: `Bearer ${authenticatedUser["access-token"]}`,
          },
        }
        );
      } else {
        await axios.post(
          "http://localhost:8888/FORMATION-SERVICE/formations/add-all-entites-to-formation",
          {
            label: formationFormState.label,
            description: formationFormState.description,
            dureeEnJours: formationFormState.dureeEnJours,
            dateDebut: formationFormState.dateDebut,
            dateFin: formationFormState.dateFin,
            competenceId: formationFormState.competenceId,
            prestataireFormation: formationFormState.prestataireFormation,
          }, {
          headers: {
            Authorization: `Bearer ${authenticatedUser["access-token"]}`,
          },
        }
        );
      }
      handleResetAllOperations();
      handleAddFormationSnackBarOpen();
      resetFormationFormState();
      setReloading((pre) => !pre);
    } catch (err) {
      console.log(err);
    }
  };

  ///////////////////DELETE FORMATION//////////////////////////////////
  const handleDeleteFormation = async () => {
    try {
      await axios.delete(
        `http://localhost:8888/FORMATION-SERVICE/formations/${deleteFormationId}`, {
        headers: {
          Authorization: `Bearer ${authenticatedUser["access-token"]}`,
        },
      }
      );
      setDeleteFormationId(null);
      handleDeleteFormationSnackBarOpen();
      setClickedFormation(null);
      setReloading((pre) => !pre);
    } catch (err) {
      console.log(err);
    }
  };

  ///////////////////////////////EDIT FORMATION////////////////////////////////
  const handleEditFormation = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:8888/FORMATION-SERVICE/formations/${editFormationId}`,
        {
          label: formationFormState.label,
          description: formationFormState.description,
          dureeEnJours: formationFormState.dureeEnJours,
          dateDebut: formationFormState.dateDebut,
          dateFin: formationFormState.dateFin,
          competenceId: formationFormState.competenceId,
          prestataireFormation: formationFormState.prestataireFormation,
        }, {
        headers: {
          Authorization: `Bearer ${authenticatedUser["access-token"]}`,
        },
      }
      );
      handleEditFormationSnackBarOpen();
      handleResetAllOperations();
      resetFormationFormState();
      setReloading((pre) => !pre);
      setClickedFormation(editFormationId);
    } catch (err) {
      console.log(err);
    }
  };

  const toggleEstUneRecherche = () => {
    if (estUneRecherche) {
      setSearchDone(false);
      setFormSearchState({
        competence: "Toutes",
        prestataire: "Tous",
        dureeMaximale: "Toutes",
      });
    }
    setEstUneRecherche((pre) => !pre);
  };
  const handleSearch = () => {
    if (
      formSearchState.competence !== "Toutes" &&
      formSearchState.prestataire === "Tous" &&
      formSearchState.dureeMaximale === "Toutes"
    ) {
      let result = formations.filter((f) => {
        return f["competenceId"] === formSearchState.competence.id;
      });
      handleOpenBackdrop();
      setSearchResult(result);
      setTimeout(() => {
        handleCloseBackdrop();
        setSearchDone(true);
      }, 1000);
    } else if (
      formSearchState.competence === "Toutes" &&
      formSearchState.prestataire !== "Tous" &&
      formSearchState.dureeMaximale === "Toutes"
    ) {
      let result = formations.filter((f) => {
        return f["prestataireFormation"].includes(formSearchState.prestataire);
      });
      handleOpenBackdrop();
      setSearchResult(result);
      setTimeout(() => {
        handleCloseBackdrop();
        setSearchDone(true);
      }, 1000);
    } else if (
      formSearchState.competence === "Toutes" &&
      formSearchState.prestataire === "Tous" &&
      formSearchState.dureeMaximale !== "Toutes"
    ) {
      let result = formations.filter((f) => {
        return Number(f["dureeEnJours"]) < formSearchState.dureeMaximale;
      });
      handleOpenBackdrop();
      setSearchResult(result);
      setTimeout(() => {
        handleCloseBackdrop();
        setSearchDone(true);
      }, 1000);
    } else if (
      formSearchState.competence !== "Toutes" &&
      formSearchState.prestataire !== "Tous" &&
      formSearchState.dureeMaximale === "Toutes"
    ) {
      let result = formations.filter((f) => {
        return (
          f["prestataireFormation"].includes(formSearchState.prestataire) &&
          f["competenceId"] === formSearchState.competence.id
        );
      });
      handleOpenBackdrop();
      setSearchResult(result);
      setTimeout(() => {
        handleCloseBackdrop();
        setSearchDone(true);
      }, 1000);
    } else if (
      formSearchState.competence !== "Toutes" &&
      formSearchState.prestataire === "Tous" &&
      formSearchState.dureeMaximale !== "Toutes"
    ) {
      let result = formations.filter((f) => {
        return (
          Number(f["dureeEnJours"]) < formSearchState.dureeMaximale &&
          f["competenceId"] === formSearchState.competence.id
        );
      });
      handleOpenBackdrop();
      setSearchResult(result);
      setTimeout(() => {
        handleCloseBackdrop();
        setSearchDone(true);
      }, 1000);
    } else if (
      formSearchState.competence === "Toutes" &&
      formSearchState.prestataire !== "Tous" &&
      formSearchState.dureeMaximale !== "Toutes"
    ) {
      let result = formations.filter((f) => {
        return (
          Number(f["dureeEnJours"]) < formSearchState.dureeMaximale &&
          f["prestataireFormation"].includes(formSearchState.prestataire)
        );
      });
      handleOpenBackdrop();
      setSearchResult(result);
      setTimeout(() => {
        handleCloseBackdrop();
        setSearchDone(true);
      }, 1000);
    } else if (
      formSearchState.competence !== "Toutes" &&
      formSearchState.prestataire !== "Tous" &&
      formSearchState.dureeMaximale !== "Toutes"
    ) {
      let result = formations.filter((f) => {
        return (
          f["prestataireFormation"].includes(formSearchState.prestataire) &&
          f["competenceId"] === formSearchState.competence.id &&
          Number(f["dureeEnJours"]) < formSearchState.dureeMaximale
        );
      });
      handleOpenBackdrop();
      setSearchResult(result);
      setTimeout(() => {
        handleCloseBackdrop();
        setSearchDone(true);
      }, 1000);
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
    <ReloadingContext.Provider value={[reloading, setReloading]}>
      <SharedDataContext.Provider value={[sharedData, setSharedData]}>
        <EditFormationIdContext.Provider
          value={[editFormationId, setEditFormationId]}
        >
          <DeleteFormationIdContext.Provider
            value={[deleteFormationId, setDeleteFormationId]}
          >
            <Suspense
              fallback={
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
              }
            >
              <div className="container  p-3">
                {authenticatedUser.role === "RESPONSABLE" && (
                  <div className="row">
                    <div className="col-md-6">
                      <Breadcrumbs
                        aria-label="breadcrumb"
                        className={`${
                          appTheme === "light"
                            ? "text-bg-light"
                            : "text-bg-dark"
                        }`}
                      >
                        <Link
                          underline="hover"
                          color="inherit"
                          href="#"
                          onClick={() => handleFormationClick(null)}
                        >
                          formations
                        </Link>

                        {clickedFormation != null && (
                          <Link underline="hover" color="inherit" href="#">
                            détails formation
                          </Link>
                        )}
                      </Breadcrumbs>
                    </div>
                    {clickedFormation === null && (
                      <div className="col-md-1 offset-md-5">
                        <Button
                          color="primary"
                          onClick={handleOpenAddFormationDialog}
                          variant="contained"
                          style={{ borderRadius: "50%", minHeight: 60 }}
                        >
                          <Add />
                        </Button>
                      </div>
                    )}
                  </div>
                )}
                {authenticatedUser.role === "RESPONSABLE" && (
                  <>
                    {clickedFormation === null ? (
                      <>
                        <div className="row  ">
                          <div className="col-md-6 mx-auto sticky">
                            <Autocomplete
                              options={formationTitresOptions}
                              sx={{
                                width: "100%",
                                "& .MuiOutlinedInput-root": {
                                  "& fieldset": {
                                    borderColor:
                                      appTheme !== "light" ? "#FFFFFF" : "",
                                    borderRadius: "10px",
                                  },
                                  "& input::placeholder": {
                                    color:
                                      appTheme !== "light" ? "#FFFFFF" : "",
                                  },
                                },
                                "& .MuiInputLabel-root": {
                                  color: appTheme !== "light" ? "#FFFFFF" : "",
                                },
                                "& .MuiInputLabel-root.Mui-focused": {
                                  color: appTheme !== "light" ? "#FFFFFF" : "",
                                },
                                // Change the dropdown arrow color
                                "& .MuiSvgIcon-root": {
                                  color:
                                    appTheme !== "light"
                                      ? "#FFFFFF"
                                      : "#000000",
                                },
                                "& input": {
                                  color:
                                    appTheme !== "light"
                                      ? "#FFFFFF"
                                      : "#000000",
                                  borderRadius: "10px",
                                },
                              }}
                              onChange={(event, newValue) =>
                                setClickedFormation(
                                  formations.find((e) => e.label === newValue)
                                    ?.id
                                )
                              }
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="rechercher formation par titre"
                                />
                              )}
                            />
                          </div>
                        </div>

                        <div className="row  ">
                          <div className="col-md-1 offset-md-11">
                            <center>
                              <IconButton onClick={toggleEstUneRecherche}>
                                {estUneRecherche ? (
                                  <Cancel />
                                ) : (
                                  <Search color="warning" />
                                )}
                              </IconButton>
                            </center>
                          </div>
                        </div>
                        {/*////////////////////////////////////////////// */}

                        {estUneRecherche && (
                          <div className="row mb-2">
                            <div className="col-md-4 mt-2">
                              <Autocomplete
                                size="small"
                                options={[
                                  ...sharedData["competences"],
                                  "Toutes",
                                ]}
                                value={formSearchState.competence}
                                onChange={(event, newValue) =>
                                  handleSearchCompetenceChange(newValue)
                                }
                                sx={{
                                  width: "100%",
                                  "& .MuiOutlinedInput-root": {
                                    "& fieldset": {
                                      borderColor:
                                        appTheme !== "light" ? "#FFFFFF" : "",
                                    },
                                    "& input::placeholder": {
                                      color:
                                        appTheme !== "light" ? "#FFFFFF" : "",
                                    },
                                  },
                                  "& .MuiInputLabel-root": {
                                    color:
                                      appTheme !== "light" ? "#FFFFFF" : "",
                                  },
                                  "& .MuiInputLabel-root.Mui-focused": {
                                    color:
                                      appTheme !== "light" ? "#FFFFFF" : "",
                                  },
                                  "& input": {
                                    color:
                                      appTheme !== "light"
                                        ? "#FFFFFF"
                                        : "#000000",
                                  },
                                }}
                                renderInput={(params) => (
                                  <TextField {...params} label="Competence" />
                                )}
                              />
                            </div>
                            <div className="col-md-4 mt-2">
                              <Autocomplete
                                size="small"
                                options={[...prestataires, "Tous"]}
                                value={formSearchState.prestataire}
                                onChange={(event, newValue) =>
                                  handleSearchPrestataireChange(newValue)
                                }
                                sx={{
                                  width: "100%",
                                  "& .MuiOutlinedInput-root": {
                                    "& fieldset": {
                                      borderColor:
                                        appTheme !== "light" ? "#FFFFFF" : "",
                                    },
                                    "& input::placeholder": {
                                      color:
                                        appTheme !== "light" ? "#FFFFFF" : "",
                                    },
                                  },
                                  "& .MuiInputLabel-root": {
                                    color:
                                      appTheme !== "light" ? "#FFFFFF" : "",
                                  },
                                  "& .MuiInputLabel-root.Mui-focused": {
                                    color:
                                      appTheme !== "light" ? "#FFFFFF" : "",
                                  },
                                  "& input": {
                                    color:
                                      appTheme !== "light"
                                        ? "#FFFFFF"
                                        : "#000000",
                                  },
                                }}
                                renderInput={(params) => (
                                  <TextField {...params} label="Prestataire" />
                                )}
                              />
                            </div>

                            <div className="col-md-3 mt-2">
                              <TextField
                                size="small"
                                sx={{
                                  width: "100%",
                                  "& .MuiOutlinedInput-root": {
                                    "& fieldset": {
                                      borderColor:
                                        appTheme !== "light" ? "#FFFFFF" : "",
                                    },
                                    "& input::placeholder": {
                                      color:
                                        appTheme !== "light" ? "#FFFFFF" : "",
                                    },
                                  },
                                  "& .MuiInputLabel-root": {
                                    color:
                                      appTheme !== "light" ? "#FFFFFF" : "",
                                  },
                                  "& .MuiInputLabel-root.Mui-focused": {
                                    color:
                                      appTheme !== "light" ? "#FFFFFF" : "",
                                  },
                                  "& input": {
                                    color:
                                      appTheme !== "light"
                                        ? "#FFFFFF"
                                        : "#000000",
                                  },
                                }}
                                id="outlined-basic"
                                label="Duree maximale"
                                type="number"
                                defaultChecked={"Toutes"}
                                value={formSearchState.dureeMaximale}
                                onChange={(e) =>
                                  setFormSearchState((pre) => ({
                                    ...pre,
                                    dureeMaximale: e.target.value,
                                  }))
                                }
                                variant="outlined"
                                required
                              />
                            </div>

                            <div className="col-md-1 mt-2 ">
                              <Button
                                onClick={handleSearch}
                                variant="contained"
                                color="secondary"
                                sx={{
                                  width: "100%",
                                }}
                              >
                                <GridFilterAltIcon />
                              </Button>
                            </div>
                          </div>
                        )}
                        {searchDone && (
                          <div className="row fw-bold text-secondary fs-5">
                            <div className="col-md">
                              {searchResult.length} resultats
                            </div>{" "}
                          </div>
                        )}
                        <div className="row">
                          <div className="col-md-4 fw-bold mb-2">
                            Titre et description
                          </div>
                          <div className="col-md-2 fw-bold mb-2">
                            <center>durée{"(J)"}</center>
                          </div>
                          <div className="col-md-2 fw-bold mb-2">
                            <center>compétence</center>
                          </div>
                          <div className="col-md-2 fw-bold mb-2">
                            <center>prestataire</center>
                          </div>
                          <div className="col-md-2 fw-bold mb-2">
                            <center>Entité concernée</center>
                          </div>
                          <div className="col-md-2"></div>
                        </div>
                        {searchDone
                          ? searchResult.map((formation, index) => (
                              <Formation
                                formation={formation}
                                key={formation.id}
                                isEmploye={false}
                                onClick={() =>
                                  handleFormationClick(formation.id)
                                }
                              />
                            ))
                          : formations.map((formation, index) => (
                              <Formation
                                formation={formation}
                                key={formation.id}
                                isEmploye={false}
                                onClick={() =>
                                  handleFormationClick(formation.id)
                                }
                              />
                            ))}
                      </>
                    ) : (
                      <FormationDetails
                        formation={formations.find(
                          (f) => f.id === clickedFormation
                        )}
                      />
                    )}
                  </>
                )}
                {authenticatedUser.role === "EMPLOYE" && (
                  <div className="mb-2">
                    <h4>Mes formations</h4>
                    <Divider color="primary" />
                  </div>
                )}
                {authenticatedUser.role === "EMPLOYE" && (
                  <div className="row mt-4">
                    <div className="col-md-4 fw-bold mb-2">
                      Titre et description
                    </div>
                    <div className="col-md-2 fw-bold mb-2">
                      <center>durée{"(J)"}</center>
                    </div>
                    <div className="col-md-2 fw-bold mb-2">
                      <center>compétence</center>
                    </div>
                    <div className="col-md-2 fw-bold mb-2">
                      <center>prestataire</center>
                    </div>
                    <div className="col-md-2 fw-bold mb-2">
                      <center>Entité concernée</center>
                    </div>
                    <div className="col-md-2"></div>
                  </div>
                )}
                {authenticatedUser.role === "EMPLOYE" &&
                  allEmployeFormations.map((employeFormation, index) => (
                    <Formation
                      key={
                        employeFormation.employeId +
                        employeFormation.formationId
                      }
                      formation={employeFormation}
                      onClick={() => null}
                      disabled={true}
                      isEmploye={true}
                      formations={formations}
                    />
                  ))}
                {authenticatedUser.role === "RESPONSABLE" && (
                  <>
                    <Dialog
                      open={openAddFormationDialog || editFormationId !== null}
                      fullWidth
                      TransitionComponent={Transition}
                      keepMounted
                      onClose={handleResetAllOperations}
                    >
                      <DialogTitle className="text-center fw-bold">
                        {openAddFormationDialog
                          ? "Ajouter une nouvelle formation"
                          : `Modifier la formation ${targetDeleteOrEditFormation?.label}`}
                      </DialogTitle>
                      <DialogContent>
                        <form
                          method={openAddFormationDialog ? "post" : "put"}
                          onSubmit={
                            openAddFormationDialog
                              ? handleAddFormation
                              : handleEditFormation
                          }
                        >
                          <div className="row">
                            <div className="col-md mb-2 mt-2">
                              <TextField
                                sx={{ width: "100%" }}
                                id="outlined-basic"
                                label="Label"
                                name="label"
                                value={formationFormState.label}
                                onChange={handleFormationFormStateChange}
                                variant="outlined"
                                required
                              />
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md mb-2 mt-2">
                              <TextField
                                sx={{ width: "100%" }}
                                id="outlined-basic"
                                label="Description"
                                multiline
                                name="description"
                                value={formationFormState.description}
                                onChange={handleFormationFormStateChange}
                                variant="outlined"
                                required
                              />
                            </div>
                          </div>
                          <div className="row ">
                            <div className="col-md-6 mt-2 mb-2">
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <MobileDateTimePicker
                                  closeOnSelect
                                  value={formationFormState.dateDebut}
                                  onChange={(newValue) =>
                                    setFormationFormState((pre) => ({
                                      ...pre,
                                      dateDebut: newValue,
                                    }))
                                  }
                                  sx={{ width: "100%" }}
                                  label="Date de debut"
                                />
                              </LocalizationProvider>
                            </div>
                            <div className="col-md-6 mt-2 mb-2">
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <MobileDateTimePicker
                                  closeOnSelect
                                  value={formationFormState.dateFin}
                                  onChange={(newValue) =>
                                    setFormationFormState((pre) => ({
                                      ...pre,
                                      dateFin: newValue,
                                    }))
                                  }
                                  sx={{ width: "100%" }}
                                  label="Date de fin"
                                />
                              </LocalizationProvider>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md mt-2 mb-2">
                              <TextField
                                sx={{ width: "100%" }}
                                id="outlined-basic"
                                label="Durée en jours"
                                type="number"
                                name="dureeEnJours"
                                value={formationFormState.dureeEnJours}
                                onChange={handleFormationFormStateChange}
                                variant="outlined"
                                required
                              />
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md mt-2 mb-2">
                              <TextField
                                sx={{ width: "100%" }}
                                id="outlined-basic"
                                label="Prestataire"
                                name="prestataireFormation"
                                value={formationFormState.prestataireFormation}
                                onChange={handleFormationFormStateChange}
                                variant="outlined"
                                required
                              />
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-md mb-2 mt-2">
                              <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                options={sharedData["competences"].map(
                                  (r) => r["label"]
                                )}
                                value={competenceLabel}
                                onChange={(event, newValue) =>
                                  handleCompetenceChange(newValue)
                                }
                                sx={{ width: "100%" }}
                                renderInput={(params) => (
                                  <TextField {...params} label="Competence" />
                                )}
                              />
                            </div>
                          </div>
                          {editFormationId === null && (
                            <div className="row">
                              <div className="col-md mt-2 mb-2">
                                <FormControl fullWidth>
                                  <InputLabel id="demo-simple-select-label">
                                    Entite concernee
                                  </InputLabel>
                                  <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label="Entite concernee"
                                    name="entiteId"
                                    value={formationFormState.entiteId}
                                    onChange={handleFormationFormStateChange}
                                  >
                                    {sharedData["entites"].map((e) => (
                                      <MenuItem value={e.id}>{e.name}</MenuItem>
                                    ))}
                                    <MenuItem value={"Toutes"}>Toutes</MenuItem>
                                  </Select>
                                </FormControl>
                              </div>
                            </div>
                          )}

                          <div className="row">
                            <div className="col-md mt-2 mb-2">
                              <Button
                                type="submit"
                                variant="contained"
                                color={
                                  editFormationId !== null ? "info" : "success"
                                }
                                fullWidth
                                sx={{ width: "100%" }}
                              >
                                {editFormationId !== null
                                  ? "modifier"
                                  : "ajouter"}
                              </Button>
                            </div>
                          </div>
                        </form>
                      </DialogContent>
                      <DialogActions>
                        <Button
                          onClick={handleResetAllOperations}
                          color="secondary"
                          variant="text"
                        >
                          Annuler
                        </Button>
                      </DialogActions>
                    </Dialog>

                    <Dialog
                      open={deleteFormationId !== null}
                      TransitionComponent={Transition}
                      keepMounted
                      onClose={handleDeleteFormationSnackBarClose}
                    >
                      <DialogTitle>
                        Etes-vous sur de supprimer la formation{" "}
                      </DialogTitle>
                      <DialogContent>
                        <DialogContentText
                          className="fw-bold"
                          id="alert-dialog-slide-description"
                        >
                          {targetDeleteOrEditFormation?.label}
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button
                          onClick={handleResetAllOperations}
                          color="secondary"
                          variant="text"
                        >
                          annuler
                        </Button>
                        <Button
                          onClick={handleDeleteFormation}
                          color="error"
                          variant="contained"
                        >
                          supprimer
                        </Button>
                      </DialogActions>
                    </Dialog>

                    <CustomSnackBar
                      isOpen={showAddFormationSnackBar}
                      duration={4000}
                      onClose={handleAddFormationSnackBarClose}
                      type="success"
                      message="  Formation ajoutee avec succes!"
                    />
                    <CustomSnackBar
                      isOpen={showDeleteFormationSnackBar}
                      duration={4000}
                      onClose={handleDeleteFormationSnackBarClose}
                      type="error"
                      message="Formation supprimee avec succes!"
                    />
                    <CustomSnackBar
                      isOpen={showEditFormationSnackBar}
                      duration={4000}
                      onClose={handleEditFormationSnackBarClose}
                      type="info"
                      message=" Formation modifiee avec succes!"
                    />
                    <Backdrop
                      sx={(theme) => ({
                        color: "blue",
                        zIndex: theme.zIndex.drawer + 1,
                      })}
                      open={openBackdrop}
                      onClick={handleCloseBackdrop}
                    >
                      <CircularProgress
                        variant="indeterminate"
                        disableShrink
                        sx={{
                          color: (theme) =>
                            theme.palette.mode === "light"
                              ? "#1a90ff"
                              : "#308fe8",
                          animationDuration: "550ms",

                          [`& .${circularProgressClasses.circle}`]: {
                            strokeLinecap: "round",
                          },
                        }}
                        size={40}
                        thickness={7}
                      />
                    </Backdrop>
                  </>
                )}
              </div>
            </Suspense>
          </DeleteFormationIdContext.Provider>
        </EditFormationIdContext.Provider>
      </SharedDataContext.Provider>
    </ReloadingContext.Provider>
  );
};


export default React.memo(Formations, (prevProps, nextProps) => Object.is(prevProps, nextProps));

