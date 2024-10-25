import dayjs from "dayjs";
import React from "react";
const Conjoint = ({ data }) => {
  return (
    <div className="row border border-1 rounded-3 mb-1 p-2">
      <div className="row">
        <div className="col-md">
          <span className="fw-bold">Nom:{" "} </span> {data["nom"]}
        </div>
        <div className="col-md">
          <span className="fw-bold">Prénom:{" "}</span> {data["prenom"]}
        </div>
      </div>
      <div className="row mt-1">
        <div className="col-md">
          <span className="fw-bold">âge:</span>{" "}
          {dayjs().diff(dayjs(data["dateNaissance"]), "year")}
        </div>
      </div>
    </div>
  );
};


export default React.memo(Conjoint, (prevProps, nextProps) => Object.is(prevProps, nextProps));

