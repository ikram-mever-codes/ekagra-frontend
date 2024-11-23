import { toast } from "react-toastify";

// export const BASE_URL = "http://localhost:6001";
const BASE_URL = "https://api.ekagra.in";

export const login = async (email, password, router) => {
  try {
    const res = await fetch(`${BASE_URL}/api/v1/user/login`, {
      method: "POST",
      credentials: "include",
      cache: "no-store",
      body: JSON.stringify({ email, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.message || "Login failed.");
      return;
    }

    toast.success(data.message || "Login successful!");
    if (router) {
      await router.push("/");
    }

    return data;
  } catch (error) {
    toast.error(error?.message || "An unexpected error occurred.");
  }
};

export const logout = async (setUser) => {
  try {
    const res = await fetch(`${BASE_URL}/api/v1/user/logout`, {
      method: "GET",
      credentials: "include",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.message || "Logout failed.");
      return;
    }

    toast.success(data.message || "Logout successful!");
    setUser(null);
  } catch (error) {
    toast.error(error?.message || "An unexpected error occurred.");
  }
};

export const refresh = async () => {
  try {
    const res = await fetch(`${BASE_URL}/api/v1/user/refresh`, {
      method: "GET",
      credentials: "include",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    if (!res.ok) {
      return null;
    }

    return data;
  } catch (error) {
    console.error("Refresh Error:", error);
  }
};
