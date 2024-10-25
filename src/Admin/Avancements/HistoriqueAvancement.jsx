import dayjs from "dayjs";
import React, { useContext, useState } from "react";
import { SharedDataContext } from "./Avancements";
import {
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Tooltip,
} from "@mui/material";
import { DeleteOutline, Edit } from "@mui/icons-material";
import {
  DeleteAvancementIdContext,
  EditAvancementIdContext,
} from "./HistoriqueAvancements";
import {
  LocalizationProvider,
  MobileDateTimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import axios from "axios";
import { AuthenticatedUserContext } from "../../App";

const HistoriqueAvancement = ({ avancement }) => {
  const employe = avancement["employe"];
  const sharedData = useContext(SharedDataContext)[0];
  const setDeleteAvancementId = useContext(DeleteAvancementIdContext)[1];
  const [editAvancementId, setEditAvancementId] = useContext(
    EditAvancementIdContext
  );

  const authenticatedUser = useContext(AuthenticatedUserContext)[0];

  const [categorieId, setCategorieId] = useState(null);
  const [corpsId, setCorpsId] = useState(null);
  const [cadreId, setCadreId] = useState(null);
  const [avancementFormState, setAvancementFormState] = useState({
    dateAvancement: dayjs(avancement["dateAvancement"]),
    typeAvancement: avancement["typeAvancement"],
    motifAvancement: avancement["motifAvancement"],
    nouveauGradeId: avancement["nouveauGradeId"],
    nouveauIndiceEchelonId: avancement["nouveauIndiceEchelonId"],
    nouvelleEntiteId: avancement["nouvelleEntiteId"],
    posteId: avancement["posteId"],
    employeId: employe.id,
  });

  const getCorpsWithCategorieId = (categorieId) => {
    const result = sharedData["corps"].filter(
      (c) => c["categorie"]["id"] === categorieId
    );
    return result;
  };
  const getCadresWithCorpsId = (corpsId) => {
    const result = sharedData["cadres"].filter(
      (c) => c["corps"]["id"] === corpsId
    );
    return result;
  };

  const getGradesWithCadreId = (cadreId) => {
    const result = sharedData["grades"].filter(
      (c) => c["cadre"]["id"] === cadreId
    );
    return result;
  };
  const getIndicesWithGradeId = (gradeId) => {
    const result = sharedData["indices"].filter(
      (c) => c["gradeId"] === gradeId
    );
    return result;
  };
  const handleAvancementFormStateChange = (event) => {
    const { name, value } = event.target;
    setAvancementFormState((pre) => ({ ...pre, [name]: value }));
  };
 const handleSubmit = async (event) => {
   event.preventDefault();
   try {
     const response = await axios.put(
       `http://localhost:8888/AVANCEMENT-SERVICE/avancements/${avancement.id}`,
       avancementFormState, {
       headers: {
         Authorization: `Bearer ${authenticatedUser["access-token"]}`,
       },
     }
     );
     alert("Updated");
   } catch (err) {
     console.log(err);
   }
 };

  return (
    <div className="row mt-3 mb-3 border border-1 border-info rounded-4 p-4">
      {editAvancementId === avancement.id ? (
        <form method="put" onSubmit={handleSubmit}>
          <div className="row ">
            <div className="col-md mt-3 mb-3">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <MobileDateTimePicker
                  closeOnSelect
                  value={avancementFormState.dateAvancement}
                  onChange={(newValue) =>
                    setAvancementFormState((pre) => ({
                      ...pre,
                      dateAvancement: newValue,
                    }))
                  }
                  sx={{ width: "100%" }}
                  label="date d'avancement"
                />
              </LocalizationProvider>
            </div>
            <div className="col-md mt-3 mb-3">
              <FormControl sx={{ width: "100%" }}>
                <InputLabel id="demo-multiple-name-label">
                  Type avancement
                </InputLabel>
                <Select
                  labelId="demo-multiple-name-label"
                  id="demo-multiple-name"
                  name="typeAvancement"
                  value={avancementFormState.typeAvancement}
                  onChange={handleAvancementFormStateChange}
                  input={<OutlinedInput label="Type Avancement" />}
                >
                  {["GRADE", "ECHELON", "POSTE", "ENTITE"].map((c) => (
                    <MenuItem key={c} value={c}>
                      {c}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div className="col-md mt-3 mb-3">
              <FormControl sx={{ width: "100%" }}>
                <InputLabel id="demo-multiple-name-label">
                  Motif Avancement
                </InputLabel>
                <Select
                  labelId="demo-multiple-name-label"
                  id="demo-multiple-name"
                  name="motifAvancement"
                  value={avancementFormState.motifAvancement}
                  onChange={handleAvancementFormStateChange}
                  input={<OutlinedInput label="Motif Avancement" />}
                >
                  {[
                    "ANCIENNETE",
                    "MERITE",
                    "EXAMEN_PROFESSIONNEL",
                    "MUTATION",
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
            <div className="col-md mb-3">
              <FormControl sx={{ width: "100%" }}>
                <InputLabel id="demo-multiple-name-label">Categorie</InputLabel>
                <Select
                  disabled={avancementFormState.typeAvancement !== "GRADE"}
                  labelId="demo-multiple-name-label"
                  id="demo-multiple-name"
                  name="categorie"
                  value={categorieId}
                  onChange={(e) => setCategorieId(e.target.value)}
                  input={<OutlinedInput label="Catégorie" />}
                >
                  {sharedData["categories"].map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                      {c.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div className="col-md mb-3">
              <FormControl sx={{ width: "100%" }}>
                <InputLabel id="demo-multiple-name-label">Corps</InputLabel>
                <Select
                  disabled={avancementFormState.typeAvancement !== "GRADE"}
                  labelId="demo-multiple-name-label"
                  id="demo-multiple-name"
                  name="corpsId"
                  value={corpsId}
                  onChange={(e) => setCorpsId(e.target.value)}
                  input={<OutlinedInput label="Corps" />}
                >
                  {getCorpsWithCategorieId(categorieId).map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                      {c.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div className="col-md mb-3">
              <FormControl sx={{ width: "100%" }}>
                <InputLabel id="demo-multiple-name-label">Cadre</InputLabel>
                <Select
                  disabled={avancementFormState.typeAvancement !== "GRADE"}
                  labelId="demo-multiple-name-label"
                  id="demo-multiple-name"
                  name="cadreId"
                  value={cadreId}
                  onChange={(e) => setCadreId(e.target.value)}
                  input={<OutlinedInput label="Cadre" />}
                >
                  {getCadresWithCorpsId(corpsId).map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                      {c.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </div>
          <div className="row">
            <div className="col-md mb-3">
              <FormControl sx={{ width: "100%" }}>
                <InputLabel id="demo-multiple-name-label">
                  Nouveau Grade
                </InputLabel>
                <Select
                  disabled={avancementFormState.typeAvancement !== "GRADE"}
                  labelId="demo-multiple-name-label"
                  id="demo-multiple-name"
                  name="nouveauGradeId"
                  value={avancementFormState.nouveauGradeId}
                  onChange={handleAvancementFormStateChange}
                  input={<OutlinedInput label="Nouveau grade" />}
                >
                  {getGradesWithCadreId(corpsId).map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                      {c.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div className="col-md mb-3">
              <FormControl sx={{ width: "100%" }}>
                <InputLabel id="demo-multiple-name-label">
                  Nouveau Indice-Echelon
                </InputLabel>
                <Select
                  disabled={
                    avancementFormState.typeAvancement !== "ECHELON" &&
                    avancementFormState.typeAvancement !== "GRADE"
                  }
                  labelId="demo-multiple-name-label"
                  id="demo-multiple-name"
                  name="nouveauIndiceEchelonId"
                  value={avancementFormState.nouveauIndiceEchelonId}
                  onChange={handleAvancementFormStateChange}
                  input={<OutlinedInput label="Nouveau Indice-Echelon" />}
                >
                  {getIndicesWithGradeId(
                    avancementFormState.nouveauGradeId
                  ).map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                      {c.indice}
                      {"-"}
                      {c.echelon}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </div>
          <div className="row">
            <div className="col-md mb-3">
              <FormControl sx={{ width: "100%" }}>
                <InputLabel id="demo-multiple-name-label">
                  Nouvelle Entite
                </InputLabel>
                <Select
                  disabled={avancementFormState.typeAvancement !== "ENTITE"}
                  labelId="demo-multiple-name-label"
                  id="demo-multiple-name"
                  name="nouvelleEntiteId"
                  value={avancementFormState.nouvelleEntiteId}
                  onChange={handleAvancementFormStateChange}
                  input={<OutlinedInput label="Nouvelle Entité" />}
                >
                  {sharedData["entites"].map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                      {c.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div className="col-md mb-3">
              <FormControl sx={{ width: "100%" }}>
                <InputLabel id="demo-multiple-name-label">
                  Nouveau poste
                </InputLabel>
                <Select
                  disabled={avancementFormState.typeAvancement !== "POSTE"}
                  labelId="demo-multiple-name-label"
                  id="demo-multiple-name"
                  name="posteId"
                  value={avancementFormState.posteId}
                  onChange={handleAvancementFormStateChange}
                  input={<OutlinedInput label="Nouveau poste" />}
                >
                  {sharedData["postes"].map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                      {c.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </div>
          <div className="row">
            <Button
              variant="contained"
              color="secondary"
              type="submit"
              className="p-2"
            >
              modifier
            </Button>
          </div>
          <div className="row">
            <Button
              variant="outlined"
              color="info"
              onClick={() => setEditAvancementId(null)}
              className="p-2 mt-2"
            >
              annuler
            </Button>
          </div>
        </form>
      ) : (
        <div className="row">
          <div className="col-md">
            <div className="row d-flex flex-column">
              <div className="col-md mb-3 fs-4 fw-bold text-primary">
                {employe.nom} {employe.prenom}
              </div>
              <div className="col-md mb-3">
                <div className="row">
                  <div className="col-5"> Date Avancement</div>
                  <div className="col-7">
                    <span
                      className="border px-3 py-2 border-1 border-primary rounded-pill fw-bold"
                      style={{ backgroundColor: "#20A6F326" }}
                    >
                      {dayjs(avancement["dateAvancement"]).format(
                        "YYYY-MM-DD HH:mm:ss"
                      )}
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-md mb-3">
                <div className="row">
                  <div className="col-5"> Type avancement</div>
                  <div className="col-7">
                    {" "}
                    <span
                      className="border px-3 py-2 border-1 border-primary rounded-pill fw-bold"
                      style={{ backgroundColor: "#20A6F326" }}
                    >
                      {avancement["typeAvancement"]}
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-md mb-3">
                <div className="row">
                  <div className="col-5"> Motif Avancement</div>
                  <div className="col-7">
                    {" "}
                    <span
                      className="border px-3 py-2 border-1 border-primary rounded-pill fw-bold"
                      style={{ backgroundColor: "#20A6F326" }}
                    >
                      {avancement["motifAvancement"]}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md">
            <div className="row d-flex flex-column">
              <div className="col-md mb-3">
                <div className="row">
                  <div className="col-5"> Grade</div>
                  <div className="col-7">
                    <span
                      className="border px-3 py-2 border-1 border-primary rounded-pill fw-bold"
                      style={{ backgroundColor: "#20A6F326" }}
                    >
                      {
                        sharedData["grades"].find(
                          (g) => g["id"] === avancement["nouveauGradeId"]
                        )?.label
                      }
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-md mb-3">
                <div className="row">
                  <div className="col-5"> Indice-Echelon</div>
                  <div className="col-7">
                    <span
                      className="border px-3 py-2 border-1 border-primary rounded-pill fw-bold"
                      style={{ backgroundColor: "#20A6F326" }}
                    >
                      {
                        sharedData["indices"].find(
                          (i) =>
                            i["id"] === avancement["nouveauIndiceEchelonId"]
                        )?.indice
                      }
                      {"-"}
                      {
                        sharedData["indices"].find(
                          (i) =>
                            i["id"] === avancement["nouveauIndiceEchelonId"]
                        )?.echelon
                      }
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-md mb-3">
                <div className="row">
                  <div className="col-5"> Entité</div>
                  <div className="col-7">
                    <span
                      className="border px-3 py-2 border-1 border-primary rounded-pill fw-bold"
                      style={{ backgroundColor: "#20A6F326" }}
                    >
                      {
                        sharedData["entites"].find(
                          (i) => i["id"] === avancement["nouvelleEntiteId"]
                        )?.name
                      }
                      (
                      {
                        sharedData["types"].find(
                          (i) =>
                            i["id"] ===
                            sharedData["entites"].find(
                              (i) => i["id"] === avancement["nouvelleEntiteId"]
                            )?.typeId
                        )?.label
                      }
                      )
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-md mb-3">
                <div className="row">
                  <div className="col-5"> Poste</div>
                  <div className="col-7">
                    <span
                      className="border px-3 py-2 border-1 border-primary rounded-pill fw-bold"
                      style={{ backgroundColor: "#20A6F326" }}
                    >
                      {
                        sharedData["postes"].find(
                          (i) => i["id"] === avancement["posteId"]
                        )?.label
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="row">
        <di className="col-md d-flex justify-content-end">
          <Tooltip title="supprimer">
            <IconButton onClick={() => setDeleteAvancementId(avancement.id)}>
              <DeleteOutline color="error" />
            </IconButton>
          </Tooltip>
          <Tooltip title="modifier">
            <IconButton onClick={() => setEditAvancementId(avancement.id)}>
              <Edit color="info" />
            </IconButton>
          </Tooltip>
        </di>
      </div>
    </div>
  );
};

export default React.memo(HistoriqueAvancement, (prevProps, nextProps) => Object.is(prevProps, nextProps));


