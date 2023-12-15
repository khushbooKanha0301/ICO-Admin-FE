import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import jwtAxios from "../../service/jwtAxios";
import { notificationFail } from "./notificationSlice";

const initialState = {
  userData: {},
  userAllData: [],
  totalUser: 0,
  totalKYCUser: 0,
  sinceLastWeekUserCount: 0,
  sinceLastWeekKYCUserCount: 0,
};

export const getuserData = createAsyncThunk(
  "getuserData",
  async (data, { dispatch }) => {
    try {
      let res = await jwtAxios.get(`/users/viewKyc/${data}`).catch((error) => {
        dispatch(notificationFail(error?.response?.data?.message));
      });
      return res?.data;
    } catch (error) {
      return error.message;
    }
  }
);

export const getuserList = createAsyncThunk(
  "getuserList",
  async (data, { dispatch }) => {
    try {
      let res = await jwtAxios.get(`/users/userList`).catch((error) => {
        dispatch(notificationFail(error?.response?.data?.message));
      });
      return res.data?.users;
    } catch (error) {
      return error.message;
    }
  }
);
export const getUsersCount = createAsyncThunk(
  "getUsersCount",
  async (data, { dispatch }) => {
    try {
      let res = await jwtAxios.get(`/users/getUsersCount`).catch((err) => {
        dispatch(notificationFail(err?.response?.data?.message));
      });
      return res.data;
    } catch (error) {
      return error.message;
    }
  }
);

const userSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getuserData.fulfilled, (state, action) => {
        if (!action?.payload) {
          return;
        }
        state.userData = action.payload;
      })
      .addCase(getuserList.fulfilled, (state, action) => {
        if (!action?.payload) {
          return;
        }
        state.userAllData = action.payload;
      })
      .addCase(getUsersCount.fulfilled, (state, action) => {
        if (!action?.payload) {
          return;
        }
        state.totalUser = action.payload?.totalUser;
        state.totalKYCUser = action.payload?.totalKYCUser;
        state.sinceLastWeekUserCount = action.payload?.sinceLastWeekUserCount;
        state.sinceLastWeekKYCUserCount =
          action.payload?.sinceLastWeekKYCUserCount;
      });
  },
});

export default userSlice.reducer;
