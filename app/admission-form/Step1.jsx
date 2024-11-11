import React, { useEffect } from "react";
import {
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Button,
  Grid,
  Box,
  Checkbox,
} from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import axios from "axios";
import { BASE_URL } from "../api";
import { toast } from "react-toastify";

const validationSchema = Yup.object().shape({
  fullName: Yup.string().required("Full Name is required"),
  fatherName: Yup.string().required("Father's Name is required"),
  dob: Yup.date().required("Date of Birth is required"),
  gender: Yup.string().required("Gender is required"),
  mobileNumber: Yup.string()
    .required("Mobile Number is required")
    .min(10)
    .max(10),
  email: Yup.string().email("Invalid email").required("Email is required"),
  addressLine1: Yup.string().required("Address Line 1 is required"),
  addressLine2: Yup.string(),
  cityName: Yup.string().required("City is required"),
  pincode: Yup.string().required("Pincode is required").min(6).max(6),
  bloodGroup: Yup.string().required("Blood Group is required"),
  photo: Yup.mixed().required("Photo is required"),
  aadharFront: Yup.mixed().required("Aadhar Front Image is required"),
  aadharBack: Yup.mixed().required("Aadhar Back Image is required"),
  howDidYouKnow: Yup.string().required("This field is required"),
  termsAccepted: Yup.boolean()
    .oneOf([true], "Terms must be accepted")
    .required(),
});

const Step1 = ({ currentStep }) => {
  const router = useRouter();

  const loadInitialValues = () => {
    const savedData = localStorage.getItem("step1Data");
    return savedData
      ? JSON.parse(savedData)
      : {
          fullName: "",
          fatherName: "",
          dob: "",
          gender: "",
          mobileNumber: "",
          email: "",
          addressLine1: "",
          addressLine2: "",
          cityName: "",
          pincode: "",
          bloodGroup: "",
          photo: "",
          aadharFront: "",
          aadharBack: "",
          howDidYouKnow: "",
          termsAccepted: false,
        };
  };

  const uploadFile = async (file, fieldName, setFieldValue) => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await axios.post(`${BASE_URL}/api/v1/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const fileUrl = response.data.url;
      setFieldValue(fieldName, fileUrl);
    } catch (error) {
      console.error(`Error uploading ${fieldName}`, error);
    }
  };
  return (
    <Formik
      initialValues={loadInitialValues()}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        localStorage.setItem("step1Data", JSON.stringify(values));
        const nextStep = parseInt(currentStep) + 1;
        router.push(`/admission-form?step=${nextStep}`);
      }}
    >
      {({ setFieldValue, errors, touched, values }) => (
        <Form>
          <Box sx={{ mb: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Field
                  as={TextField}
                  label="Full Name"
                  name="fullName"
                  variant="outlined"
                  fullWidth
                  error={touched.fullName && Boolean(errors.fullName)}
                  helperText={touched.fullName && errors.fullName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field
                  as={TextField}
                  label="Father's Name"
                  name="fatherName"
                  variant="outlined"
                  fullWidth
                  error={touched.fatherName && Boolean(errors.fatherName)}
                  helperText={touched.fatherName && errors.fatherName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field
                  as={TextField}
                  label="Date of Birth"
                  name="dob"
                  type="date"
                  variant="outlined"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  error={touched.dob && Boolean(errors.dob)}
                  helperText={touched.dob && errors.dob}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl
                  component="fieldset"
                  error={touched.gender && Boolean(errors.gender)}
                  fullWidth
                >
                  <FormLabel component="legend">Gender</FormLabel>
                  <RadioGroup
                    row
                    name="gender"
                    value={values.gender}
                    onChange={(e) => setFieldValue("gender", e.target.value)}
                    className="flex justify-around items-center"
                  >
                    <FormControlLabel
                      value="Male"
                      control={<Radio />}
                      label="Male"
                    />
                    <FormControlLabel
                      value="Female"
                      control={<Radio />}
                      label="Female"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field
                  as={TextField}
                  label="Mobile Number"
                  name="mobileNumber"
                  variant="outlined"
                  fullWidth
                  error={touched.mobileNumber && Boolean(errors.mobileNumber)}
                  helperText={touched.mobileNumber && errors.mobileNumber}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field
                  as={TextField}
                  label="Email Address"
                  name="email"
                  variant="outlined"
                  fullWidth
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field
                  as={TextField}
                  label="Address Line 1"
                  name="addressLine1"
                  variant="outlined"
                  fullWidth
                  error={touched.addressLine1 && Boolean(errors.addressLine1)}
                  helperText={touched.addressLine1 && errors.addressLine1}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field
                  as={TextField}
                  label="Address Line 2"
                  name="addressLine2"
                  variant="outlined"
                  fullWidth
                  error={touched.addressLine2 && Boolean(errors.addressLine2)}
                  helperText={touched.addressLine2 && errors.addressLine2}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field
                  as={TextField}
                  label="City Name"
                  name="cityName"
                  variant="outlined"
                  fullWidth
                  error={touched.cityName && Boolean(errors.cityName)}
                  helperText={touched.cityName && errors.cityName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field
                  as={TextField}
                  label="Pincode"
                  name="pincode"
                  variant="outlined"
                  fullWidth
                  error={touched.pincode && Boolean(errors.pincode)}
                  helperText={touched.pincode && errors.pincode}
                />
              </Grid>
              <Grid item xs={12}>
                <label
                  htmlFor="bloodGroup"
                  className="block text-sm font-medium text-gray-700"
                >
                  Blood Group
                </label>
                <Field
                  as="select"
                  id="bloodGroup"
                  name="bloodGroup"
                  className="mt-1 block w-full h-[3.5rem] bg-transparent border border-solid border-[#2C3E50] focuss:border-[#11282E] transition duration-250 ease-in-out p-3 rounded-md shadow-sm sm:text-sm"
                >
                  <option value="" disabled>
                    Select Blood Group
                  </option>
                  <option value="A+">A+</option>
                  <option value="B+">B+</option>
                  <option value="O+">O+</option>
                  <option value="AB+">AB+</option>
                </Field>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button variant="outlined" component="label" fullWidth>
                  Upload Aadhar Front
                  <input
                    type="file"
                    hidden
                    onChange={(event) => {
                      const file = event.currentTarget.files[0];
                      setFieldValue("aadharFront", file.name);
                      uploadFile(file, "aadharFront", setFieldValue);
                    }}
                  />
                </Button>
                {values.aadharFront && <p>{values.aadharFront}</p>}
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button variant="outlined" component="label" fullWidth>
                  Upload Aadhar Back
                  <input
                    type="file"
                    hidden
                    onChange={(event) => {
                      const file = event.currentTarget.files[0];
                      uploadFile(file, "aadharBack", setFieldValue);
                    }}
                  />
                </Button>
                {values.aadharBack && <p>{values.aadharBack}</p>}
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button variant="outlined" component="label" fullWidth>
                  Upload Photo
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(event) => {
                      const file = event.currentTarget.files[0];
                      uploadFile(file, "photo", setFieldValue);
                    }}
                  />
                </Button>
                {values.photo && (
                  <img src={values.photo} alt="Uploaded Photo" width="100" />
                )}
              </Grid>

              <Grid item xs={12}>
                <label
                  htmlFor="howDidYouKnow"
                  className="block text-sm font-medium text-gray-700"
                >
                  How did you hear about Ekagra?
                </label>
                <Field
                  as="select"
                  id="howDidYouKnow"
                  name="howDidYouKnow"
                  className="mt-1 block w-full h-[3.3rem] bg-transparent border border-solid border-[#2C3E50] focuss:border-[#11282E] transition duration-250 ease-in-out p-3 rounded-md shadow-sm sm:text-sm"
                >
                  <option value="" disabled>
                    Select an option
                  </option>
                  <option value="Friend">Friend</option>
                  <option value="Advertisement">Advertisement</option>
                  <option value="Social Media">Social Media</option>
                  <option value="Other">Other</option>
                </Field>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={values.termsAccepted}
                      onChange={(e) =>
                        setFieldValue("termsAccepted", e.target.checked)
                      }
                      name="termsAccepted"
                    />
                  }
                  label="I accept the terms and conditions"
                />
                {errors.termsAccepted && touched.termsAccepted && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.termsAccepted}
                  </p>
                )}
              </Grid>
              <Grid item xs={12} className="flex justify-end">
                <Button
                  type="submit"
                  variant="contained"
                  endIcon={<ArrowForward />}
                  color="primary"
                >
                  Next
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default Step1;
