import { createSlice } from "@reduxjs/toolkit";

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

export default statusSlice.reducer;
