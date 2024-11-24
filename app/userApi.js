import { toast } from "react-toastify";

const BASE_URL = "https://api.ekagra.in";

export const createOrder = async (amount) => {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/adm/create-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount }),
    });

    const data = await response.json();

    if (response.ok) {
      return data;
    } else {
      return toast.error(data.message);
    }
  } catch (error) {
    console.error("Error creating order:", error);
  }
};
