"use client";
import React, { useState, useEffect } from "react";
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
  FormControl,
  InputLabel,
  Tooltip,
  Select,
  TextField,
  MenuItem as SelectMenuItem,
} from "@mui/material";
import theme from "@/app/theme";
import { Add, Edit, Delete, MoreVert } from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  createBranch,
  getAllBranches,
  editBranchFunc,
  deleteBranch,
  getAllCities,
} from "../../api";

const BranchManagementPage = () => {
  const [branches, setBranches] = useState([]);
  const [cities, setCities] = useState([]);
  const [open, setOpen] = useState(false);
  const [editBranch, setEditBranch] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const branchData = await getAllBranches();
      const cityData = await getAllCities();
      setBranches(branchData || []);
      setCities(cityData.cities || []);
    };
    fetchData();
  }, []);

  const formik = useFormik({
    initialValues: {
      name: editBranch ? editBranch.name : "",
      code: editBranch ? editBranch.code : "",
      city: editBranch ? editBranch.city : { id: "", name: "" },
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Branch name is required"),
      code: Yup.string().required("Branch code is required"),
      city: Yup.object({
        id: Yup.string().required("City ID is required"),
        name: Yup.string().required("City name is required"),
      }).required("City is required"),
    }),
    enableReinitialize: true,
    onSubmit: async (values) => {
      if (editBranch) {
        await editBranchFunc(
          editBranch._id,
          values.name,
          values.code,
          values.city
        );
        setBranches((prev) =>
          prev.map((branch) =>
            branch._id === editBranch._id ? { ...branch, ...values } : branch
          )
        );
      } else {
        const newBranch = await createBranch(
          values.name,
          values.code,
          values.city
        );
        setBranches((prev) => [
          ...prev,
          { name: values.name, code: values.code, city: values.city },
        ]);
      }
      setOpen(false);
    },
  });

  const handleCityChange = (event) => {
    const selectedCity = cities.find((city) => city._id === event.target.value);
    formik.setFieldValue("city", {
      id: selectedCity._id,
      name: selectedCity.name,
    });
  };

  const handleOpenMenu = (event, branch) => {
    setMenuAnchor(event.currentTarget);
    setSelectedBranch(branch);
  };

  const handleCloseMenu = () => {
    setMenuAnchor(null);
  };

  const handleAddBranch = () => {
    setEditBranch(null);
    setOpen(true);
  };

  const handleEditBranch = () => {
    setEditBranch(selectedBranch);
    setOpen(true);
    handleCloseMenu();
  };

  const handleDeleteBranch = async () => {
    if (window.confirm("Are you sure you want to delete this branch?")) {
      await deleteBranch(selectedBranch._id);
      setBranches((prev) =>
        prev.filter((branch) => branch._id !== selectedBranch._id)
      );
    }
    handleCloseMenu();
  };

  return (
    <Box sx={{ p: 4, minHeight: "100vh" }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Typography variant="h2" color="primary">
          Manage Branches
        </Typography>
        <Button
          onClick={handleAddBranch}
          variant="contained"
          color="primary"
          startIcon={<Add />}
        >
          Add Branch
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
                Branch Name
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
                className="text-center"
                sx={{
                  fontWeight: "bold",
                  backgroundColor: theme.palette.grey[100],
                  padding: "16px",
                }}
              >
                City
              </TableCell>
              <TableCell
                className="text-right"
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
            {branches.map((branch) => (
              <TableRow key={branch._id}>
                <TableCell className="text-center">{branch.name}</TableCell>
                <TableCell className="text-center">{branch.code}</TableCell>
                <TableCell className="text-center">
                  {branch.city.name}
                </TableCell>
                <TableCell className="text-right">
                  <IconButton
                    onClick={(event) => handleOpenMenu(event, branch)}
                  >
                    <MoreVert />
                  </IconButton>
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
        <MenuItem onClick={handleEditBranch}>
          <Edit fontSize="small" /> Edit
        </MenuItem>
        <MenuItem onClick={handleDeleteBranch}>
          <Delete fontSize="small" /> Delete
        </MenuItem>
      </Menu>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>{editBranch ? "Edit Branch" : "Add Branch"}</DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <TextField
              label="Branch Name"
              fullWidth
              variant="outlined"
              margin="dense"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
            <TextField
              label="Branch Code"
              fullWidth
              variant="outlined"
              margin="dense"
              name="code"
              value={formik.values.code}
              onChange={formik.handleChange}
              error={formik.touched.code && Boolean(formik.errors.code)}
              helperText={formik.touched.code && formik.errors.code}
            />
            <FormControl fullWidth variant="outlined" margin="dense">
              <InputLabel>City</InputLabel>
              <Select
                name="city"
                value={formik.values.city.id}
                onChange={handleCityChange}
                error={formik.touched.city && Boolean(formik.errors.city)}
                label="City"
              >
                {cities.map((city) => (
                  <SelectMenuItem key={city._id} value={city._id}>
                    {city.name}
                  </SelectMenuItem>
                ))}
              </Select>
              {formik.touched.city && formik.errors.city && (
                <Typography color="error">{formik.errors.city}</Typography>
              )}
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setOpen(false)}
              variant="outlined"
              sx={{ fontWeight: 500 }}
            >
              Cancel
            </Button>
            <Button type="submit" color="primary" variant="contained">
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default BranchManagementPage;
