import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import jwtAxios, { setAuthToken } from "../../service/jwtAxios";
import { countryCodes } from "../countryCodes";
import { setLoading } from "./commonSlice";
import { notificationFail, notificationSuccess } from "./notificationSlice";

const userData = JSON.parse(window?.localStorage?.getItem("userData"))
  ? JSON.parse(window.localStorage.getItem("userData"))
  : null;

const initialState = {
  authdata: {
    account: userData?.account ? userData?.account : "Connect Wallet",
    authToken: userData?.authToken,
    userid: userData?.userid,
    imageUrl: userData?.imageUrl,
  },
  countryDetails: null,
};

export const checkAuth = createAsyncThunk(
  "checkAuth",
  async (action, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      let resBody = null;
      let account = action.account;
      let library = action.library;
      let checkValue = action.checkValue;
      setAuthToken(null);
      let response = await jwtAxios
        .get(`/auth/nonce/${account}`, {
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        })
        .then((response) => {
          resBody = response.data;
          setAuthToken(resBody.tempToken);
          return response.data;
        })
        .catch((error) => {
          console.log(error);
          dispatch(
            notificationFail(
              "Something Went Wrong. Can you please Connect wallet again?"
            )
          );
          window.localStorage.removeItem("token");
          window.localStorage.clear();
        });
      let provider = window.localStorage.getItem("provider");
      let signature;
      if (provider == "fortmatic") {
        signature = await window.web3.eth.personal.sign(
          resBody.message,
          account
        );
      } else {
        signature = await library
          .getSigner(account)
          .signMessage(resBody.message);
      }

      if (response) {
        let verifyTokenData = await jwtAxios
          .post(`/users/verify?signatureId=${signature}`, {
            walletType: checkValue,
          })
          .catch((error) => {
            dispatch(
              notificationSuccess(
                "Something Went Wrong. Can you please Connect wallet again?"
              )
            );
            window.localStorage.removeItem("token");
            window.localStorage.clear();
          });
        if (verifyTokenData.data.token) {
          setAuthToken(verifyTokenData.data.token);
        }
        let userData = {
          account: account,
          authToken: verifyTokenData.data.token,
          userid: verifyTokenData.data.userInfo._id,
          imageUrl: verifyTokenData.data.imageUrl,
        };
        window.localStorage.setItem("userData", JSON.stringify(userData));
        dispatch(setLoading(false));
        dispatch(notificationSuccess("user login successfully"));
        return userData;
      }
    } catch (error) {
      dispatch(setLoading(false));
      return error.message;
    }
  }
);

export const logoutAuth = createAsyncThunk(
  "logoutAuth",
  async (action, { dispatch }) => {
    try {
      await jwtAxios.get(`/users/logout`).catch((error) => {
        dispatch(notificationFail("Something went wrong"));
        dispatch(setLoading(false));
      });

      setAuthToken(null);
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("userData");
      window.localStorage.clear();
      let userData = {
        account: "Connect Wallet",
        authToken: null,
        userid: null,
      };
      dispatch(setLoading(false));
      return userData;
    } catch (error) {
      dispatch(setLoading(false));
      return error.message;
    }
  }
);

export const userGetData = createAsyncThunk(
  "userGetData",
  async (action, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      let user = {};
      let imageUrl = "";
      await jwtAxios
        .get(`/users/getuser`)
        .then((response) => {
          user = response.data.User;
          imageUrl = response.data.imageUrl;
        })
        .catch((error) => {
          dispatch(notificationFail("Something went wrong with get user"));
        });
      dispatch(setLoading(false));
      return { ...user, imageUrl: imageUrl };
    } catch (error) {
      dispatch(setLoading(false));

      return error.message;
    }
  }
);

export const getCountryDetails = createAsyncThunk(
  "getCountryDetails",
  async (action, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      // const response = await fetch ("https://ipapi.co/json/");
      const response = await fetch(`https://geolocation-db.com/json/`).then(
        (res) => res.json()
      );
      dispatch(setLoading(false));
      let country_calling_code =
        countryCodes.find((x) => x.code === response?.country_code).dial_code ||
        "";
      let countryData = Object.assign(response, {
        country_calling_code: country_calling_code,
      });
      return countryData;
    } catch (error) {
      dispatch(setLoading(false));
      return error.message;
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(checkAuth.fulfilled, (state, action) => {
        if (!action?.payload) {
          return;
        }
        state.authdata = action.payload;
      })
      .addCase(logoutAuth.fulfilled, (state, action) => {
        if (!action?.payload) {
          return;
        }
        state.authdata = action.payload;
      })
      .addCase(userGetData.fulfilled, (state, action) => {
        if (!action?.payload) {
          return;
        }
        state.userfulldata = action.payload;
      })
      .addCase(getCountryDetails.fulfilled, (state, action) => {
        if (!action?.payload) {
          return;
        }
        state.countryDetails = action.payload;
      });
  },
});

export const userDetails = (state) => state.authReducer.authdata;
export const userGetFullDetails = (state) => state.authReducer.userfulldata;
export default authSlice.reducer;
