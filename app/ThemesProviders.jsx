"use client";
import { ThemeProvider } from "@mui/material";
import React from "react";
import theme from "./theme";

const ThemesProviders = ({ children }) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default ThemesProviders;
