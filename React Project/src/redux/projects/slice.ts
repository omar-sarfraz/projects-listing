import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Project } from "../../lib/types";
import { RootState } from "../store";

type StateType = {
    value: Project[];
};

const initialState: StateType = {
    value: [],
};

const slice = createSlice({
    name: "projects",
    initialState,
    reducers: {
        setProjects(state, action: PayloadAction<Project[]>) {
            state.value = action.payload;
        },
    },
});

export const { setProjects } = slice.actions;

export const selectProjects = (state: RootState) => state.projects.value;

export default slice.reducer;
