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
} from "@mui/material";
import { getAllAdms, editAdm, deleteAdm, viewSingleAdm } from "../../api";
import { Router } from "next/router";
import { useRouter } from "next/navigation";
import { Delete, Edit } from "@mui/icons-material";

const AdmissionPage = () => {
  const [admissions, setAdmissions] = useState([]);

  useEffect(() => {
    // Fetching all admission records
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
              <TableCell className="text-center">Course Name</TableCell>
              <TableCell className="text-center">Student Code</TableCell>
              <TableCell className="text-center">City</TableCell>
              <TableCell className="text-center">Email</TableCell>
              <TableCell className="text-center">Contact Number</TableCell>
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
                  {admission.course.name}
                </TableCell>
                <TableCell className="text-center">
                  {admission.city.name}
                </TableCell>
                <TableCell className="text-center">
                  {admission.studentCode}
                </TableCell>
                <TableCell className="text-center">{admission.email}</TableCell>
                <TableCell className="text-center">
                  {admission.mobileNumber || "-"}
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleView(admission._id)}
                  >
                    View
                  </Button>

                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDelete(admission._id)}
                    style={{ marginLeft: "10px" }}
                  >
                    <Delete />
                  </Button>
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
