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
  FormControl,
  InputLabel,
  CircularProgress,
} from "@mui/material";
import { Add, Edit, Delete, MoreVert } from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";
import theme from "../../theme";
import {
  getAllCoupons,
  createCoupon,
  editCouponFunc,
  deleteCoupon,
} from "../../api.js"; // Import CRUD functions
import { useRouter } from "next/navigation";

const CouponManagementPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [open, setOpen] = useState(false);
  const [editCoupon, setEditCoupon] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCoupons = async () => {
      const data = await getAllCoupons();
      setCoupons(data?.coupons || []);
    };
    fetchCoupons();
  }, []);

  const handleOpenMenu = (event, coupon) => {
    setMenuAnchor(event.currentTarget);
    setSelectedCoupon(coupon);
  };

  const handleCloseMenu = () => {
    setMenuAnchor(null);
  };

  const handleAddCoupon = () => {
    setEditCoupon(null);
    setOpen(true);
  };

  const handleEditCoupon = () => {
    setEditCoupon(selectedCoupon);
    setOpen(true);
    handleCloseMenu();
  };

  const handleDeleteCoupon = async () => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      await deleteCoupon(selectedCoupon._id);
      setCoupons(coupons.filter((coupon) => coupon._id !== selectedCoupon._id));
    }
    handleCloseMenu();
  };
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      title: editCoupon ? editCoupon.name : "",
      code: editCoupon ? editCoupon.code : "",
      type: editCoupon ? editCoupon.type : "public",
      percentage: editCoupon ? editCoupon.discount : "",
      startDate: editCoupon ? editCoupon.start : "",
      endDate: editCoupon ? editCoupon.end : "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      code: Yup.string().required("Code is required"),
      type: Yup.string().required("Type is required"),
      percentage: Yup.number()
        .min(1, "Must be at least 1%")
        .max(100, "Must be 100% or less")
        .required("Discount percentage is required"),
      startDate: Yup.date().required("Start date is required"),
      endDate: Yup.date().required("End date is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      if (editCoupon) {
        await editCouponFunc(
          editCoupon._id,
          values.title,
          values.code,
          values.type,
          values.percentage,
          values.startDate,
          values.endDate
        );
        const data = await getAllCoupons();
        setCoupons(data?.coupons || []);
      } else {
        await createCoupon(
          values.title,
          values.code,
          values.type,
          values.percentage,
          values.startDate,
          values.endDate
        );
        return router.push("/");
      }
      setLoading(false);
      setOpen(false);
    },
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
          Manage Coupons
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleAddCoupon}
        >
          Add Coupon
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
                Coupon Title
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  backgroundColor: theme.palette.grey[100],
                  padding: "16px",
                }}
              >
                Coupon Code
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  backgroundColor: theme.palette.grey[100],
                  padding: "16px",
                }}
              >
                Discount
              </TableCell>{" "}
              <TableCell
                sx={{
                  fontWeight: "bold",
                  backgroundColor: theme.palette.grey[100],
                  padding: "16px",
                }}
              >
                Type
              </TableCell>{" "}
              <TableCell
                sx={{
                  fontWeight: "bold",
                  backgroundColor: theme.palette.grey[100],
                  padding: "16px",
                }}
              >
                Expires
              </TableCell>
              <TableCell
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
            {coupons.map((coupon) => (
              <TableRow
                key={coupon._id}
                hover
                sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}
              >
                <TableCell sx={{ padding: "16px" }}>{coupon.name}</TableCell>
                <TableCell sx={{ padding: "16px" }}>{coupon.code}</TableCell>
                <TableCell sx={{ padding: "16px" }}>
                  {coupon.discount}%
                </TableCell>
                <TableCell sx={{ padding: "16px" }}>{coupon.type}</TableCell>
                <TableCell sx={{ padding: "16px" }}>
                  {new Date(coupon.end).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </TableCell>
                <TableCell sx={{ padding: "16px" }}>
                  <Tooltip title="Options">
                    <IconButton
                      onClick={(event) => handleOpenMenu(event, coupon)}
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
        <MenuItem onClick={handleEditCoupon}>
          <Edit fontSize="small" sx={{ mr: 1 }} /> Edit
        </MenuItem>
        <MenuItem onClick={handleDeleteCoupon}>
          <Delete fontSize="small" sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>{editCoupon ? "Edit Coupon" : "Add Coupon"}</DialogTitle>
        <DialogContent sx={{ pb: 2 }}>
          <form onSubmit={formik.handleSubmit}>
            <TextField
              label="Coupon Title"
              fullWidth
              variant="outlined"
              margin="dense"
              {...formik.getFieldProps("title")}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Coupon Code"
              fullWidth
              variant="outlined"
              margin="dense"
              {...formik.getFieldProps("code")}
              error={formik.touched.code && Boolean(formik.errors.code)}
              helperText={formik.touched.code && formik.errors.code}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
              <InputLabel>Coupon Type</InputLabel>
              <Select
                label="Coupon Type"
                {...formik.getFieldProps("type")}
                error={formik.touched.type && Boolean(formik.errors.type)}
              >
                <MenuItem value="public">Public</MenuItem>
                <MenuItem value="private">Private</MenuItem>
                <MenuItem value="referral">Referral</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Discount (%)"
              fullWidth
              variant="outlined"
              margin="dense"
              type="number"
              {...formik.getFieldProps("percentage")}
              error={
                formik.touched.percentage && Boolean(formik.errors.percentage)
              }
              helperText={formik.touched.percentage && formik.errors.percentage}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Start Date"
              fullWidth
              variant="outlined"
              margin="dense"
              type="date"
              {...formik.getFieldProps("startDate")}
              InputLabelProps={{ shrink: true }}
              error={
                formik.touched.startDate && Boolean(formik.errors.startDate)
              }
              helperText={formik.touched.startDate && formik.errors.startDate}
              sx={{ mb: 2 }}
            />
            <TextField
              label="End Date"
              fullWidth
              variant="outlined"
              margin="dense"
              type="date"
              {...formik.getFieldProps("endDate")}
              InputLabelProps={{ shrink: true }}
              error={formik.touched.endDate && Boolean(formik.errors.endDate)}
              helperText={formik.touched.endDate && formik.errors.endDate}
              sx={{ mb: 2 }}
            />
            <DialogActions>
              <Button onClick={() => setOpen(false)} variant="outlined">
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={16} /> : null}
              >
                {editCoupon ? "Save Changes" : "Create Coupon"}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default CouponManagementPage;
