import {
  Alert,
  Box,
  Button,
  CircularProgress,
  circularProgressClasses,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Snackbar,
} from "@mui/material";
import {
  LocalizationProvider,
  MobileDateTimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import React, { useContext, useEffect, useState } from "react";
import { SharedDataContext } from "./Avancements";
import { AuthenticatedUserContext } from "../../App";
import axios from "axios";


const AjouterAvancement = ({ employe }) => {
  const [avancementFormState, setAvancementFormState] = useState({
    dateAvancement: null,
    typeAvancement: "POSTE",
    motifAvancement: "MERITE",
    nouveauGradeId: null,
    nouveauIndiceEchelonId: null,
    nouvelleEntiteId: null,
    posteId: null,
    employeId: employe.id,
  });
  const [showAddSnackBar, setAddShowSnackBar] = useState(false);
  const sharedData = useContext(SharedDataContext)[0];
  const [categorieId, setCategorieId] = useState(null);
  const [corpsId, setCorpsId] = useState(null);
  const [cadreId, setCadreId] = useState(null);
  const [loading, setLoading] = useState(false);
  const authenticatedUser = useContext(AuthenticatedUserContext)[0]
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
  const handleAddSnackBarOpen = () => {
    setAddShowSnackBar(true);
  };

  const handleAddSnackBarClose = () => {
    setAddShowSnackBar(false);
  };
  useEffect(() => {
    const entiteActuelle =
      employe["entites"][employe["entites"].length - 1]?.entiteId;
    setAvancementFormState((pre) => ({
      ...pre,
      nouveauGradeId: employe["grade"].id,
      nouveauIndiceEchelonId: employe["indiceEchelon"].id,
      nouvelleEntiteId: entiteActuelle,
      posteId: employe["poste"].id,
      employeId: employe["id"],
    }));
  }, []);

  const handleAvancementFormStateChange = (event) => {
    const { name, value } = event.target;
    setAvancementFormState((pre) => ({ ...pre, [name]: value }));
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8888/AVANCEMENT-SERVICE/avancements",

        avancementFormState, {
        headers: {
          Authorization: `Bearer ${authenticatedUser["access-token"]}`,
        },
      }
      );
      console.log(response.data);
      handleAddSnackBarOpen();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="row ms-3 mb-3 mt-4  fs-5">
        <div className="col-md">
          Ajouter un avancement pour l'employé{" "}
          <span className="text-secondary fw-bold fs-3">
            {employe.nom} {employe.prenom}
          </span>
        </div>
      </div>
      <form method="post" onSubmit={handleSubmit}>
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
                {getIndicesWithGradeId(avancementFormState.nouveauGradeId).map(
                  (c) => (
                    <MenuItem key={c.id} value={c.id}>
                      {c.indice}
                      {"-"}
                      {c.echelon}
                    </MenuItem>
                  )
                )}
              </Select>
            </FormControl>
          </div>
        </div>
        <div className="row">
          <div className="col-md mb-3">
            <FormControl sx={{ width: "100%" }}>
              <InputLabel id="demo-multiple-name-label">
                Nouvelle Entité
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
            {loading && (
              <Box sx={{ position: "relative", mr: 1 }}>
                <CircularProgress
                  variant="indeterminate"
                  disableShrink
                  sx={{
                    color: (theme) =>
                      theme.palette.mode === "light" ? "#1a90ff" : "#308fe8",
                    animationDuration: "600ms",
                    position: "absolute",
                    left: 0,
                    [`& .${circularProgressClasses.circle}`]: {
                      strokeLinecap: "round",
                    },
                  }}
                  size={30}
                  thickness={4}
                />
              </Box>
            )}
            ajouter
          </Button>
        </div>
      </form>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={showAddSnackBar}
        autoHideDuration={4000}
        onClose={handleAddSnackBarClose}
      >
        <Alert
          onClose={handleAddSnackBarClose}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Avancement ajouté avec succès!
        </Alert>
      </Snackbar>
    </>
  );
};

export default React.memo(AjouterAvancement, (prevProps, nextProps) => Object.is(prevProps, nextProps));
