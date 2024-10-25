import React, { useContext, useEffect, useState } from "react";
import { Button, IconButton, Slider, Typography } from "@mui/material";
import "../../App.css";
import axios from "axios";
import { ReloadingContext, SharedDataContext } from "./Formations";
import { AppThemeContext } from "../AdminMainPage";
import { Edit } from "@mui/icons-material";
import { AuthenticatedUserContext } from "../../App";
import dayjs from "dayjs";

function valuetext(value) {
  return `${value}`;
}
const Formation = ({ formation, onClick, disabled, formations, isEmploye }) => {
  const sharedData = useContext(SharedDataContext)[0];
  const authenticatedUser = useContext(AuthenticatedUserContext)[0];
  const [formationData, setFormationData] = useState({});
  const [entiteFormations, setEntiteFormation] = useState([]);
  const appTheme = useContext(AppThemeContext)[0];
  const [addEvaluationClicked, setAddEvaluationClicked] = useState(false);
  const [evaluation, setEvaluation] = useState(10);
  const setReloading = useContext(ReloadingContext)[1];

  const handleToggleAddEvaluation = () => {
    setAddEvaluationClicked((pre) => !pre);
  };

  const [editEvaluationClicked, setEditEvaluationClicked] = useState(false);

  const handleToggleEditEvaluation = () => {
    if (!editEvaluationClicked) {
      setEvaluation(formation.evaluation);
    }
    setEditEvaluationClicked((pre) => !pre);
  };

  const handleAddEvaluationSubmit = async () => {
    try {
      let res = await axios.post(
        `http://localhost:8888/FORMATION-SERVICE/formations/employe-formation/add-evaluation/${authenticatedUser.employeId}/${formation.formationId}?evaluation=${evaluation}`,{}, {
        headers: {
          Authorization: `Bearer ${authenticatedUser["access-token"]}`,
        },
      }
      );
      handleToggleAddEvaluation();
      setReloading((pre) => !pre);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditEvaluationSubmit = async () => {
    try {
      let res = await axios.put(
        `http://localhost:8888/FORMATION-SERVICE/formations/employe-formation/add-evaluation/${authenticatedUser.employeId}/${formation.formationId}?evaluation=${evaluation}`,{}, {
        headers: {
          Authorization: `Bearer ${authenticatedUser["access-token"]}`,
        },
      }
      );
      setReloading((pre) => !pre);
      setEditEvaluationClicked(false);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const fetchEntiteFormation = async () => {
      try {
        const formationId = isEmploye ? formation.formationId : formation.id;
        const response = await axios.get(
          `http://localhost:8888/FORMATION-SERVICE/formations/entite-formation/${formationId}`, {
          headers: {
            Authorization: `Bearer ${authenticatedUser["access-token"]}`,
          },
        }
        );
        setEntiteFormation(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchEntiteFormation();

    if (isEmploye) {
      setFormationData(
        formations?.find((f) => f["id"] === formation.formationId)
      );
    }
  }, []);


  return (
    <div
      className=" p-4 formation border border-2  rounded-4 mb-2 "
      style={{ width: "100%" }}
      onClick={disabled ? null : onClick}
    >
      <div className="row ">
        <div className="col-md-4 mb-4">
          <div className="row d-flex flex-column">
            <div className="col-md">
              <Typography variant="h5" width="100%">
                {!isEmploye ? formation.label : formationData.label}
              </Typography>
            </div>
            <div className="col-md mt-2">
              <Typography
                style={{ fontSize: "14px", width: "100%", lineHeight: 1.6 }}
                className="text-secondary"
                height={30}
              >
                {!isEmploye ? formation.description : formationData.description}
              </Typography>
            </div>
          </div>
        </div>

        <div className="col-md-2 mb-2">
          <center>
            <Typography
              variant="h6"
              width={120}
              className=" rounded-5 text-light  fw-bold"
              style={{
                backgroundColor:
                  (!isEmploye
                    ? formation.dureeEnJours
                    : formationData.dureeEnJours) < 5
                    ? "#51C461FA"
                    : "#018212FA",
              }}
              height={30}
            >
              <center>
                {!isEmploye
                  ? formation.dureeEnJours
                  : formationData.dureeEnJours}
              </center>
            </Typography>
          </center>
        </div>
        <div className="col-md-2 mb-2">
          <center>
            <Typography variant="h6">
              {
                sharedData["competences"].find((c) =>
                  c["id"] === (!isEmploye
                    ? formation.competenceId
                    : formationData.competenceId)
                )?.label
              }
            </Typography>
          </center>
        </div>
        <div className="col-md-2 mb-2">
          <center>
            <Typography variant="h6">
              {!isEmploye
                ? formation["prestataireFormation"]
                : formationData["prestataireFormation"]}
            </Typography>
          </center>
        </div>
        <div className="col-md-2 mb-2">
          <center className="fw-bold">{entiteFormations.length}</center>
          <center>
            {
              sharedData["entites"].find(
                (e) => e["id"] === entiteFormations[0]?.entiteId
              )?.name
            }
          </center>
          {entiteFormations.length > 1 && (
            <center>
              et {entiteFormations.length - 1} {" autres"}
            </center>
          )}
        </div>
      </div>
      <div className={`row justify-content-end`}>
        <div className="col-md-2 mt-2  ">
          <center>
            <p
              className=" fw-bold bg-info-subtle rounded-4"
              style={{
                color: "#000000",
              }}
            >
              {!isEmploye ? dayjs(formation["dateDebut"]).format("YYYY-MM-DD HH:mm") : dayjs(formationData["dateDebut"]).format("YYYY-MM-DD HH:mm") }
            </p>
          </center>
        </div>
        <div className="col-md-1 fw-bold mt-2 ">
          <center>{">>>"}</center>
        </div>
        <div className="col-md-2 mt-2 fw-bold">
          <center>
            <p
              className=" fw-bold   bg-info-subtle rounded-4"
              style={{
                color: "#000000",
              }}
            >
              {!isEmploye ? dayjs(formation["dateFin"]).format("YYYY-MM-DD HH:mm") : dayjs(formationData["dateFin"]).format("YYYY-MM-DD HH:mm")}
            </p>
          </center>
        </div>
      </div>
      {isEmploye && (
        <div
          className="row mt-3  rounded-4 p-3"
          style={{
            backgroundColor: appTheme === "light" ? "#CFF4FC" : "#0C2034",
          }}
        >
          <div className="col-md-6">
            <div className="row">
              <div className="col-5 fw-bold">date d'intégration:</div>
              <div className="col-7">{dayjs(formation.dateIntegration).format("YYYY-MM-DD HH:mm")}</div>
            </div>
            <div className="row">
              <div className="col-5 fw-bold">date de fin:</div>
              <div className="col-7">
                {formation.dateFin === null ? "pas encore" :  dayjs(formation.dateFin).format("YYYY-MM-DD HH:mm")}
              </div>
            </div>
          </div>
          <div className="col-md-4">
            {!addEvaluationClicked && !editEvaluationClicked && (
              <div className="col-5">Votre évaluation:</div>
            )}
            <div className="col-7 fw-bold">
              {editEvaluationClicked || addEvaluationClicked ? (
                <div className="row">
                  <div className="col">
                    <div className="row">
                      <p>Evaluation</p>
                    </div>
                    <div className="row ">
                      <div className="col">
                        <Slider
                          aria-label="Evaluation"
                          getAriaValueText={valuetext}
                          valueLabelDisplay="auto"
                          shiftStep={30}
                          name="score"
                          value={evaluation}
                          onChange={(event, newValue) => {
                            if (typeof newValue === "number") {
                              setEvaluation(newValue);
                            }
                          }}
                          step={10}
                          marks
                          min={10}
                          max={100}
                        />
                        <Button
                          className="text-lowercase"
                          variant="contained"
                          color="secondary"
                          onClick={
                            addEvaluationClicked
                              ? handleAddEvaluationSubmit
                              : handleEditEvaluationSubmit
                          }
                        >
                          confirmer
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : formation.evaluation === 0 ||
                formation.evaluation === null ? (
                "pas d'évaluation"
              ) : (
                formation.evaluation
              )}
            </div>
          </div>
          <div className="col-md-2">
            {formation.evaluation === 0 || formation.evaluation === null ? (
              <Button
                variant="contained"
                color={addEvaluationClicked ? "warning" : "primary"}
                onClick={handleToggleAddEvaluation}
              >
                {addEvaluationClicked ? "annuler" : "Evaluer la formation"}
              </Button>
            ) : (
              <IconButton onClick={handleToggleEditEvaluation}>
                <Edit color="primary" />
              </IconButton>
            )}
          </div>
        </div>
      )}
    </div>
  );
};


export default React.memo(Formation, (prevProps, nextProps) => Object.is(prevProps, nextProps));

