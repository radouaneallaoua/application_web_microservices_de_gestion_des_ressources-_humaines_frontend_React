import {
  Autocomplete,
  Backdrop,
  Box,
  Breadcrumbs,
  Button,
  CircularProgress,
  circularProgressClasses,
  Link,
  TextField,
} from "@mui/material";
import React, {
  createContext,
  Suspense,
  useContext,
  useEffect,
  useState,
} from "react";
import SearchIcon from "@mui/icons-material/Search";
import { AppThemeContext } from "../AdminMainPage";

import { AuthenticatedUserContext } from "../../App";
import axios from "axios";
const HistoriqueAvancements = React.lazy(() =>
  import("./HistoriqueAvancements")
);
const EmployeAvancement = React.lazy(() => import("./EmployeAvancement"));
const AjouterAvancement = React.lazy(() => import("./AjouterAvancement"));


//=====================CONTEXTS===============================================
export const AddAvancementClickedContext = createContext();
export const HistoriqueAvancementClickedContext = createContext();
export const TargetEmployeIdContext = createContext();
export const SharedDataContext = createContext();

const Avancements = () => {
  const [addAvancementClicked, setAddAvancementClicked] = useState(false);
  const [historiqueAvancementClicked, setHistoriqueAvancementClicked] =
    useState(false);
  const authenticatedUser = useContext(AuthenticatedUserContext)[0];
  const [targetEmployeId, setTargetEmployeId] = useState(null);
  const [employes, setEmployes] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const appTheme = useContext(AppThemeContext)[0];
  const [sharedData, setSharedData] = useState({
    entites: [],
    types: [],
    categories: [],
    indices: [],
    corps: [],
    cadres: [],
    grades: [],
    postes: [],
  });
  const handleBack = () => {
    setAddAvancementClicked(false);
    setHistoriqueAvancementClicked(false);
    setTargetEmployeId(null);
  };
  const [formSearchState, setFormSearchState] = useState({
    employe: "Tous",
    entite: null,
    poste: null,
    grade: null,
  });

  const [openBackdrop, setOpenBackdrop] = useState(false);
  const handleCloseBackdrop = () => {
    setOpenBackdrop(false);
  };
  const handleOpenBackdrop = () => {
    setOpenBackdrop(true);
  };
  const handleEntiteChange = (newValue) => {
    setFormSearchState((pre) => ({ ...pre, entite: newValue }));
  };
  const handlePosteChange = (newValue) => {
    setFormSearchState((pre) => ({ ...pre, poste: newValue }));
  };
  const handleGradeChange = (newValue) => {
    setFormSearchState((pre) => ({ ...pre, grade: newValue }));
  };
  const handleSearch = (e) => {
    handleOpenBackdrop();
    setSearching(true);
    e.preventDefault();
    if (
      formSearchState.entite !== null &&
      formSearchState.poste === null &&
      formSearchState.grade === null
    ) {
      const result = employes.filter((e) => {
        const entiteId = e?.entites[e.entites?.length - 1]?.entiteId;
        const entite = sharedData["entites"].find(
          (e) => e["name"] === formSearchState.entite
        );
        if (entite.id === entiteId) {
          return e;
        }
      });
      setSearchResult(result);
      handleCloseBackdrop();
    } else if (
      formSearchState.entite === null &&
      formSearchState.poste !== null &&
      formSearchState.grade === null
    ) {
      const result = employes.filter(
        (e) => e["poste"]["label"] === formSearchState.poste
      );
      setSearchResult(result);
      handleCloseBackdrop();
    } else if (
      formSearchState.entite === null &&
      formSearchState.poste === null &&
      formSearchState.grade !== null
    ) {
      const result = employes.filter(
        (e) => e["grade"]["label"] === formSearchState.grade
      );
      setSearchResult(result);
      handleCloseBackdrop();
    } else if (
      formSearchState.entite !== null &&
      formSearchState.poste === null &&
      formSearchState.grade !== null
    ) {
      const result = employes.filter((e) => {
        const entiteId = e?.entites[e.entites?.length - 1]?.entiteId;
        const entite = sharedData["entites"].find(
          (e) => e["name"] === formSearchState.entite
        );
        if (
          entite.id === entiteId &&
          e["grade"]["label"] === formSearchState.grade
        ) {
          return e;
        }
      });
      setSearchResult(result);
      handleCloseBackdrop();
    } else if (
      formSearchState.entite !== null &&
      formSearchState.poste !== null &&
      formSearchState.grade === null
    ) {
      const result = employes.filter((e) => {
        const entiteId = e?.entites[e.entites?.length - 1]?.entiteId;
        const entite = sharedData["entites"].find(
          (e) => e["name"] === formSearchState.entite
        );
        if (
          entite.id === entiteId &&
          e["poste"]["label"] === formSearchState.poste
        ) {
          return e;
        }
      });
      setSearchResult(result);
      handleCloseBackdrop();
    } else if (
      formSearchState.entite !== null &&
      formSearchState.poste !== null &&
      formSearchState.grade !== null
    ) {
      const result = employes.filter((e) => {
        const entiteId = e?.entites[e.entites?.length - 1]?.entiteId;
        const entite = sharedData["entites"].find(
          (e) => e["name"] === formSearchState.entite
        );
        if (
          entite.id === entiteId &&
          e["poste"]["label"] === formSearchState.poste &&
          e["grade"]["label"] === formSearchState.grade
        ) {
          return e;
        }
      });
      setSearchResult(result);
      handleCloseBackdrop();
    } else if (
      formSearchState.entite === null &&
      formSearchState.poste !== null &&
      formSearchState.grade !== null
    ) {
      const result = employes.filter(
        (e) =>
          e["poste"]["label"] === formSearchState.poste &&
          e["grade"]["label"] === formSearchState.grade
      );
      setSearchResult(result);
      handleCloseBackdrop();
    }
  };
  useEffect(() => {
    const fetchData = async () => {

      try {
        const employesResponse = await axios.get(
          "http://localhost:8888/EMPLOYE-SERVICE/employes",
          {
            headers: {
              Authorization: `Bearer ${authenticatedUser["access-token"]}`,
            },
          }
        );
        let emplo = employesResponse.data;
        setEmployes(emplo.filter(e => e["id"] !== authenticatedUser.employeId));

        const entitesResponse = await axios.get(
          "http://localhost:8888/EMPLOYE-SERVICE/entites",
          {
            headers: {
              Authorization: `Bearer ${authenticatedUser["access-token"]}`,
            },
          }
        );
        setSharedData((prev) => ({ ...prev, entites: entitesResponse.data }));

        const typesResponse = await axios.get(
          "http://localhost:8888/EMPLOYE-SERVICE/types",
          {
            headers: {
              Authorization: `Bearer ${authenticatedUser["access-token"]}`,
            },
          }
        );
        setSharedData((prev) => ({ ...prev, types: typesResponse.data }));

        const categoriesResponse = await axios.get(
          "http://localhost:8888/EMPLOYE-SERVICE/categories",
          {
            headers: {
              Authorization: `Bearer ${authenticatedUser["access-token"]}`,
            },
          }
        );
        setSharedData((prev) => ({
          ...prev,
          categories: categoriesResponse.data,
        }));

        const corpsResponse = await axios.get(
          "http://localhost:8888/EMPLOYE-SERVICE/corps",
          {
            headers: {
              Authorization: `Bearer ${authenticatedUser["access-token"]}`,
            },
          }
        );
        setSharedData((prev) => ({ ...prev, corps: corpsResponse.data }));

        const cadresResponse = await axios.get(
          "http://localhost:8888/EMPLOYE-SERVICE/cadres",
          {
            headers: {
              Authorization: `Bearer ${authenticatedUser["access-token"]}`,
            },
          }
        );
        setSharedData((prev) => ({ ...prev, cadres: cadresResponse.data }));

        const gradesResponse = await axios.get(
          `http://localhost:8888/EMPLOYE-SERVICE/grades`,
          {
            headers: {
              Authorization: `Bearer ${authenticatedUser["access-token"]}`,
            },
          }
        );
        setSharedData((prev) => ({ ...prev, grades: gradesResponse.data }));

        const indicesResponse = await axios.get(
          "http://localhost:8888/EMPLOYE-SERVICE/indices",
          {
            headers: {
              Authorization: `Bearer ${authenticatedUser["access-token"]}`,
            },
          }
        );
        setSharedData((prev) => ({ ...prev, indices: indicesResponse.data }));

        const postesResponse = await axios.get(
          "http://localhost:8888/EMPLOYE-SERVICE/postes",
          {
            headers: {
              Authorization: `Bearer ${authenticatedUser["access-token"]}`,
            },
          }
        );
        setSharedData((prev) => ({ ...prev, postes: postesResponse.data }));
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  const employeOptions = employes.map((e) => e.id !== authenticatedUser.employeId && e.nom + " " + e.prenom);
  return (
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
      <SharedDataContext.Provider value={[sharedData, setSharedData]}>
        <TargetEmployeIdContext.Provider
          value={[targetEmployeId, setTargetEmployeId]}
        >
          <HistoriqueAvancementClickedContext.Provider
            value={[
              historiqueAvancementClicked,
              setHistoriqueAvancementClicked,
            ]}
          >
            <AddAvancementClickedContext.Provider
              value={[addAvancementClicked, setAddAvancementClicked]}
            >
              <div className="container  mt-3">
                <Breadcrumbs aria-label="breadcrumb" style={{ color: appTheme === "light" ? "#000000" : "#FFFFFFFf" }}>
                  <Link
                    underline="hover"
                    color="inherit"
                    href="#"
                    onClick={handleBack}
                  >
                    employés
                  </Link>
                  {addAvancementClicked && (
                    <Link underline="hover" color="inherit" href="#">
                      ajouter avancement
                    </Link>
                  )}
                  {historiqueAvancementClicked && (
                    <Link underline="hover" color="inherit" href="#">
                      historique des avancements
                    </Link>
                  )}
                </Breadcrumbs>
                {targetEmployeId === null ? (
                  <>
                    {searching && (
                      <div className="row">
                        <div className="col-md-2 offset-md-10">
                          <Button
                            onClick={() => setSearching(false)}
                            variant="outlined"
                          >
                            afficher tous
                          </Button>
                        </div>
                      </div>
                    )}

                    <form method="get" onSubmit={handleSearch}>
                      <div className="row mt-3 mb-3">
                        <div className="col-md-3 mt-2">
                          <Autocomplete
                            size="small"
                            options={[...employeOptions, "Tous"]}
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
                              // Change the dropdown arrow color
                              "& .MuiSvgIcon-root": {
                                color:
                                  appTheme !== "light" ? "#FFFFFF" : "#000000",
                              },
                              "& input": {
                                color:
                                  appTheme !== "light" ? "#FFFFFF" : "#000000",
                                borderRadius: "10px", // Text color
                              },
                            }}
                            onChange={(event, newValue) => {
                              setHistoriqueAvancementClicked(true);
                              setTargetEmployeId(
                                employes.find(
                                  (e) => e.nom + " " + e.prenom === newValue
                                )?.id
                              );
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="rechercher employé par nom complet"
                              />
                            )}
                          />
                        </div>

                        <div className="col-md-3 mt-2">
                          <Autocomplete
                            size="small"
                            id="combo-box-demo"
                            options={[
                              ...sharedData["entites"].map((e) => e["name"]),
                              "Toutes",
                            ]}
                            value={formSearchState.entite}
                            onChange={(event, newValue) =>
                              handleEntiteChange(newValue)
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
                              "& .MuiInputLabel-root": {
                                color: appTheme !== "light" ? "#FFFFFF" : "",
                              },
                              "& .MuiInputLabel-root.Mui-focused": {
                                color: appTheme !== "light" ? "#FFFFFF" : "",
                              },
                              // Change the dropdown arrow color
                              "& .MuiSvgIcon-root": {
                                color:
                                  appTheme !== "light" ? "#FFFFFF" : "#000000",
                              },
                              "& input": {
                                color:
                                  appTheme !== "light" ? "#FFFFFF" : "#000000",
                                borderRadius: "10px", // Text color
                              },
                            }}
                            renderInput={(params) => (
                              <TextField {...params} label="Entité" />
                            )}
                          />
                        </div>
                        <div className="col-md-3 mt-2">
                          <Autocomplete
                            size="small"
                            id="combo-box-demo"
                            options={[
                              ...sharedData["postes"].map((p) => p["label"]),
                              "Tous",
                            ]}
                            value={formSearchState.poste}
                            onChange={(event, newValue) =>
                              handlePosteChange(newValue)
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
                              "& .MuiInputLabel-root": {
                                color: appTheme !== "light" ? "#FFFFFF" : "",
                              },
                              "& .MuiInputLabel-root.Mui-focused": {
                                color: appTheme !== "light" ? "#FFFFFF" : "",
                              },
                              // Change the dropdown arrow color
                              "& .MuiSvgIcon-root": {
                                color:
                                  appTheme !== "light" ? "#FFFFFF" : "#000000",
                              },
                              "& input": {
                                color:
                                  appTheme !== "light" ? "#FFFFFF" : "#000000",
                                borderRadius: "10px", // Text color
                              },
                            }}
                            renderInput={(params) => (
                              <TextField {...params} label="Poste" />
                            )}
                          />
                        </div>
                        <div className="col-md-3 mt-2">
                          <Autocomplete
                            size="small"
                            id="combo-box-demo"
                            options={[
                              ...sharedData["grades"].map((p) => p["label"]),
                              "Tous",
                            ]}
                            value={formSearchState.grade}
                            onChange={(event, newValue) =>
                              handleGradeChange(newValue)
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
                              "& .MuiInputLabel-root": {
                                color: appTheme !== "light" ? "#FFFFFF" : "",
                              },
                              "& .MuiInputLabel-root.Mui-focused": {
                                color: appTheme !== "light" ? "#FFFFFF" : "",
                              },
                              // Change the dropdown arrow color
                              "& .MuiSvgIcon-root": {
                                color:
                                  appTheme !== "light" ? "#FFFFFF" : "#000000",
                              },
                              "& input": {
                                color:
                                  appTheme !== "light" ? "#FFFFFF" : "#000000",
                                borderRadius: "10px", // Text color
                              },
                            }}
                            renderInput={(params) => (
                              <TextField {...params} label="Grade" />
                            )}
                          />
                        </div>
                        <div className="col-md-2 mt-3">
                          <Button
                            size="large"
                            type="submit"
                            color="primary"
                            variant="contained"
                          >
                            <SearchIcon />
                          </Button>
                        </div>
                      </div>
                    </form>
                    {searching
                      ? searchResult?.map((e) => {
                        return (
                          <EmployeAvancement employe={e} key={e["id"]} />
                        );
                      })
                      : employes?.map((e) => {
                        return (
                          <EmployeAvancement employe={e} key={e["id"]} />
                        );
                      })}
                  </>
                ) : addAvancementClicked ? (
                  <AjouterAvancement
                    employe={employes.find((e) => e["id"] === targetEmployeId)}
                  />
                ) : (
                  <HistoriqueAvancements
                    employe={employes.find((e) => e["id"] === targetEmployeId)}
                  />
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
            </AddAvancementClickedContext.Provider>
          </HistoriqueAvancementClickedContext.Provider>
        </TargetEmployeIdContext.Provider>
      </SharedDataContext.Provider>
    </Suspense>
  );
};

export default React.memo(Avancements, (prevProps, nextProps) => Object.is(prevProps, nextProps));

