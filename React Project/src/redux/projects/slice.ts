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
        fetchProjectsRequest(state) {
            state.loading = true;
        },
        fetchProjectsSuccess(state, action: PayloadAction<Project[]>) {
            state.projects = action.payload;
            state.loading = false;
        },
        fetchProjectsFailure(state) {
            state.loading = false;
        },
    },
});

export const { fetchProjectsRequest, fetchProjectsSuccess, fetchProjectsFailure } = slice.actions;
export const selectProjects = (state: RootState) => state.projects;

export default slice.reducer;
