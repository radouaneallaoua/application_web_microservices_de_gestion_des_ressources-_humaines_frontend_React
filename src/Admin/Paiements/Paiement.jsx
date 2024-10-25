import React, { useContext, useEffect, useState } from "react";
import { Button, IconButton, Tooltip } from "@mui/material";
import "../../App.css";
import {
  DeleteOutlined,
  Edit,
  RemoveRedEyeOutlined,
} from "@mui/icons-material";
import { DeletePaiementContext, EditPaiementContext } from "./Paiements";
import dayjs from "dayjs";
import { AuthenticatedUserContext } from "../../App";
import axios from "axios";

const Paiement = ({ paiement, windowWidth, entites }) => {
  const authenticatedUser = useContext(AuthenticatedUserContext)[0];
  const setEditPaiement = useContext(EditPaiementContext)[1];
  const setDeletePaiement = useContext(DeletePaiementContext)[1];
  const [entiteActuelle, setEntiteActuelle] = useState({});
  const handleEdit = () => {
    setEditPaiement(paiement["id"]);
  };
  const handleDelete = () => {
    setDeletePaiement(paiement["id"]);
  };
  useEffect(() => {
    const entiteActuelleId =
      paiement["employe"]?.entites[paiement["employe"].entites?.length - 1]
        ?.entiteId;
    const entite = entites.find((e) => e["id"] === entiteActuelleId);
    setEntiteActuelle(entite);
  }, [paiement]);

  const getRecu = async (paiementId) => {
    try {
      let result = await axios.get(
        `http://localhost:8888/PAIE-SERVICE/paies/recu/${paiementId}`,
        {
          headers: {
            Authorization: `Bearer ${authenticatedUser["access-token"]}`,
          },
        }
      );
      if (result.status === 200) {
        return result.data;
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div
      className=" p-3 formation rounded-4 mb-2 "
      style={{ width: "100%", backgroundColor: "#1D78D911" }}
    >
      {windowWidth >= 767 ? (
        <>
          <div className="row ">
            <div className="col-md-4 mt-2 mb-2">
              <div className="row">
                <div className="col-md-4">
                  <img
                    alt=""
                    src={`http://localhost:8888/EMPLOYE-SERVICE/employes/image-profile/${paiement.employeId}`}
                    loading="lazy"
                    width={
                      windowWidth >= 767 && windowWidth < 1000 ? "50" : "80"
                    }
                    height={
                      windowWidth >= 767 && windowWidth < 1000 ? "50" : "80"
                    }
                    className="rounded-circle"
                  />
                </div>
                <div className="col-md-7 d-flex flex-column">
                  <div className="row fw-bold">
                    {paiement["employe"]["nom"]} {paiement["employe"]["prenom"]}
                  </div>
                  <div className="row">
                    {" "}
                    {"entité: "}
                    {entiteActuelle?.name}
                  </div>
                  <div className="row">
                    {"poste: "}
                    {paiement["employe"]["poste"]["label"]}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-2 fw-bold fs-4  text-primary mt-2 mb-2">
              {paiement["montant"]}
              {" DH"}
            </div>
            <div className="col-md-2  mt-2 mb-2">
              {dayjs(paiement["datePaiement"]).format("YYYY-MM-DD HH:mm")}
            </div>

            <div
              className="col-md-2  mt-2 mb-2"
              style={{
                fontSize:
                  windowWidth >= 767 && windowWidth < 1000 ? "14px" : "16px",
              }}
            >
              {paiement["typePaiement"]}
            </div>
            <div
              className="col-md-2 mr-2 mb-2"
              style={{
                fontSize:
                  windowWidth >= 767 && windowWidth < 1000 ? "14px" : "12px",
              }}
            >
              <Button
                variant="contained"
                color="warning"
                className="rounded-pill"
                onClick={() => {
                  window.open(getRecu(paiement.id), "_blank");
                }}
              >
                <RemoveRedEyeOutlined />
                <span className=" ms-1">voir</span>
              </Button>
            </div>
          </div>
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
        </>
      ) : (
        <>
          <div className="row mb-3">
            <div className="col-3">
              <center>
                <img
                  alt=""
                  src={`http://localhost:8888/EMPLOYE-SERVICE/employes/image-profile/${paiement.employeId}`}
                  width="80"
                  loading="lazy"
                  height="80"
                  className="rounded-circle"
                />
              </center>
            </div>
            <div className="col-7 offset-1">
              <div className="row fw-bold">
                {paiement["employe"]["nom"]} {paiement["employe"]["prenom"]}
              </div>
              <div className="row">
                {"entité: "}
                {entiteActuelle?.name}
              </div>
              <div className="row">
                {"poste: "}
                {paiement["employe"]["poste"]["label"]}
              </div>
            </div>
          </div>

          <div className="row ">
            <div className="col-md-2 mb-2">
              <div className="row">
                <div className="col-4 fw-bold">montant</div>
                <div className="col-7  fw-bold text-primary ">
                  {paiement["montant"]}
                  {" DH"}
                </div>
              </div>
            </div>
            <div className="col-md-2 mb-2">
              <div className="row">
                <div className="col-4 fw-bold">date de paiement</div>
                <div className="col-7">
                  {dayjs(paiement["datePaiement"]).format("YYYY-MM-DD HH:mm")}
                </div>
              </div>
            </div>
            <div className="col-md-2 mb-2">
              <div className="row">
                <div className="col-4 fw-bold">type paiement</div>
                <div className="col-7">{paiement["typePaiement"]}</div>
              </div>
            </div>
            <div className="col-md-2 mb-2">
              <div className="row">
                <div className="col-4 fw-bold">reçu</div>
                <div className="col-7">
                  <Button
                    variant="contained"
                    color="warning"
                    className="rounded-pill"
                    onClick={() => {
                      window.open(getRecu(paiement.id), "_blank");
                    }}
                  >
                    <RemoveRedEyeOutlined />
                    <span className="ms-1">voir</span>
                  </Button>
                </div>
              </div>
            </div>
            <div className="col-md-2 col-4 offset-8 mb-2">
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
        </>
      )}
    </div>
  );
};

export default React.memo(Paiement, (prevProps, nextProps) =>
  Object.is(prevProps, nextProps)
);
