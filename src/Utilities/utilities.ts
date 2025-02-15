import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

export const getCookie = (name: string) => {
  return Cookies.get(name);
};

export const setCookie = (name: string, value: string) => {
  return Cookies.set(name, value, {
    expires: 7,
    secure: true, // Ensures the cookie is sent over HTTPS only
    sameSite: "Strict", // Prevents CSRF attacks
    path: "/", // Available throughout the site
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
    return import.meta.env.BLOGPOST_FRONTEND_BACKEND_URL + path;
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

export const updateProfileImage = async (
  photoData: FormData,
  authToken: string
) => {
  const response = await axios.patch(
    import.meta.env.BLOGPOST_FRONTEND_API_URL + "/user/update/update-photo",
    photoData,
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response;
};

export const deletePost = async (postid: string, authToken: string) => {
  console.log("post deleted");
  const DELETEURL =
    import.meta.env.BLOGPOST_FRONTEND_API_URL + `/post/${postid}`;
  try {
    const response = await axios.delete(DELETEURL, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    if (response.data.success) {
      toast.success("Post deleted successfully");
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      toast.error(`Error occurred, ${error.response?.data.message}`);
    } else {
      toast.error("An unknown error occurred");
    }
  }
};

export const updatePost = async (
  postid: string,
  body:
    | {
        title?: string;
        content?: string;
        tags?: string;
        categories?: string;
        isPublished?: "true" | "false";
      }
    | FormData,
  authToken: string
) => {
  console.log("post updated");
  const UPDATEURL =
    import.meta.env.BLOGPOST_FRONTEND_API_URL + `/post/${postid}`;
  try {
    const response = await axios.patch(UPDATEURL, body, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    if (response.data.success) {
      toast.success("Post updated successfully");
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      toast.error(`Error occurred, ${error.response?.data.message}`);
    } else {
      toast.error("An unknown error occurred");
    }
  }
};

export const socket = io(import.meta.env.BLOGPOST_FRONTEND_BACKEND_URL);
