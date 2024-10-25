import notification from "../../assets/notification.png";
import React, { useContext, useEffect, useState } from "react";
import Notification from "../Notifications/Notification";
import {
  Backdrop,
  Box,
  CircularProgress,
  circularProgressClasses,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { AppThemeContext } from "../AdminMainPage";
import axios from "axios";
import dayjs from "dayjs";
import { AuthenticatedUserContext } from "../../App";
const Notifications = () => {
  const authenticatedUser = useContext(AuthenticatedUserContext)[0];
  const [open, setOpen] = useState(false);
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const appTheme = useContext(AppThemeContext)[0];
  const [notifications, setNotifications] = useState([]);
  const [displayedNotifications, setDisplayedNotifications] = useState([]);
  const [nonLues, setNonLues] = useState([]);
  const [loading, setLoading] = useState(true);
  const handleCloseBackdrop = () => {
    setOpenBackdrop(false);
  };
  const handleOpenBackdrop = () => {
    setOpenBackdrop(true);
  };

  const [periode, setPeriode] = React.useState("TOUS");
  const handleChange = (event) => {
    setPeriode(event.target.value);
    handleOpenBackdrop();
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8888/EMPLOYE-SERVICE/notifications/all/${authenticatedUser.employeId}`, {
          headers: {
            Authorization: `Bearer ${authenticatedUser["access-token"]}`,
          },
        }
        );
        let res = response.data.reverse();
        setNotifications(res);
        setNonLues(res.filter((n) => n["etatNotification"] === "NONLUE"));
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };

    fetchNotifications();
  }, [authenticatedUser.employeId]);

  useEffect(() => {
    let filteredResult = [];

    if (periode === "cette semaine") {
      filteredResult = notifications?.filter((item) =>
        dayjs(item["date"]).isAfter(dayjs().subtract(7, "day"))
      );
    } else if (periode === "derniere semaine") {
      filteredResult = notifications?.filter(
        (item) =>
          dayjs(item["date"]).isBefore(dayjs().subtract(7, "day")) &&
          dayjs(item["date"]).isAfter(dayjs().subtract(14, "day"))
      );
    } else if (periode === "dernier mois") {
      filteredResult = notifications?.filter((item) =>
        dayjs(item["date"]).isAfter(dayjs().subtract(30, "day"))
      );
    }

    const handleDisplay = () => {
      handleCloseBackdrop();
      setDisplayedNotifications(filteredResult);
    };

    setTimeout(handleDisplay, 500);
  }, [periode, notifications]);

  if (loading) {
    return (
      <Box sx={{ position: "relative" }}>
        <CircularProgress
          variant="indeterminate"
          disableShrink
          sx={{
            color: (theme) =>
              theme.palette.mode === "light" ? "#1a90ff" : "#308fe8",
            animationDuration: "550ms",
            position: "absolute",
            left: 0,
            [`& .${circularProgressClasses.circle}`]: {
              strokeLinecap: "round",
            },
          }}
          size={40}
          thickness={4}
        />
      </Box>
    );
  }
  return (
    <div className="container mt-4 ">
      <div className="row fw-bold text-primary fs-4">
        <div className="col-md-6 mt-2">
          <div className="row">
            <div className="col-2">
              <img src={notification} width={60} height={60} alt="" />
            </div>
            <div className="col-9">
              {nonLues.length === 0
                ? "aucune nouvelle notification"
                : `${nonLues.length}  nouvelles notifications`}
            </div>
          </div>
        </div>
        <div className="col-md-3 mt-2 offset-md-3">
          <FormControl
            sx={{
              width: "100%",
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: appTheme !== "light" ? "#FFFFFF" : "",
                  borderRadius: "10px",
                },
              },
              "& .MuiInputLabel-root": {
                color: appTheme !== "light" ? "#FFFFFF" : "",
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: appTheme !== "light" ? "#FFFFFF" : "",
              },
            }}
            size="small"
          >
            <InputLabel id="demo-controlled-open-select-label">
              periode
            </InputLabel>
            <Select
              className="rounded-3"
              sx={{
                width: "100%",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: appTheme !== "light" ? "#FFFFFF" : "",
                    borderRadius: "10px",
                  },
                },
                // Fix the color of the selected item
                "& .MuiSelect-select": {
                  color: appTheme !== "light" ? "#FFFFFF" : "#000000",
                },
                // Change the dropdown arrow color
                "& .MuiSvgIcon-root": {
                  color: appTheme !== "light" ? "#FFFFFF" : "#000000",
                },
              }}
              open={open}
              onClose={handleClose}
              onOpen={handleOpen}
              value={periode}
              label="periode"
              onChange={handleChange}
            >
              <MenuItem value={"TOUS"}>TOUS</MenuItem>
              <MenuItem value={"cette semaine"}>cette semaine</MenuItem>
              <MenuItem value={"derniere semaine"}>derniere semaine</MenuItem>
              <MenuItem value={"dernier mois"}>dernier mois</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>
      {periode === "TOUS" ? (
        notifications.map((n) => <Notification key={n.id} notification={n} />)
      ) : displayedNotifications?.length === 0 ? (
        <center>aucune notification</center>
      ) : (
        displayedNotifications?.map((n) => (
          <Notification key={n.id} notification={n} />
        ))
      )}
      <Backdrop
        sx={(theme) => ({
          color: "blue",
          zIndex: theme.zIndex.drawer + 1,
        })}
        open={openBackdrop}
        onClick={handleCloseBackdrop}
      >
        <CircularProgress
          variant="indeterminate"
          disableShrink
          sx={{
            color: (theme) =>
              theme.palette.mode === "light" ? "#1a90ff" : "#308fe8",
            animationDuration: "550ms",

            [`& .${circularProgressClasses.circle}`]: {
              strokeLinecap: "round",
            },
          }}
          size={40}
          thickness={7}
        />
      </Backdrop>
    </div>
  );
};


export default React.memo(Notifications, (prevProps, nextProps) => Object.is(prevProps, nextProps));

