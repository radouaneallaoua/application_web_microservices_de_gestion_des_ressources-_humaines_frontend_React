import React, { useContext, useEffect, useState } from "react";
import { AppThemeContext, ReloadingProfileContext } from "./AdminMainPage";
import { Autocomplete, IconButton, TextField } from "@mui/material";
import { CancelOutlined, CheckCircle, Edit } from "@mui/icons-material";
import axios from "axios";
import CustomSnackBar from "./CustomSnackBar";

import { AuthenticatedUserContext } from "../App";

const ProfileItem = ({ itemName, icon, value }) => {
  const authenticatedUser = useContext(AuthenticatedUserContext)[0];
  const [editEnabled, setEditEnabled] = useState(false);
  const [val, setVal] = useState(null);
  const appTheme = useContext(AppThemeContext)[0];
  const setReloadingProfile = useContext(ReloadingProfileContext)[1];
  const [regions, setRegions] = useState([]);
  const [showSnackBar, setShowSnackBar] = useState(false);
  const handleOpenSnackBar = () => setShowSnackBar(true);
  const handleCloseSnackBar = () => setShowSnackBar(false);
  const handleEditToggle = () => {
    setEditEnabled((pre) => !pre);
  };
  const handleValChange = (e) => {
    setVal(e.target.value);
  };
  useEffect(() => {
    setVal(value);
    const fetchRegions = async () => {
      try {
        if (itemName === "region") {
          let response = await axios.get(
            "http://localhost:8888/EMPLOYE-SERVICE/regions",
            {
              headers: {
                Authorization: `Bearer ${authenticatedUser["access-token"]}`,
              },
            }
          );
          setRegions(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchRegions();
  }, [itemName, value]);

  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8888/EMPLOYE-SERVICE/employes/${authenticatedUser.employeId}/update-profile?${itemName}=${val}`,
        {},
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authenticatedUser["access-token"]}`,
          },
        }
      );
      console.log("////////////////////////////PROFILE ITEM////////////////")
      console.log(response.data)

      handleEditToggle();
      handleOpenSnackBar();
      setReloadingProfile((pre) => !pre);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="row mt-2">
      <div
        style={{
          backgroundColor: appTheme === "light" ? "#CFF4FC" : "#0C2034",
          color: appTheme === "light" ? "black" : "white",
        }}
        className={`col-12 rounded-pill`}
      >
        {editEnabled ? (
          <div className="row ">
            <div className="col-1 mt-4">{icon}</div>
            <div className="col-9 mt-3">
              {itemName === "region" ? (
                <Autocomplete
                  size="small"
                  disablePortal
                  id="combo-box-demo"
                  options={regions.map((r) => r["label"])}
                  value={val}
                  onChange={(event, newValue) => setVal(newValue)}
                  sx={{ width: "auto" }}
                  renderInput={(params) => (
                    <TextField {...params} label="Region" />
                  )}
                />
              ) : itemName === "situationFamiliale" ? (
                <Autocomplete
                  size="small"
                  disablePortal
                  id="combo-box-demo"
                  options={["MARIE", "CELIBATAIRE"]}
                  value={val}
                  onChange={(event, newValue) => setVal(newValue)}
                  sx={{ width: "auto" }}
                  renderInput={(params) => (
                    <TextField {...params} label="Situation familiale" />
                  )}
                />
              ) : (
                <TextField
                  className="mb-2 "
                  sx={{
                    width: "auto",
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: appTheme !== "light" ? "#FFFFFF" : "",
                      },
                      "& input::placeholder": {
                        color: appTheme !== "light" ? "#FFFFFF" : "",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: appTheme !== "light" ? "#FFFFFF" : "",
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: appTheme !== "light" ? "#FFFFFF" : "",
                    },
                    "& input": {
                      color: appTheme !== "light" ? "#FFFFFF" : "#000000",
                    },
                  }}
                  id="outlined-basic"
                  label={itemName}
                  name={itemName}
                  size="small"
                  required
                  value={val}
                  onChange={handleValChange}
                  variant="outlined"
                />
              )}
            </div>

            <div className="col-2">
              <div className="row">
                <div className="col">
                  <IconButton onClick={handleUpdate}>
                    <CheckCircle color="success" />
                  </IconButton>
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <IconButton onClick={handleEditToggle}>
                    <CancelOutlined color="error" />
                  </IconButton>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="row ">
            <div className="col-10  mt-2">
              {icon}
              {value}
            </div>
            <div className="col-2">
              <IconButton onClick={handleEditToggle}>
                <Edit color="primary" />
              </IconButton>
            </div>
          </div>
        )}
        <CustomSnackBar
          isOpen={showSnackBar}
          duration={4000}
          onClose={handleCloseSnackBar}
          type="info"
          message={`${itemName} modifie avec succes!`}
        />
      </div>
    </div>
  );
};

export default React.memo(ProfileItem, (prevProps, nextProps) =>
  Object.is(prevProps, nextProps)
);
