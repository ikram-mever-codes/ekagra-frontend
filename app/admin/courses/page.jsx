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
  createCourse,
  getAllCourses,
  editCourseFunc,
  deleteCourse,
} from "@/app/api";

const CourseManagementPage = () => {
  const [courses, setCourses] = useState([]);
  const [open, setOpen] = useState(false);
  const [editCourse, setEditCourse] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const validationSchema = Yup.object({
    name: Yup.string().required("Course name is required"),
    description: Yup.string().required("Description is required"),
    price: Yup.number()
      .required("Price is required")
      .positive("Price must be a positive number"),
  });

  const formik = useFormik({
    initialValues: {
      name: editCourse ? editCourse.name : "",
      description: editCourse ? editCourse.description : "",
      price: editCourse ? editCourse.price : "",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      if (editCourse) {
        await editCourseFunc(
          editCourse._id,
          values.name,
          values.description,
          values.price
        );
        setCourses((prevCourses) =>
          prevCourses.map((course) =>
            course.id === editCourse.id ? { ...course, ...values } : course
          )
        );
      } else {
        await createCourse(values.name, values.description, values.price);
        setCourses((prev) => [
          ...prev,
          {
            name: values.name,
            description: values.description,
            price: values.price,
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
              <TableCell
                sx={{
                  fontWeight: "bold",
                  backgroundColor: theme.palette.grey[100],
                  padding: "16px",
                }}
              >
                Course Name
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  backgroundColor: theme.palette.grey[100],
                  padding: "16px",
                }}
              >
                Description
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  backgroundColor: theme.palette.grey[100],
                  padding: "16px",
                }}
              >
                Price
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
            <DialogActions>
              <Button onClick={() => setOpen(false)} variant="outlined">
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary">
                {editCourse ? "Save" : "Add"}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default CourseManagementPage;
