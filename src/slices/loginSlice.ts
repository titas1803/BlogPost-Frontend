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
  error: undefined,
};

const loginUrl = `${import.meta.env.BLOGPOST_FRONTEND_API_URL}/login/`;

export const login = createAsyncThunk(
  "login",
  async (payload: ILoginPayload, { rejectWithValue }) => {
    try {
      const response = await axios.post(loginUrl, payload);
      const { accessToken, userid, username, role } = response.data;
      ["auth-token", "userid", "username", "role"].forEach((key, index) =>
        setCookie(key, [accessToken, userid, username, role][index])
      );
      return response.data;
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
      ["auth-token", "userid", "username", "role"].forEach(removeCookie);
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(login.fulfilled, (state, action) => {
        Object.assign(state, {
          loggedIn: true,
          loading: false,
          "auth-token": action.payload.accessToken,
          username: action.payload.username,
          userid: action.payload.userid,
          role: action.payload.role,
          error: undefined,
        });
      })
      .addCase(login.rejected, (state, action) => {
        console.log(action);
        state.loading = false;
        state.error = (action.payload as { message: string }).message;
      });
  },
});

export default loginSlice.reducer;
export const { logout } = loginSlice.actions;
