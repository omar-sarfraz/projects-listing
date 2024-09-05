import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Project } from "../../lib/types";
import { RootState } from "../store";
import { NavigateFunction } from "react-router-dom";

type StateType = {
    project: Project | null;
    loading: boolean;
};

const initialState: StateType = {
    project: null,
    loading: false,
};

const slice = createSlice({
    name: "project",
    initialState,
    reducers: {
        fetchProjectRequest(state, _: PayloadAction<{ projectId: number }>) {
            state.loading = true;
        },
        fetchProjectSuccess(state, action: PayloadAction<Project>) {
            state.project = action.payload;
            state.loading = false;
        },
        fetchProjectFailure(state) {
            state.loading = false;
        },
        acceptBidRequest(_, __: PayloadAction<{ bidId: number; projectId: number }>) {},
        acceptBidSuccess(state, { payload }: { payload: Project }) {
            if (state.project) {
                state.project = { ...state.project, acceptedBid: payload.acceptedBid };
            }
        },
        deleteBidRequest(_, __: PayloadAction<{ bidId: number; projectId: number }>) {},
        deleteBidSuccess(state, { payload }: { payload: { bidId: number } }) {
            const project = state.project;
            if (project && project.bids?.length) {
                let newBids = project.bids.filter((bid) => bid.id !== payload.bidId);
                state.project = { ...project, bids: newBids };
            }
        },
        deleteProjectRequest(
            _,
            __: PayloadAction<{ projectId: number; navigate: NavigateFunction }>
        ) {},
        deleteProjectSuccess(_, { payload }: { payload: { navigate: NavigateFunction } }) {
            // toast(response.data.message, "success");
            payload.navigate("/");
        },
    },
});

export const {
    fetchProjectRequest,
    fetchProjectSuccess,
    fetchProjectFailure,
    acceptBidRequest,
    acceptBidSuccess,
    deleteBidRequest,
    deleteBidSuccess,
    deleteProjectRequest,
    deleteProjectSuccess,
} = slice.actions;
export const selectProject = (state: RootState) => state.project;

export default slice.reducer;
