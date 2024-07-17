import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import jwtAxios, { setAuthToken } from "../../service/jwtAxios";
import { setLoading } from "./commonSlice";
import { notificationFail, notificationSuccess } from "./notificationSlice";

const authToken = window.localStorage.getItem("authToken") || null;
const roleId = window.localStorage.getItem("roleId") || null;
const userId = window.localStorage.getItem("userId") || null;

const initialState = {
  authToken: authToken,
  userId: userId,
  roleId: roleId,
  SAL: null,
};

export const login = createAsyncThunk("login", async (action, { dispatch }) => {
  dispatch(setLoading(true));
  try {
    let res = await jwtAxios.post(`/auth/adminlogin`, action).catch((error) => {
      if(typeof error == "string"){
        dispatch(notificationFail(error));
      } else{
        dispatch(notificationFail(error?.response?.data?.message));
      }
      dispatch(setLoading(false));
    });
    if (res?.data) {
      setAuthToken(res.data?.token);
      return {
        authToken: res.data?.token,
        userId: res.data?.userId,
        roleId: res.data?.roleId,
        ...action,
      };
    }
  } catch (error) {
    return error.message;
  }
});

export const logout = createAsyncThunk(
  "logout",
  async (action, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      let res = await jwtAxios
        .post(`/auth/adminlogout`, action)
        .catch((error) => {
          dispatch(notificationFail("Something went wrong"));
          dispatch(setLoading(false));
        });
      window.localStorage.removeItem("token");
      window.localStorage.clear();
      dispatch(notificationSuccess(res.data?.message));
      setAuthToken(null);
      dispatch(setLoading(false));
      return { authToken: null };
    } catch (error) {
      dispatch(notificationFail("Something went wrong"));
      return error.message;
    }
  }
);

export const getAllPermissions = createAsyncThunk(
  "getAllPermissions",
  async (action, { dispatch }) => {
    try {
      const res = await jwtAxios
        .get(`auth/getAllPermissions`)
        .then((response) => {
          return response?.data?.fetchAllpermissions;
        });
      return res;
    } catch (error) {
      dispatch(notificationFail(error?.response?.data?.message));
    }
  }
);

const authenticationSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSAL: (state, action) => ({
      ...state,
      SAL: action.payload
    })
  },
  extraReducers(builder) {
    builder
      .addCase(login.fulfilled, (state, action) => {
        if (!action?.payload) {
          return;
        }
        state.authToken = action.payload?.authToken;  
        state.userId = action.payload?.userId;
        state.roleId = action.payload?.roleId;
        window.localStorage.setItem("authToken", action.payload?.authToken);
        window.localStorage.setItem("userId", action.payload?.userId);
        window.localStorage.setItem("roleId", action.payload?.roleId);
      })
      .addCase(logout.fulfilled, (state, action) => {
        if (!action?.payload) {
          return;
        }
        window.localStorage.removeItem("authToken");
        window.localStorage.removeItem("roleId");

        state.authToken = null;
        state.roleId = null;
        state.ipAddress = null;
      })
      .addCase(getAllPermissions.fulfilled, (state, action) => {
        if (!action?.payload) {
          return;
        }
        state.fetchAllpermissions = action.payload;
      });
  },
});

export const { setSAL } = authenticationSlice.actions
export default authenticationSlice.reducer;
