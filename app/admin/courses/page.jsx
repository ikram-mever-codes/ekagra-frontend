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
  Select,
  MenuItem as MuiMenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { Add, Edit, Delete, MoreVert } from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";
import theme from "../../theme";
import {
  createCourse,
  getAllCourses,
  editCourseFunc,
  deleteCourse,
  getAllPreparationFields,
} from "@/app/api";

const CourseManagementPage = () => {
  const [courses, setCourses] = useState([]);
  const [open, setOpen] = useState(false);
  const [editCourse, setEditCourse] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [preparationFields, setPreparationFields] = useState([]);

  const validationSchema = Yup.object({
    name: Yup.string().required("Course name is required"),
    description: Yup.string().required("Description is required"),
    price: Yup.number()
      .required("Price is required")
      .positive("Price must be a positive number"),
    preparation: Yup.object().required("Preparation field is required"),
  });

  const formik = useFormik({
    initialValues: {
      name: editCourse ? editCourse.name : "",
      description: editCourse ? editCourse.description : "",
      price: editCourse ? editCourse.price : "",
      preparation: {
        name: editCourse ? editCourse.preparation.name : null,
        id: editCourse ? editCourse.preparation.id : null,
      },
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      const { name, description, price, preparation } = values;

      if (editCourse) {
        await editCourseFunc(
          editCourse._id,
          name,
          description,
          price,
          preparation
        );
        setCourses((prevCourses) =>
          prevCourses.map((course) =>
            course._id === editCourse._id ? { ...course, ...values } : course
          )
        );
      } else {
        await createCourse(name, description, price, preparation);
        setCourses((prev) => [
          ...prev,
          {
            name,
            description,
            price,
            preparation,
          },
        ]);
      }
      setOpen(false);
    },
  });

  const handleOpenMenu = (event, course) => {
    setMenuAnchor(event.currentTarget);
    setSelectedCourse(course);
  };

  const handleCloseMenu = () => {
    setMenuAnchor(null);
  };

  const handleAddCourse = () => {
    setEditCourse(null);
    formik.resetForm();
    setOpen(true);
  };

  const handleEditCourse = () => {
    setEditCourse(selectedCourse);
    formik.setValues({
      name: selectedCourse.name,
      description: selectedCourse.description,
      price: selectedCourse.price,
      preparation: selectedCourse.preparation,
    });
    setOpen(true);
    handleCloseMenu();
  };

  const handleDeleteCourse = async () => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      await deleteCourse(selectedCourse._id);
      setCourses((prev) =>
        prev.filter((course) => course._id !== selectedCourse._id)
      );
    }
    handleCloseMenu();
  };

  const fetchAllCourses = async () => {
    const prep = await getAllPreparationFields();
    setPreparationFields(prep || []);
    const courses = await getAllCourses();
    setCourses(courses.courses || []);
  };

  useEffect(() => {
    fetchAllCourses();
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
          Manage Courses
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddCourse}
          sx={{ display: "flex", alignItems: "center" }}
        >
          <Add sx={{ fontSize: "18px" }} /> Add Course
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
              <TableCell sx={{ fontWeight: "bold", padding: "16px" }}>
                Course Name
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", padding: "16px" }}>
                Description
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", padding: "16px" }}>
                Price
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", padding: "16px" }}>
                Preparation
              </TableCell>
              <TableCell
                align="right"
                sx={{ fontWeight: "bold", padding: "16px" }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {courses.map((course) => (
              <TableRow
                key={course.id}
                hover
                sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}
              >
                <TableCell sx={{ padding: "16px" }}>{course.name}</TableCell>
                <TableCell sx={{ padding: "16px" }}>
                  {course.description}
                </TableCell>
                <TableCell sx={{ padding: "16px" }}>₹{course.price}</TableCell>
                <TableCell sx={{ padding: "16px" }}>
                  {course?.preparation?.name || "-"}
                </TableCell>
                <TableCell align="right" sx={{ padding: "16px" }}>
                  <Tooltip title="Options">
                    <IconButton
                      onClick={(event) => handleOpenMenu(event, course)}
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
        <MenuItem onClick={handleEditCourse}>
          <Edit fontSize="small" sx={{ mr: 1 }} /> Edit
        </MenuItem>
        <MenuItem onClick={handleDeleteCourse}>
          <Delete fontSize="small" sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>{editCourse ? "Edit Course" : "Add Course"}</DialogTitle>
        <DialogContent sx={{ pb: 2 }}>
          <form onSubmit={formik.handleSubmit}>
            <TextField
              label="Course Name"
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
              label="Description"
              fullWidth
              variant="outlined"
              margin="dense"
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              error={
                formik.touched.description && Boolean(formik.errors.description)
              }
              helperText={
                formik.touched.description && formik.errors.description
              }
              sx={{ mb: 2 }}
            />
            <TextField
              label="Price"
              fullWidth
              variant="outlined"
              margin="dense"
              name="price"
              type="number"
              value={formik.values.price}
              onChange={formik.handleChange}
              error={formik.touched.price && Boolean(formik.errors.price)}
              helperText={formik.touched.price && formik.errors.price}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
              <InputLabel>Preparation</InputLabel>
              <Select
                label="Preparation"
                name="preparation"
                value={
                  formik.values.preparation
                    ? JSON.stringify(formik.values.preparation)
                    : ""
                }
                onChange={(e) => {
                  const selectedPreparation = JSON.parse(e.target.value);
                  formik.setFieldValue("preparation", selectedPreparation);
                }}
                error={
                  formik.touched.preparation &&
                  Boolean(formik.errors.preparation)
                }
              >
                {preparationFields.map((prep) => (
                  <MuiMenuItem
                    key={prep._id}
                    value={JSON.stringify({ name: prep.name, id: prep._id })}
                  >
                    {prep.name}
                  </MuiMenuItem>
                ))}
              </Select>
            </FormControl>

            <DialogActions>
              <Button onClick={() => setOpen(false)} variant="outlined">
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary">
                {editCourse ? "Update" : "Add"} Course
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default CourseManagementPage;
