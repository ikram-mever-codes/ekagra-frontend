"use client";
import React, { useEffect, useState } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Container,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { getAllAdms, editAdm, deleteAdm, viewSingleAdm } from "../../api";
import { Router } from "next/router";
import { useRouter } from "next/navigation";
import { Delete, Edit, MoreVertRounded } from "@mui/icons-material";

const AdmissionPage = () => {
  const [admissions, setAdmissions] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  useEffect(() => {
    const fetchAdmissions = async () => {
      const data = await getAllAdms();
      console.log(data);
      setAdmissions(data);
    };

    fetchAdmissions();
  }, []);

  const handleDelete = async (id) => {
    const cfs = confirm("Do you want to delete Admission?");
    if (!cfs) {
      return;
    }
    const response = await deleteAdm(id);
    if (response.ok) {
      setAdmissions(admissions.filter((admission) => admission._id !== id));
    }
  };
  console.log(admissions);
  const router = useRouter();
  const handleView = (id) => {
    return router.push(`/admin/admission/${id}`);
  };
  return (
    <div className="mt-6">
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className="text-center">Full Name</TableCell>
              <TableCell className="text-center">Date</TableCell>
              <TableCell className="text-center">Student Code</TableCell>
              <TableCell className="text-center">Email</TableCell>
              <TableCell className="text-center">Contact Number</TableCell>
              <TableCell className="text-center">Whatsapp Number</TableCell>
              <TableCell className="text-center">Course Name</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {admissions.map((admission) => (
              <TableRow key={admission._id}>
                <TableCell className="text-center">
                  {admission.fullName}
                </TableCell>
                <TableCell className="text-center">
                  {new Date(admission.createdAt).toLocaleString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </TableCell>
                <TableCell className="text-center">
                  {admission.studentCode}
                </TableCell>
                <TableCell className="text-center">{admission.email}</TableCell>
                <TableCell className="text-center">
                  {admission.mobileNumber || "-"}
                </TableCell>
                <TableCell className="text-center">
                  {admission.whatsappNumber || "-"}
                </TableCell>
                <TableCell className="text-center">
                  {admission.course.name}
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleView(admission._id)}
                  >
                    View
                  </Button>

                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                  >
                    <MenuItem
                      onClick={() => {
                        handleDelete(selectedId);
                        handleClose();
                      }}
                      style={{ color: "red" }}
                    >
                      <Delete style={{ marginRight: "10px" }} />
                      Delete
                    </MenuItem>
                  </Menu>

                  <IconButton
                    onClick={(e) => {
                      setSelectedId(admission._id);
                      handleClick(e);
                    }}
                  >
                    <MoreVertRounded />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default AdmissionPage;
