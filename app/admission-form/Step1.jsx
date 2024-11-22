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
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { AlternateEmail, ArrowBack, ArrowForward } from "@mui/icons-material";
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
    .min(10, "Must be 10 digits")
    .max(10, "Must be 10 digits"),
  isWhatsapp: Yup.string(),
  whatsappNumber: Yup.string().min(10).max(10),
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
          mobileNumber: "",
          isWhatsapp: "Yes",
          whatsappNumber: "",
          pincode: "",
          bloodGroup: "",
          photo: "",
          aadharFront: "",
          aadharBack: "",
          howDidYouKnow: "",
          termsAccepted: true,
        };
  };

  const uploadFile = async (file, fieldName, setFieldValue) => {
    if (!file) return;
    toast.loading("Uploading Files...");
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await axios.post(`${BASE_URL}/api/v1/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === "413") {
        return toast.error("File size too big!");
      }
      const fileUrl = response.data.url;

      toast.dismiss();
      setFieldValue(fieldName, fileUrl);
      toast.success("File Uploaded Successfully!");
    } catch (error) {
      toast.dismiss();
      toast.error(error.response.data.error || error.message);
      console.error(`Error uploading ${fieldName}`, error);
    }
  };
  const today = new Date().toISOString().split("T")[0];

  return (
    <Formik
      initialValues={loadInitialValues()}
      validationSchema={validationSchema}
      validateOnChange={true}
      onSubmit={(values) => {
        localStorage.setItem("step1Data", JSON.stringify(values));
        const nextStep = parseInt(currentStep) + 1;
        return router.push(`/admission-form?step=${nextStep}`);
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
              </Grid>{" "}
              {/* Is WhatsApp */}
              <Grid item xs={12} sm={6}>
                <FormControl component="fieldset" fullWidth>
                  <FormLabel component="legend">
                    Is the above Number registered on WhatsApp?{" "}
                  </FormLabel>
                  <RadioGroup
                    row
                    name="isWhatsapp"
                    value={values.isWhatsapp}
                    onChange={(e) => {
                      setFieldValue("isWhatsapp", e.target.value);
                    }}
                  >
                    <FormControlLabel
                      value="Yes"
                      control={<Radio />}
                      label="Yes"
                    />
                    <FormControlLabel
                      value="No"
                      control={<Radio />}
                      label="No"
                    />
                  </RadioGroup>
                  {touched.isWhatsapp && errors.isWhatsapp && (
                    <FormHelperText error>{errors.isWhatsapp}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              {values.isWhatsapp === "No" && (
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    label="WhatsApp Number"
                    name="whatsappNumber"
                    variant="outlined"
                    fullWidth
                    error={
                      touched.whatsappNumber && Boolean(errors.whatsappNumber)
                    }
                    helperText={touched.whatsappNumber && errors.whatsappNumber}
                  />
                </Grid>
              )}
              {/* Date of Birth */}
              <Grid item xs={12} sm={6}>
                <Field
                  as={TextField}
                  label="Date of Birth"
                  name="dob"
                  type="date"
                  variant="outlined"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ max: today }} // Set max attribute to today's date
                  error={touched.dob && Boolean(errors.dob)}
                  helperText={touched.dob && errors.dob}
                />
              </Grid>
              {/* Gender */}
              <Grid item xs={12} sm={6}>
                <FormControl component="fieldset" fullWidth>
                  <FormLabel component="legend">Gender</FormLabel>
                  <RadioGroup
                    row
                    name="gender"
                    value={values.gender}
                    onChange={(e) => setFieldValue("gender", e.target.value)}
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
                  {touched.gender && (
                    <FormHelperText error>{errors.gender}</FormHelperText>
                  )}
                </FormControl>
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
              {/* Blood Group */}
              <Grid item xs={12}>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel>Blood Group</InputLabel>
                  <Field
                    as={Select}
                    name="bloodGroup"
                    label="Blood Group"
                    fullWidth
                    error={touched.bloodGroup && Boolean(errors.bloodGroup)}
                  >
                    <MenuItem value="" disabled>
                      Select Blood Group
                    </MenuItem>
                    {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(
                      (group) => (
                        <MenuItem key={group} value={group}>
                          {group}
                        </MenuItem>
                      )
                    )}
                  </Field>
                  {touched.bloodGroup && (
                    <FormHelperText error>{errors.bloodGroup}</FormHelperText>
                  )}
                </FormControl>
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
                {values.aadharFront && (
                  <p className="text-[14px] my-2">{values.aadharFront}</p>
                )}
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
                {values.aadharBack && (
                  <p className="text-[14px] my-2">{values.aadharBack}</p>
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button variant="outlined" component="label" fullWidth>
                  Upload Photo
                  <input
                    type="file"
                    hidden
                    accept="image/*,image/webp"
                    onChange={(event) => {
                      const file = event.currentTarget.files[0];
                      uploadFile(file, "photo", setFieldValue);
                    }}
                  />
                </Button>
                {values.photo && (
                  <img
                    src={values.photo}
                    alt="Uploaded Photo"
                    width="100"
                    className=" w-full h-max object-cover object-center my-4 border border-black border-solid rounded-lg"
                  />
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
                  onChange={(e) =>
                    setFieldValue("howDidYouKnow", e.target.value)
                  }
                >
                  <option value="" disabled>
                    Select an option
                  </option>
                  <option value="Friend">Friend</option>
                  <option value="Advertisement">Advertisement</option>
                  <option value="Social Media">Social Media</option>
                  <option value="Other">Other</option>
                </Field>
                {errors.howDidYouKnow && touched.howDidYouKnow && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.howDidYouKnow}
                  </p>
                )}
              </Grid>
              {values.howDidYouKnow === "Other" && (
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    label="Please specify"
                    name="otherReason"
                    variant="outlined"
                    fullWidth
                    error={touched.otherReason && Boolean(errors.otherReason)}
                    helperText={touched.otherReason && errors.otherReason}
                  />
                </Grid>
              )}
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
