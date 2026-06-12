import { RootState } from "@/store/store";
import { TUser } from "@/store/storeTypes/user";
import { createSlice } from "@reduxjs/toolkit";

type Tstate = {
  user: TUser | null;
  accessToken: string | null;
};

const initialState: Tstate = {
  user: null,
  accessToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { user, accessToken } = action.payload || {};
      state.accessToken = accessToken ?? state.accessToken;
      state.user = user ?? state.user;
    },

    logout: (state) => {
      state.user = null;
      state.accessToken = null;
    },
  },
});

export const { setUser, logout } = authSlice.actions;

export const selectUser = (state: RootState) => state.auth?.user;
export const selectToken = (state: RootState) => state.auth?.accessToken;

const authReducer = authSlice.reducer;
export default authReducer;
