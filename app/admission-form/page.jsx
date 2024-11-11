// pages/form/AdmissionForm.js

"use client";
import React from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Box,
  Typography,
  Container,
  Step,
  StepLabel,
  Stepper,
  Divider,
  IconButton,
} from "@mui/material";
import { ArrowBack, ArrowForward, Kitesurfing } from "@mui/icons-material";
import { useSearchParams } from "next/navigation";
import Step1 from "./Step1";
import Step2 from "./Step2";
import FinalStep from "./FinalStep";
import { createOrder } from "../userApi";

const AdmissionForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentStep = searchParams.get("step") || "1";
  const steps = ["General Details", "Course & Batch", "Payment"];
  const handleNextStep = async () => {
    if (currentStep === "2") {
      let orderData = await createOrder(5000);
      console.log(orderData);
    }
  };

  const handlePrevStep = () => {
    const prevStep = parseInt(currentStep) - 1;
    if (prevStep >= 1) {
      router.push(`/admission-form?step=${prevStep}`);
    }
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        height: "max-content",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {currentStep === "3" ? (
        // <div className="w-[100vw] h-full flex justify-center items-center bg-red-400">
        <FinalStep />
      ) : (
        // </div>

        <Box
          sx={{
            margin: "40px 0px",
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 3,
            p: 3,
            color: "text.primary",
          }}
        >
          <Typography
            variant="h5"
            fontWeight="bold"
            textAlign="center"
            gutterBottom
          >
            Admission Form - {steps[currentStep - 1]}
          </Typography>

          <Stepper
            activeStep={currentStep}
            alternativeLabel
            sx={{
              ".css-1b2ju2j-MuiStepLabel-iconContainer.MuiStepLabel-alternativeLabel":
                {
                  width: "14px",
                  backgroundColor: "transparent",
                  zIndex: "1",
                },
            }}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box sx={{ mt: 4 }}>
            {currentStep === "1" && <Step1 currentStep={currentStep} />}
          </Box>
          <Box sx={{ mt: 4 }}>
            {currentStep === "2" && (
              <Step2
                currentStep={currentStep}
                handlePrevStep={handlePrevStep}
              />
            )}
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default AdmissionForm;
