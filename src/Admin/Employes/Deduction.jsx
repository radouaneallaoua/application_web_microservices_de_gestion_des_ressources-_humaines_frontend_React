import { Delete, Edit } from "@mui/icons-material";
import {
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
} from "@mui/material";
import React, { useContext, useState } from "react";
import { DeleteDeductionIdContext, EditedItemContext } from "./EmployeDetails";
import dayjs from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import axios from "axios";
import { AuthenticatedUserContext } from "../../App";


const Deduction = React.memo(
  ({ deduction = {} }) => {
    const setDeleteDeduction = useContext(DeleteDeductionIdContext)[1];
    const [editEnabled, setEditEnabled] = useState(false);
    const authenticatedUser = useContext(AuthenticatedUserContext)[0];
    const toggleEdit = () => {
      setEditEnabled((pre) => !pre);
    };
    const [deductionFormState, setDeductionFormState] = useState({
      description: deduction.description,
      montant: deduction.montant,
      typeDeduction: deduction.typeDeduction,
      dateDebut: dayjs(deduction.dateDebut),
      dateFin: dayjs(deduction.dateFin),
      employeId: deduction.employeId,
    });

    const handleDeductionFormStateChange = (e) => {
      const { name, value } = e.target;
      setDeductionFormState((pre) => ({ ...pre, [name]: value }));
    };
    const setEditItem = useContext(EditedItemContext)[1];
    const handleDeductionSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.put(
          `http://localhost:8888/PAIE-SERVICE/deductions/${deduction.id}`,
          deductionFormState, {
          headers: {
            Authorization: `Bearer ${authenticatedUser["access-token"]}`,
          },
        }
        );
        console.log(response.data);
        setEditItem({ edit: true, type: "deduction" });
        toggleEdit();
      } catch (err) {
        console.log(err);
      }
    };

    return (
      <div className="row border p-2 border-1 mb-2 border-warning rounded-3">
        {editEnabled ? (
          <>
            <form method="put" onSubmit={handleDeductionSubmit}>
              <div className="row mt-2">
                <TextField
                  sx={{ width: "100%" }}
                  id="outlined-basic"
                  label="Description"
                  name="description"
                  multiline
                  required
                  value={deductionFormState.description}
                  onChange={handleDeductionFormStateChange}
                  variant="outlined"
                />
              </div>
              <div className="row mt-2">
                <TextField
                  sx={{ width: "100%" }}
                  id="outlined-basic"
                  label="Montant"
                  name="montant"
                  type="number"
                  required
                  value={deductionFormState.montant}
                  onChange={handleDeductionFormStateChange}
                  variant="outlined"
                />
              </div>
              <div className="row mt-2">
                <FormControl fullWidth required>
                  <InputLabel id="demo-simple-select-label">
                    Type deduction
                  </InputLabel>
                  <Select
                    label="Type deduction"
                    name="typeDeduction"
                    value={deductionFormState.typeDeduction}
                    onChange={handleDeductionFormStateChange}
                  >
                    <MenuItem value="ANNUELLE">ANNUELLE</MenuItem>
                    <MenuItem value="MENSUELLE">MENSUELLE</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="row">
                <div className="col-md  mt-2">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      closeOnSelect
                      sx={{ width: "100%" }}
                      value={deductionFormState.dateDebut}
                      onChange={(newValue) =>
                        setDeductionFormState((pre) => ({
                          ...pre,
                          dateDebut: newValue,
                        }))
                      }
                      label="date de début"
                    />
                  </LocalizationProvider>
                </div>
              </div>
              <div>
                <div className="col-md mt-2">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      closeOnSelect
                      sx={{ width: "100%" }}
                      value={deductionFormState.dateFin}
                      onChange={(newValue) =>
                        setDeductionFormState((pre) => ({
                          ...pre,
                          dateFin: newValue,
                        }))
                      }
                      label="date de fin"
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
          </>
        ) : (
          <>
            <div className="row">
              <div className="col-md-5 col-6 fw-bold text-primary">
                Montant:
              </div>
              <div className="col-md-7 col-6">{deduction.montant}</div>
            </div>
            <div className="row">
              <div className="col-md-5 col-6 fw-bold text-primary">
                Type deduction:
              </div>
              <div className="col-md-7 col-6">{deduction.typeDeduction}</div>
            </div>
            <div className="row">
              <div className="col-md-5 col-6 fw-bold text-primary">
                Date de début:
              </div>
              <div className="col-md-7 col-6">{deduction.dateDebut}</div>
            </div>
            <div className="row">
              <div className="col-md-5 col-6 fw-bold text-primary">
                Date de fin:
              </div>
              <div className="col-md-7 col-6">{deduction.dateFin}</div>
            </div>
            <div className="row">
              <div className="col-md-5 col-6 fw-bold text-primary">
                Description:
              </div>
              <div className="col-md-7 col-6">{deduction.description}</div>
            </div>
            <div className="row justify-content-end">
              <div className="col-md-4">
                <Tooltip title="supdeductionr">
                  <IconButton onClick={() => setDeleteDeduction(deduction.id)}>
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

export default React.memo(Deduction, (prevProps, nextProps) => Object.is(prevProps, nextProps));

