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
import { DeletePrimeIdContext, EditedItemContext } from "./EmployeDetails";
import dayjs from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import axios from "axios";
import { AuthenticatedUserContext } from "../../App";

const Prime = React.memo(
  ({ prime = {} }) => {
    const authenticatedUser = useContext(AuthenticatedUserContext)[0];
    const setDeletePrime = useContext(DeletePrimeIdContext)[1];
    const [editEnabled, setEditEnabled] = useState(false);
    const toggleEdit = () => {
      setEditEnabled((pre) => !pre);
    };
    const [primeFormState, setPrimeFormState] = useState({
      description: prime.description,
      montant: prime.montant,
      typePrime: prime.typePrime,
      dateDebut: dayjs(prime.dateDebut),
      dateFin: dayjs(prime.dateFin),
      employeId: prime.employeId,
    });

    const handlePrimeFormStateChange = (e) => {
      const { name, value } = e.target;
      setPrimeFormState((pre) => ({ ...pre, [name]: value }));
    };
    const setEditItem = useContext(EditedItemContext)[1];
    const handlePrimeSubmit = async (e) => {
      e.preventDefault();

      try {
        const response = await axios.put(
          `http://localhost:8888/PAIE-SERVICE/primes/${prime.id}`,
          primeFormState, {
          headers: {
            Authorization: `Bearer ${authenticatedUser["access-token"]}`,
          },
        }
        );
        console.log(response.data);
        setEditItem({ edit: true, type: "prime" });
        toggleEdit();
      } catch (err) {
        console.log(err);
      }
    };

    return (
      <div className="row border p-2 border-1 mb-2 border-info rounded-3">
        {editEnabled ? (
          <>
            <form method="put" onSubmit={handlePrimeSubmit}>
              <div className="row mt-2">
                <TextField
                  sx={{ width: "100%" }}
                  id="outlined-basic"
                  label="Description"
                  name="description"
                  multiline
                  required
                  value={primeFormState.description}
                  onChange={handlePrimeFormStateChange}
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
                  value={primeFormState.montant}
                  onChange={handlePrimeFormStateChange}
                  variant="outlined"
                />
              </div>
              <div className="row mt-2">
                <FormControl fullWidth required>
                  <InputLabel id="demo-simple-select-label">
                    Type prime
                  </InputLabel>
                  <Select
                    label="Type prime"
                    name="typePrime"
                    value={primeFormState.typePrime}
                    onChange={handlePrimeFormStateChange}
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
                      value={primeFormState.dateDebut}
                      onChange={(newValue) =>
                        setPrimeFormState((pre) => ({
                          ...pre,
                          dateDebut: newValue,
                        }))
                      }
                      label="date de debut"
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
                      value={primeFormState.dateFin}
                      onChange={(newValue) =>
                        setPrimeFormState((pre) => ({
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
              <div className="col-md-7 col-6">{prime.montant}</div>
            </div>
            <div className="row">
              <div className="col-md-5 col-6 fw-bold text-primary">
                Type prime:
              </div>
              <div className="col-md-7 col-6">{prime.typePrime}</div>
            </div>
            <div className="row">
              <div className="col-md-5 col-6 fw-bold text-primary">
                Date de debut:
              </div>
              <div className="col-md-7 col-6">{prime.dateDebut}</div>
            </div>
            <div className="row">
              <div className="col-md-5 col-6 fw-bold text-primary">
                Date de fin:
              </div>
              <div className="col-md-7 col-6">{prime.dateFin}</div>
            </div>
            <div className="row">
              <div className="col-md-5 col-6 fw-bold text-primary">
                Description:
              </div>
              <div className="col-md-7 col-6">{prime.description}</div>
            </div>
            <div className="row justify-content-end">
              <div className="col-md-4">
                <Tooltip title="supprimer">
                  <IconButton onClick={() => setDeletePrime(prime.id)}>
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

export default React.memo(Prime, (prevProps, nextProps) => Object.is(prevProps, nextProps));

