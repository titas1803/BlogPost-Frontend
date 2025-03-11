import { IUserState } from "@/Utilities/Types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { logout } from "./loginSlice";

const initialState: IUserState = {
  _id: "",
  isLoading: true,
  hasError: false,
  isFetched: false,
  name: "",
  userName: "",
  bio: "",
  email: "",
  phone: "",
  photo: "",
  gender: "",
  dob: "",
  role: "USER",
  noOfSubscribers: {
    authorId: "",
    subscribedBy: [],
    subscribedTo: [],
  },
};

const userApiUrl = `${import.meta.env.BLOGPOST_FRONTEND_API_URL}/user/`;

export const fetchInitialuserDetails = createAsyncThunk(
  "fetchInitialUser",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as {
        login: { loggedIn: boolean; "auth-token"?: string };
      };
      if (state.login.loggedIn && state.login["auth-token"]) {
        const response = await axios.get(userApiUrl + "getuser", {
          headers: {
            Authorization: `Bearer ${state.login["auth-token"]}`,
          },
        });
        return response.data;
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue((error as Error).message);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInitialuserDetails.pending, (state) => {
        Object.assign(state, initialState, {
          isLoading: true,
          hasError: false,
          isFetched: false,
        });
      })
      .addCase(fetchInitialuserDetails.fulfilled, (state, action) => {
        if (action.payload.success) {
          Object.assign(state, action.payload.user, {
            isLoading: false,
            hasError: false,
            isFetched: true,
          });
        }
      })
      .addCase(fetchInitialuserDetails.rejected, (state) => {
        state.isLoading = false;
        state.hasError = true;
        state.isFetched = false;
      })
      .addCase(logout, (state) => {
        Object.assign(state, initialState);
      });
  },
});

export default userSlice.reducer;
