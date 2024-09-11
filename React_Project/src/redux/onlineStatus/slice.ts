import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

const initialState = {
    isOnline: navigator.onLine,
};

const statusSlice = createSlice({
    name: "status",
    initialState,
    reducers: {
        setOnline: (state) => {
            state.isOnline = true;
        },
        setOffline: (state) => {
            state.isOnline = false;
        },
        listenOnlineStatus() {},
    },
});

export const { setOnline, setOffline, listenOnlineStatus } = statusSlice.actions;

export const selectOnlineStatus = (state: RootState) => state.isUserOnline.isOnline;

export default statusSlice.reducer;
