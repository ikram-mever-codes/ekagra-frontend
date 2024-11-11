"use client";
import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
} from "@mui/material";
import { viewSingleAdm } from "@/app/api";
import { useRouter } from "next/navigation";
import Loading from "@/app/loading";
import Link from "next/link";
const AdmissionDetails = ({ params }) => {
  const [loading, setLoading] = useState(false);
  const { admId } = params;
  const [data, setData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchAdm = async () => {
      setLoading(true);
      const adm = await viewSingleAdm(admId);
      console.log(adm);
      if (!adm) {
        return router.push("/");
      }
      setData(adm);
      setLoading(false);
    };
    fetchAdm();
  }, []);
  console.log(data);
  if (loading || !data) return <Loading />;
  return data === null ? (
    <Loading />
  ) : (
    <Container maxWidth="full" sx={{ marginTop: 2 }}>
      <Card sx={{ backgroundColor: "white", boxShadow: "none" }}>
        <CardContent>
          <Typography variant="h1" gutterBottom>
            Admission Details
          </Typography>

          <Grid container spacing={1}>
            <Grid item xs={12} sm={4} display="flex" justifyContent="center">
              <Avatar
                alt="User Photo"
                src={data.photo}
                sx={{ width: 150, height: 150 }}
              />
            </Grid>

            <Grid item xs={12} sm={8}>
              <Typography variant="h2">Personal Information</Typography>
              <Grid container spacing={1} my={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    <strong>Full Name:</strong> {data.fullName}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Father&apos;s Name:</strong> {data.fatherName}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Gender:</strong> {data.gender}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Date of Birth:</strong> {data.dob}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    <strong>Email:</strong> {data.email}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Mobile Number:</strong> {data.mobileNumber}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Blood Group:</strong> {data.bloodGroup}
                  </Typography>
                  <Typography variant="body1">
                    <strong>How Did You Know:</strong> {data.source}
                  </Typography>
                </Grid>
              </Grid>
              <Typography variant="h2" sx={{ marginTop: 4 }}>
                Course and Batch Information
              </Typography>
              <Grid container spacing={2} my={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    <strong>Course:</strong> {data.course.name}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Branch:</strong> {data.branch.name}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    <strong>Batch:</strong> {data.batch.name}
                  </Typography>
                  <Typography variant="body1">
                    <strong>City:</strong> {data.city.name}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    <strong>Student Code:</strong> {data.studentCode}
                  </Typography>
                </Grid>
              </Grid>
              <Typography variant="h2" sx={{ marginTop: 4 }}>
                Address Information
              </Typography>
              <Typography variant="body1" mt={2}>
                <strong>Address:</strong> {data.address.addressLine1 || "Nil"},{" "}
                {data.AddressLine2}
              </Typography>
              <Typography variant="body1" mb={2}>
                <strong>Pincode:</strong> {data.address.pincode}
                <Typography variant="body1" mb={2}>
                  <strong>City:</strong> {data.cityName}
                </Typography>
              </Typography>{" "}
              <Typography variant="h2" sx={{ marginTop: 4 }}>
                Aadhar and Payment Information
              </Typography>
              <Grid container spacing={2} my={1}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    <strong>Aadhar Front:</strong>
                  </Typography>
                  <br />
                  <Link
                    className="w-max h-3 p-2 bg-black text-white rounded-md my-2"
                    href={data.aadharFront || "#"}
                  >
                    View Aadhar Front Image
                  </Link>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    <strong>Aadhar Back:</strong>
                  </Typography>
                  <br />
                  <Link
                    className="w-max h-3 p-2 bg-black text-white rounded-md"
                    href={data.aadharBacks || "#"}
                  >
                    View Back Front Image
                  </Link>
                </Grid>
              </Grid>
              <br />
              <Typography variant="body1">
                <strong>Amount:</strong> ₹{data.amount}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default AdmissionDetails;
