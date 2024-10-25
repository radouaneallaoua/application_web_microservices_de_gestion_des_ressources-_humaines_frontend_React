import React, { useContext, useEffect, useState } from "react";
import "../../App.css";
import axios from "axios";
import { AuthenticatedUserContext } from "../../App";


const Offre = ({ offreId, onClick }) => {
  const authenticatedUser = useContext(AuthenticatedUserContext)[0];
  const [offre, setOffre] = useState({});
  const [typeContrats, setTypesContrats] = useState([]);

  useEffect(() => {
    const getOffre = async () => {
      try {
        let response = await axios.get(
          `http://localhost:8888/RECRUTEMENT-SERVICE/offres/${offreId}`, {
          headers: {
            Authorization: `Bearer ${authenticatedUser["access-token"]}`,
          },
        }
        );
        if (response.status === 200) {
          const data = response.data;
          setOffre(data);
          setTypesContrats(data["contrats"]);
        }

      } catch (error) {
        console.log(error);
      }
    };
    getOffre();
  }, [offreId, authenticatedUser]);
  return (
    <div
      className="border  border-1 rounded-2 mb-3 p-4"
      onClick={() => onClick(offreId)}
      style={{ cursor: "pointer" }}
    >
      <div className="row justify-content-end">
        {offre["estExpiree"] && (
          <div
            className="col-3  text-center border border-1 rounded-pill bg-danger text-light"
            style={{ rotate: "20deg" }}
          >
            expirée
          </div>
        )}
      </div>
      <div className="row">
        <div className="col-4 mb-2 fw-bold">Titre</div>
        <div className="col-8 mb-2">{offre["titre"]}</div>
      </div>
      <div className="row">
        <div className="col-4 mb-2 fw-bold">Poste</div>
        <div className="col-8 mb-2 justify-content-between">
          <div className="row">
            <div className="col-7 fw-bold">{offre["poste"]}</div>
            <div className="col-5">
              <span className="fw-bold text-primary">
                {offre["nombreDePostes"]}
              </span>
              <br />
              postes
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-4 mb-2 fw-bold">Description</div>
        <div className="col-8 mb-2 text-secondary" style={{ fontSize: 14 }}>
          {offre["description"]}
        </div>
      </div>
      <div className="row">
        <div className="col-4 mb-2 fw-bold">Ville</div>
        <div className="col-8 mb-2">{offre["ville"]}</div>
      </div>
      <div className="row">
        <div className="col-4 mb-2 fw-bold">Date de publication</div>
        <div className="col-8 mb-2">{offre["datePublication"]}</div>
      </div>
      <div className="row">
        <div className="col-4 mb-2 fw-bold">Date limite de condidature</div>
        <div className="col-8 mb-2">{offre["dateLimiteCondidature"]}</div>
      </div>
      <div className="row">
        <div className="col-4 mb-2 fw-bold">Types de contrats</div>
        <div className="col-8 mb-2">
          <ul>
            {typeContrats.map((item) => {
              return <li key={item["id"]}>{item["typeContrat"]}</li>;
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Offre, (prevProps, nextProps) => Object.is(prevProps, nextProps));

