import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
const Enfant = ({ data, conjoints }) => {
  const [mereInfo, setMereInfos] = useState("");
  useEffect(() => {
    const conjoint = conjoints.find((c) => c["id"] === data["mereId"]);
    setMereInfos(conjoint.nom + " " + conjoint.prenom);
  }, []);
  return (
    <div className="row border border-1 rounded-3 mb-1 p-2">
      <div className="row">
        <div className="col-md">
          <span className="fw-bold">Nom:</span> {data["nom"]}
        </div>
        <div className="col-md">
          <span className="fw-bold">Prenom:</span> {data["prenom"]}
        </div>
      </div>
      <div className="row mt-1">
        <div className="col-md">
          <span className="fw-bold">Age:</span>{" "}
          {dayjs().diff(dayjs(data["dateNaissance"]), "year")}
        </div>
        <div className="col-md">
          <span className="fw-bold">Mere:</span> {mereInfo}
        </div>
      </div>
    </div>
  );
};


export default React.memo(Enfant, (prevProps, nextProps) => Object.is(prevProps, nextProps));

