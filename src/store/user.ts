/*
 * @Author: Libra
 * @Date: 2023-12-05 15:48:41
 * @LastEditors: Libra
 * @Description:
 */
import { IUser } from "@/api/user";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
  token: string;
  userInfo: Partial<IUser>;
}

const initialState: UserState = {
  token: "",
  userInfo: {},
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    setUserInfo: (state, action: PayloadAction<Partial<IUser>>) => {
      state.userInfo = action.payload;
    },
  },
});

export const { setToken, setUserInfo } = userSlice.actions;

export default userSlice.reducer;
