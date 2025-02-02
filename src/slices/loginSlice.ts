import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { ILoginPayload, ILoginState } from "@/Utilities/Types";
import { getCookie, removeCookie, setCookie } from "@/Utilities/utilities";

const initialState: ILoginState = {
  loggedIn: false,
  loading: false,
  message: "",
  "auth-token": undefined,
  username: undefined,
  userid: undefined,
  role: undefined,
};

const loginUrl = `${import.meta.env.BLOGPOST_FRONTEND_API_URL}/login/`;

export const login = createAsyncThunk(
  "login",
  async (payload: ILoginPayload, { rejectWithValue }) => {
    try {
      const response = await axios.post(loginUrl, payload);
      const data = response.data;
      setCookie("auth-token", data.accessToken);
      setCookie("userid", data.userid);
      setCookie("username", data.username);
      setCookie("role", data.role);
      return data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue((error as Error).message);
    }
  }
);

const loginSlice = createSlice({
  name: "login",
  initialState: () => {
    const username = getCookie("username");
    const userid = getCookie("userid");
    const authToken = getCookie("auth-token");
    const role = getCookie("role");

    if (!authToken) return initialState;

    return {
      ...initialState,
      loggedIn: true,
      username,
      userid,
      role,
      "auth-token": authToken,
    };
  },
  reducers: {
    logout: (state) => {
      console.log("in logout");
      removeCookie("auth-token");
      removeCookie("userid");
      removeCookie("username");
      state.loggedIn = false;
      state["auth-token"] = undefined;
      state.username = undefined;
      state.userid = undefined;
      state.role = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loggedIn = true;
        state.loading = false;
        console.log("payload", action.payload);
        state["auth-token"] = action.payload.accessToken;
        state.username = action.payload.username;
        state.userid = action.payload.userid;
        state.role = action.payload.role;
      })
      .addCase(login.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default loginSlice.reducer;
export const { logout } = loginSlice.actions;
