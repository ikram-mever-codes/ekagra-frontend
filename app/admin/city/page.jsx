"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Menu,
  MenuItem,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Tooltip,
} from "@mui/material";
import { Add, Edit, Delete, MoreVert } from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";
import theme from "../../theme";
import { createCity, getAllCities, editCityFunc, deleteCity } from "@/app/api";

const CityManagementPage = () => {
  // const [cities, setCities] = useState([{ id: 1, name: "Gaya", code: "GY" }]);
  const [cities, setCities] = useState([]);
  const [open, setOpen] = useState(false);
  const [editCity, setEditCity] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  const validationSchema = Yup.object({
    name: Yup.string().required("City name is required"),
    code: Yup.string().required("City code is required"),
  });

  const formik = useFormik({
    initialValues: {
      name: editCity ? editCity.name : "",
      code: editCity ? editCity.code : "",
    },
    validationSchema,
    onSubmit: async (values) => {
      if (editCity) {
        const newCity = await editCityFunc(
          editCity._id,
          values.name,
          values.code
        );
        setCities((prevCities) =>
          prevCities.map((city) =>
            city._id === editCity._id
              ? { ...city, name: values.name, code: values.code }
              : city
          )
        );
      } else {
        const newCity = {
          id: cities.length + 1,
          name: values.name,
          code: values.code,
        };
        await createCity(values.name, values.code);
        setCities((prev) => [...prev, newCity]);
      }
      setOpen(false);
    },
  });

  const handleOpenMenu = (event, city) => {
    setMenuAnchor(event.currentTarget);
    setSelectedCity(city);
  };

  const handleCloseMenu = () => {
    setMenuAnchor(null);
  };

  const handleAddCity = () => {
    setEditCity(null);
    formik.resetForm();
    setOpen(true);
  };

  const handleEditCity = () => {
    setEditCity(selectedCity);
    formik.setValues({ name: selectedCity.name, code: selectedCity.code });
    setOpen(true);
    handleCloseMenu();
  };

  const handleDeleteCity = async () => {
    if (window.confirm("Are you sure you want to delete this city?")) {
      await deleteCity(selectedCity._id);

      setCities((prev) => prev.filter((city) => city.id !== selectedCity._id));
    }

    handleCloseMenu();
  };

  const fetchAllCities = async () => {
    const cities = await getAllCities();
    setCities(cities.cities || []);
  };

  useEffect(() => {
    fetchAllCities();
  }, []);
  return (
    <Box sx={{ p: 4, minHeight: "100vh" }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Typography variant="h2" color="primary">
          Manage Cities
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddCity}
          sx={{ display: "flex", alignItems: "center" }}
        >
          <Add sx={{ fontSize: "18px" }} /> Add City
        </Button>
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          borderRadius: "12px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          backgroundColor: "white",
          border: "1px solid #e0e0e0",
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                className="text-center"
                sx={{
                  fontWeight: "bold",
                  backgroundColor: theme.palette.grey[100],
                  padding: "16px",
                }}
              >
                City Name
              </TableCell>
              <TableCell
                className="text-center"
                sx={{
                  fontWeight: "bold",
                  backgroundColor: theme.palette.grey[100],
                  padding: "16px",
                }}
              >
                Code
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  fontWeight: "bold",
                  backgroundColor: theme.palette.grey[100],
                  padding: "16px",
                }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cities.map((city) => (
              <TableRow
                key={city.id}
                hover
                sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}
              >
                <TableCell sx={{ padding: "16px" }} className="text-center">
                  {city.name}
                </TableCell>
                <TableCell sx={{ padding: "16px" }} className="text-center">
                  {city.code}
                </TableCell>
                <TableCell align="right" sx={{ padding: "16px" }}>
                  <Tooltip title="Options">
                    <IconButton
                      onClick={(event) => handleOpenMenu(event, city)}
                    >
                      <MoreVert />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={handleEditCity}>
          <Edit fontSize="small" sx={{ mr: 1 }} /> Edit
        </MenuItem>
        <MenuItem onClick={handleDeleteCity}>
          <Delete fontSize="small" sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>{editCity ? "Edit City" : "Add City"}</DialogTitle>
        <DialogContent sx={{ pb: 2 }}>
          <form onSubmit={formik.handleSubmit}>
            <TextField
              label="City Name"
              fullWidth
              variant="outlined"
              margin="dense"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              sx={{ mb: 2 }}
            />
            <TextField
              label="City Code"
              fullWidth
              variant="outlined"
              margin="dense"
              name="code"
              value={formik.values.code}
              onChange={formik.handleChange}
              error={formik.touched.code && Boolean(formik.errors.code)}
              helperText={formik.touched.code && formik.errors.code}
            />
            <DialogActions>
              <Button
                onClick={() => setOpen(false)}
                variant="outlined"
                sx={{ fontWeight: 500 }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ fontWeight: 600 }}
              >
                {editCity ? "Save" : "Add"}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default CityManagementPage;
