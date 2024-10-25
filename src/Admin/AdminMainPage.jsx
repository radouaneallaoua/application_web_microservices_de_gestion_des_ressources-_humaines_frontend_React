import React, { createContext, useContext, useEffect } from "react";
import { useState } from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import Badge from "@mui/material/Badge";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import LogoutIcon from "@mui/icons-material/Logout";
import Button from "@mui/material/Button";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import GroupIcon from "@mui/icons-material/Group";
import MailOutlineOutlinedIcon from "@mui/icons-material/MailOutlineOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import AlternateEmailOutlinedIcon from "@mui/icons-material/AlternateEmailOutlined";
import SouthAmericaOutlinedIcon from "@mui/icons-material/SouthAmericaOutlined";
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";
import FitnessCenterSharpIcon from "@mui/icons-material/FitnessCenterSharp";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import Dashboard from "./Dashboard/Dashboard";
import Employes from "./Employes/Employes";
import Formations from "./Formations/Formations";
import Notifications from "./Notifications/Notifications";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import Absences from "./Absences/Absences";
import PaidIcon from "@mui/icons-material/Paid";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import WorkIcon from "@mui/icons-material/Work";
import ApartmentIcon from "@mui/icons-material/Apartment";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import ClassIcon from "@mui/icons-material/Class";
import CategoryIcon from "@mui/icons-material/Category";
import Conges from "./Conges/Conges";
import Paiements from "./Paiements/Paiements";
import Categories from "./Categories";
import Corps from "./Corps";
import Cadres from "./Cadres";
import Grades from "./Grades";
import Mutuelles from "./Mutuelles";
import Entites from "./Entites/Entites";
import Avancements from "../Admin/Avancements/Avancements";
import Recrutement from "../Admin/Recrutement/Recrutements";
import Types from "./Types";
import { SwipeableDrawer, Tooltip } from "@mui/material";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import Indices from "./Indices";
import { Link } from "react-router-dom";
import "../App.css";
import CancelIcon from "@mui/icons-material/Cancel";
import EditIcon from "@mui/icons-material/Edit";
import AutoAwesomeMosaicIcon from "@mui/icons-material/AutoAwesomeMosaic";
import AlignHorizontalRightIcon from "@mui/icons-material/AlignHorizontalRight";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import ExpandIcon from "@mui/icons-material/Expand";
import HelpOutlinedIcon from "@mui/icons-material/HelpOutlined";
import axios from "axios";
import ProfileItem from "./ProfileItem";
import CustomSnackBar from "./CustomSnackBar";
import AutoFixHighRoundedIcon from "@mui/icons-material/AutoFixHighRounded";
import Competences from "./Competences";

import {
  AuthenticatedEmployeInfosContext,
  AuthenticatedUserContext,
} from "../App";
const drawerWidth = 240;

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(10)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["width", "margin"], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  variants: [
    {
      props: ({ open }) => open,
      style: {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
      },
    },
    {
      props: ({ open }) => !open,
      style: {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
      },
    },
  ],
}));
const getIconsDependsOnUser = (role) => {
  if (role !== "EMPLOYE") {
    return [
      <GridViewRoundedIcon />,
      <GroupIcon />,
      <FitnessCenterSharpIcon />,
      <CalendarMonthIcon />,
      <EventBusyIcon />,
      <PaidIcon />,
      <TrendingUpIcon />,
      <WorkIcon />,
      <ApartmentIcon />,
      <CategoryIcon />,
      <ClearAllIcon />,
      <ClassIcon />,
      <AlignHorizontalRightIcon />,
      <ExpandIcon />,
      <AutoAwesomeMosaicIcon />,
      <AutoFixHighRoundedIcon />,
      <HelpOutlinedIcon />,
      <NotificationsActiveIcon />,
    ];
  } else {
    return [
      <CalendarMonthIcon />,
      <EventBusyIcon />,
      <FitnessCenterSharpIcon />,
      <NotificationsActiveIcon />,
    ];
  }
};
const getComponentsDependsOnUser = (role) => {
  if (role !== "EMPLOYE") {
    return [
      <Dashboard />,
      <Employes />,
      <Formations />,
      <Absences />,
      <Conges />,
      <Paiements />,
      <Avancements />,
      <Recrutement />,
      <Entites />,
      <Categories />,
      <Corps />,
      <Cadres />,
      <Grades />,
      <Indices />,
      <Types />,
      <Competences />,
      <Mutuelles />,
      <Notifications />,
    ];
  } else {
    return [<Absences />, <Conges />, <Formations />, <Notifications />];
  }
};
const getItemsTextDependsOnUser = (role) => {
  if (role !== "EMPLOYE") {
    return [
      "Dashboard",
      "Employés",
      "Formations",
      "Absences",
      "Congés",
      "Paiements",
      "Avancements",
      "Recrutement",
      "Entités",
      "Catégories",
      "Corps",
      "Cadres",
      "Grades",
      "Indice-Echelon",
      "Types",
      "Compétences",
      "Mutuelles",
      "Notifications",
    ];
  } else {
    return ["Absences", "Congés", "Formations", "Notifications"];
  }
};

export const AppThemeContext = createContext();
export const UserRoleContext = createContext();
export const ReloadingProfileContext = createContext();
///////////////////////////COMPONENT/////////////////////////

const AdminMainPage = () => {
  const date = useState(new Date())[0];
  const [authenticatedUser, setAuthenticatedUser] = useContext(
    AuthenticatedUserContext
  );
  const [employeInfos, setEmployeInfos] = useContext(
    AuthenticatedEmployeInfosContext
  );
  const [reloadingProfile, setReloadingProfile] = useState(false);

  const [appTheme, setAppTheme] = useState("light");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [icons, setIcons] = useState([]);
  const [components, setComponents] = useState([]);
  const [itemsText, setItemsText] = useState([]);
  const theme = useTheme();
  const [showSnackBar, setShowSnackBar] = useState(false);
  const [employeNotifications, setEmployeNotifications] = useState([]);
  const handleOpenSnackBar = () => setShowSnackBar(true);
  const handleCloseSnackBar = () => setShowSnackBar(false);
  const [open, setOpen] = React.useState(false);
  const [userRole, setUserRole] = useState(undefined);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open2 = Boolean(anchorEl);
  const [profileClicked, setProfileClicked] = useState(false);
  useEffect(() => {
    window.addEventListener("resize", function (e) {
      setWindowWidth(this.window.innerWidth);
    });
    if (windowWidth <= 600) {
      handleDrawerClose();
    }
  }, [windowWidth]);
  const convertNumberToDay = (index) => {
    switch (index) {
      case 0:
        return "Dimanche";
      case 1:
        return "Lundi";
      case 2:
        return "Mardi";
      case 3:
        return "Mercredi";
      case 4:
        return "Jeudi";
      case 5:
        return "Vendredi";
      case 6:
        return "Samedi";
      default:
        return;
    }
  };
  const handleUpdateImageProfile = async (event) => {
    let file = event.target.files[0];
    try {
      let res = await axios.put(
        `http://localhost:8888/EMPLOYE-SERVICE/employes/${authenticatedUser.employeId}/update-profile`,
        {
          image: file,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authenticatedUser["access-token"]}`,
          },
        }
      );
      handleOpenSnackBar();
      setReloadingProfile((pre) => !pre);
    } catch (error) {
      console.log(error);
    }
  };

  const toggleTheme = () => {
    appTheme === "light" ? setAppTheme("dark") : setAppTheme("light");
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerOpen = () => {
    if (windowWidth >= 600) {
      setOpen(true);
    }
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  const handleOpenProfile = () => {
    setProfileClicked(true);
    handleClose();
  };
  const handleCloseProfile = () => {
    setProfileClicked(false);
  };

  const handleSelectedIndexChange = async (newIndex) => {
    if (selectedIndex === getIconsDependsOnUser().length - 1) {
      try {
        for (let i = 0; i < employeNotifications.length; i++) {
          const element = employeNotifications[i];
          await axios.put(
            `http://localhost:8888/EMPLOYE-SERVICE/notifications/${element.id}`,
            {
              headers: {
                Authorization: `Bearer ${authenticatedUser["access-token"]}`,
              },
            }
          );
        }
        const response = await axios.get(
          `http://localhost:8888/EMPLOYE-SERVICE/notifications/all/${authenticatedUser.employeId}/etatNotification/NONLUE`,
          {
            headers: {
              Authorization: `Bearer ${authenticatedUser["access-token"]}`,
            },
          }
        );
        setEmployeNotifications(response.data);
      } catch (err) {
        console.log(err);
      }
    }

    setSelectedIndex(newIndex);
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        if (authenticatedUser.isAuthenticated) {
          const response = await axios.get(
            `http://localhost:8888/EMPLOYE-SERVICE/notifications/all/${authenticatedUser.employeId}/etatNotification/NONLUE`,
            {
              headers: {
                Authorization: `Bearer ${authenticatedUser["access-token"]}`,
              },
            }
          );
          console.log(response.data);
          setEmployeNotifications(response.data);

          let role =
            authenticatedUser.role === "RESPONSABLE"
              ? "RESPONSABLE-RH"
              : "EMPLOYE";
          setUserRole(role);
          setIcons(getIconsDependsOnUser(role));
          console.log(getIconsDependsOnUser(role));
          setComponents(getComponentsDependsOnUser(role));
          setItemsText(getItemsTextDependsOnUser(role));
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchNotifications();
  }, []);

  useEffect(() => {
    if (authenticatedUser.isAuthenticated) {
      const fetchAuthenticatedUserInfos = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8888/EMPLOYE-SERVICE/employes/${authenticatedUser.employeId}`,
            {
              headers: {
                Authorization: `Bearer ${authenticatedUser["access-token"]}`,
              },
            }
          );
          setEmployeInfos(response.data);
        } catch (err) {
          console.log(err);
        }
      };
      fetchAuthenticatedUserInfos();
    }
  }, [reloadingProfile]);

  return (
    <AppThemeContext.Provider value={[appTheme, setAppTheme]}>
      <AuthenticatedUserContext.Provider
        value={[authenticatedUser, setAuthenticatedUser]}
      >
        <ReloadingProfileContext.Provider
          value={[reloadingProfile, setReloadingProfile]}
        >
          <UserRoleContext.Provider value={[userRole, setUserRole]}>
            <div>
              <Box sx={{ display: "flex" }}>
                <CssBaseline />
                <AppBar
                  position="fixed"
                  open={open}
                  color="inherit"
                  elevation="0"
                  sx={{
                    backgroundColor:
                      appTheme === "light" ? "#FFFFFF" : "#242426",
                  }}
                >
                  <Toolbar>
                    <IconButton
                      color="inherit"
                      aria-label="open drawer"
                      onClick={handleDrawerOpen}
                      edge="start"
                      sx={{
                        marginRight: 5,
                        ...(open && { display: "none" }),
                      }}
                    >
                      <MenuIcon color="primary" />
                    </IconButton>
                    <Typography sx={{ fontWeight: "bold", color: "grey" }}>
                      {convertNumberToDay(date.getDay()) + " "}
                      {date.getDate()}/
                      {`${date.getMonth() < 10 ? "0" : ""}${date.getMonth()}`}/
                      {date.getFullYear()}
                    </Typography>
                    <div style={{ flex: "auto" }}></div>
                    <IconButton
                      onClick={toggleTheme}
                      color="inherit"
                      size={windowWidth > 470 ? "medium" : "small"}
                      edge="start"
                      sx={{ mr: 2 }}
                    >
                      {appTheme === "light" ? (
                        <DarkModeIcon color="primary" />
                      ) : (
                        <LightModeOutlinedIcon color="primary" />
                      )}
                    </IconButton>

                    <Button
                      id="basic-button"
                      aria-controls={open2 ? "basic-menu" : undefined}
                      aria-haspopup="true"
                      aria-expanded={open2 ? "true" : undefined}
                      onClick={handleClick}
                    >
                      <Avatar
                        alt="Remy Sharp"
                        src={`http://localhost:8888/EMPLOYE-SERVICE/employes/image-profile/${authenticatedUser.employeId}`}
                        sx={{ width: 50, height: 50 }}
                      />
                      <div
                        className={` p-1 rounded-3 text-light text-lowercase  ms-1 ${
                          userRole === "RESPONSABLE-RH"
                            ? "bg-success"
                            : "bg-info"
                        }`}
                      >
                        <Typography>
                          {userRole === "RESPONSABLE-RH"
                            ? "RESPONSABLE-RH"
                            : "EMPLOYE"}
                        </Typography>
                      </div>
                    </Button>
                    <Menu
                      id="basic-menu"
                      anchorEl={anchorEl}
                      open={open2}
                      onClose={handleClose}
                      MenuListProps={{
                        "aria-labelledby": "basic-button",
                      }}
                    >
                      <MenuItem
                        onClick={handleOpenProfile}
                        sx={{ borderRadius: 3, px: 2, m: 1 }}
                      >
                        <Stack direction="row" spacing={1}>
                          <AccountCircleIcon />
                          <Typography>profile</Typography>
                        </Stack>
                      </MenuItem>
                      <Link to="/login" className="logout">
                        <MenuItem
                          className="bg-warning "
                          sx={{ borderRadius: 3, px: 2, m: 1 }}
                        >
                          <Stack direction="row" spacing={1}>
                            <LogoutIcon />
                            <Typography>logout</Typography>
                          </Stack>
                        </MenuItem>
                      </Link>
                    </Menu>
                  </Toolbar>
                </AppBar>
                <Drawer
                  variant="permanent"
                  open={open}
                  className={
                    appTheme === "light" ? "text-bg-light" : "text-bg-dark"
                  }
                >
                  <DrawerHeader
                    style={{
                      position: "sticky",
                      top: 0,
                      backdropFilter: "none",
                      backgroundColor:
                        appTheme === "light" ? "#FFFFFF" : "#242426",
                      zIndex: 1100,
                    }}
                  >
                    <Typography sx={{ color: "#0057A2EB", fontWeight: "bold" }}>
                      GRH
                    </Typography>
                    <div style={{ flex: "auto" }}></div>
                    <IconButton onClick={handleDrawerClose}>
                      {theme.direction === "rtl" ? (
                        <ChevronRightIcon color="primary" />
                      ) : (
                        <ChevronLeftIcon color="primary" />
                      )}
                    </IconButton>
                  </DrawerHeader>
                  <Divider color="primary" />
                  <List
                    className="sidebar"
                    style={{
                      backgroundColor:
                        appTheme === "light" ? "#FFFFFF" : "#242426",
                      flex: 1,
                      scrollbarWidth: 0,
                    }}
                  >
                    {itemsText.map((text, index) => (
                      <div
                        key={index}
                        style={{
                          backgroundColor:
                            selectedIndex !== index
                              ? ""
                              : appTheme === "light"
                              ? "#EDF4FB"
                              : "#262F37",
                          color: appTheme === "light" ? "#000000" : "#FFFFFF",
                          borderRadius: 10,
                          margin: 3,
                        }}
                        className={`${appTheme !== "light" ? "itemDark" : ""}`}
                      >
                        {windowWidth <= 600 ? (
                          <Tooltip title={text} placement="right">
                            <ListItem
                              key={text}
                              disablePadding
                              sx={{
                                display: "block",
                              }}
                              onClick={() => handleSelectedIndexChange(index)}
                            >
                              <ListItemButton
                                sx={{
                                  borderRadius: 3,
                                  minHeight: 48,
                                  justifyContent: open ? "initial" : "center",
                                  px: 2.5,
                                }}
                              >
                                <ListItemIcon
                                  sx={{
                                    color:
                                      selectedIndex === index
                                        ? "#126AAE"
                                        : "blueViolet",
                                    minWidth: 0,
                                    mr: open ? 3 : "auto",
                                    justifyContent: "center",
                                    alignContent: "center",
                                  }}
                                >
                                  {index === icons.length - 1 ? (
                                    <Badge
                                      badgeContent={
                                        employeNotifications.length === 0
                                          ? null
                                          : employeNotifications.length
                                      }
                                      color={
                                        selectedIndex === icons.length - 1
                                          ? "secondary"
                                          : "primary"
                                      }
                                    >
                                      {icons[index]}
                                    </Badge>
                                  ) : (
                                    icons[index]
                                  )}
                                </ListItemIcon>
                                <ListItemText
                                  primary={text}
                                  sx={{ opacity: open ? 1 : 0 }}
                                />
                              </ListItemButton>
                            </ListItem>
                          </Tooltip>
                        ) : (
                          <ListItem
                            key={text}
                            disablePadding
                            sx={{
                              display: "block",
                            }}
                            onClick={() => handleSelectedIndexChange(index)}
                          >
                            <ListItemButton
                              className={`${
                                selectedIndex === index ? " text-primary" : ""
                              } `}
                              sx={{
                                borderRadius: 3,
                                minHeight: 48,
                                justifyContent: open ? "initial" : "center",
                                px: 2.5,
                              }}
                            >
                              <ListItemIcon
                                sx={{
                                  color:
                                    selectedIndex === index
                                      ? "#126AAE"
                                      : "blueViolet",
                                  minWidth: 0,
                                  mr: open ? 3 : "auto",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                {index === icons.length - 1 ? (
                                  <Badge
                                    badgeContent={
                                      employeNotifications.length === 0
                                        ? null
                                        : employeNotifications.length
                                    }
                                    color={
                                      selectedIndex === icons.length - 1
                                        ? "secondary"
                                        : "primary"
                                    }
                                  >
                                    {icons[index]}
                                  </Badge>
                                ) : (
                                  icons[index]
                                )}
                              </ListItemIcon>
                              <ListItemText
                                primary={text}
                                sx={{
                                  opacity: open ? 1 : 0,
                                }}
                              />
                            </ListItemButton>
                          </ListItem>
                        )}
                      </div>
                    ))}
                  </List>
                </Drawer>
                <Box
                  component="main"
                  className={`w-100 
               ${appTheme === "light" ? "text-bg-light" : "text-bg-dark"}
              `}
                >
                  <DrawerHeader />
                  <div className="mb-1"></div>
                  <div className=" min-vh-100  overflow-x-scroll">
                    {components[selectedIndex]}
                  </div>
                </Box>
              </Box>
            </div>
            <SwipeableDrawer
              anchor="right"
              open={profileClicked}
              onClose={handleCloseProfile}
              onOpen={() => null}
              sx={{
                borderRadius: 10,
              }}
            >
              <Box
                className={`p-3 `}
                sx={{
                  width: 350,
                  marginTop: 6,
                  flex: 1,
                  backgroundColor: appTheme === "light" ? "white" : "#121212",
                }}
              >
                <IconButton onClick={handleCloseProfile}>
                  <CancelIcon fontSize="large" color="info" />
                </IconButton>
                <center className="mt-2">
                  <Avatar
                    alt="Remy Sharp"
                    src={`http://localhost:8888/EMPLOYE-SERVICE/employes/image-profile/${authenticatedUser.employeId}`}
                    sx={{ width: 120, height: 120 }}
                  />
                  <Tooltip title="modifier l'image du profil">
                    <IconButton
                      component="label"
                      tabIndex={-1}
                      sx={{ position: "relative", top: -32, right: -50 }}
                    >
                      <EditIcon color="primary" />
                      <VisuallyHiddenInput
                        name="file"
                        onChange={handleUpdateImageProfile}
                        type="file"
                      />
                    </IconButton>
                  </Tooltip>
                </center>
                <ProfileItem
                  itemName="email"
                  icon={<MailOutlineOutlinedIcon color="primary" />}
                  value={employeInfos?.email}
                  key={employeInfos?.email}
                />
                <ProfileItem
                  itemName="tel"
                  icon={<PhoneOutlinedIcon color="primary" />}
                  value={employeInfos?.tel}
                  key={employeInfos?.tel}
                />
                <ProfileItem
                  itemName="adresse"
                  icon={<AlternateEmailOutlinedIcon color="primary" />}
                  value={employeInfos?.adresse}
                  key={employeInfos?.adresse}
                />
                <ProfileItem
                  itemName="region"
                  icon={<SouthAmericaOutlinedIcon color="primary" />}
                  value={employeInfos?.region?.label}
                  key={employeInfos?.region?.label}
                />
                {employeInfos?.situationFamiliale !== "MARIE" && (
                  <ProfileItem
                    itemName="situationFamiliale"
                    icon={<FamilyRestroomIcon color="primary" />}
                    value={employeInfos?.situationFamiliale}
                    key={employeInfos?.situationFamiliale}
                  />
                )}
              </Box>
              <CustomSnackBar
                isOpen={showSnackBar}
                duration={4000}
                onClose={handleCloseSnackBar}
                type="info"
                message={`image de profile modifie avec succes!`}
              />
            </SwipeableDrawer>
          </UserRoleContext.Provider>
        </ReloadingProfileContext.Provider>
      </AuthenticatedUserContext.Provider>
    </AppThemeContext.Provider>
  );
};

export default AdminMainPage;
