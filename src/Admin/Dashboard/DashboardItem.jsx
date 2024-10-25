import { Menu, MenuItem } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { AppThemeContext } from "../AdminMainPage";
import dayjs from "dayjs";

const DashboardItem = ({ nom, color, data }) => {
  const appTheme = useContext(AppThemeContext)[0];
  const [periode, setPeriode] = useState("cette semaine");
  const [anchorEl, setAnchorEl] = useState(null);
  const [displayedNumber, setDisplayedNumber] = useState(0);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    setDisplayedNumber(
      data?.filter((item) => dayjs().diff(dayjs(item["dateDebut"]), "day") < 7)
        ?.length
    );
  
  }, []);
  
  const handleChange = (value) => {
    setPeriode(value);
    handleClose();
  };

  useEffect(() => {
    if (periode === "cette semaine") {
      const filteredResult = data?.filter(
        (item) => dayjs().diff(dayjs(item["dateDebut"]), "day") <= 7
      );
      setDisplayedNumber(filteredResult?.length);
    } else if (periode === "dernière semaine") {
      const filteredResult = data?.filter(
        (item) => dayjs().diff(dayjs(item["dateDebut"]), "day") < 14 && dayjs().diff(dayjs(item["dateDebut"], "day")) >7
      );
      setDisplayedNumber(filteredResult?.length);
    } else if (periode === "dernier mois") {
      const filteredResult = data?.filter(
        (item) => dayjs().diff(dayjs(item["dateDebut"]), "month") === 0
      );
      setDisplayedNumber(filteredResult?.length);
    }
  }, [periode,data]);

  return (
    <div
      className={`col-md mt-2 rounded-4  text-dark`}
      style={{ backgroundColor: color }}
    >
      <div className="row justify-content-between">
        <span className={` bg-light rounded-pill ms-1 mt-2 w-auto`}>
          <center>{periode}</center>
        </span>

        <div
          className="col-2 fs-4 fw-bold"
          onClick={handleClick}
          style={{
            cursor: "pointer",
            color: appTheme === "light" ? "#000000" : "#FFFFFF",
          }}
        >
          ...
        </div>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
          PaperProps={{
            style: {
              backgroundColor: appTheme === "dark" ? "#000" : "#fff",
              color: appTheme === "dark" ? "#fff" : "#000",
            },
          }}
        >
          <MenuItem onClick={() => handleChange("cette semaine")}>
            cette semaine
          </MenuItem>
          <MenuItem onClick={() => handleChange("dernière semaine")}>
            dernière semaine
          </MenuItem>
          <MenuItem onClick={() => handleChange("dernier mois")}>
            dernier mois
          </MenuItem>
        </Menu>
        <div className="row">
          <div className="fw-bold p-2 ms-3 fs-3 mt-3">{displayedNumber}</div>
        </div>
        <div className="row">
          <div className=" fw-bold p-2 ms-3 "> {nom}</div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(DashboardItem, (prevProps, nextProps) => Object.is(prevProps, nextProps));

