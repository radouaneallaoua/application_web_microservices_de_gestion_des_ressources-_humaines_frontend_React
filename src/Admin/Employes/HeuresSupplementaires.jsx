import { Delete, Edit } from "@mui/icons-material";
import { Button, IconButton, TextField, Tooltip } from "@mui/material";
import React, { useContext, useState } from "react";
import { DeleteHeuresIdContext, EditedItemContext } from "./EmployeDetails";
import dayjs from "dayjs";
import axios from "axios";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { AuthenticatedUserContext } from "../../App";

const HeuresSupplemetaires = React.memo(
  ({ heuresSupplemetaires = {} }) => {
    const authenticatedUser = useContext(AuthenticatedUserContext)[0];
    const setDeleteHeuresSupplemetaires = useContext(DeleteHeuresIdContext)[1];
    const [editEnabled, setEditEnabled] = useState(false);
    const toggleEdit = () => {
      setEditEnabled((pre) => !pre);
    };
    const [heuresFormState, setHeuresFormState] = useState({
      nombreHeures: heuresSupplemetaires.nombreHeures,
      montantUnitaire: heuresSupplemetaires.montantUnitaire,
      date: dayjs(heuresSupplemetaires.date),
      employeId: heuresSupplemetaires.employeId,
    });
    const setEditItem = useContext(EditedItemContext)[1];
    const handleHeuresFormStateChange = (e) => {
      const { name, value } = e.target;
      setHeuresFormState((pre) => ({ ...pre, [name]: value }));
    };
   const handleHeuresSubmit = async (e) => {
     e.preventDefault();

     try {
       const response = await axios.put(
         `http://localhost:8888/PAIE-SERVICE/heures-supp/${heuresSupplemetaires.id}`,
         heuresFormState, {
         headers: {
           Authorization: `Bearer ${authenticatedUser["access-token"]}`,
         },
       }
       );
       console.log(response.data);
       setEditItem({ edit: true, type: "heures" });
       toggleEdit();
     } catch (err) {
       console.log(err);
     }
   };

    return (
      <div className="row border p-3 border-1 mb-2 border-success rounded-3">
        {editEnabled ? (
          <form method="put" onSubmit={handleHeuresSubmit}>
            <div className="row mt-2">
              <TextField
                sx={{ width: "100%" }}
                id="outlined-basic"
                label="Nombre d'heures"
                name="nombreHeures"
                type="number"
                required
                value={heuresFormState.nombreHeures}
                onChange={handleHeuresFormStateChange}
                variant="outlined"
              />
            </div>
            <div className="row mt-2">
              <TextField
                sx={{ width: "100%" }}
                id="outlined-basic"
                label="Montant Unitaire"
                name="montantUnitaire"
                type="number"
                required
                value={heuresFormState.montantUnitaire}
                onChange={handleHeuresFormStateChange}
                variant="outlined"
              />
            </div>

            <div className="row">
              <div className="col-md mt-2">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    closeOnSelect
                    sx={{ width: "100%" }}
                    value={heuresFormState.date}
                    onChange={(newValue) =>
                      setHeuresFormState((pre) => ({
                        ...pre,
                        date: newValue,
                      }))
                    }
                    label="Date"
                  />
                </LocalizationProvider>
              </div>
            </div>
            <div className="row mt-3 mx-1">
              <Button type="submit" color="warning" variant="contained">
                modifier
              </Button>
            </div>
            <div className="row mt-3 mx-1">
              <Button
                type="button"
                color="secondary"
                variant="text"
                onClick={toggleEdit}
              >
                Annuler
              </Button>
            </div>
          </form>
        ) : (
          <>
            <div className="row">
              <div className="col-md-7 fw-bold text-primary">
                Nombres d'heures:
              </div>
              <div className="col-md-5">
                {heuresSupplemetaires.nombreHeures}
              </div>
            </div>
            <div className="row">
              <div className="col-md-7 fw-bold text-primary">
                Montant Unitaire:
              </div>
              <div className="col-md-5">
                {heuresSupplemetaires.montantUnitaire}
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 fw-bold text-primary">Date:</div>
              <div className="col-md-6">{heuresSupplemetaires.date}</div>
            </div>

            <div className="row ">
              <div className="col-md d-flex justify-content-end">
                <Tooltip title="supprimer">
                  <IconButton
                    onClick={() =>
                      setDeleteHeuresSupplemetaires(heuresSupplemetaires.id)
                    }
                  >
                    <Delete color="error" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="modifier">
                  <IconButton onClick={toggleEdit}>
                    <Edit color="primary" />
                  </IconButton>
                </Tooltip>
              </div>
            </div>
          </>
        )}
      </div>
    );
  },
  (prevProps, newProps) => Object.is(prevProps, newProps)
);

export default React.memo(HeuresSupplemetaires, (prevProps, nextProps) => Object.is(prevProps, nextProps));

