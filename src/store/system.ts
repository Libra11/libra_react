/*
 * @Author: Libra
 * @Date: 2024-01-08 15:59:19
 * @LastEditors: Libra
 * @Description:
 */
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface SystemState {
  isDark: boolean;
}

const initialState: SystemState = {
  isDark: false,
};

export const systemSlice = createSlice({
  name: "system",
  initialState,
  reducers: {
    setIsDark: (state, action: PayloadAction<string>) => {
      state.isDark = action.payload === "true";
    },
  },
});

export const { setIsDark } = systemSlice.actions;
export default systemSlice.reducer;
