import axios from "axios";
import Cookies from "js-cookie";

export const getCookie = (name: string) => {
  return Cookies.get(name);
};

export const setCookie = (name: string, value: string) => {
  return Cookies.set(name, value);
};

export const removeCookie = (name: string) => {
  Cookies.remove(name);
};

export const verifyAuthToken = async (token?: string) => {
  console.log(token);
  if (!token) return false;
  try {
    const response = await axios.get(
      import.meta.env.BLOGPOST_FRONTEND_API_URL + "/jwt/verify",
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );

    const verified = response.status === 200;
    return verified;
  } catch {
    return false;
  }
};
