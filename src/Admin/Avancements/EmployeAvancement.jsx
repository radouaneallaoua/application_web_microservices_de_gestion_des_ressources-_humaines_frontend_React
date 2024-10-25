import React, { useContext, useEffect, useState } from "react";
import { Button } from "@mui/material";
import {
  AddAvancementClickedContext,
  HistoriqueAvancementClickedContext,
  SharedDataContext,
  TargetEmployeIdContext,
} from "./Avancements";
import { AuthenticatedUserContext } from "../../App";


const EmployeAvancement = ({ employe }) => {
  const [addAvancementClicked, setAddAvancementClicked] = useContext(
    AddAvancementClickedContext
  );
  const sharedData = useContext(SharedDataContext)[0];
  const authenticatedUser=useContext(AuthenticatedUserContext)[0]
  const setHistoriqueAvancementClicked = useContext(
    HistoriqueAvancementClickedContext
  )[1];
  const setTargetEmployeId = useContext(TargetEmployeIdContext)[1];
  const [entiteActuelle, setEntiteActuelle] = useState({});
  const handleAddAvancementClick = () => {
    setHistoriqueAvancementClicked(false);
    setAddAvancementClicked(true);
    setTargetEmployeId(employe.id);
  };
  const handleHistoriqueAvancementClick = () => {
    setAddAvancementClicked(false);
    setHistoriqueAvancementClicked(true);
    setTargetEmployeId(employe.id);
  };
  

  useEffect(() => {
    const entiteActuelleId =
      employe?.entites[employe.entites?.length - 1]?.entiteId;
    const entite = sharedData["entites"].find(
      (e) => e["id"] === entiteActuelleId
    );
    setEntiteActuelle(entite);
  }, [employe.entites, sharedData]);
  return (
    <div className=" row p-3 mb-3 border border-1 rounded-4 ">
      <div className="col-md-2">
        <center>
          <img
               src={`http://localhost:8888/EMPLOYE-SERVICE/employes/image-profile/${employe.id}`}
            alt=""
            style={{ width: 120, height: 120, borderRadius: "50%" }}
          />
        </center>
      </div>
      <div className="col-md-7  ">
        <div className="row ms-1 fw-bold mb-2 text-secondary fs-5">
          {employe.nom} {employe.prenom}
        </div>
        <div className="row">
          <div className="col-md mt-1">
            <span className="fw-bold">Grade: </span>
            {employe.grade?.label}
          </div>
          <div className="col-md mt-1">
            <span className="fw-bold">Indice-echelon: </span>{" "}
            {employe.indiceEchelon?.indice}
            {"-"}
            {employe.indiceEchelon?.echelon}
          </div>
        </div>
        <div className="row">
          <div className="col-md mt-1">
            <span className="fw-bold">Entité actuelle: </span>{" "}
            {entiteActuelle?.name}
           
          </div>
          <div className="col-md mt-1 ">
            <span className="fw-bold">Poste: </span> {employe.poste?.label}
          </div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="row mx-auto">
          <div className="col mt-2 ">
            <Button
              variant="contained"
              className="text-lowercase"
              color="secondary"
              onClick={handleAddAvancementClick}
            >
              ajouter un avancement
            </Button>
          </div>
          <div className="col mt-2">
            <Button
              variant="contained"
              className="text-lowercase"
              color="info"
              onClick={handleHistoriqueAvancementClick}
            >
              hisorique des avancements
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(EmployeAvancement, (prevProps, nextProps) => Object.is(prevProps, nextProps));
