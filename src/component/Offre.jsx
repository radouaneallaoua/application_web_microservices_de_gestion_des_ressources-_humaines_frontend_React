import React, { useContext } from "react";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import HistoryToggleOffRoundedIcon from "@mui/icons-material/HistoryToggleOffRounded";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import WorkIcon from "@mui/icons-material/Work";
import PublicIcon from "@mui/icons-material/Public";
import { Button } from "@mui/material";
import LinkIcon from "@mui/icons-material/Link";
import { TargetOffreContext } from "./Home";

const Offre =React.memo (({ offre }) => {
  const setTargetOffre = useContext(TargetOffreContext)[1];
  const handleOpen = () => {
    setTargetOffre(offre["offreId"]);
  };
  return (
    <div className="row mx-1 mt-5 mb-4  rounded-3 border border-1">
      <div className="row">
        <div className="col-md d-flex justify-content-between">
          <span
            className="w-auto bg-info text-light rounded-pill p-2 fw-bold"
            style={{ position: "relative", top: -15 }}
          >
            {offre["poste"]}
          </span>
          {offre["estExpiree"] && (
            <span
              className="w-auto bg-danger text-light rounded-pill p-2 fw-bold"
              style={{ position: "relative", top: 10,right:-40,transform:"rotate(30deg)" }}
            >
              Expiree
            </span>
          )}
        </div>
      </div>
      <div className="row">
        <div className="col-md">
          <div className="row ">
            <center>
              <DescriptionRoundedIcon color="secondary" />
              <span className="fw-bold ms-3">Description</span>
            </center>
          </div>
          <div className="row p-3">{offre["description"]}</div>
        </div>
        <div className="col-md">
          <div className="row ">
            <center>
              <PublicIcon color="secondary" />
              <span className="fw-bold ms-3">Date de publication</span>
            </center>
          </div>
          <div className="row p-3">
            <center className="fw-bold">{offre["datePublication"]}</center>
          </div>
        </div>
      </div>
      <div className="row mt-2 mx-1">
        <div className="col-md">
          <div className="row ">
            <center>
              <LocationOnIcon color="secondary" />
              <span className="fw-bold ms-3">Ville</span>
            </center>
          </div>
          <div className="row p-3 fw-bold">
            <center> {offre["ville"]}</center>
          </div>
        </div>
        <div className="col-md">
          <div className="row ">
            <center>
              <WorkIcon color="secondary" />
              <span className="fw-bold ms-3">Nombre de postes</span>
            </center>
          </div>
          <div className="row p-3">
            <center className="fw-bold">{offre["nombreDePostes"]}</center>
          </div>
        </div>
        <div className="col-md">
          <div className="row ">
            <center>
              <HistoryToggleOffRoundedIcon color="secondary" />
              <span className="fw-bold ms-3">Date limite de condidature</span>
            </center>
          </div>
          <div className="row p-3">
            <center className="fw-bold">
              {offre["dateLimiteCondidature"]}
            </center>
          </div>
        </div>
        <div className="col-md">
          <div className="row ">
            <center>
              <LinkIcon color="secondary" />
              <span className="fw-bold ms-3">Type de contrats</span>
            </center>
          </div>
          <div className="row p-3">
            <center className="fw-bold">
              <ul style={{ listStyle: "none" }}>
                {offre.contrats?.map((c) => (
                  <li key={c.id}>{c.typeContrat}</li>
                ))}
              </ul>
            </center>
          </div>
        </div>
      </div>
      <div className="row mx-1 mb-3">
        <Button variant="contained" color="secondary" onClick={handleOpen} disabled={offre["estExpiree"]}>
          Postuler
        </Button>
      </div>
    </div>
  );
}, (prevProps, nextProps)=>{
  return prevProps!==nextProps
})
export default Offre;
