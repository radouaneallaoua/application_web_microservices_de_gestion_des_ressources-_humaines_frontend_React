import {
  ExpandLess,
  ExpandMore,
  InboxOutlined,
  SendAndArchiveOutlined,
  StarBorder,
} from "@mui/icons-material";
import {
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  ListSubheader,
} from "@mui/material";
import React, { useContext, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { DeleteEntiteIdContext, EditEntiteIdContext } from "./Entites";


const Entite = ({ entite, subEntites, entites, types }) => {
  const [editEntiteId, setEditEntiteId] = useContext(EditEntiteIdContext);
  const setDeleteEntiteId = useContext(DeleteEntiteIdContext)[1];
  const [open, setOpen] = useState(false);

  const [updateFormState, setUpdateFormState] = useState({
    name: "",
    typeId: "None",
    entiteMereId: "None",
  });

  const handleUpdateFormChange = (e) => {
    const { name, value } = e.target;
    setUpdateFormState((pre) => ({ ...pre, [name]: value }));
  };

  const handleClick = () => {
    setOpen(!open);
  };

  const handleDeleteEntite = (entiteId) => {
    setDeleteEntiteId(entiteId);
  };
  const handleEditEntite = (entiteId) => {
    setEditEntiteId(entiteId);
    const foundEntite = entites.find((e) => e["id"] === entiteId);
    setUpdateFormState({
      name: foundEntite?.name,
      typeId: foundEntite?.typeId,
      entiteMereId:
        foundEntite?.entiteMereId === null ? "None" : foundEntite?.entiteMereId,
    });
  };

  if (subEntites?.length === 0) {
    if (entite["entiteMereId"] !== null) {
      return;
    }

    return (
      <ListItem
        secondaryAction={
          entite["id"] === editEntiteId ? (
            <Button
              variant="text"
              sx={{ mt: 1 }}
              className="text-lowercase"
              color="warning"
              onClick={() => handleEditEntite(null)}
            >
              annuler
            </Button>
          ) : (
            <>
              <IconButton
                IconButton
                edge="end"
                aria-label="comments"
                sx={{ mr: 1 }}
                onClick={() => handleDeleteEntite(entite["id"])}
              >
                <DeleteIcon color="error" />
              </IconButton>
              <IconButton
                edge="end"
                aria-label="comments"
                onClick={() => handleEditEntite(entite["id"])}
              >
                <EditIcon color="success" />
              </IconButton>
            </>
          )
        }
        disablePadding
      >
        <ListItemButton className="rounded-3">
          <ListItemIcon>
            <SendAndArchiveOutlined />
          </ListItemIcon>
          <ListItemText
            primary={
              editEntiteId !== entite["id"] ? (
                entite?.name
              ) : (
                <form method="post">
                  <div className="row  mb-3">
                    <div className="col-md-4">
                      <TextField
                        sx={{ width: "100%" }}
                        id="outlined-basic"
                        //error={error.hasError}
                        label="Name"
                        name="name"
                        //helperText={error.message}
                        value={updateFormState.name}
                        onChange={handleUpdateFormChange}
                        variant="outlined"
                        className="me-2"
                      />
                    </div>
                    <div className="col-md-3">
                      <FormControl sx={{ width: "100%" }}>
                        <InputLabel id="demo-multiple-name-label">
                          Type
                        </InputLabel>
                        <Select
                          labelId="demo-multiple-name-label"
                          id="demo-multiple-name"
                          name="typeId"
                          value={updateFormState.typeId}
                          onChange={handleUpdateFormChange}
                          input={<OutlinedInput label="Type" />}
                        >
                          {types.map((c) => (
                            <MenuItem key={c.id} value={c.id}>
                              {c.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                    <div className="col-md-3">
                      <FormControl sx={{ width: "100%" }}>
                        <InputLabel htmlFor="grouped-select">
                          Entite superieure
                        </InputLabel>
                        <Select
                          id="grouped-select"
                          label="Entite superieure"
                          name="entiteMereId"
                          value={updateFormState.entiteMereId || "None"}
                          onChange={handleUpdateFormChange}
                        >
                          {types.map((t) => {
                            return (
                              <div>
                                <ListSubheader className="fw-bold text-info">
                                  {t["label"]}
                                </ListSubheader>
                                {entites
                                  .filter((e) => e["typeId"] === t["id"])
                                  ?.map((item) => {
                                    return (
                                      <MenuItem value={item.id} key={item.id}>
                                        {item["name"]}
                                      </MenuItem>
                                    );
                                  })}
                              </div>
                            );
                          })}
                        </Select>
                      </FormControl>
                    </div>
                    <div className="col-md-2 mt-2">
                      <Button
                        color="primary"
                        variant="contained"
                        type="submit"
                        sx={{ textTransform: "lowercase" }}
                      >
                        modifier
                      </Button>
                    </div>
                  </div>
                </form>
              )
            }
          />
        </ListItemButton>
      </ListItem>
    );
  }
  return (
    <>
      <ListItem
        secondaryAction={
          entite["id"] === editEntiteId ? (
            <Button
              variant="text"
              sx={{ mt: 1 }}
              className="text-lowercase"
              color="warning"
              onClick={() => handleEditEntite(null)}
            >
              annuler
            </Button>
          ) : (
            <>
              <IconButton
                IconButton
                edge="end"
                aria-label="comments"
                sx={{ mr: 1 }}
                onClick={() => handleDeleteEntite(entite["id"])}
              >
                <DeleteIcon color="error" />
              </IconButton>
              <IconButton
                edge="end"
                aria-label="comments"
                onClick={() => handleEditEntite(entite["id"])}
              >
                <EditIcon color="success" />
              </IconButton>
            </>
          )
        }
        disablePadding
      >
        <ListItemButton onClick={handleClick} className="rounded-3">
          <ListItemIcon>
            <InboxOutlined />
          </ListItemIcon>
          <ListItemText
            primary={
              editEntiteId !== entite["id"] ? (
                entite?.name
              ) : (
                <form method="post">
                  <div className="row  mb-3">
                    <div className="col-md-4">
                      <TextField
                        sx={{ width: "100%" }}
                        id="outlined-basic"
                        //error={error.hasError}
                        label="Name"
                        name="name"
                        //helperText={error.message}
                        value={updateFormState.name}
                        onChange={handleUpdateFormChange}
                        variant="outlined"
                        className="me-2"
                      />
                    </div>
                    <div className="col-md-3">
                      <FormControl sx={{ width: "100%" }}>
                        <InputLabel id="demo-multiple-name-label">
                          Type
                        </InputLabel>
                        <Select
                          labelId="demo-multiple-name-label"
                          id="demo-multiple-name"
                          name="typeId"
                          value={updateFormState.typeId}
                          onChange={handleUpdateFormChange}
                          input={<OutlinedInput label="Type" />}
                        >
                          {types.map((c) => (
                            <MenuItem key={c.id} value={c.id}>
                              {c.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                    <div className="col-md-3">
                      <FormControl sx={{ width: "100%" }}>
                        <InputLabel htmlFor="grouped-select">
                          Entite superieure
                        </InputLabel>
                        <Select
                          id="grouped-select"
                          label="Entité superieure"
                          name="entiteMereId"
                          value={updateFormState.entiteMereId || "None"}
                          onChange={handleUpdateFormChange}
                        >
                          {types.map((t) => {
                            return (
                              <div>
                                <ListSubheader className="fw-bold text-info">
                                  {t["label"]}
                                </ListSubheader>
                                {entites
                                  .filter((e) => e["typeId"] === t["id"])
                                  ?.map((item) => {
                                    return (
                                      <MenuItem value={item.id} key={item.id}>
                                        {item["name"]}
                                      </MenuItem>
                                    );
                                  })}
                              </div>
                            );
                          })}
                        </Select>
                      </FormControl>
                    </div>
                    <div className="col-md-2 mt-2">
                      <Button
                        color="primary"
                        variant="contained"
                        type="submit"
                        sx={{ textTransform: "lowercase" }}
                      >
                        modifier
                      </Button>
                    </div>
                  </div>
                </form>
              )
            }
          />
          {open ? <ExpandLess sx={{ mr: 5 }} /> : <ExpandMore sx={{ mr: 5 }} />}
        </ListItemButton>
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {subEntites?.map((subEntite) => (
            <ListItem
              secondaryAction={
                subEntite["id"] === editEntiteId ? (
                  <Button
                    variant="text"
                    sx={{ mt: 1 }}
                    className="text-lowercase"
                    color="warning"
                    onClick={() => handleEditEntite(null)}
                  >
                    annuler
                  </Button>
                ) : (
                  <>
                    <IconButton
                      IconButton
                      edge="end"
                      aria-label="comments"
                      sx={{ mr: 1 }}
                      onClick={() => handleDeleteEntite(subEntite["id"])}
                    >
                      <DeleteIcon color="error" />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="comments"
                      onClick={() => handleEditEntite(subEntite["id"])}
                    >
                      <EditIcon color="success" />
                    </IconButton>
                  </>
                )
              }
              disablePadding
            >
              <ListItemButton sx={{ pl: 4 }} className="rounded-3">
                <ListItemIcon>
                  <StarBorder />
                </ListItemIcon>
                <ListItemText
                  primary={
                    editEntiteId !== subEntite["id"] ? (
                      subEntite?.name
                    ) : (
                      <form method="post">
                        <div className="row  mb-3">
                          <div className="col-md-4">
                            <TextField
                              sx={{ width: "100%" }}
                              id="outlined-basic"
                              //error={error.hasError}
                              label="Name"
                              name="name"
                              //helperText={error.message}
                              value={updateFormState.name}
                              onChange={handleUpdateFormChange}
                              variant="outlined"
                              className="me-2"
                            />
                          </div>
                          <div className="col-md-3">
                            <FormControl sx={{ width: "100%" }}>
                              <InputLabel id="demo-multiple-name-label">
                                Type
                              </InputLabel>
                              <Select
                                labelId="demo-multiple-name-label"
                                id="demo-multiple-name"
                                name="typeId"
                                value={updateFormState.typeId}
                                onChange={handleUpdateFormChange}
                                input={<OutlinedInput label="Type" />}
                              >
                                {types.map((c) => (
                                  <MenuItem key={c.id} value={c.id}>
                                    {c.label}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </div>
                          <div className="col-md-3">
                            <FormControl sx={{ width: "100%" }}>
                              <InputLabel htmlFor="grouped-select">
                                Entite superieure
                              </InputLabel>
                              <Select
                                id="grouped-select"
                                label="Entite superieure"
                                name="entiteMereId"
                                value={updateFormState.entiteMereId || "None"}
                                onChange={handleUpdateFormChange}
                              >
                                {types.map((t) => {
                                  return (
                                    <div>
                                      <ListSubheader className="fw-bold text-info">
                                        {t["label"]}
                                      </ListSubheader>
                                      {entites
                                        .filter((e) => e["typeId"] === t["id"])
                                        ?.map((item) => {
                                          return (
                                            <MenuItem value={item["id"]}>
                                              {item["name"]}
                                            </MenuItem>
                                          );
                                        })}
                                    </div>
                                  );
                                })}
                              </Select>
                            </FormControl>
                          </div>
                          <div className="col-md-2 mt-2">
                            <Button
                              color="primary"
                              variant="contained"
                              type="submit"
                              sx={{ textTransform: "lowercase" }}
                            >
                              modifier
                            </Button>
                          </div>
                        </div>
                      </form>
                    )
                  }
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Collapse>
    </>
  );
};

export default React.memo(Entite, (prevProps, nextProps) => Object.is(prevProps, nextProps));

