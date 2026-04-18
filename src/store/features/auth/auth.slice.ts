import { RootState } from "@/store/store";
import { TUser } from "@/store/storeTypes/user";
import { createSlice } from "@reduxjs/toolkit";

type Tstate = {
  user: TUser | null;
  accessToken: string | null;
};

const demoUser: TUser = {
  id: "demo-12345",
  email: "admin@example.com",
  fullName: "Demo Admin",
  role: "admin",
  isVerified: true,
  isActive: true,
  isDeleted: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  deletedAt: null,
  profilePhoto: "",
  first_name: "Demo",
  last_name: "Admin",
  phone_number: "+1 (555) 000-0000",
  city: "New York",
  area: "",
  password: "",
  confirm_password: "",
};

const initialState: Tstate = {
  user: demoUser,
  accessToken: "demo-token-1234",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { user, accessToken } = action.payload || {};
      if (!user || !accessToken) {
        console.error("Invalid payload received:", action.payload);
        return;
      }
      state.accessToken = accessToken;
      state.user = user;
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
