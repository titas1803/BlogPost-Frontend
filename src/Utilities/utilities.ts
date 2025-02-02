import axios from "axios";
import Cookies from "js-cookie";

export const getCookie = (name: string) => {
  return Cookies.get(name);
};

export const setCookie = (name: string, value: string) => {
  return Cookies.set(name, value, {
    expires: 1 / 24,
  });
};

export const removeCookie = (name: string) => {
  Cookies.remove(name);
};

/**
 * @todo: properly use this to verify the token
 */
export const verifyAuthToken = async (token?: string) => {
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

export const processPhotoPath = (path: string): string => {
  if (path && path.length > 0) {
    return import.meta.env.BLOGPOST_FRONTEND_DB_IMAGES + path;
  } else {
    return path;
  }
};
export const processProfilePhotoPath = (path: string): string => {
  const processedpath = processPhotoPath(path);
  if (processedpath && processedpath.length > 0) {
    return processedpath;
  }
  return "/src/assets/profile-user.png";
};
