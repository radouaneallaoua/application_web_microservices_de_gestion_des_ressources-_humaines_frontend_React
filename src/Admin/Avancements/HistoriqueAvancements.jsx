import {
  Box,
  Button,
  CircularProgress,
  circularProgressClasses,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
} from "@mui/material";
import axios from "axios";
import React, { createContext, Suspense, useContext, useEffect, useState } from "react";
import CustomSnackBar from "../CustomSnackBar";
import { AuthenticatedUserContext } from "../../App";

const HistoriqueAvancement = React.lazy(() => import("./HistoriqueAvancement"));
export const DeleteAvancementIdContext = createContext();
export const EditAvancementIdContext = createContext();
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const HistoriqueAvancements = ({ employe }) => {
  const authenticatedUser = useContext(AuthenticatedUserContext)[0];
  const [employeAvancements, setEmployeAvancements] = useState([]);
  const [loadingDone, setLoadingDone] = useState(false);
  const [deleteAvancementId, setDeleteAvancementId] = useState(null);
  const [editAvancementId, setEditAvancementId] = useState(null);
  const [deleteSnackBarOpen, setDeleteSnackBarOpen] = useState(false);
  const handleDeleteSnackBarClose = () => {
    setDeleteSnackBarOpen(false);
  };
  const handleDeleteSnackBarOpen = () => {
    setDeleteSnackBarOpen(true);
  };

  useEffect(() => {
    const fetchAvancements = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8888/AVANCEMENT-SERVICE/avancements/employe/${employe.id}`, {
          headers: {
            Authorization: `Bearer ${authenticatedUser["access-token"]}`,
          },
        }
        );
        setEmployeAvancements(response.data);
        setLoadingDone(true);
      } catch (err) {
        console.log(err);
      }
    };

    fetchAvancements();
  }, [employe.id]);

  const handleDeleteAvancementIdClose = () => setDeleteAvancementId(null);
  const handleEditAvancementIdClose = () => setEditAvancementId(null);
  const handleDeleteAvancement = async () => {
    try {
      await axios.delete(
        `http://localhost:8888/AVANCEMENT-SERVICE/avancements/${deleteAvancementId}`, {
        headers: {
          Authorization: `Bearer ${authenticatedUser["access-token"]}`,
        },
      }
      );
      handleDeleteSnackBarOpen();
      handleDeleteAvancementIdClose();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Suspense
      fallback={
        <div>
          <Box sx={{ position: "relative", mr: 1 }}>
            <CircularProgress
              variant="indeterminate"
              disableShrink
              sx={{
                color: (theme) =>
                  theme.palette.mode === "light" ? "#1a90ff" : "#308fe8",
                animationDuration: "600ms",
                position: "absolute",
                left: 0,
                [`& .${circularProgressClasses.circle}`]: {
                  strokeLinecap: "round",
                },
              }}
              size={30}
              thickness={4}
            />
          </Box>
        </div>
      }
    >
      <DeleteAvancementIdContext.Provider
        value={[deleteAvancementId, setDeleteAvancementId]}
      >
        <EditAvancementIdContext.Provider
          value={[editAvancementId, setEditAvancementId]}
        >
          {" "}
          {!loadingDone ? (
            <Box sx={{ position: "relative", mr: 1 }}>
              <CircularProgress
                variant="indeterminate"
                disableShrink
                sx={{
                  color: (theme) =>
                    theme.palette.mode === "light" ? "#1a90ff" : "#308fe8",
                  animationDuration: "600ms",
                  position: "absolute",
                  left: 0,
                  [`& .${circularProgressClasses.circle}`]: {
                    strokeLinecap: "round",
                  },
                }}
                size={30}
                thickness={4}
              />
            </Box>
          ) : employeAvancements.length === 0 ? (
            <center className="mt-2 fw-bold  text-secondary">
              {" "}
              Aucun avancement pour cet employé
            </center>
          ) : (
            <>
              {" "}
              <div className="row ms-2 fw-bold mt-3 fs-5">
                <div className="col-md">
                  Historique des avancements de l'employé{" "}
                  <span className="text-secondary fs-4">
                    {employe.nom}{" "} {employe.prenom}
                  </span>
                  ( {employeAvancements.length} avancements )
                </div>
              </div>
              {employeAvancements.map((avan) => (
                <HistoriqueAvancement avancement={avan} key={avan.id} />
              ))}
            </>
          )}
          <Dialog
            open={deleteAvancementId != null}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleDeleteAvancementIdClose}
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle>Etês-vous sûr de supprimer l'avancement</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description"></DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleDeleteAvancementIdClose}
                color="secondary"
                variant="text"
              >
                Annuler
              </Button>
              <Button
                onClick={handleDeleteAvancement}
                color="error"
                variant="contained"
              >
                Confirmer
              </Button>
            </DialogActions>
          </Dialog>
          <CustomSnackBar
            isOpen={deleteSnackBarOpen}
            duration={4000}
            onClose={handleDeleteSnackBarClose}
            type="error"
            message={" Avancement supprime avec succes!"}
          />
        </EditAvancementIdContext.Provider>
      </DeleteAvancementIdContext.Provider>
    </Suspense>
  );
};

export default React.memo(HistoriqueAvancements, (prevProps, nextProps) => Object.is(prevProps, nextProps));

