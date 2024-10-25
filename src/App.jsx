import React, { createContext, useEffect, useState } from "react";
import AdminMainPage from "./Admin/AdminMainPage";
import Login from "./component/Login";
import "bootstrap/dist/css/bootstrap.min.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SignUp from "./component/SignUp";
import Home from "./component/Home";
import NotFound from "./component/NotFound";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "admin",
    element: <AdminMainPage />,
  },
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "signup",
    element: <SignUp />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export const AuthenticatedUserContext = createContext();
export const AuthenticatedEmployeInfosContext = createContext();

function App() {
  const [authenticatedUser, setAuthenticatedUser] = useState({
    employeId: undefined,
    role: undefined,
    "access-token": "",
    isAuthenticated: false,
  });
  const [authenticatedEmployeInfos, setAuthenticatedEmployeInfos] = useState(
    {}
  );

  useEffect(() => {
    let res = window.localStorage.getItem("access-token");
    if (res !== undefined) {
      let accessToken = res;
      const decodedToken = jwtDecode(accessToken);
      let employeId = decodedToken["sub"].slice(
        decodedToken["sub"].lastIndexOf("::") + 2
      );
      let role = decodedToken["scope"];
      setAuthenticatedUser({
        isAuthenticated: true,
        employeId: employeId,
        role: role,
        "access-token": accessToken,
      });
      const fetchAuthenticatedUserInfos = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8888/EMPLOYE-SERVICE/employes/${employeId}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          console.log("//////////////RECOVERY            ////////////");
          console.table(response.data);
          setAuthenticatedEmployeInfos(response.data);
        } catch (err) {
          console.log(err);
        }
      };
      fetchAuthenticatedUserInfos();
    }
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
          setAuthenticatedEmployeInfos(response.data);
        } catch (err) {
          console.log(err);
        }
      };
      if (authenticatedUser.isAuthenticated) {
        fetchAuthenticatedUserInfos();
      }
    }
  }, [authenticatedUser]);

  return (
    <AuthenticatedUserContext.Provider
      value={[authenticatedUser, setAuthenticatedUser]}
    >
      <AuthenticatedEmployeInfosContext.Provider
        value={[authenticatedEmployeInfos, setAuthenticatedEmployeInfos]}
      >
        <RouterProvider router={router} />
      </AuthenticatedEmployeInfosContext.Provider>
    </AuthenticatedUserContext.Provider>
  );
}
export default App;
