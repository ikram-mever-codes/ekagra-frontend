import { toast } from "react-toastify";
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
      return toast.error(data.message);
    }
    toast.success(data.message);
    router.push("/");
    return data;
  } catch (error) {
    return toast.error(error.message);
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
      return toast.error(data.message);
    }

    toast.success(data.message);
    setUser(null);
  } catch (error) {
    return toast.error(error.message);
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
    toast.success(data.message);
    return data;
  } catch (error) {
    console.log(error);
  }
};
