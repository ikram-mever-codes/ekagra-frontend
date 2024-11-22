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
import {
  createPreparationField,
  getAllPreparationFields,
  editPreparationFieldFunc,
  deletePreparationField,
} from "../../api";

const PreparationFieldManagementPage = () => {
  const [preparationFields, setPreparationFields] = useState([]);
  const [open, setOpen] = useState(false);
  const [editPreparationField, setEditPreparationField] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedPreparationField, setSelectedPreparationField] =
    useState(null);

  const validationSchema = Yup.object({
    name: Yup.string().required("Preparation field name is required"),
  });
  console.log(preparationFields);
  const formik = useFormik({
    initialValues: {
      name: editPreparationField ? editPreparationField.name : "",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      if (editPreparationField) {
        await editPreparationFieldFunc(editPreparationField._id, values.name);
        setPreparationFields((prevFields) =>
          prevFields.map((field) =>
            field._id === editPreparationField._id
              ? { ...field, ...values }
              : field
          )
        );
      } else {
        await createPreparationField(
          values.name,
          values.description,
          values.value
        );
        setPreparationFields((prev) => [
          ...prev,
          {
            name: values.name,
          },
        ]);
      }
      setOpen(false);
    },
  });

  const handleOpenMenu = (event, field) => {
    setMenuAnchor(event.currentTarget);
    setSelectedPreparationField(field);
  };

  const handleCloseMenu = () => {
    setMenuAnchor(null);
  };

  const handleAddPreparationField = () => {
    setEditPreparationField(null);
    formik.resetForm();
    setOpen(true);
  };

  const handleEditPreparationField = () => {
    setEditPreparationField(selectedPreparationField);
    formik.setValues({
      name: selectedPreparationField.name,
      description: selectedPreparationField.description,
      value: selectedPreparationField.value,
    });
    setOpen(true);
    handleCloseMenu();
  };

  const handleDeletePreparationField = async () => {
    if (
      window.confirm("Are you sure you want to delete this preparation field?")
    ) {
      await deletePreparationField(selectedPreparationField._id);
      setPreparationFields((prev) =>
        prev.filter((field) => field._id !== selectedPreparationField._id)
      );
    }
    handleCloseMenu();
  };

  const fetchAllPreparationFields = async () => {
    const fields = await getAllPreparationFields();
    setPreparationFields(fields || []);
  };

  useEffect(() => {
    fetchAllPreparationFields();
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
          Manage Preparation Fields
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddPreparationField}
          sx={{ display: "flex", alignItems: "center" }}
        >
          <Add sx={{ fontSize: "18px" }} /> Add Preparation Field
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
                sx={{
                  fontWeight: "bold",
                  backgroundColor: theme.palette.grey[100],
                  padding: "16px",
                }}
              >
                Field Name
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
            {preparationFields.map((field) => (
              <TableRow
                key={field._id}
                hover
                sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}
              >
                <TableCell sx={{ padding: "16px" }}>{field.name}</TableCell>
                <TableCell align="right" sx={{ padding: "16px" }}>
                  <Tooltip title="Options">
                    <IconButton
                      onClick={(event) => handleOpenMenu(event, field)}
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
        <MenuItem onClick={handleEditPreparationField}>
          <Edit fontSize="small" sx={{ mr: 1 }} /> Edit
        </MenuItem>
        <MenuItem onClick={handleDeletePreparationField}>
          <Delete fontSize="small" sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          {editPreparationField ? "Edit Field" : "Add Field"}
        </DialogTitle>
        <DialogContent sx={{ pb: 2 }}>
          <form onSubmit={formik.handleSubmit}>
            <TextField
              label="Field Name"
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
            <DialogActions>
              <Button onClick={() => setOpen(false)} variant="outlined">
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary">
                {editPreparationField ? "Save" : "Add"}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default PreparationFieldManagementPage;
