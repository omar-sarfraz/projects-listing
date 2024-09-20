import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { OfflineEventType, Project } from "../../lib/types";
import { RootState } from "../store";

type StateType = {
    value: Project[];
    events: OfflineEventType[];
};

const initialState: StateType = {
    value: [],
    events: [],
};

const slice = createSlice({
    name: "projects",
    initialState,
    reducers: {
        setProjects(state, action: PayloadAction<Project[]>) {
            state.value = action.payload;
        },
        listenProjectEvents() {},
        addOfflineEvent(state, action: PayloadAction<OfflineEventType>) {
            const newEvent = {
                ...action.payload,
                id: state.events?.length ? state.events.length + 1 : 1,
            };

            if (state.events) state.events = [...state.events, newEvent];
            else state.events = [newEvent];
        },
        removeOfflineEvent(state, action: PayloadAction<{ id: number }>) {
            state.events = state.events.filter(
                (offlineEvent) => offlineEvent.id !== action.payload.id
            );
        },
    },
});

export const { setProjects, listenProjectEvents, addOfflineEvent, removeOfflineEvent } =
    slice.actions;

export const selectProjects = (state: RootState) => state.projects.value;
export const selectEvents = (state: RootState) => state.projects.events;

export default slice.reducer;
