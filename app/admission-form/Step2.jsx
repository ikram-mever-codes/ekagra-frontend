"use client";
import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Grid,
  Box,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
} from "@mui/material";
import {
  BASE_URL,
  getAllCities,
  getAllCoupons,
  getAllCourses,
  getCityBranches,
  getCourseBatches,
} from "../api";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { ArrowBackIos, CheckOutlined } from "@mui/icons-material";

const Step2 = ({ currentStep, handlePrevStep }) => {
  const [cities, setCities] = useState([]);
  const [branches, setBranches] = useState([]);
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [couponList, setCouponList] = useState([]);
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [isReferenceApplied, setIsReferenceApplied] = useState(false);
  const [formData, setFormData] = useState({
    fatherName: "",
    preparation: "",
    city: {
      id: "",
      name: "",
      code: "",
    },
    branch: { id: "", name: "", code: "" },
    course: { id: "", name: "" },
    batch: { id: "", name: "" },
    mobileNumber: "",
    alternateNumber: "",
    dob: "",
    pincode: "",
    AddressLine1: "",
    AddressLine2: "",
    gender: "",
    bloodGroup: "",
    photo: null,
    howDidYouKnow: "",
    couponCode: "",
    referenceCoupon: "",
    termsAccepted: false,
    email: "",
  });

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [amount, setAmount] = useState(0);
  const [coupons, setCoupons] = useState([]);
  const [showCoupons, setShowCoupons] = useState(false);
  const router = useRouter();
  const handleCheckout = async () => {
    try {
      if (
        (formData.course.id === "" ||
          formData.batch.id === "" ||
          formData.city.id === "" ||
          formData.branch.id === "",
        formData.preparation === "")
      ) {
        return toast.error("Please fill all the fields!");
      }
      const keyRes = await fetch(`${BASE_URL}/api/v1/getkey`, {
        cache: "no-store",
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const keyData = await keyRes.json();
      const orderRes = await fetch(`${BASE_URL}/api/v1/adm/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: formData.course.id,
          couponCode: formData.couponCode,
          referenceCode: formData.referenceCoupon,
        }),
        cache: "no-store",
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) {
        return toast.error(orderData.message);
      }
      const admData = { ...formData, amount: amount };
      const stringData = JSON.stringify(admData);

      const encodedData = encodeURIComponent(stringData);
      const options = {
        key: keyData.key,
        amount: orderData.amount,
        currency: "INR",
        name: formData.fullName,
        description: "Payment for Ekgara Course",
        image: "https://avatars.githubusercontent.com/u/177479703?v=4",
        order_id: orderData.order.id,
        callback_url: `${BASE_URL}/api/v1/adm/payment-verification?admData=${encodedData}`,
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.mobileNumber,
        },
        theme: {
          color: "#121212",
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      console.log(error);
      return toast.error(error.message);
    }
  };
  useEffect(() => {
    const step1Data = JSON.parse(localStorage.getItem("step1Data"));
    console.log(step1Data);
    if (step1Data === null) {
      const step = parseInt(1);
      return router.push(`/admission-form?step=${step}`);
    }

    setFormData({ ...formData, ...step1Data });

    const fetchCitiesAndCourses = async () => {
      const courseData = await getAllCourses();
      const cityData = await getAllCities();
      const couponData = await getAllCoupons("public", "false", "false");
      setCoupons(couponData.coupons || []);
      setCities(cityData.cities || []);
      setCourses(courseData.courses || []);
    };
    fetchCitiesAndCourses();
  }, []);

  const handleCityChange = async (e) => {
    const { value } = e.target;
    const objData = JSON.parse(value);
    console.log(objData);
    setFormData({
      ...formData,
      city: { id: objData.id, name: objData.name, code: objData.code },
      branch: "",
      batch: "",
    });

    if (value) {
      try {
        const fetchedBranches = await getCityBranches(objData.id);
        setBranches(fetchedBranches.branches || []);
      } catch (error) {
        console.error("Error fetching branches:", error);
      }
    } else {
      setBranches([]);
    }
  };

  const handleCourseChange = async (e) => {
    const { value } = e.target;

    const objData = JSON.parse(value);
    setFormData({
      ...formData,
      course: { name: objData.name, id: objData.id },
      batch: "",
    });

    setAmount(objData.amount);
    setSelectedCourse(courses.find((course) => course._id === objData.id));
    if (value) {
      try {
        const fetchedBatches = await getCourseBatches(objData.id);
        setBatches(fetchedBatches.batches || []);
      } catch (error) {
        console.error("Error fetching batches:", error);
      }
    } else {
      setBatches([]);
    }
  };

  const handleBranchChange = (e) => {
    const { value } = e.target;
    if (formData.city.id === "") {
      toast.error("Please select a city first!");
      return;
    }
    const objData = JSON.parse(value);
    setFormData({
      ...formData,
      branch: { id: objData.id, name: objData.name, code: objData.code },
    });
  };

  const handleBatchChange = (e) => {
    const { value } = e.target;
    if (formData.course.id === "") {
      toast.error("Please select a Course first!");
      return;
    }
    const objData = JSON.parse(value);
    setFormData({
      ...formData,
      batch: { name: objData.name, id: objData.id },
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };
  const handleApplyCoupon = async (type, code) => {
    try {
      if (!formData.course.id) {
        return toast.error("Please Select a Course!");
      }

      const res = await fetch(`${BASE_URL}/api/v1/coupon/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ code, type }),
      });

      const data = await res.json();
      if (!res.ok) {
        return toast.error(data.message);
      }

      const currentDate = new Date();
      const startDate = new Date(data.start);
      const endDate = new Date(data.end);

      if (startDate && currentDate < startDate) {
        return toast.error("Coupon is not active yet.");
      }
      if (endDate && currentDate > endDate) {
        return toast.error("Coupon has expired.");
      }

      const discount = data.discount;
      const discountAmount = (selectedCourse.price * discount) / 100;
      if (type && type !== data.type) {
        return toast.error("Can not Apply this Coupon");
      }
      if (type === "referral") {
        if (isReferenceApplied) {
          setAmount((prev) => prev + discountAmount);
          setFormData((prev) => ({ ...prev, referenceCoupon: "" }));
          setCouponList((coupons) =>
            coupons.filter((c) => c !== discount.toString())
          );
          setIsReferenceApplied(false);
        } else {
          setAmount((prev) => prev - discountAmount);
          setCouponList((coupons) => [...coupons, discount.toString()]);
          setIsReferenceApplied(true);
        }
      } else {
        if (isCouponApplied) {
          setAmount((prev) => prev + discountAmount);
          setFormData((prev) => ({ ...prev, couponCode: "" }));
          setCouponList((coupons) =>
            coupons.filter((c) => c !== discount.toString())
          );
          setIsCouponApplied(false);
        } else {
          setAmount((prev) => prev - discountAmount);
          setCouponList((coupons) => [...coupons, discount.toString()]);
          setIsCouponApplied(true);
        }
      }

      toast.success("Coupon operation successful!");
    } catch (error) {
      console.error("Error applying coupon:", error);
      toast.error("An error occurred while applying the coupon.");
    }
  };

  const handleCouponLinkClick = () => {
    setShowCoupons(!showCoupons);
  };

  useEffect(() => {
    if (selectedCourse) {
      localStorage.setItem("selectedCourse", JSON.stringify(selectedCourse));
    }
  }, [selectedCourse]);

  return (
    <Box sx={{ mb: 0 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl component="fieldset" required>
            <FormLabel component="legend">Preparation</FormLabel>
            <RadioGroup
              row
              name="preparation"
              value={formData.preparation}
              onChange={handleChange}
            >
              <FormControlLabel value="NEET" control={<Radio />} label="NEET" />
              <FormControlLabel value="UPSC" control={<Radio />} label="UPSC" />
              <FormControlLabel value="BPSC" control={<Radio />} label="BPSC" />
              <FormControlLabel value="SSC" control={<Radio />} label="SSC" />
              <FormControlLabel value="JEE" control={<Radio />} label="JEE" />
              <FormControlLabel
                value="other"
                control={<Radio />}
                label="Other"
              />
              {formData.preparation === "other" && (
                <TextField
                  label="Specify"
                  name="preparationOther"
                  value={formData.preparation}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                  required
                />
              )}
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <label
            htmlFor="city"
            className="block text-sm font-medium text-gray-700"
          >
            City
          </label>
          <select
            id="city"
            name="city"
            value={formData.city._id}
            onChange={handleCityChange}
            className="mt-1 block w-full h-[3.3rem] bg-transparent border border-solid border-[#2C3E50] focus:border-[#11282E] transition duration-250 ease-in-out p-3 rounded-md shadow-sm sm:text-sm"
            required
          >
            <option value="" selected disabled>
              Select City
            </option>
            {cities.map((city) => (
              <option
                key={city._id}
                value={JSON.stringify({
                  id: city._id,
                  name: city.name,
                  code: city.code,
                })}
              >
                {city.name}
              </option>
            ))}
          </select>
        </Grid>

        <Grid item xs={12} md={6}>
          <label
            htmlFor="branch"
            className="block text-sm font-medium text-gray-700"
          >
            Branch
          </label>
          <select
            id="branch"
            name="branch"
            value={formData.branch}
            onChange={handleBranchChange}
            className="mt-1 block w-full h-[3.3rem] bg-transparent border border-solid border-[#2C3E50] focus:border-[#11282E] transition duration-250 ease-in-out p-3 rounded-md shadow-sm sm:text-sm"
            required
          >
            <option value="" disabled>
              Select Branch
            </option>
            {branches.map((branch) => (
              <option
                key={branch._id}
                value={JSON.stringify({
                  id: branch._id,
                  name: branch.name,
                  code: branch.code,
                })}
              >
                {branch.name}
              </option>
            ))}
          </select>
        </Grid>

        <Grid item xs={12} md={6}>
          <label
            htmlFor="course"
            className="block text-sm font-medium text-gray-700"
          >
            Course
          </label>
          <select
            id="course"
            name="course"
            value={formData.course._id}
            onChange={handleCourseChange}
            className="mt-1 block w-full h-[3.3rem] bg-transparent border border-solid border-[#2C3E50] focus:border-[#11282E] transition duration-250 ease-in-out p-3 rounded-md shadow-sm sm:text-sm"
            required
          >
            <option value="" selected disabled>
              Select Course
            </option>
            {courses.map((course) => (
              <option
                key={course._id}
                value={JSON.stringify({
                  name: course.name,
                  id: course._id,
                  amount: course.price,
                })}
              >
                {course.name}
              </option>
            ))}
          </select>
        </Grid>

        <Grid item xs={12} md={6}>
          <label
            htmlFor="batch"
            className="block text-sm font-medium text-gray-700"
          >
            Batch
          </label>
          <select
            id="batch"
            name="batch"
            value={formData.batch}
            onChange={handleBatchChange}
            className="mt-1 block w-full h-[3.3rem] bg-transparent border border-solid border-[#2C3E50] focus:border-[#11282E] transition duration-250 ease-in-out p-3 rounded-md shadow-sm sm:text-sm"
            required
          >
            <option value="" disabled>
              Select Batch
            </option>
            {batches.map((batch) => (
              <option
                key={batch._id}
                value={JSON.stringify({ name: batch.name, id: batch._id })}
              >
                {batch.name}
              </option>
            ))}
          </select>
        </Grid>

        <Grid item xs={12} md={6}>
          <label
            htmlFor="couponCode"
            className="block text-sm font-medium text-gray-700"
          >
            Coupon Code
          </label>
          <input
            type="text"
            id="couponCode"
            placeholder="Coupon Code"
            name="couponCode"
            value={formData.couponCode}
            onChange={handleChange}
            className="mt-1 block w-full h-[3.3rem] bg-transparent border border-solid border-[#2C3E50] focus:border-[#11282E] transition duration-250 ease-in-out p-3 rounded-md shadow-sm sm:text-sm"
          />

          <Button
            variant="contained"
            sx={{ width: "100%", mt: 2 }}
            onClick={async () => {
              if (formData.couponCode === "") {
                return toast.error("Coupon Code is required!");
              }
              await handleApplyCoupon(undefined, formData.couponCode);
            }}
          >
            {isCouponApplied ? "Remove" : "Apply"}
          </Button>
        </Grid>

        <Grid item xs={12} md={6}>
          <label
            htmlFor="referenceCoupon"
            className="block text-sm font-medium text-gray-700"
          >
            Reference Coupon
          </label>
          <input
            type="text"
            id="referenceCoupon"
            name="referenceCoupon"
            placeholder="Reference Code"
            value={formData.referenceCoupon}
            onChange={handleChange}
            className="mt-1 block w-full h-[3.3rem] bg-transparent border border-solid border-[#2C3E50] focus:border-[#11282E] transition duration-250 ease-in-out p-3 rounded-md shadow-sm sm:text-sm"
          />
          <Button
            variant="contained"
            sx={{ width: "100%", mt: 2 }}
            onClick={async () => {
              if (formData.referenceCoupon === "") {
                return toast.error("Please write the Code first");
              }

              await handleApplyCoupon("referral", formData.referenceCoupon);
            }}
          >
            {isReferenceApplied ? "Remove" : "Apply"}
          </Button>
        </Grid>

        <Grid item xs={12} sx={{ mt: 2 }}>
          <Button
            onClick={handleCouponLinkClick}
            className="bg-bg-gradient"
            sx={{ textTransform: "none", padding: "10px" }}
          >
            {showCoupons ? "Hide Coupons" : "View Available Coupons"}
          </Button>
          {showCoupons && (
            <Box sx={{ mt: 2 }}>
              {coupons.map((coupon) => (
                <Box
                  key={coupon.code}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: 2,
                    border: "1px solid #ccc",
                    marginBottom: 2,
                  }}
                >
                  <Box>
                    <strong>{coupon.name}</strong>
                    <div>Code: {coupon.code}</div>
                    <div>Discount: {coupon.discount}%</div>
                  </Box>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={async () => {
                      if (isCouponApplied) {
                        return toast.error("Coupon already applied!");
                      }
                      setFormData({ ...formData, couponCode: coupon.code });
                      await handleApplyCoupon(undefined, coupon.code);
                    }}
                  >
                    Use
                  </Button>
                </Box>
              ))}
            </Box>
          )}
        </Grid>

        {selectedCourse && (
          <Grid item xs={12} sx={{ mt: 0 }}>
            <Box
              sx={{
                border: "1px solid #ccc",
                padding: 2,
                borderRadius: "8px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#f7f7f7",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                  gap: "10px",
                  flexDirection: "column",
                }}
              >
                <div>
                  Course Name:<strong> {selectedCourse.name}</strong>
                </div>
                <div>
                  Course Description:{" "}
                  <strong>{" " + selectedCourse.description}</strong>
                </div>

                <div className="flex justify-start items-center">
                  Total Price: &nbsp;
                  <strong>{" " + "₹" + selectedCourse.price}</strong>
                  {couponList.length !== 0 && (
                    <div className="mx-2 flex justify-start items-center gap-1">
                      {couponList.map((c, index) => {
                        return (
                          <div
                            key={index + 1000}
                            ket
                            className="w-max h-max px-2 py-1 rounded-md text-white font-semibold bg-purple-500"
                          >
                            -{c}%
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
                {couponList.length !== 0 && (
                  <div className="flex justify-start items-center font-bold">
                    After Discount: &nbsp;
                    <strong className="font-bold text-green-700">
                      {" "}
                      ₹{amount}{" "}
                    </strong>{" "}
                  </div>
                )}
              </Box>
            </Box>
          </Grid>
        )}
      </Grid>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "2rem",
          mt: 4,
        }}
      >
        <Button
          variant="outlined"
          color="secondary"
          onClick={handlePrevStep}
          disabled={currentStep === "1"}
          sx={{
            "&.Mui-disabled": {
              cursor: "not-allowed",
            },
          }}
          className="h-[3rem] flex justify-end gap-2 items-center"
        >
          <ArrowBackIos sx={{ fontSize: "17px" }} /> Previous
        </Button>

        <Button
          variant="contained"
          color="primary"
          type="submit"
          onClick={handleCheckout}
          endIcon={<CheckOutlined />}
          className="h-[3rem]"
        >
          CheckOut
        </Button>
      </Box>
    </Box>
  );
};

export default Step2;
