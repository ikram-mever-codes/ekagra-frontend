"use client";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Box,
  Typography,
  Container,
  Step,
  StepLabel,
  Stepper,
} from "@mui/material";
import Step1 from "./Step1";
import Step2 from "./Step2";
import FinalStep from "./FinalStep";

const AdmissionForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentStep = parseInt(searchParams.get("step") || "1", 10);
  const steps = ["General Details", "Course & Batch", "Payment"];

  const handlePrevStep = () => {
    const prevStep = currentStep - 1;
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
      {currentStep === 3 ? (
        <FinalStep />
      ) : (
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
            activeStep={currentStep - 1}
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
            {currentStep === 1 && <Step1 currentStep={currentStep} />}
          </Box>
          <Box sx={{ mt: 4 }}>
            {currentStep === 2 && (
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
