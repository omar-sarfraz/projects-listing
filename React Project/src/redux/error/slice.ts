import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

type StateType = {
    value: null | string;
};

const initialState: StateType = {
    value: null,
};

const slice = createSlice({
    name: "error",
    initialState,
    reducers: {
        resetError(state) {
            state.value = null;
        },
        setError(state, action) {
            state.value = action.payload;
        },
    },
});

export const { resetError, setError } = slice.actions;
export const selectError = (state: RootState) => state.error.value;
export default slice.reducer;
