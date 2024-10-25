import React, { useContext, useEffect, useState } from "react";
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Slide,
  TextField,
  Tooltip,
} from "@mui/material";
import "../../App.css";
import {

  LocalizationProvider,
  MobileDateTimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Delete, Edit } from "@mui/icons-material";

import dayjs from "dayjs";
import {
  DeleteFormationIdContext,
  EditFormationIdContext,
  SharedDataContext,
} from "./Formations";
import CustomSnackBar from "../CustomSnackBar";
import axios from "axios";
import { AppThemeContext } from "../AdminMainPage";
import { AuthenticatedUserContext } from "../../App";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

////////////////COMPONENT///////////////////////////////////////////
const FormationDetails = ({ formation }) => {
  const authenticatedUser = useContext(AuthenticatedUserContext)[0];
  const [afficherLaListeDesParticipants, setAfficherLaListeDesParticipants] =
    useState(false);
  const sharedData = useContext(SharedDataContext)[0];
  const [entiteFormations, setEntiteFormation] = useState([]);
  const [employesFormation, setEmployesFormation] = useState([]);
  const setEditFormationId = useContext(EditFormationIdContext)[1];
  const setDeleteFormationId = useContext(DeleteFormationIdContext)[1];
  const [addEmployeeToFormationClicked, setAddEmployeeToFormationClicked] =
    useState(false);
  const [employeList, setEmployeList] = useState([]);
  const appTheme = useContext(AppThemeContext)[0];
  const [
    showAddMembersToFormationSnackBar,
    setShowAddMembersToFormationSnackBar,
  ] = useState(false);
  const [addEmployeToFormation, setAddEmployeToFormation] = useState({
    typeId: "Tous",
    entiteId: "Toutes",
    dateDebut: null,
    dateFin: null,
    employes: [],
  });
  const handleAddMembersToFormationSnackBarClose = () => {
    setShowAddMembersToFormationSnackBar(false);
  };
  const handleAddMembersToFormationSnackBarOpen = () => {
    setShowAddMembersToFormationSnackBar(true);
  };

  const handleAddEmployeeToFormationClickedOpen = () => {
    setAddEmployeeToFormationClicked(true);
  };

  const handleAddEmployeeToFormationClickedClose = () => {
    setAddEmployeeToFormationClicked(false);
    setAddEmployeToFormation({
      typeId: "Tous",
      entiteId: "Toutes",
      dateDebut: null,
      dateFin: null,
      employes: [],
    });
  };
  const getEmployeId = (nomComplet) => {
    return employeList.find((e) => `${e.nom} ${e.prenom}` === nomComplet)?.id;
  };
  const toggleAfficherLaListesDesParticipants = () => {
    setAfficherLaListeDesParticipants((pre) => !pre);
  };

  const handleAddEmployeeToFormationSubmit = async (event) => {
    event.preventDefault();
    try {
      let ids = [];
      addEmployeToFormation.employes.forEach((nomComplet) => {
        ids.push(getEmployeId(nomComplet));
      });

      if (addEmployeToFormation.entiteId === "Toutes" && ids.length > 0) {
        alert("1");
        alert(ids);

        const response = await axios.post(
          `http://localhost:8888/FORMATION-SERVICE/formations/add-list-employe-to-formation`,
          {
            employeFormationRequestDto: {
              employeId: ids[0],
              formationId: formation.id,
              dateIntegration: addEmployeToFormation.dateDebut,
              dateFin: addEmployeToFormation.dateFin,
              evaluation: 0,
            },
            employeIds: ids.length > 1 ? ids.slice(1) : [],
          },
          {
            headers: {
              Authorization: `Bearer ${authenticatedUser["access-token"]}`,
            },
          }
        );
        console.log(response.data);
        handleAddMembersToFormationSnackBarOpen();
      } else {
        const entiteName = sharedData["entites"].find(
          (e) => e["id"] === addEmployeToFormation.entiteId
        )?.name;

        if (
          addEmployeToFormation.employes.includes(
            `Tous les employes de l'entite ${entiteName}`
          )
        ) {
          alert("2");

          const response = await axios.post(
            "http://localhost:8888/FORMATION-SERVICE/formations/entite-formation",
            {
              entiteId: addEmployeToFormation.entiteId,
              formationId: formation.id,
              dateAjout: addEmployeToFormation.dateDebut,
              dateFin: addEmployeToFormation.dateFin,
            },
            {
              headers: {
                Authorization: `Bearer ${authenticatedUser["access-token"]}`,
              },
            }
          );
          console.log(response.data);
          handleAddMembersToFormationSnackBarOpen();
        } else if (ids.length > 0) {
          alert("3");
          alert(ids);

          const response = await axios.post(
            `http://localhost:8888/FORMATION-SERVICE/formations/add-list-employe-to-formation`,
            {
              employeFormationRequestDto: {
                employeId: ids[0],
                formationId: formation.id,
                dateIntegration: addEmployeToFormation.dateDebut,
                dateFin: addEmployeToFormation.dateFin,
                evaluation: 0,
              },
              employeIds: ids.slice(1),
            },
            {
              headers: {
                Authorization: `Bearer ${authenticatedUser["access-token"]}`,
              },
            }
          );
          console.log(response.data);
          handleAddMembersToFormationSnackBarOpen();
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const entiteFormationResponse = await axios.get(
          `http://localhost:8888/FORMATION-SERVICE/formations/entite-formation/${formation.id}`,
          {
            headers: {
              Authorization: `Bearer ${authenticatedUser["access-token"]}`,
            },
          }
        );
        setEntiteFormation(entiteFormationResponse.data);

        const employesFormationResponse = await axios.get(
          `http://localhost:8888/FORMATION-SERVICE/formations/employe-formations/${formation.id}`,
          {
            headers: {
              Authorization: `Bearer ${authenticatedUser["access-token"]}`,
            },
          }
        );
        setEmployesFormation(employesFormationResponse.data);

        const employeListResponse = await axios.get(
          `http://localhost:8888/EMPLOYE-SERVICE/employes`,
          {
            headers: {
              Authorization: `Bearer ${authenticatedUser["access-token"]}`,
            },
          }
        );
        setEmployeList(employeListResponse.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [formation.id]);

  const handleEmployeChange = (newValue) => {
    setAddEmployeToFormation((pre) => ({ ...pre, employes: newValue }));
  };

  const handleAddEmployeToFormationTypeChange = (e) => {
    setAddEmployeToFormation((pre) => ({ ...pre, typeId: e.target.value }));
    setAddEmployeToFormation((pre) => ({ ...pre, employes: [] }));
  };
  const handleAddEmployeToFormationEntiteChange = (e) => {
    setAddEmployeToFormation((pre) => ({ ...pre, entiteId: e.target.value }));
  };

  return (
    <>
      <div
        className=" p-4  rounded-4 mb-2 my-4 "
        style={{ width: "100%", backgroundColor: "#97DBFF29" }}
      >
        {dayjs().isAfter(dayjs(formation["dateFin"])) ? (
          <div className="col-md-2 col-4 offset-8 offset-md-10 rounded-pill p-2 fw-bold text-light bg-info">
            <center>Terminée</center>
          </div>
        ) : (
          <div className="col-md-2 offset-md-10 rounded-pill p-2 fw-bold text-light bg-success">
            <center>En cours</center>
          </div>
        )}

        <div className="row ">
          <div className="col-md-4 col-4 mb-4">titre de la formation</div>
          <div className="col-md-8 col-8 mb-4 fw-bold fs-4">
            {formation["label"]}
          </div>
        </div>
        <div className="row ">
          <div className="col-md-4 col-4 mb-4">description</div>
          <div className="col-md-8 col-8 mb-4 text-secondary">
            {formation["description"]}
          </div>
        </div>
        <div className="row ">
          <div className="col-md-4 col-4 mb-4">duree</div>
          <div className="col-md-8 col-4 mb-4">
            {formation["dureeEnJours"]}
            {" Jours"}
          </div>
        </div>
        <div className="row ">
          <div className="col-md-4 col-4 mb-4">date de debut</div>
          <div className="col-md-4 col-4 mb-4">
            {dayjs(formation["dateDebut"]).format("YYYY-MM-DD HH:mm:ss")}
          </div>
        </div>
        <div className="row ">
          <div className="col-md-4 col-4 mb-4">date de fin</div>
          <div className="col-md-4 col-4 mb-4">
            {dayjs(formation["dateFin"]).format("YYYY-MM-DD HH:mm:ss")}
          </div>
        </div>
        <div className="row ">
          <div className="col-md-4 col-4  mb-4">competence</div>
          <div className="col-md-4 col-4 mb-4">
            {
              sharedData["competences"].find(
                (c) => c["id"] === formation["competenceId"]
              )?.label
            }
          </div>
        </div>
        <div className="row ">
          <div className="col-md-4 col-4 mb-4">prestataire</div>
          <div className="col-md-4 col-4 mb-4">
            {formation["prestataireFormation"]}
          </div>
        </div>
        {/* <div className="row ">
          <div className="col-md-4 col-4 mb-4">Entite concernee</div>
          <div className="col-md-4 col-4 mb-4">{formation["entiteId"]}</div>
        </div> */}
        <div className="row justify-content-end">
          <div className="col-2 col-md-1 mb-4">
            <Tooltip title="modifier">
              <IconButton onClick={() => setEditFormationId(formation.id)}>
                <Edit color="secondary" />
              </IconButton>
            </Tooltip>
          </div>
          <div className="col-2 col-md-1 mb-4">
            <Tooltip title="supprimer">
              <IconButton onClick={() => setDeleteFormationId(formation.id)}>
                <Delete color="error" />
              </IconButton>
            </Tooltip>
          </div>
        </div>
        <div className="row ">
          <Button
            variant="contained"
            sx={{ textTransform: "lowercase" }}
            onClick={toggleAfficherLaListesDesParticipants}
            className="fs-6"
            color="secondary"
          >
            afficher la liste des participants
          </Button>
        </div>
        {afficherLaListeDesParticipants && (
          <>
            <div className="row mt-2">
              <div
                className="col-md  rounded-3 fw-bold  text-light p-2"
                style={{ backgroundColor: "#098AE0A0" }}
              >
                <center>
                  <span className="fs-4">{entiteFormations.length}</span>{" "}
                  Entites {"   ---- "}
                  <span className="fs-4">{employesFormation.length}</span>
                  {"   "}
                  Employes
                </center>
              </div>
            </div>

            <div className="row">
              <div className="col-md">
                <div className="row ms-1 fs-4 text-secondary fw-bold">
                  Entites
                </div>
                {entiteFormations.map((e) => {
                  return (
                    <div
                      className={`row p-2 rounded-3 mb-2`}
                      style={{
                        backgroundColor:
                          appTheme === "light" ? "#FFFFFF" : "#0A74B65B",
                      }}
                    >
                      <div className="row">
                        <div className="col-md">
                          <span className="fw-bold"> Nom de l'entite: </span>

                          {
                            sharedData["entites"].find(
                              (i) => i["id"] === e.entiteId
                            )?.name
                          }
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md">
                          <span className="fw-bold"> Date d'ajout: </span>
                          {dayjs(e["dateAjout"]).format("YYYY-MM-DD HH:mm:ss")}
                        </div>
                        <div className="col-md">
                          <span className="fw-bold"> Date de fin: </span>
                          {e["dateFin"] === null
                            ? "pas encore"
                            : dayjs(e["dateFin"]).format("YYYY-MM-DD HH:mm:ss")}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="row">
              <div className="col-md">
                <div className="row ms-1 fs-4 text-secondary fw-bold">
                  Employes
                </div>
                {employesFormation.map((e) => {
                  return (
                    <div
                      className="row p-2 rounded-3 mb-2"
                      style={{
                        backgroundColor:
                          appTheme === "light" ? "#FFFFFF" : "#0A74B64C",
                      }}
                    >
                      <div className="row">
                        <div className="col-md">
                          <div className="row mb-2">
                            <div className="col-3">
                              <center>
                                <img
                                  alt=""
                                  src={`http://localhost:8888/EMPLOYE-SERVICE/employes/image-profile/${e["employe"]["id"]}`}
                                  width="80"
                                  height="80"
                                  className="rounded-circle"
                                />
                              </center>
                            </div>
                            <div className="col-9">
                              <div className="row d-flex flex-column">
                                <div className="fw-bold">
                                  {e["employe"]["nom"] +
                                    " " +
                                    e["employe"]["prenom"]}
                                </div>
                                <div>
                                  entite:
                                  {
                                    sharedData["entites"].find(
                                      (t) =>
                                        t["id"] ===
                                        e["employe"]["entites"][
                                          e["employe"]["entites"]?.length - 1
                                        ]["entiteId"]
                                    )?.name
                                  }
                                </div>
                                <div>
                                  poste: {e["employe"]["poste"]["label"]}
                                </div>
                              </div>
                            </div>
                          </div>{" "}
                        </div>
                        <div className="col-md">
                          <span className="fw-bold"> Date d'ajout: </span>
                          {dayjs(e["dateIntegration"]).format(
                            "YYYY-MM-DD HH:mm:ss"
                          )}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md">
                          <span className="fw-bold"> Date de fin: </span>
                          {e["dateFin"] === null
                            ? "pas encore"
                            : dayjs(e["dateFin"]).format("YYYY-MM-DD HH:mm:ss")}
                        </div>
                        <div className="col-md">
                          <span className="fw-bold"> Evaluation: </span>
                          {e["evaluation"] === null
                            ? "pas encore"
                            : `${e["evaluation"]}/100`}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
      <div className="container p-4 mt-3 text-secondary ">
        <div className=" offset-md-9 col-md-3">
          <Button
            onClick={handleAddEmployeeToFormationClickedOpen}
            variant="contained"
            sx={{ textTransform: "lowercase", paddingX: 3 }}
          >
            Ajouter des entités ou des employés
          </Button>
        </div>
      </div>
      <Dialog
        open={addEmployeeToFormationClicked}
        fullWidth
        TransitionComponent={Transition}
        keepMounted
        onClose={handleAddEmployeeToFormationClickedClose}
      >
        <DialogTitle className="text-center fw-bold">
          Ajouter des employes ou des entites a la formation
        </DialogTitle>
        <DialogContent>
          <form method="post" onSubmit={handleAddEmployeeToFormationSubmit}>
            <div className="row">
              <div className="col-md mb-2 mt-2">
                <FormControl sx={{ width: "100%" }}>
                  <InputLabel id="demo-controlled-open-select-label">
                    Type entité
                  </InputLabel>
                  <Select
                    labelId="demo-controlled-open-select-label"
                    id="demo-controlled-open-select"
                    value={addEmployeToFormation.typeId}
                    label="Type entite"
                    onChange={handleAddEmployeToFormationTypeChange}
                  >
                    {sharedData["types"].map((e) => (
                      <MenuItem value={e.id}>{e.label}</MenuItem>
                    ))}
                    <MenuItem value="Tous">Tous</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="col-md mb-2 mt-2">
                <FormControl sx={{ width: "100%" }}>
                  <InputLabel id="demo-controlled-open-select-label">
                    Nom entité
                  </InputLabel>
                  <Select
                    labelId="demo-controlled-open-select-label"
                    id="demo-controlled-open-select"
                    value={addEmployeToFormation.entiteId}
                    label="Type entite"
                    onChange={handleAddEmployeToFormationEntiteChange}
                  >
                    {addEmployeToFormation.typeId === "Tous"
                      ? sharedData["entites"].map((e) => (
                          <MenuItem value={e.id}>{e.name}</MenuItem>
                        ))
                      : sharedData["entites"]
                          .filter(
                            (e) => e["typeId"] === addEmployeToFormation.typeId
                          )
                          .map((e) => (
                            <MenuItem value={e.id}>{e.name}</MenuItem>
                          ))}
                    {addEmployeToFormation.typeId === "Tous" && (
                      <MenuItem value="Toutes">Toutes</MenuItem>
                    )}
                  </Select>
                </FormControl>
              </div>
            </div>
            <div className="row align-items-center">
              <div className="col-md mb-2 mt-2">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <MobileDateTimePicker
                    closeOnSelect
                    value={addEmployeToFormation.dateDebut}
                    onChange={(newValue) =>
                      setAddEmployeToFormation((pre) => ({
                        ...pre,
                        dateDebut: newValue,
                      }))
                    }
                    sx={{ width: "100%" }}
                    label="Date de debut"
                  />
                </LocalizationProvider>
              </div>
            </div>
            <div className="row align-items-center">
              <div className="col-md mb-2 mt-2">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <MobileDateTimePicker
                    closeOnSelect
                    value={addEmployeToFormation.dateFin}
                    onChange={(newValue) =>
                      setAddEmployeToFormation((pre) => ({
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
              <center>
                <div className="col-md mb-2 mt-2">
                  <Autocomplete
                    multiple
                    options={
                      addEmployeToFormation.entiteId !== "Toutes"
                        ? [
                            ...employeList
                              .filter(
                                (e) =>
                                  e["entites"][e["entites"].length - 1]
                                    .entiteId === addEmployeToFormation.entiteId
                              )
                              .map((e) => `${e.nom} ${e.prenom}`),
                            `Tous les employes de l'entite ${
                              sharedData["entites"].find(
                                (e) =>
                                  e["id"] === addEmployeToFormation.entiteId
                              )?.name
                            }`,
                          ]
                        : employeList.map((e) => `${e.nom} ${e.prenom}`)
                    }
                    sx={{ width: "100%" }}
                    value={addEmployeToFormation.employes}
                    onChange={(event, newValue) => {
                      handleEmployeChange(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="rechercher employe par nom complet"
                      />
                    )}
                  />
                </div>
              </center>
            </div>
            <div className="row">
              <div className="col-md mb-2 mt-2">
                <Button
                  type="submit"
                  variant="contained"
                  color="success"
                  fullWidth
                  sx={{ width: "100%" }}
                >
                  Ajouter
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleAddEmployeeToFormationClickedClose}
            color="secondary"
            variant="text"
          >
            Annuler
          </Button>
        </DialogActions>
      </Dialog>
      <CustomSnackBar
        isOpen={showAddMembersToFormationSnackBar}
        duration={4000}
        onClose={handleAddMembersToFormationSnackBarClose}
        type="success"
        message="  Entite ou employes ajoute avec succes!"
      />
    </>
  );
};

export default React.memo(FormationDetails, (prevProps, nextProps) => Object.is(prevProps, nextProps));

