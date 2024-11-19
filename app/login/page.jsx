"use client";
import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Paper,
  CircularProgress,
} from "@mui/material";
import { Email, Lock, Login, LoginOutlined } from "@mui/icons-material";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import Image from "next/image";
import theme from "../theme";
import { login } from "../authApi";
import { useRouter } from "next/navigation";
import { useUser } from "../ContextProvider";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const LoginPage = () => {
  const { setUser, user } = useUser();
  const router = useRouter();
  const handleSubmit = async (values) => {
    const user = await login(values.email, values.password, router);
    setUser(user.user);
  };

  return (
    <Box
      className="bg-bg-gradient w-full h-screen flex justify-center items-center"
      sx={{ overflow: "hidden" }}
    >
      <Paper
        // className="bg-bg-gradient"
        elevation={4}
        sx={{
          width: "450px",
          padding: "32px",
          borderRadius: "12px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image src="/logo.png" alt="App Logo" width={80} height={80} />

        <Typography
          variant="h4"
          sx={{
            fontWeight: 600,
            marginTop: 2,
            color: theme.palette.primary.main,
          }}
        >
          Welcome Back!
        </Typography>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form style={{ width: "100%", marginTop: "16px" }}>
              <Box sx={{ marginBottom: 2 }}>
                <Field
                  as={TextField}
                  name="email"
                  label="Email"
                  type="email"
                  fullWidth
                  variant="outlined"
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <IconButton position="start">
                        <Email sx={{ color: theme.palette.text.secondary }} />
                      </IconButton>
                    ),
                  }}
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  style={{ color: "red", fontSize: "12px" }}
                />
              </Box>

              <Box sx={{ marginBottom: 2 }}>
                <Field
                  as={TextField}
                  name="password"
                  label="Password"
                  type="password"
                  fullWidth
                  variant="outlined"
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <IconButton position="start">
                        <Lock sx={{ color: theme.palette.text.secondary }} />
                      </IconButton>
                    ),
                  }}
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  style={{ color: "red", fontSize: "12px" }}
                />
              </Box>

              <Button
                variant="contained"
                color="primary"
                fullWidth
                type="submit"
                sx={{
                  padding: "12px",
                  fontWeight: 600,
                  textTransform: "none",
                  marginTop: 2,
                  borderRadius: "8px",
                }}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <CircularProgress size={24} sx={{ color: "white" }} />
                ) : (
                  <div className="flex justify-center items-center gap-5 text-[18px]">
                    <LoginOutlined sx={{ fontSize: "29px" }} /> Login
                  </div>
                )}
              </Button>
            </Form>
          )}
        </Formik>
      </Paper>
    </Box>
  );
};

export default LoginPage;
