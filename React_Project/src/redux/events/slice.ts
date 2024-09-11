import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { OfflineEventType } from "../../lib/types";
import { RootState } from "../store";

type StateType = {
    value: OfflineEventType[];
};

const initialState: StateType = {
    value: [],
};

const slice = createSlice({
    name: "events",
    initialState,
    reducers: {
        listenEvents() {},
        addOfflineEvent(state, action: PayloadAction<OfflineEventType>) {
            const newEvent = {
                ...action.payload,
                id: state.value?.length ? state.value.length + 1 : 1,
            };

            if (state.value) state.value = [...state.value, newEvent];
            else state.value = [newEvent];
        },
        removeOfflineEvent(state, action: PayloadAction<{ id: number }>) {
            state.value = state.value.filter(
                (offlineEvent) => offlineEvent.id !== action.payload.id
            );
        },
    },
});

export const { listenEvents, addOfflineEvent, removeOfflineEvent } = slice.actions;

export const selectEvents = (state: RootState) => state.events.value;

export default slice.reducer;
