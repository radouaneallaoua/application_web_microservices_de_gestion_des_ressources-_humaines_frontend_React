import React, {
  createContext,
  Suspense,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  DeleteEmployeContext,
  EditEmployeContext,
  ReloadingEmployeDetailsContext,
} from "./Employes";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Slide,
  TextField,
  Tooltip,
} from "@mui/material";
import { Add, Delete, Edit } from "@mui/icons-material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import axios from "axios";
import CustomTextField from "../CustomTextField";
import CustomSnackBar from "../CustomSnackBar";
import Prime from "./Prime";
import Deduction from "./Deduction";
import HeuresSupplemetaires from "./HeuresSupplementaires";
import { AppThemeContext } from "../AdminMainPage";
import dayjs from "dayjs";
import { AuthenticatedUserContext } from "../../App";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const Enfant = React.lazy(() => import("./Enfant"));
const Conjoint = React.lazy(() => import("./Conjoint"));
export const DeletePrimeIdContext = createContext();
export const DeleteDeductionIdContext = createContext();
export const DeleteHeuresIdContext = createContext();
export const EditedItemContext = createContext();

const EmployeDetails = ({ employe, entites }) => {
  const authenticatedUser=useContext(AuthenticatedUserContext)[0]
  const setEditEmploye = useContext(EditEmployeContext)[1];
  const setDeleteEmploye = useContext(DeleteEmployeContext)[1];
  const [indexOperation, setIndexOperation] = useState(0);
  const [addConjointClicked, setAddConjointClicked] = useState(false);
  const [addEnfantClicked, setAddEnfantClicked] = useState(false);
  const [deletePrimeId, setDeletePrimeId] = useState(null);
  const [deleteDeductionId, setDeleteDeductionId] = useState(null);
  const [deleteHeuresId, setDeleteHeuresId] = useState(null);
  const setReloadingEmployeDetails = useContext(
    ReloadingEmployeDetailsContext
  )[1];
  const [primeFormState, setPrimeFormState] = useState({
    description: "",
    montant: 0,
    typePrime: "MENSUELLE",
    dateDebut: null,
    dateFin: null,
    employeId: employe.id,
  });
  const [deductionFormState, setDeductionFormState] = useState({
    description: "",
    montant: 0,
    typeDeduction: "MENSUELLE",
    dateDebut: null,
    dateFin: null,
    employeId: employe.id,
  });

  const [conjointFormState, setConjointFormState] = useState({
    nom: "",
    prenom: "",
    dateNaissance: null,
  });
  const [enfantFormState, setEnfantFormState] = useState({
    nom: "",
    prenom: "",
    dateNaissance: null,
    mereId: null,
  });

  const [heuresFormState, setHeuresFormState] = useState({
    nombreHeures: 2,
    montantUnitaire: 1,
    date: null,
    employeId: employe.id,
  });
  const [primes, setPrimes] = useState([]);
  const [deductions, setDeductions] = useState([]);
  const [heures, setHeures] = useState([]);
  const [deleteItemSnackBarOpen, setDeleteItemSnackBarOpen] = useState(false);
  const [editedItem, setEditedItem] = useState({ edit: false, type: "" });
  const handleDeleteSnackBarItemOpen = () => {
    setDeleteItemSnackBarOpen(true);
  };
  const appTheme = useContext(AppThemeContext)[0];
  const handleDeleteSnackBarItemClose = () => {
    setDeleteItemSnackBarOpen(false);
  };

  const handlePrimeFormStateChange = (e) => {
    const { name, value } = e.target;
    setPrimeFormState((pre) => ({ ...pre, [name]: value }));
  };
  const handleConjointFormStateChange = (e) => {
    const { name, value } = e.target;
    setConjointFormState((pre) => ({ ...pre, [name]: value }));
  };
  const handleEnfantFormStateChange = (e) => {
    const { name, value } = e.target;
    setEnfantFormState((pre) => ({ ...pre, [name]: value }));
  };
  const handleDeductionFormStateChange = (e) => {
    const { name, value } = e.target;
    setDeductionFormState((pre) => ({ ...pre, [name]: value }));
  };
  const handleHeuresFormStateChange = (e) => {
    const { name, value } = e.target;
    setHeuresFormState((pre) => ({ ...pre, [name]: value }));
  };
  const [addedItem, setAddedItem] = useState({ added: false, type: "" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const primesResponse = await axios.get(
          `http://localhost:8888/PAIE-SERVICE/primes/employe-primes/${employe.id}`, {
          headers: {
            Authorization: `Bearer ${authenticatedUser["access-token"]}`,
          },
        }
        );
        setPrimes(primesResponse.data);

        const deductionsResponse = await axios.get(
          `http://localhost:8888/PAIE-SERVICE/deductions/employe-deductions/${employe.id}`, {
          headers: {
            Authorization: `Bearer ${authenticatedUser["access-token"]}`,
          },
        }
        );
        setDeductions(deductionsResponse.data);

        const heuresResponse = await axios.get(
          `http://localhost:8888/PAIE-SERVICE/heures-supp/employe/${employe.id}`, {
          headers: {
            Authorization: `Bearer ${authenticatedUser["access-token"]}`,
          },
        }
        );
        setHeures(heuresResponse.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);
  const handlePrimeSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8888/PAIE-SERVICE/primes",
        primeFormState, {
        headers: {
          Authorization: `Bearer ${authenticatedUser["access-token"]}`,
        },
      }
      );
      console.log(response.data);
      handleResetIndexOperation();
      setReloadingEmployeDetails(employe.id);
    } catch (err) {
      console.log(err);
    }
    setAddedItem({ added: true, type: "prime" });
  };

  const handleDeductionSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8888/PAIE-SERVICE/deductions",
        deductionFormState, {
        headers: {
          Authorization: `Bearer ${authenticatedUser["access-token"]}`,
        },
      }
      );
      console.log(response.data);
      handleResetIndexOperation();
      setReloadingEmployeDetails(employe.id);
    } catch (err) {
      console.log(err);
    }
    setAddedItem({ added: true, type: "deduction" });
  };

  const handleHeuresSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8888/PAIE-SERVICE/heures-supp",
        heuresFormState, {
        headers: {
          Authorization: `Bearer ${authenticatedUser["access-token"]}`,
        },
      }
      );
      console.log(response.data);
      handleResetIndexOperation();
      setReloadingEmployeDetails(employe.id);
    } catch (err) {
      console.log(err);
    }
    setAddedItem({ added: true, type: "heures" });
  };

  const handleResetIndexOperation = () => {
    setIndexOperation(0);
  };
  const handleAddPrimeOpen = () => {
    setIndexOperation(1);
  };
  const handleAddDeductionOpen = () => {
    setIndexOperation(2);
  };
  const handleAddHeuresSupplementairesOpen = () => {
    setIndexOperation(3);
  };

  const handleAddConjointClose = () => {
    setAddConjointClicked(false);
    setConjointFormState({
      nom: "",
      prenom: "",
      dateNaissance: null,
    });
  };
  const handleAddEnfantClose = () => {
    setAddEnfantClicked(false);
    setEnfantFormState({
      nom: "",
      prenom: "",
      dateNaissance: null,
      mereId: null,
    });
  };
  const handleAddEnfantOpen = () => setAddEnfantClicked(true);
  const handleAddConjointOpen = () => setAddConjointClicked(true);
  const handleDeleteItemsClose = () => {
    setDeleteDeductionId(null);
    setDeletePrimeId(null);
    setDeleteHeuresId(null);
  };
  const handleDeleteItem = async () => {
    handleDeleteItemsClose();
    try {
      let response;
      if (deleteDeductionId != null) {
        response = await axios.delete(
          `http://localhost:8888/PAIE-SERVICE/deductions/${deleteDeductionId}`, {
          headers: {
            Authorization: `Bearer ${authenticatedUser["access-token"]}`,
          },
        }
        );
      } else if (deletePrimeId != null) {
        response = await axios.delete(
          `http://localhost:8888/PAIE-SERVICE/primes/${deletePrimeId}`, {
          headers: {
            Authorization: `Bearer ${authenticatedUser["access-token"]}`,
          },
        }
        );
      } else if (deleteHeuresId != null) {
        response = await axios.delete(
          `http://localhost:8888/PAIE-SERVICE/heures-supp/${deleteHeuresId}`, {
          headers: {
            Authorization: `Bearer ${authenticatedUser["access-token"]}`,
          },
        }
        );
      }
      console.log(response.data);
      handleDeleteSnackBarItemOpen();
    } catch (err) {
      console.log(err);
    }
  };

  const handleConjointSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8888/EMPLOYE-SERVICE/conjoints",
      
        {
          nom: conjointFormState.nom,
          prenom: conjointFormState.prenom,
          dateNaissance: conjointFormState.dateNaissance,
          employeId: employe.id,
        }, {
        headers: {
          Authorization: `Bearer ${authenticatedUser["access-token"]}`,
        },
      }
      );
      console.log(response.data);
      setAddConjointClicked(false);
        setAddedItem({ added: true, type: "conjoint" });
      setReloadingEmployeDetails(employe.id);
    
    } catch (err) {
      console.error(err);
    }
  };
  const handleEnfantSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8888/EMPLOYE-SERVICE/enfants",
        {
          nom: enfantFormState.nom,
          prenom: enfantFormState.prenom,
          dateNaissance: enfantFormState.dateNaissance,
          mereId: enfantFormState.mereId,
          employeId: employe.id,
        }, {
        headers: {
          Authorization: `Bearer ${authenticatedUser["access-token"]}`,
        },
      }
      );
      console.log(response.data);
      setAddEnfantClicked(false);
        setAddedItem({ added: true, type: "enfant" });
      setReloadingEmployeDetails(employe.id);
    
    } catch (err) {
      console.error(err);
    }
  };


  return (
    <Suspense fallback={<div>...Loading</div>}>
      <DeletePrimeIdContext.Provider value={[deletePrimeId, setDeletePrimeId]}>
        <DeleteDeductionIdContext.Provider
          value={[deleteDeductionId, setDeleteDeductionId]}
        >
          <DeleteHeuresIdContext.Provider
            value={[deleteHeuresId, setDeleteHeuresId]}
          >
            <EditedItemContext.Provider value={[editedItem, setEditedItem]}>
              <div className="p-3">
                <p className="mt-2 fw-bold fs-4">
                  Toutes les informations sur l'employé{" "}
                  <span className="fw-bold text-secondary">
                  
                    {employe["nom"]}   {" "} {employe["prenom"]}
                  </span>
                </p>
                <div className="border border-1 rounded-2 p-3">
                  <div className="row">
                    <div className="col-md-4">
                      <center>
                        <img
                            src={`http://localhost:8888/EMPLOYE-SERVICE/employes/image-profile/${employe.id}`}
                          alt=""
                          width="200"
                          height="200"
                          style={{ borderRadius: "50%" }}
                        />
                      </center>
                      <div className="row">
                        <div className="col-md mt-3">Date de recrutement</div>
                        <div
                          className="col-md mt-3 rounded-pill  text-center"
                          style={{ backgroundColor: "#9B9BA94C" }}
                        >
                          {employe["dateRecrutement"]}
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md mt-3">Années d'experience</div>
                        <div
                          className="col-md mt-3 rounded-pill  text-center"
                          style={{
                            backgroundColor:
                              appTheme === "light" ? "#D9E7E8AD" : "#0846B185",
                          }}
                        >
                          {employe["anneeExperience"]}
                        </div>
                      </div>
                    </div>
                    <div className="col-md-8   ">
                      <div className="row">
                        <div className="col-9 fw-bold text-secondary fs-4 mb-3">
                         
                          {employe["nom"]} {" "} {employe["prenom"]}
                        </div>
                        <div
                          className={`col-3 mb-3 rounded-pill text-light align-content-center text-center ${
                            employe["etatEmploye"] === "ACTIF"
                              ? "bg-success"
                              : "bg-danger"
                          }`}
                        >
                          {employe["etatEmploye"] === "ACTIF"
                            ? "Disponible"
                            : "Non disponible"}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md mb-3 ">
                          <span className="fw-bold text-secondary">CIN:</span>{" "}
                          <span
                            className="rounded-pill  p-2"
                            style={{
                              backgroundColor:
                                appTheme === "light"
                                  ? "#D9E7E8AD"
                                  : "#0846B185",
                            }}
                          >
                            {employe["cin"]}
                          </span>
                        </div>
                        <div className="col-md mb-3">
                          <span className="fw-bold text-secondary">âge:</span>{" "}
                          <span
                            className="rounded-pill  p-2"
                            style={{
                              backgroundColor:
                                appTheme === "light"
                                  ? "#D9E7E8AD"
                                  : "#0846B185",
                            }}
                          >
                            
                            {dayjs().diff(dayjs(employe["dateNaissance"]),'year')}
                          </span>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md mb-3">
                          
                          <span className="fw-bold text-secondary">Tél:</span>
                          <span
                            className="rounded-pill  p-2"
                            style={{
                              backgroundColor:
                                appTheme === "light"
                                  ? "#D9E7E8AD"
                                  : "#0846B185",
                            }}
                          >
                            {employe["tel"]}
                          </span>
                        </div>
                        <div className="col-md mb-3">
                         
                          <span className="fw-bold text-secondary">
                            Email:
                          </span>{" "}
                          <span
                            className="rounded-pill  p-2"
                            style={{
                              backgroundColor:
                                appTheme === "light"
                                  ? "#D9E7E8AD"
                                  : "#0846B185",
                            }}
                          >
                            {" "}
                            {employe["email"]}
                          </span>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md mb-3">
                        
                          <span className="fw-bold text-secondary">
                            Adresse:
                          </span>
                          <span
                            className="rounded-pill  p-2"
                            style={{
                              backgroundColor:
                                appTheme === "light"
                                  ? "#D9E7E8AD"
                                  : "#0846B185",
                            }}
                          >
                           
                            {employe["adresse"]}
                          </span>
                        </div>
                        <div className="col-md mb-3">
                         
                          <span className="fw-bold text-secondary">Ville:</span>
                          <span
                            className="rounded-pill  p-2"
                            style={{
                              backgroundColor:
                                appTheme === "light"
                                  ? "#D9E7E8AD"
                                  : "#0846B185",
                            }}
                          >
                            {employe["ville"]}
                          </span>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md mb-3">
                        
                          <span className="fw-bold text-secondary">
                            Genre:
                          </span>{" "}
                          <span
                            className="rounded-pill  p-2"
                            style={{
                              backgroundColor:
                                appTheme === "light"
                                  ? "#D9E7E8AD"
                                  : "#0846B185",
                            }}
                          >
                            {employe["genre"]}
                          </span>
                        </div>
                        <div className="col-md mb-3">
                          <span className="fw-bold text-secondary">
                            Situation familiale:
                          </span>{" "}
                          <span
                            className="rounded-pill  p-2"
                            style={{
                              backgroundColor:
                                appTheme === "light"
                                  ? "#D9E7E8AD"
                                  : "#0846B185",
                            }}
                          >
                            {employe["situationFamiliale"]}
                          </span>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md mb-3">
                          {" "}
                          <span className="fw-bold text-secondary">
                            Région:
                          </span>{" "}
                          <span
                            className="rounded-pill  p-2"
                            style={{
                              backgroundColor:
                                appTheme === "light"
                                  ? "#D9E7E8AD"
                                  : "#0846B185",
                            }}
                          >
                            {employe.region?.label}
                          </span>
                        </div>
                        <div className="col-md mb-3">
                          <div className="row">
                            <div className="col-md-4 mb-3 fw-bold text-secondary">
                              Mutuelles:
                            </div>
                            <div
                              className="col-md-7 mb-3 rounded-pill p-2 "
                              style={{
                                backgroundColor:
                                  appTheme === "light"
                                    ? "#D9E7E8AD"
                                    : "#0846B185",
                              }}
                            >
                              <ul>
                                {employe["mutuelles"].map((m) => (
                                  <li>{m["label"]}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md mt-3">
                      Catégorie:{" "}
                      <span className="fw-bold ms-2">
                        {
                          employe["grade"]["cadre"]["corps"]["categorie"][
                            "name"
                          ]
                        }
                      </span>
                    </div>
                    <div className="col-md mt-3">
                      Corps:
                      <span className="fw-bold ms-2">
                        {employe["grade"]["cadre"]["corps"]["label"]}
                      </span>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md mt-3">
                      Cadre:
                      <span className="fw-bold ms-2">
                        {employe["grade"]["cadre"]["label"]}
                      </span>
                    </div>
                    <div className="col-md mt-3">
                      Grade:
                      <span className="fw-bold ms-2">
                        {employe["grade"]["label"]}
                      </span>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md mt-3">
                      Indice-Echelon:
                      <span className="fw-bold ms-2">
                        {employe["indiceEchelon"]["indice"]}
                        {" - "}
                        {employe["indiceEchelon"]["echelon"]}
                      </span>
                    </div>
                    <div className="col-md mt-3">
                      Entité Actuelle:
                      <span className="fw-bold ms-2">
                        {
                          entites.find(
                            (e) =>
                              e["id"] ===
                              employe["entites"][employe["entites"].length - 1]
                                ?.entiteId
                          )?.name
                        }
                      </span>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md mt-3">
                      Poste:
                      <span className="fw-bold ms-2">
                        {employe["poste"]["label"]}
                        <br />
                        <span style={{ fontSize: 12 }}>
                          {employe["poste"]["description"]}
                        </span>
                      </span>
                    </div>
                  </div>
                  <div className="row gap-2">
                    <div className="col-md mt-3">
                      <div className="row">
                        <div className="col-md">
                          Conjoints:{" "}
                          {employe["conjoints"].length === 0
                            ? " Pas de conjoints"
                            : `${employe["conjoints"].length} conjoints`}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-1">
                          <Tooltip title="ajouter un conjoint">
                            <IconButton onClick={handleAddConjointOpen}>
                              <Add color="primary" />
                            </IconButton>
                          </Tooltip>
                        </div>
                      </div>
                      {addConjointClicked && (
                        <form
                          method="post"
                          onSubmit={handleConjointSubmit}
                          className="mb-3"
                        >
                          <div className="row">
                            <div className="col-md mt-2">
                              <TextField
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
                                label="Nom"
                                name="nom"
                                size="small"
                                required
                                value={conjointFormState.nom}
                                onChange={handleConjointFormStateChange}
                                variant="outlined"
                              />
                            </div>
                            <div className="col-md mt-2">
                              <TextField
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
                                label="Prénom"
                                name="prenom"
                                size="small"
                                required
                                value={conjointFormState.prenom}
                                onChange={handleConjointFormStateChange}
                                variant="outlined"
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
                                  value={conjointFormState.dateNaissance}
                                  onChange={(newValue) =>
                                    setConjointFormState((pre) => ({
                                      ...pre,
                                      dateNaissance: newValue,
                                    }))
                                  }
                                  label="date de naissance"
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      sx={{
                                        width: "100%",
                                        "& .MuiOutlinedInput-root": {
                                          "& fieldset": {
                                            borderColor:
                                              appTheme !== "light"
                                                ? "#FFFFFF"
                                                : "",
                                          },
                                          "& input::placeholder": {
                                            color:
                                              appTheme !== "light"
                                                ? "#FFFFFF"
                                                : "",
                                          },
                                        },
                                        "& .MuiInputLabel-root": {
                                          color:
                                            appTheme !== "light"
                                              ? "#FFFFFF"
                                              : "",
                                        },
                                        "& .MuiInputLabel-root.Mui-focused": {
                                          color:
                                            appTheme !== "light"
                                              ? "#FFFFFF"
                                              : "",
                                        },
                                        "& input": {
                                          color:
                                            appTheme !== "light"
                                              ? "#FFFFFF"
                                              : "#000000",
                                        },
                                      }}
                                    />
                                  )}
                                />
                              </LocalizationProvider>
                            </div>
                            <div className="col-md mt-3">
                              <Button
                                type="submit"
                                color="info"
                                variant="contained"
                                className="me-2"
                              >
                                Ajouter
                              </Button>
                              <Button
                                type="submit"
                                variant="outlined"
                                color="secondary"
                                onClick={handleAddConjointClose}
                              >
                                Annuler
                              </Button>
                            </div>
                          </div>
                        </form>
                      )}
                      {employe["conjoints"].map((c) => (
                        <Conjoint data={c} />
                      ))}
                    </div>
                    <div className="col-md mt-3">
                      <div className="row">
                        <div className="col-md">
                          Enfants:{" "}
                          {employe["enfants"].length === 0
                            ? " Pas d'enfants"
                            : `${employe["enfants"].length} enfants`}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-1">
                          <Tooltip title="ajouter un enfant">
                            <IconButton onClick={handleAddEnfantOpen}>
                              <Add color="primary" />
                            </IconButton>
                          </Tooltip>
                        </div>
                      </div>
                      {addEnfantClicked && (
                        <form
                          method="post"
                          onSubmit={handleEnfantSubmit}
                          className="mb-3"
                        >
                          <div className="row">
                            <div className="col-md mt-2">
                              <CustomTextField
                                label="Nom"
                                name="nom"
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
                                required={true}
                                value={enfantFormState.nom}
                                onChange={handleEnfantFormStateChange}
                              />
                            </div>
                            <div className="col-md mt-2">
                              <CustomTextField
                                label="Prénom"
                                name="prenom"
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
                                required={true}
                                value={enfantFormState.prenom}
                                onChange={handleEnfantFormStateChange}
                              />
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md mt-2">
                              <FormControl
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
                                size="small"
                              >
                                <InputLabel id="demo-multiple-name-label">
                                  Mère
                                </InputLabel>
                                <Select
                                  labelId="demo-multiple-name-label"
                                  id="demo-multiple-name"
                                  name="mereId"
                                  value={enfantFormState.mereId}
                                  onChange={handleEnfantFormStateChange}
                                  input={<OutlinedInput label="Mere" />}
                                >
                                  {employe["conjoints"].map((c) => (
                                    <MenuItem key={c.id} value={c.id}>
                                      {c.nom + " " + c.prenom}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </div>
                            <div className="col-md mt-2">
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                  closeOnSelect
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
                                  value={enfantFormState.dateNaissance}
                                  onChange={(newValue) =>
                                    setEnfantFormState((pre) => ({
                                      ...pre,
                                      dateNaissance: newValue,
                                    }))
                                  }
                                  label="date de naissance"
                                />
                              </LocalizationProvider>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col">
                              <div className="col-md mt-2">
                                <Button
                                  type="submit"
                                  color="info"
                                  variant="contained"
                                  className="me-2"
                                >
                                  Ajouter
                                </Button>
                                <Button
                                  type="submit"
                                  color="secondary"
                                  onClick={handleAddEnfantClose}
                                  variant="outlined"
                                >
                                  Annuler
                                </Button>
                              </div>
                            </div>
                          </div>
                        </form>
                      )}
                      {employe["enfants"].map((c) => (
                        <Enfant data={c} conjoints={employe["conjoints"]} />
                      ))}
                    </div>
                  </div>
                  <div className="row justify-content-end">
                    <div className="col-md-2">
                      <Tooltip title="supprimer">
                        <IconButton
                          onClick={() => setDeleteEmploye(employe.id)}
                        >
                          <Delete color="error" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="modifier">
                        <IconButton onClick={() => setEditEmploye(employe.id)}>
                          <Edit color="primary" />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </div>
                </div>
                <div className="row gap-3">
                  <div className="col-md">
                    <div className="row fw-bold text-secondary fs-5 mb-2">
                      <center>Primes</center>
                    </div>
                    {primes.length === 0 && (
                      <center className="fw-bold">pas de primes</center>
                    )}
                    {primes.map((p) => (
                      <Prime prime={p} />
                    ))}
                  </div>
                  <div className="col-md">
                    <div className="row fw-bold text-secondary fs-5 mb-2">
                      <center>Deductions</center>
                    </div>
                    {deductions.length === 0 && (
                      <center className="fw-bold">pas de déductions</center>
                    )}
                    {deductions.map((d) => (
                      <Deduction deduction={d} />
                    ))}
                  </div>
                  <div className="col-md">
                    <div className="row fw-bold text-secondary fs-5 mb-2">
                      <center>Heures supplementaires</center>
                    </div>
                    {heures.length === 0 && (
                      <center className="fw-bold">
                        pas d'heures supplémentaires
                      </center>
                    )}
                    {heures.map((h) => (
                      <HeuresSupplemetaires heuresSupplemetaires={h} />
                    ))}
                  </div>
                </div>
                <div className="row gap-3">
                  <div className="col-md mt-2">
                    <Button
                      color="success"
                      className="rounded-pill"
                      sx={{ width: "100%" }}
                      variant={indexOperation === 1 ? "contained" : "outlined"}
                      onClick={handleAddPrimeOpen}
                    >
                      Ajouter prime
                    </Button>
                  </div>
                  <div className="col-md mt-2">
                    <Button
                      color="error"
                      className="rounded-pill"
                      sx={{ width: "100%" }}
                      variant={indexOperation === 2 ? "contained" : "outlined"}
                      onClick={handleAddDeductionOpen}
                    >
                      Ajouter deduction
                    </Button>
                  </div>
                  <div className="col-md mt-2">
                    <Button
                      color="primary"
                      className="rounded-pill"
                      sx={{ width: "100%" }}
                      variant={indexOperation === 3 ? "contained" : "outlined"}
                      onClick={handleAddHeuresSupplementairesOpen}
                    >
                      Ajouter heures supplémentaires
                    </Button>
                  </div>
                </div>
                {indexOperation === 0 ? null : indexOperation === 1 ? (
                  <form method="post" onSubmit={handlePrimeSubmit}>
                    <div className="row">
                      <div className="col-md mt-3">
                        <TextField
                          sx={{
                            width: "100%",
                            "& .MuiOutlinedInput-root": {
                              "& fieldset": {
                                borderColor:
                                  appTheme !== "light" ? "#FFFFFF" : "",
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
                              color:
                                appTheme !== "light" ? "#FFFFFF" : "#000000",
                            },
                          }}
                          id="outlined-basic"
                          label="Description"
                          name="description"
                          multiline
                          required
                          value={primeFormState.description}
                          onChange={handlePrimeFormStateChange}
                          variant="outlined"
                          className="me-2"
                        />
                      </div>
                      <div className="col-md mt-3">
                        <TextField
                          sx={{
                            width: "100%",
                            "& .MuiOutlinedInput-root": {
                              "& fieldset": {
                                borderColor:
                                  appTheme !== "light" ? "#FFFFFF" : "",
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
                              color:
                                appTheme !== "light" ? "#FFFFFF" : "#000000",
                            },
                          }}
                          id="outlined-basic"
                          label="Montant"
                          name="montant"
                          type="number"
                          required
                          value={primeFormState.montant}
                          onChange={handlePrimeFormStateChange}
                          variant="outlined"
                          className="me-2"
                        />
                      </div>
                      <div className="col-md mt-3">
                        <FormControl
                          fullWidth
                          required
                          sx={{
                            width: "100%",
                            "& .MuiOutlinedInput-root": {
                              "& fieldset": {
                                borderColor:
                                  appTheme !== "light" ? "#FFFFFF" : "",
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
                              color:
                                appTheme !== "light" ? "#FFFFFF" : "#000000",
                            },
                          }}
                        >
                          <InputLabel id="demo-simple-select-label">
                            Type prime
                          </InputLabel>
                          <Select
                            sx={{
                              width: "100%",
                              "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                  borderColor:
                                    appTheme !== "light" ? "#FFFFFF" : "",
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
                                color:
                                  appTheme !== "light" ? "#FFFFFF" : "#000000",
                              },
                            }}
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="Type prime"
                            name="typePrime"
                            value={primeFormState.typePrime}
                            onChange={handlePrimeFormStateChange}
                          >
                            <MenuItem value="ANNUELLE">ANNUELLE</MenuItem>
                            <MenuItem value="MENSUELLE">MENSUELLE</MenuItem>
                          </Select>
                        </FormControl>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md mt-3">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            closeOnSelect
                            sx={{
                              width: "100%",
                              "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                  borderColor:
                                    appTheme !== "light" ? "#FFFFFF" : "",
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
                                color:
                                  appTheme !== "light" ? "#FFFFFF" : "#000000",
                              },
                            }}
                            value={primeFormState.dateDebut}
                            onChange={(newValue) =>
                              setPrimeFormState((pre) => ({
                                ...pre,
                                dateDebut: newValue,
                              }))
                            }
                            label="date de début"
                          />
                        </LocalizationProvider>
                      </div>
                      <div className="col-md mt-3">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            closeOnSelect
                            sx={{
                              width: "100%",
                              "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                  borderColor:
                                    appTheme !== "light" ? "#FFFFFF" : "",
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
                                color:
                                  appTheme !== "light" ? "#FFFFFF" : "#000000",
                              },
                            }}
                            value={primeFormState.dareFin}
                            onChange={(newValue) =>
                              setPrimeFormState((pre) => ({
                                ...pre,
                                dateFin: newValue,
                              }))
                            }
                            label="date de fin"
                          />
                        </LocalizationProvider>
                      </div>
                    </div>
                    <div className="row mt-3 mx-1">
                      <Button type="submit" color="warning" variant="contained">
                        Ajouter
                      </Button>
                    </div>
                    <div className="row mt-3 mx-1">
                      <Button
                        type="button"
                        color="secondary"
                        variant="text"
                        onClick={handleResetIndexOperation}
                      >
                        Annuler
                      </Button>
                    </div>
                  </form>
                ) : indexOperation === 2 ? (
                  <form method="post" onSubmit={handleDeductionSubmit}>
                    <div className="row">
                      <div className="col-md mt-3">
                        <TextField
                          sx={{
                            width: "100%",
                            "& .MuiOutlinedInput-root": {
                              "& fieldset": {
                                borderColor:
                                  appTheme !== "light" ? "#FFFFFF" : "",
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
                              color:
                                appTheme !== "light" ? "#FFFFFF" : "#000000",
                            },
                          }}
                          id="outlined-basic"
                          label="Description"
                          name="description"
                          multiline
                          value={deductionFormState.description}
                          onChange={handleDeductionFormStateChange}
                          variant="outlined"
                          className="me-2"
                        />
                      </div>
                      <div className="col-md mt-3">
                        <TextField
                          sx={{
                            width: "100%",
                            "& .MuiOutlinedInput-root": {
                              "& fieldset": {
                                borderColor:
                                  appTheme !== "light" ? "#FFFFFF" : "",
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
                              color:
                                appTheme !== "light" ? "#FFFFFF" : "#000000",
                            },
                          }}
                          id="outlined-basic"
                          label="Montant"
                          type="number"
                          name="montant"
                          value={deductionFormState.montant}
                          onChange={handleDeductionFormStateChange}
                          variant="outlined"
                          className="me-2"
                        />
                      </div>
                      <div className="col-md mt-3">
                        <FormControl
                          fullWidth
                          sx={{
                            width: "100%",
                            "& .MuiOutlinedInput-root": {
                              "& fieldset": {
                                borderColor:
                                  appTheme !== "light" ? "#FFFFFF" : "",
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
                              color:
                                appTheme !== "light" ? "#FFFFFF" : "#000000",
                            },
                          }}
                        >
                          <InputLabel id="demo-simple-select-label">
                            Type déduction
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="Type deduction"
                            name="typeDeduction"
                            value={deductionFormState.typeDeduction}
                            onChange={handleDeductionFormStateChange}
                          >
                            <MenuItem value="ANNUELLE">ANNUELLE</MenuItem>
                            <MenuItem value="MENSUELLE">MENSUELLE</MenuItem>
                          </Select>
                        </FormControl>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md mt-3">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            closeOnSelect
                            sx={{
                              width: "100%",
                              "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                  borderColor:
                                    appTheme !== "light" ? "#FFFFFF" : "",
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
                                color:
                                  appTheme !== "light" ? "#FFFFFF" : "#000000",
                              },
                            }}
                            value={deductionFormState.dateDebut}
                            onChange={(newValue) =>
                              setDeductionFormState((pre) => ({
                                ...pre,
                                dateDebut: newValue,
                              }))
                            }
                            label="date de debut"
                          />
                        </LocalizationProvider>
                      </div>
                      <div className="col-md mt-3">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            closeOnSelect
                            sx={{
                              width: "100%",
                              "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                  borderColor:
                                    appTheme !== "light" ? "#FFFFFF" : "",
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
                                color:
                                  appTheme !== "light" ? "#FFFFFF" : "#000000",
                              },
                            }}
                            value={deductionFormState.dareFin}
                            onChange={(newValue) =>
                              setDeductionFormState((pre) => ({
                                ...pre,
                                dateFin: newValue,
                              }))
                            }
                            label="date de fin"
                          />
                        </LocalizationProvider>
                      </div>
                    </div>
                    <div className="row mt-3 mx-1">
                      <Button type="submit" color="warning" variant="contained">
                        Ajouter
                      </Button>
                    </div>
                    <div className="row mt-3 mx-1">
                      <Button
                        type="button"
                        color="secondary"
                        variant="text"
                        onClick={handleResetIndexOperation}
                      >
                        Annuler
                      </Button>
                    </div>
                  </form>
                ) : (
                  <form method="post" onSubmit={handleHeuresSubmit}>
                    <div className="row">
                      <div className="col-md mt-3">
                        <TextField
                          sx={{
                            width: "100%",
                            "& .MuiOutlinedInput-root": {
                              "& fieldset": {
                                borderColor:
                                  appTheme !== "light" ? "#FFFFFF" : "",
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
                              color:
                                appTheme !== "light" ? "#FFFFFF" : "#000000",
                            },
                          }}
                          id="outlined-basic"
                          label="Nombre d'heures"
                          name="nombreHeures"
                          type="number"
                          value={heuresFormState.nombreHeures}
                          onChange={handleHeuresFormStateChange}
                          variant="outlined"
                        />
                      </div>
                      <div className="col-md mt-3">
                        <TextField
                          sx={{
                            width: "100%",
                            "& .MuiOutlinedInput-root": {
                              "& fieldset": {
                                borderColor:
                                  appTheme !== "light" ? "#FFFFFF" : "",
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
                              color:
                                appTheme !== "light" ? "#FFFFFF" : "#000000",
                            },
                          }}
                          id="outlined-basic"
                          label="Montant unitaire"
                          name="montantUnitaire"
                          type="number"
                          value={heuresFormState.montantUnitaire}
                          onChange={handleHeuresFormStateChange}
                          variant="outlined"
                        />
                      </div>

                      <div className="col-md mt-3">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            closeOnSelect
                            sx={{
                              width: "100%",
                              "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                  borderColor:
                                    appTheme !== "light" ? "#FFFFFF" : "",
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
                                color:
                                  appTheme !== "light" ? "#FFFFFF" : "#000000",
                              },
                            }}
                            value={heuresFormState.date}
                            onChange={(newValue) =>
                              setHeuresFormState((pre) => ({
                                ...pre,
                                date: newValue,
                              }))
                            }
                            label="Date"
                          />
                        </LocalizationProvider>
                      </div>
                    </div>
                    <div className="row mt-3 mx-1">
                      <Button type="submit" color="warning" variant="contained">
                        Ajouter
                      </Button>
                    </div>
                    <div className="row mt-3 mx-1">
                      <Button
                        type="button"
                        color="secondary"
                        variant="text"
                        onClick={handleResetIndexOperation}
                      >
                        Annuler
                      </Button>
                    </div>
                  </form>
                )}
                <Dialog
                  open={
                    deleteDeductionId != null ||
                    deletePrimeId != null ||
                    deleteHeuresId != null
                  }
                  TransitionComponent={Transition}
                  keepMounted
                  onClose={handleDeleteItemsClose}
                >
                  <DialogTitle>
                    Etes-vous sur de supprimer{" "}
                    {deleteDeductionId != null
                      ? "la DEDUCTION ?"
                      : deletePrimeId != null
                      ? "la PRIME ?"
                      : "Les HEURES SUPPLEMENTAIRES ?"}
                  </DialogTitle>
                  <DialogContent></DialogContent>
                  <DialogActions>
                    <Button
                      onClick={handleDeleteItemsClose}
                      color="secondary"
                      variant="text"
                    >
                      Annuler
                    </Button>
                    <Button
                      onClick={handleDeleteItem}
                      color="error"
                      variant="contained"
                    >
                      Confirmer
                    </Button>
                  </DialogActions>
                </Dialog>
                <CustomSnackBar
                  isOpen={deleteItemSnackBarOpen}
                  duration={4000}
                  onClose={handleDeleteSnackBarItemClose}
                  type="error"
                  message={
                    deleteDeductionId != null
                      ? " Deduction supprimee avec succes!"
                      : deletePrimeId != null
                      ? " Prime supprimee avec succes!"
                      : " Heures supplementaires supprimees avec succes!"
                  }
                />

                <CustomSnackBar
                  isOpen={editedItem.edit}
                  duration={4000}
                  onClose={() => setEditedItem({ edit: false, type: "" })}
                  type="info"
                  message={
                    editedItem.type === "heures"
                      ? " Heures Supplementaires modifiees avec succes!"
                      : editedItem.type === "prime"
                      ? " Prime modifiee avec succes!"
                      : " Deduction modifiee avec succes!"
                  }
                />
                <CustomSnackBar
                  isOpen={addedItem.added}
                  duration={4000}
                  onClose={() => setAddedItem({ added: false, type: "" })}
                  type="success"
                  message={
                    addedItem.type === "heures"
                      ? " Heures Supplementaires ajoutees avec succes!"
                      : addedItem.type === "prime"
                      ? " Prime ajoutee avec succes!"
                      : addedItem.type === "deduction"
                      ? " Deduction ajoutee avec succes!"
                      : addedItem.type === "enfant"
                      ? " Enfant ajoutee avec succes!"
                      : " Conjoint ajoutee avec succes!"
                  }
                />
              </div>
            </EditedItemContext.Provider>
          </DeleteHeuresIdContext.Provider>
        </DeleteDeductionIdContext.Provider>
      </DeletePrimeIdContext.Provider>
    </Suspense>
  );
};

export default React.memo(EmployeDetails, (prevProps, nextProps) => Object.is(prevProps, nextProps));

