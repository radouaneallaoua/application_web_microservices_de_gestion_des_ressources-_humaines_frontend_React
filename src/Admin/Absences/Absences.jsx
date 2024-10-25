import {
  Alert,
  Autocomplete,
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
  FormControlLabel,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Slide,
  Snackbar,
  styled,
  Switch,
  Tab,
  Tabs,
  TextField,
} from "@mui/material";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import React, {
  createContext,
  Suspense,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  LocalizationProvider,
  MobileDateTimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

import Absence from "./Absence";
import { Add } from "@mui/icons-material";
import { AuthenticatedUserContext } from "../../App";
import axios from "axios";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: theme.palette.mode === "dark" ? "#2ECA45" : "#65C466",
        opacity: 1,
        border: 0,
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color:
        theme.palette.mode === "light"
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 22,
    height: 22,
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));

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
const ResultatRecherche = React.lazy(() => import("../ResultatRecherche"));

//===========================================CONTEXTS============================================

export const AddAbsenceClickedContext = createContext();
export const EditAbsenceContext = createContext();
export const DeleteAbsenceContext = createContext();
export const SelectedEmployeIdForAbsenceContext = createContext();
//===========================================CONTEXTS============================================
const Absences = () => {
  const authenticatedUser = useContext(AuthenticatedUserContext)[0];
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [absencesList, setAbsencesList] = useState([]);
  const [addAbsenceClicked, setAddAbsenceClicked] = useState(false);
  const [editAbsence, setEditAbsence] = useState(null);
  const [deleteAbsence, setDeleteAbsence] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [categories, setCategories] = useState([]);
  const [corps, setCorps] = useState([]);
  const [cadres, setCadres] = useState([]);
  const [grades, setGrades] = useState([]);
  const [indices, setIndices] = useState([]);
  const [entites, setEntites] = useState([]);
  const [postes, setPostes] = useState([]);
  const [employes, setEmployes] = useState([]);
  const [showAddAbsenceSnackBar, setShowAddAbsenceSnackBar] = useState(false);
  const [showUpdateAbsenceSnackBar, setShowUpdateAbsenceSnackBar] =
    useState(false);
  const [showDeleteAbsenceSnackBar, setShowDeleteAbsenceSnackBar] =
    useState(false);
  const [categorieId, setCategorieId] = useState(null);
  const [corpsId, setCorpsId] = useState(null);
  const [cadreId, setCadreId] = useState(null);
  const [gradeId, setGradeId] = useState(null);
  const [indiceId, setIndiceId] = useState(null);
  const [entiteId, setEntiteId] = useState(null);
  const [posteId, setPosteId] = useState(null);
  const [rechercheAvanceeClicked, setRechercheAvanceeClicked] = useState(false);
  const [page, setPage] = React.useState(1);
  const [displayedAbsences, setDisplayedAbsences] = useState([]);
  const [estUneDemandeAbsence, setEstUneDemandeAbsence] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reloading, setReloading] = useState(false);
  const [resultRechercheAvancee, setResultRechercheAvancee] = useState([]);
  const [selectedEmployeId, setSelectedEmployeId] = useState(null);
  window.addEventListener("resize", function () {
    setWindowWidth(window.innerWidth);
  });
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
  const handleAddAbsenceSnackBarClose = () => {
    setShowAddAbsenceSnackBar(false);
  };
  const handleSelectedEmploye = (newValue) => {
    setSelectedEmployeId(
      employes.find((e) => e.nom + " " + e.prenom === newValue)?.id
    );
    setCurrentTab(1);
  };
  const handleAddAbsenceSnackBarOpen = () => {
    setShowAddAbsenceSnackBar(true);
  };
  const handleUpdateAbsenceSnackBarClose = () => {
    setShowUpdateAbsenceSnackBar(false);
  };
  const handleEstUneDemandeAbsenceClose = () => {
    setEstUneDemandeAbsence(false);
  };
  const handleAddDemandeAbsence = () => {
    setEstUneDemandeAbsence(true);
  };
  const handleAddDemandeAbsenceSubmit = async (event) => {
    event.preventDefault();
    try {
      let response = await axios.post(
        `http://localhost:8888/ABSENCE-SERVICE/absences`,
        { ...demandeAbsenceFormState, employeId: authenticatedUser.employeId },
        {
          headers: {
            Authorization: `Bearer ${authenticatedUser["access-token"]}`,
          },
        }
      );
      handleEstUneDemandeAbsenceClose();
      handleAddAbsenceSnackBarOpen();
      setReloading((pre) => !pre);
    } catch (error) {
      console.log(error);
    }
  };
  const handleUpdateAbsenceSnackBarOpen = () => {
    setShowUpdateAbsenceSnackBar(true);
  };
  const handleDeleteAbsenceSnackBarClose = () => {
    setShowDeleteAbsenceSnackBar(false);
  };
  const handleDeleteAbsenceSnackBarOpen = () => {
    setShowDeleteAbsenceSnackBar(true);
  };
  const handleAddAbsenceClose = () => {
    setAddAbsenceClicked(false);
    setAbsenceFormState({
      employeId: "",
      dateDebut: null,
      dateFin: null,
      dureeEnJours: 1,
      motif: "VOYAGE",
      estJustifiee: false,
    });
  };
  const handleAddAbsenceOpen = () => {
    setAddAbsenceClicked(true);
    handleEditAbsenceClose();
  };
  const handleEditAbsenceClose = () => {
    setEditAbsence(null);
    setAbsenceFormState({
      employeId: "",
      dateDebut: null,
      dateFin: null,
      dureeEnJours: 1,
      motif: "VOYAGE",
      estJustifiee: false,
    });
  };
  const handleDeleteAbsenceClose = () => {
    setDeleteAbsence(null);
  };
  const [demandeAbsenceFormState, setDemandeAbsenceFormState] = useState({
    employeId: authenticatedUser.id,
    dateDebut: null,
    dateFin: null,
    dureeEnJours: 1,
    motif: "MALADIE",
    estJustifiee: false,
  });
  const [absenceFormState, setAbsenceFormState] = useState({
    employeId: "",
    dateDebut: null,
    dateFin: null,
    dureeEnJours: 1,
    motif: "VOYAGE",
    estJustifiee: false,
  });
  const handleAbsenceFormStateChange = (e) => {
    let { name, value } = e.target;
    if (name === "estJustifiee") {
      setAbsenceFormState((pre) => ({ ...pre, [name]: e.target.checked }));
    } else {
      setAbsenceFormState((pre) => ({ ...pre, [name]: value }));
    }
  };
  const handleDeleteAbsence = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:8888/ABSENCE-SERVICE/absences/${deleteAbsence}`,
        {
          headers: {
            Authorization: `Bearer ${authenticatedUser["access-token"]}`,
          },
        }
      );
      console.log(response);
      handleDeleteAbsenceClose();
      handleDeleteAbsenceSnackBarOpen();
      setReloading((pre) => !pre);
    } catch (error) {
      console.error("Error deleting absences ", error);
      throw error;
    }
  };

  useEffect(() => {
    if (editAbsence != null) {
      handleAddAbsenceClose();
      const targetAbsence = absencesList.find(
        (e) => e["absenceId"] === editAbsence
      );
      setAbsenceFormState({
        employeId: targetAbsence["employeId"],
        dateDebut: dayjs(targetAbsence["dateDebut"]),
        dateFin: dayjs(targetAbsence["dateFin"]),
        dureeEnJours: targetAbsence["dureeEnJours"],
        motif: targetAbsence["motif"],
        estJustifiee: targetAbsence["estJustifiee"],
      });
    }
  }, [editAbsence, absencesList]);

  useEffect(() => {
    const fetchAbsences = async () => {
      try {
        if (authenticatedUser.role === "RESPONSABLE") {
          const absencesResponse = await axios.get(
            `http://localhost:8888/ABSENCE-SERVICE/absences`,
            {
              headers: {
                Authorization: `Bearer ${authenticatedUser["access-token"]}`,
              },
            }
          );
          setAbsencesList(absencesResponse.data?.reverse());
        } else {
          const absencesEmployeeResponse = await axios.get(
            `http://localhost:8888/ABSENCE-SERVICE/absences/employe/${authenticatedUser.employeId}`,
            {
              headers: {
                Authorization: `Bearer ${authenticatedUser["access-token"]}`,
              },
            }
          );
          setAbsencesList(absencesEmployeeResponse.data.reverse());
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchAbsences();
  }, [reloading]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (authenticatedUser.role === "RESPONSABLE") {
          const absencesResponse = await axios.get(
            `http://localhost:8888/ABSENCE-SERVICE/absences`,
            {
              headers: {
                Authorization: `Bearer ${authenticatedUser["access-token"]}`,
              },
            }
          );
          setAbsencesList(absencesResponse.data?.reverse());
          setDisplayedAbsences(
            absencesResponse.data.slice(page * 2 - 2, page * 2)
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
            "http://localhost:8888/EMPLOYE-SERVICE/grades",
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
        } else {
          const absencesEmployeeResponse = await axios.get(
            `http://localhost:8888/ABSENCE-SERVICE/absences/employe/${authenticatedUser.employeId}`,
            {
              headers: {
                Authorization: `Bearer ${authenticatedUser["access-token"]}`,
              },
            }
          );
          setAbsencesList(absencesEmployeeResponse.data.reverse());
          setDisplayedAbsences(
            absencesEmployeeResponse.data.slice(page * 2 - 2, page * 2)
          );
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setAbsenceFormState((pre) => ({ ...pre, employeId: selectedEmployeId }));
  }, [selectedEmployeId]);

  const handleAbsenceSubmit = async (e) => {
    e.preventDefault();
    try {
      if (addAbsenceClicked) {
        let response = await axios.post(
          `http://localhost:8888/ABSENCE-SERVICE/absences`,
          absenceFormState,
          {
            headers: {
              Authorization: `Bearer ${authenticatedUser["access-token"]}`,
            },
          }
        );
        handleAddAbsenceClose();
        handleEditAbsenceClose();
        handleAddAbsenceSnackBarOpen();

        setReloading((pre) => !pre);
        return;
      } else if (editAbsence != null) {
        const response3 = await axios.put(
          `http://localhost:8888/ABSENCE-SERVICE/absences/${editAbsence}`,
          absenceFormState,
          {
            headers: {
              Authorization: `Bearer ${authenticatedUser["access-token"]}`,
            },
          }
        );

        handleAddAbsenceClose();
        handleEditAbsenceClose();
        handleUpdateAbsenceSnackBarOpen();
        setReloading((pre) => !pre);
        return;
      }
    } catch (error) {
      console.log(error);
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
    setDisplayedAbsences(absencesList.slice(value * 2 - 2, value * 2));
  };

  const handleToggleRechercheAvancee = () => {
    setRechercheAvanceeClicked((pre) => !pre);
    setSelectedEmployeId(null);
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
  const employeOptions = employes.map(
    (e) => e.id !== authenticatedUser.employeId && e.nom + " " + e.prenom
  );
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SelectedEmployeIdForAbsenceContext.Provider
        value={[selectedEmployeId, setSelectedEmployeId]}
      >
        <AddAbsenceClickedContext.Provider
          value={[addAbsenceClicked, setAddAbsenceClicked]}
        >
          <EditAbsenceContext.Provider value={[editAbsence, setEditAbsence]}>
            <DeleteAbsenceContext.Provider
              value={[deleteAbsence, setDeleteAbsence]}
            >
              <div className="container">
                {authenticatedUser.role === "RESPONSABLE" ? (
                  <div className="row  mt-2">
                    <div className="offset-md-11 col-md-1 ">
                      <Button
                        color="primary"
                        onClick={handleAddAbsenceOpen}
                        variant="contained"
                        style={{ borderRadius: "50%", minHeight: 60 }}
                      >
                        <Add />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="row  mt-2">
                    <div className="offset-md-10 col-md-2 ">
                      <Button
                        variant="contained"
                        sx={{ textTransform: "lowercase" }}
                        onClick={handleAddDemandeAbsence}
                      >
                        demande absence
                      </Button>
                    </div>
                  </div>
                )}
                <div className="row mt-4 text-secondary fs-4 mb-2 p-2">
                  {authenticatedUser.role === "RESPONSABLE"
                    ? "Dernieres absences marquées"
                    : "Mes absences"}
                  <Divider color="info" />
                </div>
                {windowWidth > 1000 && absencesList?.length > 0 && (
                  <div className="row fw-bold p-2">
                    <div className="col-md-3 mb-3">employé</div>
                    <div className="col-md-2 mb-3">date de début</div>
                    <div className="col-md-2 mb-3">date de fin</div>
                    <div className="col-md-1 mb-3">durée{"(J)"}</div>
                    <div className="col-md-2 mb-3">motif</div>
                    <div className="col-md-2 mb-3">justifiée</div>
                  </div>
                )}
                {!loading && absencesList?.length === 0 ? (
                  <center className="fw-bold">Aucune absence</center>
                ) : (
                  absencesList?.map((absence, index) => {
                    return (
                      <Absence
                        key={absence.absenceId}
                        absence={absence}
                        windowWidth={windowWidth}
                        entites={entites}
                      />
                    );
                  })
                )}
                <form
                  method={addAbsenceClicked ? "post" : "put"}
                  onSubmit={handleAbsenceSubmit}
                >
                  <Dialog
                    open={addAbsenceClicked || editAbsence !== null}
                    fullWidth
                    maxWidth="md"
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={
                      addAbsenceClicked
                        ? handleAddAbsenceClose
                        : handleEditAbsenceClose
                    }
                    aria-describedby="alert-dialog-slide-description"
                  >
                    <DialogTitle className="text-center fw-bold">
                      {addAbsenceClicked
                        ? "Ajouter une absence"
                        : "modifier une absence"}
                    </DialogTitle>
                    <DialogContent>
                      {editAbsence == null ? (
                        <>
                          <div className="row ">
                            <Tabs value={currentTab} onChange={handleTabChange}>
                              <Tab
                                label="Rechercher un employé"
                                sx={{ textTransform: "lowercase" }}
                              />
                              {rechercheAvanceeClicked && (
                                <Tab
                                  label="Résultat recherche"
                                  sx={{ textTransform: "lowercase" }}
                                />
                              )}
                              <Tab
                                label="Marquer une absence"
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
                                          <MenuItem
                                            value={c["id"]}
                                            key={c["id"]}
                                          >
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
                                        {getCorpsWithCategorieId(
                                          categorieId
                                        ).map((c) => (
                                          <MenuItem
                                            value={c["id"]}
                                            key={c["id"]}
                                          >
                                            {c.label}
                                          </MenuItem>
                                        ))}
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
                                          <MenuItem
                                            key={e["id"]}
                                            value={e["id"]}
                                          >
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
                                    onClick={handleDoSearch}
                                    color="success"
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
                            <form method="post" onSubmit={handleAbsenceSubmit}>
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
                              <div className="row">
                                <div className="col-md mt-2">
                                  <TextField
                                    sx={{ width: "100%" }}
                                    id="outlined-basic"
                                    label="Durée n Jours"
                                    name="dureeEnJours"
                                    type="number"
                                    value={absenceFormState.dureeEnJours}
                                    onChange={handleAbsenceFormStateChange}
                                    variant="outlined"
                                    className="me-2"
                                  />
                                </div>
                              </div>
                              <div className="row">
                                <div className="col-md mt-2">
                                  <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                  >
                                    <MobileDateTimePicker
                                      closeOnSelect
                                      value={absenceFormState.dateDebut}
                                      onChange={(newValue) =>
                                        setAbsenceFormState((pre) => ({
                                          ...pre,
                                          dateDebut: newValue,
                                        }))
                                      }
                                      sx={{ width: "100%" }}
                                      label="Date de début"
                                    />
                                  </LocalizationProvider>
                                </div>
                                <div className="col-md mt-2">
                                  <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                  >
                                    <MobileDateTimePicker
                                      closeOnSelect
                                      value={absenceFormState.dateFin}
                                      onChange={(newValue) =>
                                        setAbsenceFormState((pre) => ({
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
                                <div className="col-md mt-2">
                                  <FormControl sx={{ width: "100%" }}>
                                    <InputLabel id="demo-multiple-name-label">
                                      Motif
                                    </InputLabel>
                                    <Select
                                      labelId="demo-multiple-name-label"
                                      id="demo-multiple-name"
                                      name="motif"
                                      defaultChecked={"Tous"}
                                      value={absenceFormState.motif}
                                      onChange={handleAbsenceFormStateChange}
                                      input={<OutlinedInput label="Motif" />}
                                    >
                                      {["VOYAGE", "MALADIE", "AUTRE"].map(
                                        (c) => (
                                          <MenuItem key={c} value={c}>
                                            {c}
                                          </MenuItem>
                                        )
                                      )}
                                    </Select>
                                  </FormControl>
                                </div>
                                <div className="col-md mt-2">
                                  {" "}
                                  <FormControlLabel
                                    control={
                                      <IOSSwitch
                                        sx={{ m: 2 }}
                                        checked={absenceFormState.estJustifiee}
                                        name="estJustifiee"
                                        onChange={handleAbsenceFormStateChange}
                                      />
                                    }
                                    label="Justifiée?"
                                  />
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
                                <div className="text-info d-flex justify-content-between fs-4">
                                  <div>
                                    {resultRechercheAvancee.length} résultats
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
                              )}
                              {resultRechercheAvancee.map((item) => (
                                <ResultatRecherche
                                  target="absence"
                                  employe={item}
                                  key={item.id}
                                />
                              ))}
                            </CustomTabPanel>
                          )}
                        </>
                      ) : (
                        <form onSubmit={handleAbsenceSubmit}>
                          <div className="row">
                            <div className="col-md mt-3">
                              <TextField
                                sx={{ width: "100%" }}
                                id="outlined-basic"
                                label="Duree en Jours"
                                name="dureeEnJours"
                                type="number"
                                value={absenceFormState.dureeEnJours}
                                onChange={handleAbsenceFormStateChange}
                                variant="outlined"
                                className="me-2"
                              />
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md mt-3">
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer
                                  components={["MobileDateTimePicker"]}
                                >
                                  <MobileDateTimePicker
                                    closeOnSelect
                                    value={absenceFormState.dateDebut}
                                    onChange={(newValue) =>
                                      setAbsenceFormState((pre) => ({
                                        ...pre,
                                        dateDebut: newValue,
                                      }))
                                    }
                                    sx={{ width: "100%" }}
                                    label="Date de début"
                                  />
                                </DemoContainer>
                              </LocalizationProvider>
                            </div>
                            <div className="col-md mt-3">
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer
                                  components={["MobileDateTimePicker"]}
                                >
                                  <MobileDateTimePicker
                                    closeOnSelect
                                    value={absenceFormState.dateFin}
                                    onChange={(newValue) =>
                                      setAbsenceFormState((pre) => ({
                                        ...pre,
                                        dateFin: newValue,
                                      }))
                                    }
                                    sx={{ width: "100%" }}
                                    label="Date de fin"
                                  />
                                </DemoContainer>
                              </LocalizationProvider>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md mt-3">
                              <FormControl sx={{ width: "100%" }}>
                                <InputLabel id="demo-multiple-name-label">
                                  Motif
                                </InputLabel>
                                <Select
                                  labelId="demo-multiple-name-label"
                                  id="demo-multiple-name"
                                  name="motif"
                                  defaultChecked={"Tous"}
                                  value={absenceFormState.motif}
                                  onChange={handleAbsenceFormStateChange}
                                  input={<OutlinedInput label="Motif" />}
                                >
                                  {["VOYAGE", "MALADIE", "AUTRE"].map((c) => (
                                    <MenuItem key={c} value={c}>
                                      {c}
                                    </MenuItem>
                                  ))}
                                  <MenuItem selected value="Tous">
                                    <em>Tous</em>
                                  </MenuItem>
                                </Select>
                              </FormControl>
                            </div>
                            <div className="col-md mt-3">
                              {" "}
                              <FormControlLabel
                                control={
                                  <IOSSwitch
                                    sx={{ m: 2 }}
                                    checked={absenceFormState.estJustifiee}
                                    name="estJustifiee"
                                    onChange={handleAbsenceFormStateChange}
                                  />
                                }
                                label="Justifiée?"
                              />
                            </div>
                          </div>
                          <div className="row mt-3 p-2">
                            <Button
                              variant="contained"
                              type="submit"
                              color="info"
                            >
                              modifier
                            </Button>
                          </div>
                        </form>
                      )}
                    </DialogContent>

                    <DialogActions>
                      <Button
                        onClick={
                          addAbsenceClicked
                            ? handleAddAbsenceClose
                            : handleEditAbsenceClose
                        }
                        color="secondary"
                        variant="text"
                      >
                        Annuler
                      </Button>
                    </DialogActions>
                  </Dialog>
                </form>
                {/* EMPLOYE DEMANDE ABSENCE========================================== */}
                <Dialog
                  open={estUneDemandeAbsence}
                  fullWidth
                  TransitionComponent={Transition}
                  keepMounted
                  onClose={handleEstUneDemandeAbsenceClose}
                >
                  <DialogTitle className="text-center fw-bold">
                    Nouvelle demande d'absence
                  </DialogTitle>
                  <DialogContent>
                    <form
                      method="post"
                      onSubmit={handleAddDemandeAbsenceSubmit}
                    >
                      <div className="row ">
                        <div className="col-md-6 mt-2 mb-2">
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <MobileDateTimePicker
                              closeOnSelect
                              value={demandeAbsenceFormState.dateDebut}
                              onChange={(newValue) =>
                                setDemandeAbsenceFormState((pre) => ({
                                  ...pre,
                                  dateDebut: newValue,
                                }))
                              }
                              sx={{ width: "100%" }}
                              label="Date de début"
                            />
                          </LocalizationProvider>
                        </div>
                        <div className="col-md-6 mt-2 mb-2">
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <MobileDateTimePicker
                              closeOnSelect
                              value={demandeAbsenceFormState.dateFin}
                              onChange={(newValue) =>
                                setDemandeAbsenceFormState((pre) => ({
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
                            value={demandeAbsenceFormState.dureeEnJours}
                            onChange={(e) =>
                              setDemandeAbsenceFormState((pre) => ({
                                ...pre,
                                dureeEnJours: e.target.value,
                              }))
                            }
                            variant="outlined"
                            required
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md mt-2">
                          <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">
                              Motif
                            </InputLabel>
                            <Select
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              label="Motif"
                              value={demandeAbsenceFormState.typeAbsence}
                              onChange={(e) =>
                                setDemandeAbsenceFormState((pre) => ({
                                  ...pre,
                                  motif: e.target.value,
                                }))
                              }
                            >
                              {["MALADIE", "VOYAGE", "AUTRE"].map((c) => (
                                <MenuItem key={c} value={c}>
                                  {c}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md mt-2 mb-2">
                          <Button
                            type="submit"
                            variant="contained"
                            color="info"
                            fullWidth
                            sx={{ width: "100%" }}
                          >
                            confirmer
                          </Button>
                        </div>
                      </div>
                    </form>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      onClick={handleEstUneDemandeAbsenceClose}
                      color="secondary"
                      variant="text"
                    >
                      Annuler
                    </Button>
                  </DialogActions>
                </Dialog>
                <Dialog
                  open={deleteAbsence != null}
                  TransitionComponent={Transition}
                  keepMounted
                  onClose={handleDeleteAbsenceClose}
                  aria-describedby="alert-dialog-slide-description"
                >
                  <DialogTitle>
                    Etês-vous sûr de supprimer l'absence?
                  </DialogTitle>
                  <DialogContent></DialogContent>
                  <DialogActions>
                    <Button
                      onClick={handleDeleteAbsenceClose}
                      color="secondary"
                      variant="text"
                    >
                      Annuler
                    </Button>
                    <Button
                      onClick={handleDeleteAbsence}
                      color="error"
                      variant="contained"
                    >
                      Confirmer
                    </Button>
                  </DialogActions>
                </Dialog>
                <Snackbar
                  open={showAddAbsenceSnackBar}
                  autoHideDuration={4000}
                  onClose={handleAddAbsenceSnackBarClose}
                >
                  <Alert
                    onClose={handleAddAbsenceSnackBarClose}
                    severity="success"
                    variant="filled"
                    sx={{ width: "100%" }}
                  >
                    Absence ajoutée avec succès!
                  </Alert>
                </Snackbar>
                <Snackbar
                  open={showUpdateAbsenceSnackBar}
                  autoHideDuration={4000}
                  onClose={handleUpdateAbsenceSnackBarClose}
                >
                  <Alert
                    onClose={handleUpdateAbsenceSnackBarClose}
                    severity="success"
                    variant="filled"
                    sx={{ width: "100%" }}
                  >
                    Absence modifiée avec succès!
                  </Alert>
                </Snackbar>
                <Snackbar
                  open={showDeleteAbsenceSnackBar}
                  autoHideDuration={4000}
                  onClose={handleDeleteAbsenceSnackBarClose}
                >
                  <Alert
                    onClose={handleDeleteAbsenceSnackBarClose}
                    severity="success"
                    variant="filled"
                    sx={{ width: "100%" }}
                  >
                    Absence supprimée avec succès!
                  </Alert>
                </Snackbar>
              </div>
            </DeleteAbsenceContext.Provider>
          </EditAbsenceContext.Provider>
        </AddAbsenceClickedContext.Provider>
      </SelectedEmployeIdForAbsenceContext.Provider>
    </Suspense>
  );
};

export default React.memo(Absences, (prevProps, nextProps) =>
  Object.is(prevProps, nextProps)
);
