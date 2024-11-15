import React, { useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import { CheckCircle } from "@mui/icons-material";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

const FinalStep = () => {
  const searchParams = useSearchParams();
  const studentCode = searchParams.get("studentCode");
  const router = useRouter();

  if (!studentCode) {
    router.push("/admission-form?step=1");
    return null;
  }
  useEffect(() => {
    localStorage.clear("step1Data");
  }, []);
  return (
    <Box
      sx={{
        height: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        backgroundColor: "white",
        borderRadius: "8px",
        padding: "2rem",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        maxWidth: "600px",
        margin: "auto",
      }}
    >
      <Image
        width={120}
        height={120}
        src="/tick.jpg"
        alt="Success"
        style={{ width: "120px", height: "120px", marginBottom: "1rem" }}
      />
      <Typography
        variant="h4"
        sx={{
          fontWeight: 600,
          color: "#388e3c",
          marginBottom: "1rem",
        }}
      >
        Success! Your admission form is completed.
      </Typography>
      <Typography
        variant="body1"
        className="text-black"
        sx={{
          fontSize: "1.1rem",
          fontWeight: 400,
          marginBottom: "2rem",
        }}
      >
        Your student code is:{" "}
        <strong className="font-semibold text-black">{studentCode}</strong>
      </Typography>
    </Box>
  );
};

export default FinalStep;
