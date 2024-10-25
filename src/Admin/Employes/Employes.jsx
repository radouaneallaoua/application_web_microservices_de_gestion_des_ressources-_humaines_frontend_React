import React, { createContext, useContext, useEffect, useState } from "react";
import {
  Autocomplete,
  TextField,
  Pagination,
  Dialog,
  Slide,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  styled,
  Switch,
  DialogContentText,
  CircularProgress,
  Breadcrumbs,
  Link,
  IconButton,
  Backdrop,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Button from "@mui/material/Button";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import UnpublishedOutlinedIcon from "@mui/icons-material/UnpublishedOutlined";
import axios from "axios";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import FilterListOutlinedIcon from "@mui/icons-material/FilterListOutlined";
import dayjs from "dayjs";
import EmployeDetails from "./EmployeDetails";
import { Add, CancelOutlined, Search } from "@mui/icons-material";
import EmployeSkeleton from "./EmployeSkeleton";
import CustomSnackBar from "../CustomSnackBar";
import { AppThemeContext } from "../AdminMainPage";
import { AuthenticatedUserContext } from "../../App";
const Employe = React.lazy(() => import("./Employe"));

//===========================================CONTEXTS============================================
export const ClickedEmployeIdContext = createContext();
export const AddEmployeClickedContext = createContext();
export const EditEmployeContext = createContext();
export const DeleteEmployeContext = createContext();
export const ReloadingEmployeDetailsContext = createContext();
//===========================================CONTEXTS============================================
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

//======================COMPONENT========================
const Employes = () => {
  const authenticatedUser = useContext(AuthenticatedUserContext)[0];
  const [employesList, setEmployesList] = useState([]);
  const [regions, setRegions] = useState([]);
  const [mutuelles, setMutuelles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [corps, setCorps] = useState([]);
  const [cadres, setCadres] = useState([]);
  const [grades, setGrades] = useState([]);
  const [indices, setIndices] = useState([]);
  const [entites, setEntites] = useState([]);
  const [postes, setPostes] = useState([]);
  const [reloadingEmployeDetails, setReloadingEmployeDetails] = useState(null);
  const [addEmployeClicked, setAddEmployeClicked] = useState(false);
  const [editEmploye, setEditEmploye] = useState(null);
  const [deleteEmploye, setDeleteEmploye] = useState(null);
  const [employeIdClicked, setEmployeIdClicked] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState(0);
  const [page, setPage] = useState(1);
  const [displayedEmployes, setDisplayedEmployes] = useState([]);
  const [categorieId, setCategorieId] = useState(null);
  const [corpsId, setCorpsId] = useState(null);
  const [cadreId, setCadreId] = useState(null);
  const [searchResult, setSearchResult] = useState([]);
  const [estUneRecherche, setEstUneRecherche] = useState(false);
  const [regionLabel, setRegionLabel] = useState("");
  const appTheme = useContext(AppThemeContext)[0];
  const [employeFormState, setEmployeFormState] = useState({
    nom: "",
    prenom: "",
    dateNaissance: null,
    tel: "",
    adresse: "",
    ville: "",
    email: "",
    anneeExperience: 1,
    dateRecrutement: null,
    genre: "HOMME",
    etatEmploye: "ACTIF",
    situationFamiliale: "CELIBATAIRE",
    posteId: null,
    entiteId: null,
    gradeId: null,
    indiceEchelonId: null,
    mutuellesId: [],
    file: null,
    cin: "",
    regionId: 1,
  });
  const [searchDone, setSearchDone] = useState(false);

  const [openBackdrop, setOpenBackdrop] = useState(false);

  const handleEmployeSubmit = async (e) => {
    e.preventDefault();
    try {
      if (addEmployeClicked) {
        const response = await axios.post(
          `http://localhost:8888/EMPLOYE-SERVICE/employes`,
          {
            ...employeFormState,
            dateNaissance: dayjs(employeFormState.dateNaissance).format(
              "YYYY-MM-DD"
            ),
            dateRecrutement: dayjs(employeFormState.dateRecrutement).format(
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
      }
      if (editEmploye != null) {
        const response = await axios.put(
          editEmploye,
          {
            nom: employeFormState.nom,
            prenom: employeFormState.prenom,
            dateNaissance: dayjs(employeFormState.dateNaissance).format(
              "YYYY-MM-DD"
            ),
            tel: employeFormState.tel,
            adresse: employeFormState.adresse,
            ville: employeFormState.ville,
            email: employeFormState.email,
            anneeExperience: employeFormState.anneeExperience,
            dateRecrutement: dayjs(employeFormState.dateRecrutement).format(
              "YYYY-MM-DD"
            ),
            genre: employeFormState.genre,
            etatEmploye: employeFormState.etatEmploye,
            situationFamiliale: employeFormState.situationFamiliale,
            posteId: employeFormState.posteId,
            entiteId: employeFormState.entiteId,
            gradeId: employeFormState.gradeId,
            indiceEchelonId: employeFormState.indiceEchelonId,
            mutuellesId: employeFormState.mutuellesId,
            file: employeFormState.file,
            cin: employeFormState.cin,
          },
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${authenticatedUser["access-token"]}`,
            },
          }
        );
      }

      if (addEmployeClicked) {
        handleAddEmployeClose();
        handleEditEmployeClose();
        handleAddEmployeSnackBarOpen();
      } else {
        handleAddEmployeClose();
        handleEditEmployeClose();
        handleUpdateEmployeSnackBarOpen();
      }
      let response = await axios.get(
        `http://localhost:8888/EMPLOYE-SERVICE/employes`,
        {
          headers: {
            Authorization: `Bearer ${authenticatedUser["access-token"]}`,
          },
        }
      );

      let res = response.data.reverse();
      setEmployesList(
        res.filter((e) => e["id"] !== authenticatedUser.employeId)
      );
      console.log("//////////FROM EMPLOYES/////////////////");
      console.table(response.data);
      setDisplayedEmployes(
        res
          .filter((e) => e["id"] !== authenticatedUser.employeId)
          .slice(page * 4 - 4, page * 4)
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };
  const handleChange = (event, value) => {
    setPage(value);
    setDisplayedEmployes(employesList.slice(value * 4 - 4, value * 4));
  };

  const [showAddEmployeSnackBar, setShowAddEmployeSnackBar] = useState(false);
  const [showUpdateEmployeSnackBar, setShowUpdateEmployeSnackBar] =
    useState(false);
  const [showDeleteEmployeSnackBar, setShowDeleteEmployeSnackBar] =
    useState(false);

  const handleAddEmployeSnackBarClose = () => {
    setShowAddEmployeSnackBar(false);
  };
  const handleAddEmployeSnackBarOpen = () => {
    setShowAddEmployeSnackBar(true);
  };
  const handleUpdateEmployeSnackBarClose = () => {
    setShowUpdateEmployeSnackBar(false);
  };
  const handleUpdateEmployeSnackBarOpen = () => {
    setShowUpdateEmployeSnackBar(true);
  };
  const handleDeleteEmployeSnackBarClose = () => {
    setShowDeleteEmployeSnackBar(false);
  };
  const handleDeleteEmployeSnackBarOpen = () => {
    setShowDeleteEmployeSnackBar(true);
  };
  const handleAddEmployeClose = () => {
    setAddEmployeClicked(false);
  };
  const handleAddEmployeOpen = () => {
    setAddEmployeClicked(true);
    handleEditEmployeClose();
  };
  const handleEditEmployeClose = () => {
    setEditEmploye(null);
  };
  const handleDeleteEmployeClose = () => {
    setDeleteEmploye(null);
  };
  const handleCategorieChange = (e) => {
    setCategorieId(e.target.value);
  };
  const handleCorpsChange = (e) => {
    setCorpsId(e.target.value);
  };

  const handleCadreChange = (e) => {
    setCadreId(e.target.value);
  };
  const getCorpsWithCategorieId = (categorieId) => {
    const result = corps.filter((c) => c["categorie"]["id"] === categorieId);
    return result;
  };
  const getCadresWithCorpsId = (corpsId) => {
    const result = cadres.filter((c) => c["corps"]["id"] === corpsId);
    return result;
  };
  const handleCloseBackdrop = () => {
    setOpenBackdrop(false);
  };

  const getGradesWithCadreId = (cadreId) => {
    const result = grades.filter((c) => c["cadre"]["id"] === cadreId);
    return result;
  };
  const getIndicesWithGradeId = (gradeId) => {
    const result = indices.filter((c) => c["gradeId"] === gradeId);
    return result;
  };

  const handleEmployeFormStateChange = (e) => {
    let { name, value } = e.target;
    if (name === "situationFamiliale") {
      value = e.target.checked ? "MARIE" : "CELIBATAIRE";
      alert(value);
    }
    if (name === "etatEmploye") {
      value = value ? "ACTIF" : "INACTIF";
    }
    setEmployeFormState((pre) => ({ ...pre, [name]: value }));
  };
  const handleDeleteEmploye = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:8888/EMPLOYE-SERVICE/employes/${deleteEmploye}`,
        {
          headers: {
            Authorization: `Bearer ${authenticatedUser["access-token"]}`,
          },
        }
      );
      console.log(response);
      handleDeleteEmployeClose();
      handleDeleteEmployeSnackBarOpen();
    } catch (error) {
      console.log(error);
    }
  };
  const handleRegionChange = (newValue) => {
    setRegionLabel(newValue);
    const targetRegion = regions.find((r) => r["label"] === newValue);
    setEmployeFormState((pre) => ({ ...pre, regionId: targetRegion?.id }));
  };
  useEffect(() => {
    if (editEmploye !== null) {
      handleAddEmployeClose();
      const targetEmploye = employesList.find((e) => e["id"] === editEmploye);
      const employeEntites = targetEmploye["entites"];
      setEmployeFormState({
        nom: targetEmploye["nom"],
        prenom: targetEmploye["prenom"],
        dateNaissance: dayjs(targetEmploye["dateNaissance"]),
        tel: targetEmploye["tel"],
        adresse: targetEmploye["adresse"],
        ville: targetEmploye["ville"],
        email: targetEmploye["email"],
        anneeExperience: targetEmploye["anneeExperience"],
        dateRecrutement: dayjs(targetEmploye["dateRecrutement"]),
        genre: targetEmploye["genre"],
        etatEmploye: targetEmploye["etatEmploye"],
        situationFamiliale: targetEmploye["situationFamiliale"],
        posteId: targetEmploye["poste"]["id"],
        entiteId: employeEntites[employeEntites.length - 1]?.entiteId,
        gradeId: targetEmploye["grade"]["id"],
        indiceEchelonId: targetEmploye["indiceEchelon"]["id"],
        rolesIds: targetEmploye["roles"],
        mutuellesId: targetEmploye["mutuelles"],
        file: null,
        cin: targetEmploye["cin"],
        regionId: targetEmploye["region"]?.id,
      });
    }
  }, [editEmploye]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const employesResponse = await axios.get(
          `http://localhost:8888/EMPLOYE-SERVICE/employes`,
          {
            headers: {
              Authorization: `Bearer ${authenticatedUser["access-token"]}`,
            },
          }
        );
        let res = employesResponse.data.reverse();
        setEmployesList(
          res.filter((e) => e["id"] !== authenticatedUser.employeId)
        );
        setDisplayedEmployes(
          res
            .filter((e) => e["id"] !== authenticatedUser.employeId)
            .slice(page * 4 - 4, page * 4)
        );

        const mutuellesResponse = await axios.get(
          "http://localhost:8888/EMPLOYE-SERVICE/mutuelles",
          {
            headers: {
              Authorization: `Bearer ${authenticatedUser["access-token"]}`,
            },
          }
        );
        setMutuelles(mutuellesResponse.data);

        const regionsResponse = await axios.get(
          "http://localhost:8888/EMPLOYE-SERVICE/regions",
          {
            headers: {
              Authorization: `Bearer ${authenticatedUser["access-token"]}`,
            },
          }
        );
        setRegions(regionsResponse.data);
        setRegionLabel(regionsResponse.data[0]?.label);

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
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const [formSearchState, setFormSearchState] = useState({
    entite: "Toutes",
    poste: "Tous",
    grade: "Tous",
    disponible: true,
  });

  const employeOptions = employesList.map((e) => e.nom + " " + e.prenom);
  const toggleSearch = () => {
    setEstUneRecherche((pre) => !pre);
    setSearchDone(false);
    setPage(1);
    setDisplayedEmployes(employesList.slice(page * 4 - 4, page * 4));
    setFormSearchState({
      entite: "Toutes",
      poste: "Tous",
      grade: "Tous",
      disponible: true,
    });
  };

  useEffect(() => {
    const fetchEmployes = async () => {
      if (reloadingEmployeDetails !== null) {
        setEmployeIdClicked(null);
        try {
          const response = await axios.get(
            `http://localhost:8888/EMPLOYE-SERVICE/employes`,
            {
              headers: {
                Authorization: `Bearer ${authenticatedUser["access-token"]}`,
              },
            }
          );
          setEmployesList(
            response.data
              .reverse()
              .filter((e) => e["id"] !== authenticatedUser.employeId)
          );

          setDisplayedEmployes(
            response.data.reverse().slice(page * 4 - 4, page * 4)
          );
        } catch (err) {
          console.log(err);
        }
        setEmployeIdClicked(reloadingEmployeDetails);
      }
    };

    fetchEmployes();
  }, [reloadingEmployeDetails]);

  const handleSearch = (e) => {
    if (
      formSearchState.entite !== "Toutes" &&
      formSearchState.poste !== "Tous" &&
      formSearchState.grade !== "Tous"
    ) {
      setOpenBackdrop(true);
      const result = employesList.filter((e) => {
        let entitesList = e["entites"];
        let lastEntiteId = entitesList[entitesList?.length - 1]["entiteId"];
        let entite = entites.find((e) => e["name"] === formSearchState.entite);
        return (
          entite["id"] === lastEntiteId &&
          e["grade"]["label"] === formSearchState.grade &&
          e["poste"]["label"] === formSearchState.poste &&
          (formSearchState.disponible
            ? e["etatEmploye"] === "ACTIF"
            : e["etatEmploye"] === "INACTIF")
        );
      });
      setSearchResult(result);
      setTimeout(() => {
        handleCloseBackdrop();
      }, 1000);
      setSearchDone(true);
      setDisplayedEmployes(result.slice(page * 4 - 4, page * 4));
    } else if (
      formSearchState.entite !== "Toutes" &&
      formSearchState.poste === "Tous" &&
      formSearchState.grade !== "Tous"
    ) {
      setOpenBackdrop(true);
      const result = employesList.filter((e) => {
        let entitesList = e["entites"];
        let lastEntiteId = entitesList[entitesList?.length - 1]["entiteId"];
        let entite = entites.find((e) => e["name"] === formSearchState.entite);
        return (
          entite["id"] === lastEntiteId &&
          e["grade"]["label"] === formSearchState.grade &&
          (formSearchState.disponible
            ? e["etatEmploye"] === "ACTIF"
            : e["etatEmploye"] === "INACTIF")
        );
      });
      setSearchResult(result);
      setTimeout(() => {
        handleCloseBackdrop();
      }, 1000);
      setSearchDone(true);
      setDisplayedEmployes(result.slice(page * 4 - 4, page * 4));
    } else if (
      formSearchState.entite !== "Toutes" &&
      formSearchState.poste !== "Tous" &&
      formSearchState.grade === "Tous"
    ) {
      setOpenBackdrop(true);
      const result = employesList.filter((e) => {
        let entitesList = e["entites"];
        let lastEntiteId = entitesList[entitesList?.length - 1]["entiteId"];
        let entite = entites.find((e) => e["name"] === formSearchState.entite);
        return (
          entite["id"] === lastEntiteId &&
          e["poste"]["label"] === formSearchState.poste &&
          (formSearchState.disponible
            ? e["etatEmploye"] === "ACTIF"
            : e["etatEmploye"] === "INACTIF")
        );
      });
      setSearchResult(result);
      setTimeout(() => {
        handleCloseBackdrop();
      }, 1000);
      setSearchDone(true);
      setDisplayedEmployes(result.slice(page * 4 - 4, page * 4));
    } else if (
      formSearchState.entite === "Toutes" &&
      formSearchState.poste !== "Tous" &&
      formSearchState.grade !== "Tous"
    ) {
      setOpenBackdrop(true);
      const result = employesList.filter((e) => {
        return (
          e["grade"]["label"] === formSearchState.grade &&
          e["poste"]["label"] === formSearchState.poste &&
          (formSearchState.disponible
            ? e["etatEmploye"] === "ACTIF"
            : e["etatEmploye"] === "INACTIF")
        );
      });
      setSearchResult(result);
      setTimeout(() => {
        handleCloseBackdrop();
      }, 1000);
      setSearchDone(true);
      setDisplayedEmployes(result.slice(page * 4 - 4, page * 4));
    } else if (
      formSearchState.entite === "Toutes" &&
      formSearchState.poste === "Tous" &&
      formSearchState.grade !== "Tous"
    ) {
      setOpenBackdrop(true);
      const result = employesList.filter((e) => {
        return (
          e["grade"]["label"] === formSearchState.grade &&
          (formSearchState.disponible
            ? e["etatEmploye"] === "ACTIF"
            : e["etatEmploye"] === "INACTIF")
        );
      });
      setSearchResult(result);
      setTimeout(() => {
        handleCloseBackdrop();
      }, 1000);
      setSearchDone(true);
      setDisplayedEmployes(result.slice(page * 4 - 4, page * 4));
    } else if (
      formSearchState.entite === "Toutes" &&
      formSearchState.poste !== "Tous" &&
      formSearchState.grade === "Tous"
    ) {
      setOpenBackdrop(true);
      const result = employesList.filter((e) => {
        return (
          e["poste"]["label"] === formSearchState.poste &&
          (formSearchState.disponible
            ? e["etatEmploye"] === "ACTIF"
            : e["etatEmploye"] === "INACTIF")
        );
      });
      setSearchResult(result);
      setTimeout(() => {
        handleCloseBackdrop();
      }, 1000);
      setSearchDone(true);
      setDisplayedEmployes(result.slice(page * 4 - 4, page * 4));
    } else if (
      formSearchState.entite !== "Toutes" &&
      formSearchState.poste === "Tous" &&
      formSearchState.grade === "Tous"
    ) {
      setOpenBackdrop(true);
      const result = employesList.filter((e) => {
        let entitesList = e["entites"];
        let lastEntiteId = entitesList[entitesList?.length - 1]["entiteId"];
        let entite = entites.find((e) => e["name"] === formSearchState.entite);
        return (
          entite["id"] === lastEntiteId &&
          (formSearchState.disponible
            ? e["etatEmploye"] === "ACTIF"
            : e["etatEmploye"] === "INACTIF")
        );
      });
      setSearchResult(result);
      setTimeout(() => {
        handleCloseBackdrop();
        setSearchDone(true);
      }, 1000);

      setDisplayedEmployes(result.slice(page * 4 - 4, page * 4));
    } else if (
      formSearchState.entite === "Toutes" &&
      formSearchState.poste === "Tous" &&
      formSearchState.grade === "Tous"
    ) {
      setOpenBackdrop(true);
      const result = employesList.filter((e) => {
        return formSearchState.disponible
          ? e["etatEmploye"] === "ACTIF"
          : e["etatEmploye"] === "INACTIF";
      });
      setSearchResult(result);
      setTimeout(() => {
        handleCloseBackdrop();
      }, 1000);
      setSearchDone(true);
      setDisplayedEmployes(result.slice(page * 4 - 4, page * 4));
    }
  };
  const handleEntiteChange = (newValue) => {
    setFormSearchState((pre) => ({ ...pre, entite: newValue }));
  };
  const handleGradeChange = (newValue) => {
    setFormSearchState((pre) => ({ ...pre, grade: newValue }));
  };
  const handlePosteChange = (newValue) => {
    setFormSearchState((pre) => ({ ...pre, poste: newValue }));
  };
  const handleDisponibleChange = (newValue) => {
    setFormSearchState((pre) => ({ ...pre, disponible: newValue }));
  };

  return (
    <AddEmployeClickedContext.Provider
      value={[addEmployeClicked, setAddEmployeClicked]}
    >
      <ClickedEmployeIdContext.Provider
        value={[employeIdClicked, setEmployeIdClicked]}
      >
        <ReloadingEmployeDetailsContext.Provider
          value={[reloadingEmployeDetails, setReloadingEmployeDetails]}
        >
          <DeleteEmployeContext.Provider
            value={[deleteEmploye, setDeleteEmploye]}
          >
            <EditEmployeContext.Provider value={[editEmploye, setEditEmploye]}>
              <div className="container">
                <div className="row">
                  <div className="col-md-6">
                    <Breadcrumbs
                      aria-label="breadcrumb"
                      sx={{ mt: 2 }}
                      className={`${
                        appTheme === "light" ? "text-bg-light" : "text-bg-dark"
                      }`}
                    >
                      <Link
                        underline="hover"
                        color="inherit"
                        href="#"
                        onClick={() => setEmployeIdClicked(null)}
                      >
                        employes
                      </Link>
                      {employeIdClicked != null && (
                        <Link underline="hover" color="inherit" href="#">
                          details employe
                        </Link>
                      )}
                    </Breadcrumbs>
                  </div>
                  {employeIdClicked === null && (
                    <div className="col-md-1 offset-md-5">
                      <Button
                        color="primary"
                        onClick={handleAddEmployeOpen}
                        variant="contained"
                        style={{ borderRadius: "50%", minHeight: 60 }}
                      >
                        <Add />
                      </Button>
                    </div>
                  )}
                </div>
                {employeIdClicked != null ? (
                  <EmployeDetails
                    employe={displayedEmployes.find(
                      (e) => e["id"] === employeIdClicked
                    )}
                    entites={entites}
                  />
                ) : (
                  <>
                    <div className="row  ">
                      <div className="col-md-6 mx-auto sticky">
                        <Autocomplete
                          options={employeOptions}
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
                            // Change the dropdown arrow color
                            "& .MuiSvgIcon-root": {
                              color:
                                appTheme !== "light" ? "#FFFFFF" : "#000000",
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
                          onChange={(event, newValue) =>
                            setEmployeIdClicked(
                              employesList.find(
                                (e) => e.nom + " " + e.prenom === newValue
                              )?.id
                            )
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="rechercher employe par nom complet"
                            />
                          )}
                        />
                      </div>
                    </div>

                    <div className="row d-flex  justify-content-end">
                      {estUneRecherche && (
                        <div className="col-md mt-2">
                          <div className="row ">
                            <div className="col-md-3 mt-2">
                              <Autocomplete
                                size="small"
                                id="combo-box-demo"
                                options={[
                                  ...entites.map((e) => e["name"]),
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
                                  <TextField {...params} label="Entite" />
                                )}
                              />
                            </div>
                            <div className="col-md-3 mt-2">
                              <Autocomplete
                                size="small"
                                id="combo-box-demo"
                                options={[
                                  ...postes.map((p) => p["label"]),
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
                                  <TextField {...params} label="Poste" />
                                )}
                              />
                            </div>
                            <div className="col-md-3 mt-2">
                              <Autocomplete
                                size="small"
                                id="combo-box-demo"
                                options={[
                                  ...grades.map((p) => p["label"]),
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
                                    borderRadius: "10px", // Text color
                                  },
                                }}
                                renderInput={(params) => (
                                  <TextField {...params} label="Grade" />
                                )}
                              />
                            </div>
                            <div className="col-md-2 mt-3">
                              <FormControlLabel
                                control={
                                  <IOSSwitch
                                    checked={formSearchState.disponible}
                                    name="disponible"
                                    onChange={(e) =>
                                      setFormSearchState((pre) => ({
                                        ...pre,
                                        disponible: e.target.checked,
                                      }))
                                    }
                                  />
                                }
                                label="Disponible"
                              />
                            </div>
                            <div className="col-md-1 mt-2">
                              <Button
                                color="secondary"
                                variant="contained"
                                type="button"
                                onClick={handleSearch}
                              >
                                <FilterListOutlinedIcon />
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="col-md-1">
                        <IconButton color="warning" onClick={toggleSearch}>
                          {estUneRecherche ? <CancelOutlined /> : <Search />}
                        </IconButton>
                      </div>
                    </div>
                    {searchDone ? (
                      <div className="row fw-bold text-secondary fs-4">
                        <di className="col-md mt-2">
                          {searchResult.length} employes trouvés
                        </di>
                      </div>
                    ) : null}
                    {loading === true ? (
                      <>
                        <div className="row gap-3 mt-2 ">
                          <EmployeSkeleton />
                          <EmployeSkeleton />
                        </div>
                        <div className="row gap-3">
                          <EmployeSkeleton />
                          <EmployeSkeleton />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="row ">
                          {displayedEmployes[0] != null && (
                            <div className="col-md-6 mt-2">
                              <Employe
                                key={displayedEmployes[0]?.id}
                                employe={displayedEmployes[0]}
                                entites={entites}
                              />
                            </div>
                          )}
                          {displayedEmployes[1] != null && (
                            <div className="col-md-6 mt-2">
                              <Employe
                                key={displayedEmployes[1]?.id}
                                employe={displayedEmployes[1]}
                                entites={entites}
                              />
                            </div>
                          )}
                        </div>
                        <div className="row  ">
                          {displayedEmployes[2] != null && (
                            <div className="col-md-6 mt-2">
                              <Employe
                                key={displayedEmployes[2]?.id}
                                employe={displayedEmployes[2]}
                                entites={entites}
                              />
                            </div>
                          )}
                          {displayedEmployes[3] != null && (
                            <div className="col-md-6 mt-2">
                              <Employe
                                key={displayedEmployes[3]?.id}
                                employe={displayedEmployes[3]}
                                entites={entites}
                              />
                            </div>
                          )}
                        </div>
                        <Pagination
                          sx={{
                            color:
                              appTheme === "light" ? "#000000" : "#FFFFFFFF",
                          }}
                          count={Math.round((employesList.length + 1) / 4)}
                          page={page}
                          color="primary"
                          onChange={handleChange}
                        />
                      </>
                    )}
                  </>
                )}

                <Dialog
                  open={addEmployeClicked || editEmploye != null}
                  fullWidth
                  maxWidth="md"
                  TransitionComponent={Transition}
                  keepMounted
                  onClose={
                    addEmployeClicked
                      ? handleAddEmployeClose
                      : handleEditEmployeClose
                  }
                  aria-describedby="alert-dialog-slide-description"
                >
                  <DialogTitle className="text-center fw-bold">
                    {addEmployeClicked
                      ? "Ajouter un employe"
                      : "modifier un employe"}
                  </DialogTitle>
                  <form
                    method={addEmployeClicked ? "POST" : "PUT"}
                    onSubmit={handleEmployeSubmit}
                    encType="multipart/form-data"
                  >
                    <DialogContent>
                      <div className="row ">
                        <Tabs value={currentTab} onChange={handleTabChange}>
                          <Tab
                            label="Informations personnelles"
                            sx={{ textTransform: "lowercase" }}
                          />
                          <Tab
                            label="Infomations administratives"
                            sx={{ textTransform: "lowercase" }}
                          />
                        </Tabs>
                      </div>

                      <CustomTabPanel value={currentTab} index={0}>
                        <div className="row">
                          <div className="col-md mt-2">
                            <TextField
                              sx={{
                                width: "100%",
                              }}
                              id="outlined-basic"
                              label="Nom"
                              name="nom"
                              value={employeFormState.nom}
                              onChange={handleEmployeFormStateChange}
                              variant="outlined"
                              className="me-2"
                            />
                          </div>
                          <div className="col-md mt-2">
                            <TextField
                              sx={{
                                width: "100%",
                              }}
                              id="outlined-basic"
                              label="Prenom"
                              name="prenom"
                              value={employeFormState.prenom}
                              onChange={handleEmployeFormStateChange}
                              variant="outlined"
                              className="me-2"
                            />
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md mt-2">
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DatePicker
                                closeOnSelect
                                sx={{
                                  width: "100%",
                                }}
                                value={employeFormState.dateNaissance}
                                onChange={(newValue) =>
                                  setEmployeFormState((pre) => ({
                                    ...pre,
                                    dateNaissance: newValue,
                                  }))
                                }
                                label="date de naissance"
                              />
                            </LocalizationProvider>
                          </div>
                          <div className="col-md mt-2">
                            <TextField
                              sx={{
                                width: "100%",
                              }}
                              id="outlined-basic"
                              label="CIN"
                              name="cin"
                              value={employeFormState.cin}
                              onChange={handleEmployeFormStateChange}
                              variant="outlined"
                              className="me-2"
                            />
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md mt-2">
                            <TextField
                              sx={{
                                width: "100%",
                              }}
                              id="outlined-basic"
                              label="Email"
                              name="email"
                              value={employeFormState.email}
                              onChange={handleEmployeFormStateChange}
                              variant="outlined"
                              className="me-2"
                            />
                          </div>
                          <div className="col-md mt-2">
                            <TextField
                              sx={{
                                width: "100%",
                              }}
                              id="outlined-basic"
                              label="Tel"
                              name="tel"
                              value={employeFormState.tel}
                              onChange={handleEmployeFormStateChange}
                              variant="outlined"
                              className="me-2"
                            />
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md mt-2">
                            <Autocomplete
                              disablePortal
                              id="combo-box-demo"
                              options={regions.map((r) => r["label"])}
                              value={regionLabel}
                              renderInput={(params) => (
                                <TextField {...params} label="Region" />
                              )}
                              onChange={(event, newValue) =>
                                handleRegionChange(newValue)
                              }
                              sx={{
                                width: "100%",
                              }}
                            />
                          </div>
                          <div className="col-md mt-2">
                            <FormControl
                              fullWidth
                              sx={{
                                width: "100%",
                              }}
                            >
                              <InputLabel id="demo-simple-select-label">
                                Genre
                              </InputLabel>
                              <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="Genre"
                                name="genre"
                                value={employeFormState.genre}
                                onChange={handleEmployeFormStateChange}
                              >
                                <MenuItem value="HOMME">Homme</MenuItem>
                                <MenuItem value="FEMME">Femme</MenuItem>
                              </Select>
                            </FormControl>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md mt-2">
                            <TextField
                              sx={{
                                width: "100%",
                              }}
                              id="outlined-basic"
                              label="Ville"
                              name="ville"
                              value={employeFormState.ville}
                              onChange={handleEmployeFormStateChange}
                              variant="outlined"
                              className="me-2"
                            />
                          </div>
                          <div className="col-md mt-2">
                            <FormControlLabel
                              control={
                                <IOSSwitch
                                  sx={{ m: 2 }}
                                  checked={
                                    employeFormState.situationFamiliale ===
                                    "MARIE"
                                  }
                                  name="situationFamiliale"
                                  onChange={handleEmployeFormStateChange}
                                />
                              }
                              label="Marié"
                            />
                          </div>
                        </div>
                      </CustomTabPanel>
                      <CustomTabPanel value={currentTab} index={1}>
                        <div className="row">
                          <div className="col-md mt-2">
                            <FormControl
                              fullWidth
                              sx={{
                                width: "100%",
                              }}
                            >
                              <InputLabel id="demo-simple-select-label">
                                Categorie
                              </InputLabel>
                              <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="Categorie"
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
                            <FormControl
                              fullWidth
                              sx={{
                                width: "100%",
                              }}
                            >
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
                                    <MenuItem value={c["id"]} key={c["id"]}>
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
                            <FormControl
                              fullWidth
                              sx={{
                                width: "100%",
                              }}
                            >
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
                                {getCadresWithCorpsId(corpsId).map((c) => (
                                  <MenuItem value={c["id"]} key={c["id"]}>
                                    {c.label}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </div>
                          <div className="col-md mt-2">
                            <FormControl
                              fullWidth
                              sx={{
                                width: "100%",
                              }}
                            >
                              <InputLabel id="demo-simple-select-label">
                                Grade
                              </InputLabel>
                              <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="Grade"
                                name="gradeId"
                                value={employeFormState.gradeId}
                                onChange={handleEmployeFormStateChange}
                              >
                                {getGradesWithCadreId(cadreId).map((c) => (
                                  <MenuItem value={c["id"]} key={c["id"]}>
                                    {c.label}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md mt-2">
                            <FormControl
                              fullWidth
                              sx={{
                                width: "100%",
                              }}
                            >
                              <InputLabel id="demo-simple-select-label">
                                Indice Echelon
                              </InputLabel>
                              <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="Indice Echelon"
                                name="indiceEchelonId"
                                value={employeFormState.indiceEchelonId}
                                onChange={handleEmployeFormStateChange}
                              >
                                {getIndicesWithGradeId(
                                  employeFormState.gradeId
                                ).map((c) => (
                                  <MenuItem value={c["id"]} key={c["id"]}>
                                    {c.indice}
                                    {"-"}
                                    {c.echelon}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </div>
                          <div className="col-md mt-2">
                            <FormControl
                              fullWidth
                              sx={{
                                width: "100%",
                              }}
                            >
                              <InputLabel id="demo-simple-select-label">
                                Entite
                              </InputLabel>
                              <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="Entite"
                                name="entiteId"
                                value={employeFormState.entiteId}
                                onChange={handleEmployeFormStateChange}
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
                          <div className="col-md mt-2">
                            <FormControl
                              fullWidth
                              sx={{
                                width: "100%",
                              }}
                            >
                              <InputLabel id="demo-simple-select-label">
                                Poste
                              </InputLabel>
                              <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="Poste"
                                name="posteId"
                                value={employeFormState.posteId}
                                onChange={handleEmployeFormStateChange}
                              >
                                {postes.map((e) => (
                                  <MenuItem value={e["id"]}>
                                    {e["label"]}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </div>
                          <div className="col-md mt-2">
                            <FormControl
                              fullWidth
                              sx={{
                                width: "100%",
                              }}
                            >
                              <InputLabel id="demo-simple-select-label">
                                Mutuelles
                              </InputLabel>
                              <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                name="mutuellesId"
                                value={employeFormState.mutuellesId}
                                onChange={handleEmployeFormStateChange}
                                label="Mutuelles"
                                multiple
                              >
                                {mutuelles.map((e) => (
                                  <MenuItem value={e["id"]} key={e["id"]}>
                                    {e["label"]}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md mt-2">
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DatePicker
                                closeOnSelect
                                sx={{
                                  width: "100%",
                                }}
                                name="dateRecrutement"
                                value={employeFormState.dateRecrutement}
                                onChange={(newValue) =>
                                  setEmployeFormState((pre) => ({
                                    ...pre,
                                    dateRecrutement: newValue,
                                  }))
                                }
                                label="date de recrutement"
                              />
                            </LocalizationProvider>
                          </div>
                          <div className="col-md mt-2">
                            <TextField
                              sx={{
                                width: "100%",
                              }}
                              id="outlined-basic"
                              label="Nombre d'annees d'experiences"
                              name="anneeExperience"
                              type="number"
                              value={employeFormState.anneeExperience}
                              onChange={handleEmployeFormStateChange}
                              variant="outlined"
                              className="me-2"
                            />
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md mb-1">
                            <FormControlLabel
                              control={
                                <IOSSwitch
                                  sx={{ m: 2 }}
                                  checked={
                                    employeFormState.etatEmploye === "ACTIF"
                                  }
                                  name="etatEmploye"
                                  onChange={handleEmployeFormStateChange}
                                />
                              }
                              label="Disponible"
                            />
                          </div>
                          <div className="col-md mb-1 mt-2 ">
                            <Button
                              component="label"
                              variant="contained"
                              tabIndex={-1}
                              sx={{ textTransform: "lowercase", me: 1 }}
                              startIcon={<CloudUploadIcon />}
                            >
                              {editEmploye == null
                                ? "image du profil"
                                : "changer l'image de profil"}
                              <VisuallyHiddenInput
                                name="file"
                                onChange={(e) => {
                                  console.log(e.target.files[0]);
                                  setEmployeFormState((pre) => ({
                                    ...pre,
                                    file: e.target.files[0],
                                  }));
                                }}
                                type="file"
                              />
                            </Button>
                            {employeFormState.file === null ? (
                              <span className="bg-danger rounded-pill text-light p-2">
                                <UnpublishedOutlinedIcon color="action" />
                                fichier non sélectionné
                              </span>
                            ) : (
                              <span className="bg-success text-light rounded-pill p-2">
                                <TaskAltOutlinedIcon color="action" /> fichier
                                sélectionné
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="row">
                          <Button
                            type="submit"
                            variant="contained"
                            color="secondary"
                          >
                            enregistrer
                          </Button>
                        </div>
                      </CustomTabPanel>
                    </DialogContent>
                  </form>
                  <DialogActions>
                    <Button
                      onClick={
                        addEmployeClicked
                          ? handleAddEmployeClose
                          : handleEditEmployeClose
                      }
                      color="secondary"
                      variant="text"
                    >
                      Annuler
                    </Button>
                  </DialogActions>
                </Dialog>

                <Dialog
                  open={deleteEmploye != null}
                  TransitionComponent={Transition}
                  keepMounted
                  onClose={handleDeleteEmployeClose}
                  aria-describedby="alert-dialog-slide-description"
                >
                  <DialogTitle>
                    Etes-vous sur de supprimer l'employe
                  </DialogTitle>
                  <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                      {employesList.find((t) => t["id"] === deleteEmploye)?.nom}{" "}
                      {
                        employesList.find((t) => t["id"] === deleteEmploye)
                          ?.premon
                      }
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      onClick={handleDeleteEmployeClose}
                      color="secondary"
                      variant="text"
                    >
                      Annuler
                    </Button>
                    <Button
                      onClick={handleDeleteEmploye}
                      color="error"
                      variant="contained"
                    >
                      Confirmer
                    </Button>
                  </DialogActions>
                </Dialog>
                <CustomSnackBar
                  isOpen={showAddEmployeSnackBar}
                  duration={4000}
                  onClose={handleAddEmployeSnackBarClose}
                  type="success"
                  message="  Employe ajoute avec succes!"
                />
                <CustomSnackBar
                  isOpen={showUpdateEmployeSnackBar}
                  duration={4000}
                  onClose={handleUpdateEmployeSnackBarClose}
                  type="info"
                  message="Employe modifie avec succes!"
                />
                <CustomSnackBar
                  isOpen={showDeleteEmployeSnackBar}
                  duration={4000}
                  onClose={handleDeleteEmployeSnackBarClose}
                  type="error"
                  message="  Employe supprime avec succes!"
                />

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
            </EditEmployeContext.Provider>
          </DeleteEmployeContext.Provider>
        </ReloadingEmployeDetailsContext.Provider>
      </ClickedEmployeIdContext.Provider>
    </AddEmployeClickedContext.Provider>
  );
};

export default React.memo(Employes, (prevProps, nextProps) =>
  Object.is(prevProps, nextProps)
);
