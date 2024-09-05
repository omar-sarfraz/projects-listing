import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Project } from "../../lib/types";
import { RootState } from "../store";

type StateType = {
    projects: Project[];
    loading: boolean;
};

const initialState: StateType = {
    projects: [],
    loading: false,
};

const slice = createSlice({
    name: "projects",
    initialState,
    reducers: {
        fetchDataRequest(state) {
            state.loading = true;
        },
        fetchDataSuccess(state, action: PayloadAction<Project[]>) {
            state.projects = action.payload;
            state.loading = false;
        },
        fetchDataFailure(state) {
            state.loading = false;
        },
    },
});

export const { fetchDataRequest, fetchDataSuccess, fetchDataFailure } = slice.actions;
export const selectProjects = (state: RootState) => state.projects;
export default slice.reducer;
