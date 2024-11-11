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
  TextField,
  Tooltip,
  Select,
  MenuItem as MuiMenuItem,
  InputLabel,
  FormControl,
  FormHelperText,
} from "@mui/material";
import theme from "@/app/theme.js";
import { Add, Edit, Delete, MoreVert } from "@mui/icons-material";
import {
  createBatch,
  getAllBatches,
  editBatchFunc,
  deleteBatch,
  getAllCourses,
} from "../../api.js";
import { toast } from "react-toastify";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

const BatchManagementPage = () => {
  const [batches, setBatches] = useState([]);
  const [open, setOpen] = useState(false);
  const [editBatch, setEditBatch] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchBatches = async () => {
      const batchesData = await getAllBatches();
      const coursesData = await getAllCourses();
      setBatches(batchesData.batches || []);
      setCourses(coursesData.courses || []);
    };
    fetchBatches();
  }, []);

  const handleOpenMenu = (event, batch) => {
    setMenuAnchor(event.currentTarget);
    setSelectedBatch(batch);
  };

  const handleCloseMenu = () => {
    setMenuAnchor(null);
  };

  const handleAddBatch = () => {
    setEditBatch(null);
    setOpen(true);
  };

  const handleEditBatch = () => {
    setEditBatch(selectedBatch);
    setOpen(true);
    handleCloseMenu();
  };

  const handleDeleteBatch = async () => {
    if (window.confirm("Are you sure you want to delete this batch?")) {
      const response = await deleteBatch(selectedBatch._id);
      if (response) {
        setBatches((prev) =>
          prev.filter((batch) => batch._id !== selectedBatch._id)
        );
      }
    }
    handleCloseMenu();
  };

  const handleSaveBatch = async (values) => {
    const { batchName, course, availableSeats, totalSeats } = values;

    if (editBatch) {
      const response = await editBatchFunc(
        editBatch._id,
        batchName,
        { name: course.name, id: course._id },
        totalSeats
      );
      if (response) {
        setBatches((prev) =>
          prev.map((batch) =>
            batch._id === editBatch._id
              ? {
                  ...batch,
                  name: batchName,
                  course,
                  availableSeats,
                  totalSeats,
                }
              : batch
          )
        );
      }
    } else {
      const response = await createBatch(
        batchName,
        { name: course.name, id: course._id },
        totalSeats
      ); // Use course._id here as well
      if (response) {
        setBatches([
          ...batches,
          {
            id: batches.length + 1,
            name: batchName,
            course: { id: course._id, name: course.name },
            availableSeats,
            totalSeats,
          },
        ]);
      }
    }
    setOpen(false);
  };

  const validationSchema = Yup.object({
    batchName: Yup.string().required("Batch Name is required"),
    course: Yup.object().shape({
      _id: Yup.string().required("Course is required"),
    }),
    totalSeats: Yup.number()
      .min(1, "Seats must be greater than 0")
      .required("Total Seats are required"),
  });

  return (
    <Box sx={{ p: 4, minHeight: "100vh" }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Typography variant="h2" color="primary">
          Manage Batches
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddBatch}
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <Add sx={{ fontSize: "18px" }} /> Add Batch
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
                Batch Name
              </TableCell>
              <TableCell
                className="text-center"
                sx={{
                  fontWeight: "bold",
                  backgroundColor: theme.palette.grey[100],
                  padding: "16px",
                }}
              >
                Course
              </TableCell>
              <TableCell
                className="text-center"
                sx={{
                  fontWeight: "bold",
                  backgroundColor: theme.palette.grey[100],
                  padding: "16px",
                }}
              >
                Available Seats
              </TableCell>
              <TableCell
                className="text-center"
                sx={{
                  fontWeight: "bold",
                  backgroundColor: theme.palette.grey[100],
                  padding: "16px",
                }}
              >
                Total Seats
              </TableCell>
              <TableCell
                className="text-center"
                sx={{
                  fontWeight: "bold",
                  backgroundColor: theme.palette.grey[100],
                  padding: "16px",
                }}
                align="right"
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {batches.map((batch) => (
              <TableRow key={batch.id}>
                <TableCell className="text-center">{batch.name}</TableCell>
                <TableCell className="text-center">
                  {batch.course.name}
                </TableCell>
                <TableCell className="text-center">
                  {batch.availableSeats}
                </TableCell>
                <TableCell className="text-center">
                  {batch.totalSeats}
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Options">
                    <IconButton
                      onClick={(event) => handleOpenMenu(event, batch)}
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
        <MenuItem onClick={handleEditBatch}>
          <Edit fontSize="small" sx={{ mr: 1 }} /> Edit
        </MenuItem>
        <MenuItem onClick={handleDeleteBatch}>
          <Delete fontSize="small" sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>{editBatch ? "Edit Batch" : "Add Batch"}</DialogTitle>
        <DialogContent>
          <Formik
            initialValues={{
              batchName: editBatch ? editBatch.name : "",
              course: editBatch ? editBatch.course : "",
              availableSeats: editBatch ? editBatch.availableSeats : "",
              totalSeats: editBatch ? editBatch.totalSeats : "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSaveBatch}
          >
            {({ values, handleChange, handleBlur, errors, touched }) => (
              <Form>
                <TextField
                  label="Batch Name"
                  fullWidth
                  variant="outlined"
                  margin="dense"
                  name="batchName"
                  value={values.batchName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.batchName && Boolean(errors.batchName)}
                  helperText={touched.batchName && errors.batchName}
                  sx={{ mb: 2 }}
                />
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Course</InputLabel>
                  <Select
                    name="course"
                    value={values.course ? values.course._id : ""}
                    onChange={(e) => {
                      const selectedCourse = courses.find(
                        (course) => course._id === e.target.value
                      );
                      handleChange({
                        target: { name: "course", value: selectedCourse },
                      });
                    }}
                    onBlur={handleBlur}
                    error={touched.course && Boolean(errors.course)}
                  >
                    {courses.map((course) => (
                      <MuiMenuItem key={course._id} value={course._id}>
                        {course.name}
                      </MuiMenuItem>
                    ))}
                  </Select>
                  <FormHelperText error>
                    {touched.course && errors.course && errors.course._id}
                  </FormHelperText>
                </FormControl>
                <TextField
                  label="Available Seats"
                  fullWidth
                  variant="outlined"
                  margin="dense"
                  type="number"
                  name="availableSeats"
                  value={values.availableSeats}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={
                    touched.availableSeats && Boolean(errors.availableSeats)
                  }
                  helperText={touched.availableSeats && errors.availableSeats}
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Total Seats"
                  fullWidth
                  variant="outlined"
                  margin="dense"
                  type="number"
                  name="totalSeats"
                  value={values.totalSeats}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.totalSeats && Boolean(errors.totalSeats)}
                  helperText={touched.totalSeats && errors.totalSeats}
                  sx={{ mb: 2 }}
                />
                <DialogActions>
                  <Button
                    onClick={() => setOpen(false)}
                    color="secondary"
                    variant="outlined"
                    className="border border-solid border-black"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" color="primary" variant="contained">
                    Save
                  </Button>
                </DialogActions>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default BatchManagementPage;
