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
import React, { createContext, useContext, useEffect, useState } from "react";
import Conge from "./Conge";
import axios from "axios";
import { Add } from "@mui/icons-material";
import {
  LocalizationProvider,
  MobileDatePicker,
  MobileDateTimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import ResultatRecherche from "../ResultatRecherche";

import { AuthenticatedUserContext } from "../../App";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
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

export const AddCongeClickedContext = createContext();
export const EditCongeContext = createContext();
export const DeleteCongeContext = createContext();
export const SelectedEmployeIdForCongeContext = createContext();
//===========================================CONTEXTS============================================
const Conges = () => {
  const authenticatedUser = useContext(AuthenticatedUserContext)[0];
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [congesList, setCongesList] = useState([]);
  const [addCongeClicked, setAddCongeClicked] = useState(false);
  const [editConge, setEditConge] = useState(null);
  const [deleteConge, setDeleteConge] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [categories, setCategories] = useState([]);
  const [corps, setCorps] = useState([]);
  const [cadres, setCadres] = useState([]);
  const [grades, setGrades] = useState([]);
  const [indices, setIndices] = useState([]);
  const [entites, setEntites] = useState([]);
  const [postes, setPostes] = useState([]);
  const [employes, setEmployes] = useState([]);
  const [showAddCongeSnackBar, setShowAddCongeSnackBar] = useState(false);
  const [showUpdateCongeSnackBar, setShowUpdateCongeSnackBar] = useState(false);
  const [showDeleteCongeSnackBar, setShowDeleteCongeSnackBar] = useState(false);
  const [categorieId, setCategorieId] = useState(null);
  const [corpsId, setCorpsId] = useState(null);
  const [cadreId, setCadreId] = useState(null);
  const [gradeId, setGradeId] = useState(null);
  const [indiceId, setIndiceId] = useState(null);
  const [entiteId, setEntiteId] = useState(null);
  const [posteId, setPosteId] = useState(null);
  const [rechercheAvanceeClicked, setRechercheAvanceeClicked] = useState(false);
  const [page, setPage] = React.useState(1);
  const [selectedEmployeId, setSelectedEmployeId] = useState(null);
  const [estUneDemandeConge, setEstUneDemandeConge] = useState(false);
  const [resultRechercheAvancee, setResultRechercheAvancee] = useState([]);

  const [demandeCongeFormState, setDemandeCongeFormState] = useState({
    employeId: authenticatedUser.id,
    dateDebut: null,
    dateFin: null,
    dureeEnJours: 1,
    typeConge: "SANS_SOLDE",
    etatConge: "ENCOURSDETRAITEMENT",
  });
  const [displayedConges, setDisplayedConges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reloading, setReloading] = useState(false);

  window.addEventListener("resize", function () {
    setWindowWidth(window.innerWidth);
  });
  const handleEstUneDemandeCongeClose = () => {
    setEstUneDemandeConge(false);
  };
  const handleAddCongeSnackBarClose = () => {
    setShowAddCongeSnackBar(false);
  };
  const handleAddCongeSnackBarOpen = () => {
    setShowAddCongeSnackBar(true);
  };
  const handleUpdateCongeSnackBarClose = () => {
    setShowUpdateCongeSnackBar(false);
  };
  const handleUpdateCongeSnackBarOpen = () => {
    setShowUpdateCongeSnackBar(true);
  };
  const handleDeleteCongeSnackBarClose = () => {
    setShowDeleteCongeSnackBar(false);
  };
  const handleDeleteCongeSnackBarOpen = () => {
    setShowDeleteCongeSnackBar(true);
  };
  const handleAddCongeClose = () => {
    setAddCongeClicked(false);
    setCongeFormState({
      employeId: "",
      dateDebut: null,
      dateFin: null,
      dureeEnJours: 1,
      typeConge: "MATERNITE",
      etatConge: "ENCOURSDETRAITEMENT",
    });
  };
  const handleAddCongeOpen = () => {
    setAddCongeClicked(true);
    handleEditCongeClose();
  };
  const handleEditCongeClose = () => {
    setEditConge(null);
    setCongeFormState({
      employeId: "",
      dateDebut: null,
      dateFin: null,
      dureeEnJours: 1,
      typeConge: "MATERNITE",
      etatConge: "ENCOURSDETRAITEMENT",
    });
  };
  const handleDeleteCongeClose = () => {
    setDeleteConge(null);
  };
  const [congeFormState, setCongeFormState] = useState({
    employeId: "",
    dateDebut: null,
    dateFin: null,
    dureeEnJours: 1,
    typeConge: "MATERNITE",
    etatConge: "ENCOURSDETRAITEMENT",
  });
  const handleCongeFormStateChange = (e) => {
    let { name, value } = e.target;
    setCongeFormState((pre) => ({ ...pre, [name]: value }));
  };
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
  const handleDeleteConge = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:8888/ABSENCE-SERVICE/conges/${deleteConge}`,
        {
          headers: {
            Authorization: `Bearer ${authenticatedUser["access-token"]}`,
          },
        }
      );
      console.log(response);
      handleDeleteCongeClose();
      handleDeleteCongeSnackBarOpen();
      setReloading((pre) => !pre);
    } catch (error) {
      console.error("Error deleting conge", error);
      throw error;
    }
  };

  useEffect(() => {
    if (editConge !== null) {
      handleAddCongeClose();
      const targetConge = congesList.find((e) => e["congeId"] === editConge);
      setCongeFormState({
        employeId: targetConge["employeId"],
        dateDebut: dayjs(targetConge["dateDebut"]),
        dateFin: dayjs(targetConge["dateFin"]),
        dureeEnJours: targetConge["dureeEnJours"],
        typeConge: targetConge["typeConge"],
        etatConge: targetConge["etatConge"],
      });
    }
  }, [editConge, congesList]);
  const handleSelectedEmploye = (newValue) => {
    setSelectedEmployeId(
      employes.find((e) => e.nom + " " + e.prenom === newValue)?.id
    );
    setCurrentTab(1);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (authenticatedUser.role === "RESPONSABLE") {
          const congesResponse = await axios.get(
            `http://localhost:8888/ABSENCE-SERVICE/conges`,
            {
              headers: {
                Authorization: `Bearer ${authenticatedUser["access-token"]}`,
              },
            }
          );
          console.table(congesResponse.data);
          setCongesList(congesResponse.data.reverse());
          setDisplayedConges(congesResponse.data.slice(page * 2 - 2, page * 2));

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
          const congesEmployeeResponse = await axios.get(
            `http://localhost:8888/ABSENCE-SERVICE/conges/employe/${authenticatedUser.employeId}`,
            {
              headers: {
                Authorization: `Bearer ${authenticatedUser["access-token"]}`,
              },
            }
          );
          setCongesList(congesEmployeeResponse.data.reverse());
          setDisplayedConges(
            congesEmployeeResponse.data.slice(page * 2 - 2, page * 2)
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
    const fetch = async () => {
      try {
        if (authenticatedUser.role === "RESPONSABLE") {
          const res = await axios.get(
            `http://localhost:8888/ABSENCE-SERVICE/conges`,
            {
              headers: {
                Authorization: `Bearer ${authenticatedUser["access-token"]}`,
              },
            }
          );
          setCongesList(res.data.reverse());
        } else {
          const congesEmployeeResponse = await axios.get(
            `http://localhost:8888/ABSENCE-SERVICE/conges/employe/${authenticatedUser.employeId}`,
            {
              headers: {
                Authorization: `Bearer ${authenticatedUser["access-token"]}`,
              },
            }
          );
          setCongesList(congesEmployeeResponse.data.reverse());
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetch();
  }, [reloading]);

  const handleCongeSubmit = async (e) => {
    e.preventDefault();
    try {
      if (addCongeClicked) {
        const response = await axios.post(
          `http://localhost:8888/ABSENCE-SERVICE/conges`,
          { ...congeFormState, employeId: selectedEmployeId },
          {
            headers: {
              Authorization: `Bearer ${authenticatedUser["access-token"]}`,
            },
          }
        );

        handleAddCongeClose();
        handleEditCongeClose();
        handleAddCongeSnackBarOpen();
        setReloading((pre) => !pre);
        return;
      } else if (editConge !== null) {
        const response = await axios.put(
          `http://localhost:8888/ABSENCE-SERVICE/conges/${editConge}`,
          { ...congeFormState, employeId: authenticatedUser.employeId },
          {
            headers: {
              Authorization: `Bearer ${authenticatedUser["access-token"]}`,
            },
          }
        );
        console.log(response);
        handleAddCongeClose();
        handleEditCongeClose();
        handleUpdateCongeSnackBarOpen();
        setReloading((pre) => !pre);
        return;
      }
    } catch (error) {
      console.log(error);
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

  const handleToggleRechercheAvancee = () => {
    setRechercheAvanceeClicked((pre) => !pre);
  };

  const handleAddDemandeConge = () => {
    setEstUneDemandeConge(true);
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

  const handleAddDemandeCongeSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:8888/ABSENCE-SERVICE/conges`,
        { ...demandeCongeFormState, employeId: authenticatedUser.employeId },
        {
          headers: {
            Authorization: `Bearer ${authenticatedUser["access-token"]}`,
          },
        }
      );
      console.log(response);
      handleEstUneDemandeCongeClose();
      handleAddCongeSnackBarOpen();
      setReloading(pre => !pre);
    } catch (error) {
      console.log(error);
    }
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
    <SelectedEmployeIdForCongeContext.Provider
      value={[selectedEmployeId, setSelectedEmployeId]}
    >
      <AddCongeClickedContext.Provider
        value={[addCongeClicked, setAddCongeClicked]}
      >
        <EditCongeContext.Provider value={[editConge, setEditConge]}>
          <DeleteCongeContext.Provider value={[deleteConge, setDeleteConge]}>
            <div className="container">
              {authenticatedUser.role === "RESPONSABLE" ? (
                <div className="row  mt-2">
                  <div className="offset-md-11 col-md-1 ">
                    <Button
                      color="primary"
                      onClick={handleAddCongeOpen}
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
                      onClick={handleAddDemandeConge}
                    >
                      demande de congé
                    </Button>
                  </div>
                </div>
              )}
              <div className="row mt-4 text-secondary fs-4 mb-2 p-2">
                {authenticatedUser.role === "RESPONSABLE"
                  ? "Derniers congés enregistrés"
                  : "Mes conges"}{" "}
                <Divider color="info" />
              </div>
              {windowWidth > 1000 && congesList?.length > 0 && (
                <div className="row fw-bold p-2">
                  <div className="col-md-3 mb-3">employé</div>
                  <div className="col-md-2 mb-3">date de début</div>
                  <div className="col-md-2 mb-3">date de fin</div>
                  <div className="col-md-1 mb-3">durée{"(J)"}</div>
                  <div className="col-md-2 mb-3">type congé</div>
                  <div className="col-md-2 mb-3">etat congé</div>
                </div>
              )}

              {!loading && congesList?.length === 0 ? (
                <center className="fw-bold">Aucun congé</center>
              ) : (
                congesList?.map((conge, index) => {
                  return (
                    <Conge
                      key={conge.congeId}
                      conge={conge}
                      windowWidth={windowWidth}
                      entites={entites}
                    />
                  );
                })
              )}
              <form
                method={addCongeClicked ? "post" : "put"}
                onSubmit={handleCongeSubmit}
              >
                <Dialog
                  open={addCongeClicked || editConge !== null}
                  fullWidth
                  maxWidth="md"
                  TransitionComponent={Transition}
                  keepMounted
                  onClose={
                    addCongeClicked ? handleAddCongeClose : handleEditCongeClose
                  }
                  aria-describedby="alert-dialog-slide-description"
                >
                  <DialogTitle className="text-center fw-bold">
                    {addCongeClicked ? "Ajouter un conge" : "modifier un conge"}
                  </DialogTitle>
                  <DialogContent>
                    {editConge === null ? (
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
                              label="Ajouter un congé"
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
                          <form method="post" onSubmit={handleCongeSubmit}>
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
                                  label="Durée en Jours"
                                  name="dureeEnJours"
                                  type="number"
                                  value={congeFormState.dureeEnJours}
                                  onChange={handleCongeFormStateChange}
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
                                  <MobileDatePicker
                                    closeOnSelect
                                    value={congeFormState.dateDebut}
                                    onChange={(newValue) =>
                                      setCongeFormState((pre) => ({
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
                                  <MobileDatePicker
                                    closeOnSelect
                                    value={congeFormState.dateFin}
                                    onChange={(newValue) =>
                                      setCongeFormState((pre) => ({
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
                              <div className="col-md mt-3">
                                <FormControl sx={{ width: "100%" }}>
                                  <InputLabel id="demo-multiple-name-label">
                                    Type de congé
                                  </InputLabel>
                                  <Select
                                    labelId="demo-multiple-name-label"
                                    id="demo-multiple-name"
                                    name="typeConge"
                                    defaultChecked={"Tous"}
                                    value={congeFormState.typeConge}
                                    onChange={handleCongeFormStateChange}
                                    input={
                                      <OutlinedInput label="Type de congé" />
                                    }
                                  >
                                    {[
                                      "MATERNITE",
                                      "MALADIE",
                                      "ACCIDENT_TRAVAIL",
                                      "ANNUEL_PAYE",
                                      "EXCEPTIONNEL",
                                      "SANS_SOLDE",
                                    ].map((c) => (
                                      <MenuItem key={c} value={c}>
                                        {c}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              </div>
                              <div className="col-md mt-3">
                                <FormControl sx={{ width: "100%" }}>
                                  <InputLabel id="demo-multiple-name-label">
                                    Etat de congé
                                  </InputLabel>
                                  <Select
                                    labelId="demo-multiple-name-label"
                                    id="demo-multiple-name"
                                    name="etatConge"
                                    defaultChecked={"Tous"}
                                    value={congeFormState.etatConge}
                                    onChange={handleCongeFormStateChange}
                                    input={
                                      <OutlinedInput label="Etat de congé" />
                                    }
                                  >
                                    {[
                                      "ENCOURSDETRAITEMENT",
                                      "ACCEPTE",
                                      "REFUSE",
                                    ].map((c) => (
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
                                target="conge"
                                employe={item}
                                key={item.id}
                              />
                            ))}
                          </CustomTabPanel>
                        )}
                      </>
                    ) : (
                      <form onSubmit={handleCongeSubmit}>
                        <div className="row">
                          <div className="col-md mt-3">
                            <TextField
                              sx={{ width: "100%" }}
                              id="outlined-basic"
                              label="Durée en Jours"
                              name="dureeEnJours"
                              type="number"
                              value={congeFormState.dureeEnJours}
                              onChange={handleCongeFormStateChange}
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
                                  value={congeFormState.dateDebut}
                                  onChange={(newValue) =>
                                    setCongeFormState((pre) => ({
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
                                  value={congeFormState.dateFin}
                                  onChange={(newValue) =>
                                    setCongeFormState((pre) => ({
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
                                Type de congé
                              </InputLabel>
                              <Select
                                labelId="demo-multiple-name-label"
                                id="demo-multiple-name"
                                name="typeConge"
                                defaultChecked={"Tous"}
                                value={congeFormState.typeConge}
                                onChange={handleCongeFormStateChange}
                                input={<OutlinedInput label="Type de congé" />}
                              >
                                {[
                                  "MATERNITE",
                                  "MALADIE",
                                  "ACCIDENT_TRAVAIL",
                                  "ANNUEL_PAYE",
                                  "EXCEPTIONNEL",
                                  "SANS_SOLDE",
                                ].map((c) => (
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
                            <FormControl sx={{ width: "100%" }}>
                              <InputLabel id="demo-multiple-name-label">
                                Etat de conge
                              </InputLabel>
                              <Select
                                labelId="demo-multiple-name-label"
                                id="demo-multiple-name"
                                name="etatConge"
                                defaultChecked={"Tous"}
                                value={congeFormState.etatConge}
                                onChange={handleCongeFormStateChange}
                                input={<OutlinedInput label="Etat de congé" />}
                              >
                                {[
                                  "ENCOURSDETRAITEMENT",
                                  "ACCEPTE",
                                  "REFUSE",
                                ].map((c) => (
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
                        </div>
                        <div className="row mt-3 p-2">
                          <Button variant="contained" color="info" type="submit">
                            modifier
                          </Button>
                        </div>
                      </form>
                    )}
                  </DialogContent>

                  <DialogActions>
                    <Button
                      onClick={
                        addCongeClicked
                          ? handleAddCongeClose
                          : handleEditCongeClose
                      }
                      color="secondary"
                      variant="text"
                    >
                      Annuler
                    </Button>
                  </DialogActions>
                </Dialog>
              </form>
              {/* EMPLOYE DEMANDE CONGE========================================== */}
              <Dialog
                open={estUneDemandeConge}
                fullWidth
                TransitionComponent={Transition}
                keepMounted
                onClose={handleEstUneDemandeCongeClose}
              >
                <DialogTitle className="text-center fw-bold">
                  Nouvelle demande de congé
                </DialogTitle>
                <DialogContent>
                  <form method="post" onSubmit={handleAddDemandeCongeSubmit}>
                    <div className="row ">
                      <div className="col-md-6 mt-2 mb-2">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <MobileDatePicker
                            closeOnSelect
                            value={demandeCongeFormState.dateDebut}
                            onChange={(newValue) =>
                              setDemandeCongeFormState((pre) => ({
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
                          <MobileDatePicker
                            closeOnSelect
                            value={demandeCongeFormState.dateFin}
                            onChange={(newValue) =>
                              setDemandeCongeFormState((pre) => ({
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
                          value={demandeCongeFormState.dureeEnJours}
                          onChange={(e) =>
                            setDemandeCongeFormState((pre) => ({
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
                            Type de congé
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="Type de conge"
                            value={demandeCongeFormState.typeConge}
                            onChange={(e) =>
                              setDemandeCongeFormState((pre) => ({
                                ...pre,
                                typeConge: e.target.value,
                              }))
                            }
                          >
                            {[
                              "MATERNITE",
                              "MALADIE",
                              "ACCIDENT_TRAVAIL",
                              "ANNUEL_PAYE",
                              "EXCEPTIONNEL",
                              "SANS_SOLDE",
                            ].map((c) => (
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
                    onClick={handleEstUneDemandeCongeClose}
                    color="secondary"
                    variant="text"
                  >
                    Annuler
                  </Button>
                </DialogActions>
              </Dialog>
              <Dialog
                open={deleteConge != null}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleDeleteCongeClose}
                aria-describedby="alert-dialog-slide-description"
              >
                <DialogTitle>Etês-vous sur de supprimer le congé ?</DialogTitle>
                <DialogContent></DialogContent>
                <DialogActions>
                  <Button
                    onClick={handleDeleteCongeClose}
                    color="secondary"
                    variant="text"
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={handleDeleteConge}
                    color="error"
                    variant="contained"
                  >
                    Confirmer
                  </Button>
                </DialogActions>
              </Dialog>
              <Snackbar
                open={showAddCongeSnackBar}
                autoHideDuration={4000}
                onClose={handleAddCongeSnackBarClose}
              >
                <Alert
                  onClose={handleAddCongeSnackBarClose}
                  severity="success"
                  variant="filled"
                  sx={{ width: "100%" }}
                >
                  Congé ajouté avec succès!
                </Alert>
              </Snackbar>

              <Snackbar
                open={showUpdateCongeSnackBar}
                autoHideDuration={4000}
                onClose={handleUpdateCongeSnackBarClose}
              >
                <Alert
                  onClose={handleUpdateCongeSnackBarClose}
                  severity="success"
                  variant="filled"
                  sx={{ width: "100%" }}
                >
                  Congé modifié avec succès !
                </Alert>
              </Snackbar>
              <Snackbar
                open={showDeleteCongeSnackBar}
                autoHideDuration={4000}
                onClose={handleDeleteCongeSnackBarClose}
              >
                <Alert
                  onClose={handleDeleteCongeSnackBarClose}
                  severity="success"
                  variant="filled"
                  sx={{ width: "100%" }}
                >
                  Congé supprimé avec succès!
                </Alert>
              </Snackbar>
            </div>
          </DeleteCongeContext.Provider>
        </EditCongeContext.Provider>
      </AddCongeClickedContext.Provider>
    </SelectedEmployeIdForCongeContext.Provider>
  );
};

export default React.memo(Conges, (prevProps, nextProps) =>
  Object.is(prevProps, nextProps)
);
