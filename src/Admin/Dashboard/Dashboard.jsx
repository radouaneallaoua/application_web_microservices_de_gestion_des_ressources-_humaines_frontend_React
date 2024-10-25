import React, { createContext, useContext, useEffect, useState } from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge";
import "../../App.css";
import DashboardItem from "./DashboardItem";
import { AppThemeContext } from "../AdminMainPage";
import axios from "axios";
import { Box, CircularProgress, circularProgressClasses } from "@mui/material";
import dayjs from "dayjs";

import { AuthenticatedUserContext } from "../../App";

export const SharedDataContext = createContext();

const Dashboard = () => {
  const appTheme = useContext(AppThemeContext)[0];
  const [loading, setLoading] = useState(true);
  const authenticatedUser = useContext(AuthenticatedUserContext)[0];
  const [sharedData, setSharedData] = useState({
    employes: [],
    absences: [],
    conges: [],
    avancements: [],
    formations: [],
    paies: [],
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          employesResponse,
          absencesResponse,
          congesResponse,
          avancementsResponse,
          formationsResponse,
          paiesResponse,
        ] = await Promise.all([
          axios.get(`http://localhost:8888/EMPLOYE-SERVICE/employes`, {
            headers: {
              Authorization: `Bearer ${authenticatedUser["access-token"]}`,
            },
          }),
          axios.get(`http://localhost:8888/ABSENCE-SERVICE/absences`, {
            headers: {
              Authorization: `Bearer ${authenticatedUser["access-token"]}`,
            },
          }),
          axios.get(`http://localhost:8888/ABSENCE-SERVICE/conges`, {
            headers: {
              Authorization: `Bearer ${authenticatedUser["access-token"]}`,
            },
          }),
          axios.get(`http://localhost:8888/AVANCEMENT-SERVICE/avancements`, {
            headers: {
              Authorization: `Bearer ${authenticatedUser["access-token"]}`,
            },
          }),
          axios.get(`http://localhost:8888/FORMATION-SERVICE/formations`, {
            headers: {
              Authorization: `Bearer ${authenticatedUser["access-token"]}`,
            },
          }),
          axios.get(`http://localhost:8888/PAIE-SERVICE/paies`, {
            headers: {
              Authorization: `Bearer ${authenticatedUser["access-token"]}`,
            },
          }),
        ]);

        console.log("=====================ABSENCES============");
        console.table(congesResponse.data?.length);

        setSharedData((prev) => ({
          ...prev,
          employes: employesResponse.data.filter(
            (e) => e["id"] !== authenticatedUser.employeId
          ),
          absences: absencesResponse.data,
          conges: congesResponse.data,
          avancements: avancementsResponse.data,
          formations: formationsResponse.data,
          paies: paiesResponse.data,
        }));
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
    <SharedDataContext.Provider value={sharedData}>
      <div className={`container-fluid`}>
        <div className="container p-4">
          <div className="row column-gap-2">
            {[
              {
                nom: "Absences",
                color: appTheme === "light" ? "#D519B979" : "#D519B9B5",
                data: sharedData.absences,
              },
              {
                nom: "Congés",
                color: appTheme === "light" ? "#6589E3AB" : "#3968DFCE",
                data: sharedData.conges,
              },
              {
                nom: "Avancements",
                color: appTheme === "light" ? "#05D2D97D" : "#05D2D9C9",
                data: sharedData.avancements,
              },
              {
                nom: "Recrutements",
                color: appTheme === "light" ? "#F9DE108B" : "#F9DE10E5",
                data: sharedData.employes,
              },
            ].map((item) => (
              <DashboardItem
                key={item.nom}
                nom={item.nom}
                color={item.color}
                data={item.data}
              />
            ))}
          </div>
          <div className="row mt-4  ">
            <div
              className={`row ms-3 fw-bold  fs-4 ${
                appTheme === "light" ? "text-dark" : "text-light"
              }`}
            >
              Employés
            </div>
            <div className="row gap-3 p-3">
              <div className="col-md p-3 rounded-4  employe-dashboard">
                <PieChart
                  series={[
                    {
                      data: [
                        {
                          id: 0,
                          value: sharedData?.employes.filter(
                            (e) => e["genre"] === "HOMME"
                          )?.length,
                          label: "HOMME",
                        },
                        {
                          id: 1,
                          value: sharedData?.employes.filter(
                            (e) => e["genre"] === "FEMME"
                          )?.length,
                          label: "FEMME",
                        },
                      ],
                    },
                  ]}
                  height={300}
                />
              </div>
              <div className="col-md p-3 rounded-4  employe-dashboard ">
                <div className="row d-flex flex-column">
                  <center>
                    <Gauge
                      width={300}
                      height={250}
                      value={
                        sharedData.paies.filter((p) => {
                          const res = dayjs().diff(
                            dayjs(p["datePaiement"]),
                            "month"
                          );
                          return res === 0 && p;
                        })?.length
                      }
                      valueMax={sharedData.employes.length}
                      sx={{
                        [`& .${gaugeClasses.valueText}`]: {
                          fontSize: 40,
                          color: "#FFFFFF",
                          transform: "translate(1px, 1px)",
                        },
                      }}
                      text={({ value, valueMax }) => `${value} / ${valueMax}`}
                    />
                  </center>
                  <center
                    className={` fw-bold fs-4 ${
                      appTheme === "light" ? "text-dark" : "text-light"
                    } `}
                  >
                    Employés payés ce mois
                  </center>
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-4 p-3  rounded-4  formation-dashboard">
            <div className="row ms-3 fw-bold text-light fs-4">Formations</div>

            <div className="row p-3">
              <div className="col-md-8 mx-auto">
                <PieChart
                  colors={["green", "orange"]}
                  series={[
                    {
                      data: [
                        {
                          id: 0,
                          value: sharedData.formations.filter((f) =>
                            dayjs().isAfter(dayjs(f["dateFin"]))
                          )?.length,
                          label: "formations terminées",
                          color: "green",
                        },
                        {
                          id: 1,
                          value:
                            sharedData.formations.length -
                            sharedData.formations.filter((f) =>
                              dayjs().isAfter(dayjs(f["dateFin"]))
                            )?.length,
                          label: "formations en cours",
                          color: "orange",
                        },
                      ],
                    },
                  ]}
                  height={300}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </SharedDataContext.Provider>
  );
};

export default React.memo(Dashboard, (prevProps, nextProps) =>
  Object.is(prevProps, nextProps)
);
