import React, { useContext, useEffect, useState } from "react";
import { ClickedEmployeIdContext } from "./Employes";
import { AppThemeContext } from "../AdminMainPage";

const Employe = ({ employe, entites }) => {
  const [mouseOver, setMouseOver] = useState(false);
  const appTheme = useContext(AppThemeContext)[0];
  const [entiteActuelleEmploye, setEntiteActuelleEmploye] = useState({});
  const setEmployeIdClicked = useContext(ClickedEmployeIdContext)[1];
  
  useEffect(() => {
    const entiteId = employe?.entites?.at(-1)?.entiteId; 
    setEntiteActuelleEmploye(entites.find((e) => e.id === entiteId));
  }, [employe]); 
  return (
    <div
      className={`col-md mb-3 rounded-4 border border-1 p-3  ${
        mouseOver ? "shadow-lg " : " "
      }`}
      style={{ cursor: "pointer" }}
      onMouseOver={() => setMouseOver(true)}
      onMouseLeave={() => setMouseOver(false)}
      onClick={() => setEmployeIdClicked(employe.id)}
    >
      <div className="row ">
        <div className="col-md-5 ">
          <div className="row">
            <center>
              <img
                src={`http://localhost:8888/EMPLOYE-SERVICE/employes/image-profile/${employe.id}`}
                alt=""
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            </center>
          </div>
          <div className="row mt-2 fw-bold text-secondary">
            <center>Date de recrutement</center>
          </div>
          <span>
            <center className="rounded-pill px-2 py-1">
              {employe["dateRecrutement"]}
            </center>
          </span>
          <div className="row mt-2 fw-bold text-secondary">
            <center>
              <span className="text-info fs-5">
                {employe["anneeExperience"]}
              </span>{" "}
              Années d'expérience
            </center>
          </div>
        </div>
        <div className="col-md-7   ">
          <div className="fw-bold">
            {employe["nom"]} {employe["prenom"]}
          </div>

          <div className="row d-flex mt-2 text-secondary flex-column">
            <div className="col-md mt-1">
              <div className="row">
                <div className="col-md-3 fw-bold mt-1"> Poste</div>
                <div
                  className="col-md-9 rounded-pill px-2 py-1 "
                  style={{
                    backgroundColor:
                      appTheme === "light" ? "#D9E7E8AD" : "#0846B185",
                  }}
                >
                  <center>{employe?.poste?.label}</center>
                </div>
              </div>
            </div>
            <div className="col-md mt-1">
              <div className="row">
                <div className="col-md-3 fw-bold mt-1"> Entité</div>
                <div
                  className="col-md-9  rounded-pill px-2 py-1 "
                  style={{
                    backgroundColor:
                      appTheme === "light" ? "#D9E7E8AD" : "#0846B185",
                  }}
                >
                  <center>{entiteActuelleEmploye?.name}</center>
                </div>
              </div>
            </div>
            <div className="col-md mt-1">
              <div className="row">
                <div className="col-md-3 fw-bold mt-1"> Email</div>
                <div
                  className="col-md-9 rounded-pill px-2 py-1 "
                  style={{
                    backgroundColor:
                      appTheme === "light" ? "#D9E7E8AD" : "#0846B185",
                    fontSize: 14,
                  }}
                >
                  <center>{employe["email"]}</center>
                </div>
              </div>
            </div>
            <div className="col-md mt-1">
              <div className="row">
                <div className="col-md-3 fw-bold mt-1"> Tél</div>
                <div
                  className="col-md-9 rounded-pill px-2 py-1 "
                  style={{
                    backgroundColor:
                      appTheme === "light" ? "#D9E7E8AD" : "#0846B185",
                  }}
                >
                  <center>{employe["tel"]}</center>
                </div>
              </div>
            </div>
            <div className="col-md mt-1">
              <div className="row">
                <div className="col-md-3 fw-bold mt-1"> Ville</div>
                <div
                  className="col-md-9 rounded-pill px-2 py-1 "
                  style={{
                    backgroundColor:
                      appTheme === "light" ? "#D9E7E8AD" : "#0846B185",
                  }}
                >
                  <center>{employe["ville"]}</center>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row d text-secondary fw-bold ms-2 mt-3">
        <div className="col-10 ">Voir les détails</div>
        <div className="col-1">{">"}</div>
      </div>
    </div>
  );
};

export default React.memo(Employe, (prevProps, nextProps) =>
  Object.is(prevProps, nextProps)
);
