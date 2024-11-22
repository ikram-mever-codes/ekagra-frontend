import { toast } from "react-toastify";
export const BASE_URL = "https://api.ekagra.in";
// export const BASE_URL = "http://localhost:6001";

export const createCity = async (name, code) => {
  try {
    toast.loading("Creating City...");
    const res = await fetch(`${BASE_URL}/api/v1/city/cities`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      cache: "no-store",
      body: JSON.stringify({ name, code }),
    });
    toast.dismiss();
    const data = await res.json();
    console.log(data);
    if (!res.ok) {
      return toast.error(data.message);
    }
    return toast.success(data.message);
  } catch (error) {
    console.log(error);
    return toast.error(error.message);
  }
};

export const getAllCities = async () => {
  try {
    const res = await fetch(`${BASE_URL}/api/v1/city/cities`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      cache: "no-store",
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
    return toast.error(error.message);
  }
};

export const editCityFunc = async (id, name, code) => {
  try {
    toast.loading("Updating City...");
    const res = await fetch(`${BASE_URL}/api/v1/city/cities/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      cache: "no-store",
      body: JSON.stringify({ name, code }),
    });
    toast.dismiss();
    const data = await res.json();
    console.log(data);
    if (!res.ok) {
      return toast.error(data.message);
    }
    toast.success(data.message);
    return data;
  } catch (error) {
    console.log(error);
    return toast.error(error.message);
  }
};

export const deleteCity = async (id) => {
  try {
    toast.loading("Deleting City...");
    const res = await fetch(`${BASE_URL}/api/v1/city/cities/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      cache: "no-store",
    });
    toast.dismiss();
    const data = await res.json();
    if (!res.ok) {
      return toast.error(data.message);
    }
    return toast.success(data.message);
  } catch (error) {
    console.log(error);
    return toast.error(error.message);
  }
};

export const createBranch = async (name, code, city) => {
  try {
    toast.loading("Creating Branch...");
    const res = await fetch(`${BASE_URL}/api/v1/branch/branches`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      cache: "no-store",
      body: JSON.stringify({
        name,
        code,
        city: { id: city.id, name: city.name },
      }),
    });
    toast.dismiss();
    const data = await res.json();
    if (!res.ok) {
      return toast.error(data.message);
    }
    return toast.success(data.message);
  } catch (error) {
    console.log(error);
    return toast.error(error.message);
  }
};

export const getAllBranches = async () => {
  try {
    const res = await fetch(`${BASE_URL}/api/v1/branch/branches`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      cache: "no-store",
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
    return toast.error(error.message);
  }
};
export const getCityBranches = async (cityId) => {
  try {
    const res = await fetch(`${BASE_URL}/api/v1/branch/city/${cityId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching branches:", error);
    return [];
  }
};

export const editBranchFunc = async (id, name, code, city) => {
  try {
    toast.loading("Updating Branch...");
    const res = await fetch(`${BASE_URL}/api/v1/branch/branches/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      cache: "no-store",
      body: JSON.stringify({ name, code, city }),
    });
    toast.dismiss();
    const data = await res.json();
    if (!res.ok) {
      return toast.error(data.message);
    }
    toast.success(data.message);
    return data;
  } catch (error) {
    console.log(error);
    return toast.error(error.message);
  }
};

export const deleteBranch = async (id) => {
  try {
    toast.loading("Deleting Branch...");
    const res = await fetch(`${BASE_URL}/api/v1/branch/branches/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      cache: "no-store",
    });
    toast.dismiss();
    const data = await res.json();
    if (!res.ok) {
      return toast.error(data.message);
    }
    return toast.success(data.message);
  } catch (error) {
    console.log(error);
    return toast.error(error.message);
  }
};

// Create a new course
export const createCourse = async (name, description, price, perparation) => {
  try {
    toast.loading("Creating Course...");
    const res = await fetch(`${BASE_URL}/api/v1/course/courses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      cache: "no-store",
      body: JSON.stringify({ name, description, price, perparation }),
    });
    toast.dismiss();
    const data = await res.json();
    if (!res.ok) {
      return toast.error(data.message);
    }
    return toast.success(data.message);
  } catch (error) {
    console.log(error);
    return toast.error("Error creating course. Please try again.");
  }
};

// Get all courses
export const getAllCourses = async (field) => {
  try {
    const res = await fetch(
      `${BASE_URL}/api/v1/course/courses?field=${field || ""}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        cache: "no-store",
      }
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
    return toast.error("Error fetching courses. Please try again.");
  }
};

// Edit a course
export const editCourseFunc = async (id, name, description, price) => {
  try {
    toast.loading("Updating Course...");
    const res = await fetch(`${BASE_URL}/api/v1/course/courses/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      cache: "no-store",
      body: JSON.stringify({ name, description, price }),
    });
    toast.dismiss();
    const data = await res.json();
    if (!res.ok) {
      return toast.error(data.message);
    }
    toast.success(data.message);
    return data;
  } catch (error) {
    console.log(error);
    return toast.error("Error updating course. Please try again.");
  }
};

// Delete a course
export const deleteCourse = async (id) => {
  try {
    toast.loading("Deleting Course...");
    const res = await fetch(`${BASE_URL}/api/v1/course/courses/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      cache: "no-store",
    });
    toast.dismiss();
    const data = await res.json();
    if (!res.ok) {
      return toast.error(data.message);
    }
    return toast.success(data.message);
  } catch (error) {
    console.log(error);
    return toast.error("Error deleting course. Please try again.");
  }
};

// Create a new batch
export const createBatch = async (name, course, totalSeats) => {
  try {
    toast.loading("Creating Batch...");
    const res = await fetch(`${BASE_URL}/api/v1/batch/batches`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      cache: "no-store",
      body: JSON.stringify({ name, course, totalSeats }),
    });
    toast.dismiss();
    const data = await res.json();
    if (!res.ok) {
      return toast.error(data.message);
    }
    return toast.success(data.message);
  } catch (error) {
    console.log(error);
    return toast.error("Error creating batch. Please try again.");
  }
};

// Get all batches
export const getAllBatches = async () => {
  try {
    const res = await fetch(`${BASE_URL}/api/v1/batch/batches`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      cache: "no-store",
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
    return toast.error("Error fetching batches. Please try again.");
  }
};

export const getCourseBatches = async (courseId) => {
  try {
    const res = await fetch(`${BASE_URL}/api/v1/batch/course/${courseId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching Batches:", error);
    return [];
  }
};

// Edit a batch
export const editBatchFunc = async (id, name, course, totalSeats) => {
  try {
    toast.loading("Updating Batch...");
    const res = await fetch(`${BASE_URL}/api/v1/batch/batches/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      cache: "no-store",
      body: JSON.stringify({ name, course, totalSeats }),
    });
    toast.dismiss();
    const data = await res.json();
    if (!res.ok) {
      return toast.error(data.message);
    }
    toast.success(data.message);
    return data;
  } catch (error) {
    console.log(error);
    return toast.error("Error updating batch. Please try again.");
  }
};

// Delete a batch
export const deleteBatch = async (id) => {
  try {
    toast.loading("Deleting Batch...");
    const res = await fetch(`${BASE_URL}/api/v1/batch/batches/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      cache: "no-store",
    });
    toast.dismiss();
    const data = await res.json();
    if (!res.ok) {
      return toast.error(data.message);
    }
    return toast.success(data.message);
  } catch (error) {
    console.log(error);
    return toast.error("Error deleting batch. Please try again.");
  }
};

// Create a new coupon
export const createCoupon = async (name, code, type, discount, start, end) => {
  try {
    toast.loading("Creating Coupon...");
    const res = await fetch(`${BASE_URL}/api/v1/coupon/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      cache: "no-store",
      body: JSON.stringify({ name, code, type, discount, start, end }),
    });
    toast.dismiss();
    const data = await res.json();
    if (!res.ok) {
      return toast.error(data.message);
    }
    return toast.success(data.message);
  } catch (error) {
    console.log(error);
    return toast.error("Error creating coupon. Please try again.");
  }
};

// Get all coupons
export const getAllCoupons = async (type, expired, future) => {
  try {
    const res = await fetch(
      `${BASE_URL}/api/v1/coupon?type=${type}&expired=${
        expired || "true"
      }&future=${future || "true"}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        cache: "no-store",
      }
    );
    const data = await res.json();
    if (!res.ok) {
      return [];
    }
    return data;
  } catch (error) {
    console.log(error);
    return toast.error("Error fetching coupons. Please try again.");
  }
};

// Edit a coupon
export const editCouponFunc = async (
  id,
  name,
  code,
  type,
  discount,
  start,
  end
) => {
  try {
    toast.loading("Updating Coupon...");
    const res = await fetch(`${BASE_URL}/api/v1/coupon/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      cache: "no-store",
      body: JSON.stringify({ name, code, type, discount, start, end }),
    });
    toast.dismiss();
    const data = await res.json();
    if (!res.ok) {
      return toast.error(data.message);
    }
    toast.success(data.message);
    return data;
  } catch (error) {
    console.log(error);
    return toast.error("Error updating coupon. Please try again.");
  }
};

// Delete a coupon
export const deleteCoupon = async (id) => {
  try {
    toast.loading("Deleting Coupon...");
    const res = await fetch(`${BASE_URL}/api/v1/coupon/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      cache: "no-store",
    });
    toast.dismiss();
    const data = await res.json();
    if (!res.ok) {
      return toast.error(data.message);
    }
    return toast.success(data.message);
  } catch (error) {
    console.log(error);
    return toast.error("Error deleting coupon. Please try again.");
  }
};

export const getAllAdms = async () => {
  try {
    const res = await fetch(`${BASE_URL}/api/v1/adm/all`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      method: "GET",

      cache: "no-store",
    });
    const data = await res.json();
    if (!res.ok) {
      return [];
    }
    return data.adms;
  } catch (error) {
    return toast.error(error.message);
  }
};

export const viewSingleAdm = async (admId, router) => {
  try {
    const res = await fetch(`${BASE_URL}/api/v1/adm/${admId}`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      method: "GET",
      cache: "no-store",
    });
    const data = await res.json();
    if (!res.ok || res.status === 500) {
      toast.error(data.message);
      return router.push("/admin/admission");
    }
    return data.adm;
  } catch (error) {
    toast.error(error.message);
  }
};

export const deleteAdm = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/api/v1/adm/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      cache: "no-store",
      method: "DELETE",
    });

    const data = await res.json();
    if (!res.ok) {
      return toast.error(data.message);
    }
    toast.success(data.message);
    return res;
  } catch (error) {
    toast.error(error.message);
  }
};

// Create a new preparation
export const createPreparationField = async (name) => {
  try {
    toast.loading("Creating Preparation...");
    const res = await fetch(`${BASE_URL}/api/v1/course/prep`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      cache: "no-store",
      body: JSON.stringify({ name }),
    });
    toast.dismiss();
    const data = await res.json();
    if (!res.ok) {
      return toast.error(data.message);
    }
    toast.success(data.message);
    return data;
  } catch (error) {
    console.log(error);
    return toast.error("Error creating preparation. Please try again.");
  }
};

// Get all preparations
export const getAllPreparationFields = async () => {
  try {
    const res = await fetch(`${BASE_URL}/api/v1/course/prep`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      cache: "no-store",
    });
    const data = await res.json();
    if (!res.ok) {
      return [];
    }
    return data.prep;
  } catch (error) {
    console.log(error);
    return toast.error("Error fetching preparations. Please try again.");
  }
};

// Update a preparation
export const editPreparationFieldFunc = async (id, name) => {
  try {
    toast.loading("Updating Preparation...");
    const res = await fetch(`${BASE_URL}/api/v1/course/prep`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      cache: "no-store",
      body: JSON.stringify({ name, preparationId: id }),
    });
    toast.dismiss();
    const data = await res.json();
    if (!res.ok) {
      return toast.error(data.message);
    }
    toast.success(data.message);
    return data;
  } catch (error) {
    console.log(error);
    return toast.error("Error updating preparation. Please try again.");
  }
};

// Delete a preparation
export const deletePreparationField = async (id) => {
  try {
    toast.loading("Deleting Preparation...");
    const res = await fetch(`${BASE_URL}/api/v1/course/prep/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      cache: "no-store",
    });
    toast.dismiss();
    const data = await res.json();
    if (!res.ok) {
      return toast.error(data.message);
    }
    toast.success(data.message);
    return data;
  } catch (error) {
    console.log(error);
    return toast.error("Error deleting preparation. Please try again.");
  }
};
