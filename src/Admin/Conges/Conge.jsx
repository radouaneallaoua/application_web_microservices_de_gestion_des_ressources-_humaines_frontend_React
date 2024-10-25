import React, { useContext, useState, useEffect } from "react";
import { IconButton, Tooltip } from "@mui/material";
import "../../App.css";
import { DeleteOutlined, Edit } from "@mui/icons-material";
import { DeleteCongeContext, EditCongeContext } from "./Conges";
import dayjs from "dayjs";

import { AuthenticatedUserContext } from "../../App";

const Conge = ({ conge, windowWidth ,entites}) => {
  const setEditConge = useContext(EditCongeContext)[1];
  const setDeleteConge = useContext(DeleteCongeContext)[1];
  const authenticatedUser = useContext(AuthenticatedUserContext)[0];
  const [entiteActuelle, setEntiteActuelle] = useState({});

  const handleEdit = () => {
    setEditConge(conge["congeId"]);
  };
  const handleDelete = () => {
    setDeleteConge(conge["congeId"]);
  };
  useEffect(() => {
    const entiteActuelleId =
      conge["employe"]?.entites[conge["employe"].entites?.length - 1]
        ?.entiteId;
    const entite = entites.find(
      (e) => e["id"] === entiteActuelleId
    );
    setEntiteActuelle(entite);
  }, [conge]);


  return (
    <div
      className=" p-3 formation rounded-4 mb-2 "
      style={{ width: "100%", backgroundColor: "#1D78D911" }}
    >
      {windowWidth >= 767 ? (
        <>
          <div className="row ">
            <div className="col-md-3 mb-2">
              <div className="row">
                <div className="col-md-4">
                  <img
                    alt=""
                    src={`http://localhost:8888/EMPLOYE-SERVICE/employes/image-profile/${conge.employeId}`}
                    width={
                      windowWidth >= 767 && windowWidth < 1000 ? "50" : "80"
                    }
                    height={
                      windowWidth >= 767 && windowWidth < 1000 ? "50" : "80"
                    }
                    className="rounded-circle"
                  />
                </div>
                <div className="col-md-7 offset-md-1 d-flex flex-column">
                  <div className="row fw-bold">
                    {conge["employe"]?.nom} {conge["employe"]?.prenom}
                  </div>
                  <div className="row"> entité{": "} {entiteActuelle?.name} </div>
                  <div className="row">{"poste: "} {conge["employe"]?.poste?.label}</div>
                </div>
              </div>
            </div>
            <div className="col-md-2 mb-2">
              {" "}
              {dayjs(conge["dateDebut"]).format("YYYY-MM-DD")}
            </div>
            <div className="col-md-2 mb-2">
              {dayjs(conge["dateFin"]).format("YYYY-MM-DD")}
            </div>
            <div className="col-md-1 mb-2">{conge["dureeEnJours"]}</div>
            <div
              className="col-md-2 mb-2"
              style={{
                fontSize:
                  windowWidth >= 767 && windowWidth < 1000 ? "14px" : "16px",
              }}
            >
              {conge["typeConge"]}
            </div>
            <div
              className="col-md-2 mr-2 mb-2"
              style={{
                fontSize:
                  windowWidth >= 767 && windowWidth < 1000 ? "14px" : "12px",
              }}
            >
              {conge["etatConge"]}
            </div>
          </div>
          {authenticatedUser.role === "RESPONSABLE" && (
            <div className="row  justify-content-end ">
              <div className="col-md-2">
                <Tooltip title="modifier">
                  <IconButton onClick={handleEdit}>
                    <Edit color="primary" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="supprimer">
                  <IconButton onClick={handleDelete}>
                    <DeleteOutlined color="error" />
                  </IconButton>
                </Tooltip>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="row mb-3">
            <div className="col-3">
              <img
                alt=""
                src={`http://localhost:8888/EMPLOYE-SERVICE/employes/image-profile/${conge.employeId}`}
                width="80"
                height="80"
                className="rounded-circle"
              />
            </div>
            <div className="col-8">
                <div className="row fw-bold">
                {conge["employe"]?.nom}{" "}
                {conge["employe"]?.prenom}
              </div>
                <div className="row">{"entité: "}{entiteActuelle?.name}</div>
              <div className="row">{"poste: "} {conge["employe"]?.poste?.label}</div>
            </div>
          </div>

          <div className="row ">
            <div className="col-md-2 mb-2">
              <div className="row">
                <div className="col-4 fw-bold">date de début</div>
                <div className="col-7">
                  {dayjs(conge["dateDebut"]).format("YYYY-MM-DD")}
                </div>
              </div>
            </div>
            <div className="col-md-2 mb-2">
              <div className="row">
                <div className="col-4 fw-bold">date de fin</div>
                <div className="col-7">
                  {dayjs(conge["dateFin"]).format("YYYY-MM-DD")}
                </div>
              </div>
            </div>
            <div className="col-md-2 mb-2">
              <div className="row">
                <div className="col-4 fw-bold">durée en Jours</div>
                <div className="col-7">{conge["dureeEnJours"]}</div>
              </div>
            </div>
            <div className="col-md-2 mb-2">
              <div className="row">
                <div className="col-4 fw-bold">type congé</div>
                <div className="col-7">{conge["typeConge"]}</div>
              </div>
            </div>
            <div className="col-md-2 mb-2">
              <div className="row">
                <div className="col-4 fw-bold">etat congé</div>
                <div className="col-7">{conge["etatConge"]}</div>
              </div>
            </div>
            {authenticatedUser.role === "RESPONSABLE" && (
              <div className="col-md-2 col-3 offset-9 mb-2">
                <Tooltip title="modifier">
                  <IconButton onClick={handleEdit}>
                    <Edit color="primary" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="supprimer">
                  <IconButton onClick={handleDelete}>
                    <DeleteOutlined color="error" />
                  </IconButton>
                </Tooltip>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default React.memo(Conge, (prevProps, nextProps) => Object.is(prevProps, nextProps));

