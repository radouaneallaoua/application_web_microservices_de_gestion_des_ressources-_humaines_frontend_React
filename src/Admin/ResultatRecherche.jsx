import React, { useContext } from "react";
import { SelectedEmployeIdForAbsenceContext } from "./Absences/Absences";
import { SelectedEmployeIdForCongeContext } from "./Conges/Conges";
import { SelectedEmployeIdForPaiementContext } from "./Paiements/Paiements";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const ResultatRecherche = ({ employe, target }) => {
  const [selectedEmployeId, setSelectedEmployeId] = useContext(
    target === "absence"
      ? SelectedEmployeIdForAbsenceContext
      : target === "conge"
      ? SelectedEmployeIdForCongeContext
      : SelectedEmployeIdForPaiementContext
  );
  return (
    <div
      className={`row border rounded-4  mx-auto mt-2 p-2 ${
        selectedEmployeId === employe.id ? "border-2 border-info" : "border-1"
      }`}
      style={{ cursor: "pointer", width: "90%" }}
      onClick={() => setSelectedEmployeId(employe.id)}
    >
      <div className="col-4">
        <center>
          <img
            src={`http://localhost:8888/EMPLOYE-SERVICE/employes/image-profile/${employe.id}`}
            alt=""
            width={80}
            height={80}
            style={{ borderRadius: "50%" }}
          />
        </center>
      </div>
      <div className="col-8 mt-2 fw-bold">
        <div className="row">
          <div className="col">
            {employe.nom} {employe.prenom}
          </div>
        </div>
        {selectedEmployeId === employe.id ? (
          <div className="row">
            <div className="col d-flex justify-content-end">
              <CheckCircleIcon color="success" fontSize="large" />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};


export default React.memo(ResultatRecherche, (prevProps, nextProps) => Object.is(prevProps, nextProps));

