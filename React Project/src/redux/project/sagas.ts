import { call, put, takeLatest } from "redux-saga/effects";
import { AxiosResponse } from "axios";

import { Project } from "../../lib/types";
import useAxios from "../../hooks/useAxios";

import { setError } from "../error/slice";
import {
    fetchProjectRequest,
    fetchProjectSuccess,
    fetchProjectFailure,
    acceptBidSuccess,
    acceptBidRequest,
    deleteBidRequest,
    deleteBidSuccess,
    deleteProjectRequest,
} from "./slice";
import { NavigateFunction } from "react-router-dom";
import { push } from "redux-first-history";

const axiosInstance = useAxios();

function* fetchProject(action: { type: string; payload: { projectId: number } }) {
    try {
        const url = "/projects/" + action.payload.projectId;

        const response: AxiosResponse = yield call(axiosInstance.get, url);
        const project: Project = response.data.data;

        yield put(fetchProjectSuccess(project));
    } catch (error: any) {
        yield put(fetchProjectFailure());
        yield put(setError(error.response?.data?.message || error?.message));
    }
}

function* acceptBid(action: { type: string; payload: { projectId: number; bidId: number } }) {
    const projectId = action.payload.projectId;
    const bidId = action.payload.bidId;

    try {
        const url = `/projects/${projectId}/bids/${bidId}/accept`;

        const response: AxiosResponse = yield call(axiosInstance.post, url);
        const updatedProject: Project = response.data.data;

        yield put(acceptBidSuccess(updatedProject));
    } catch (error: any) {
        yield put(setError(error.response?.data?.message || error?.message));
    }
}

function* deleteBid(action: { type: string; payload: { projectId: number; bidId: number } }) {
    const projectId = action.payload.projectId;
    const bidId = action.payload.bidId;

    try {
        const url = `/projects/${projectId}/bids/${bidId}`;

        yield call(axiosInstance.delete, url);

        yield put(deleteBidSuccess({ bidId }));
    } catch (error: any) {
        yield put(setError(error.response?.data?.message || error?.message));
    }
}

function* deleteProject(action: {
    type: string;
    payload: { projectId: number; navigate: NavigateFunction };
}) {
    const projectId = action.payload.projectId;

    try {
        const url = `/projects/${projectId}`;

        yield call(axiosInstance.delete, url);

        yield put(push("/"));
    } catch (error: any) {
        yield put(setError(error.response?.data?.message || error?.message));
    }
}

export default function* watchProjectSagas() {
    yield takeLatest(fetchProjectRequest.type, fetchProject);
    yield takeLatest(acceptBidRequest.type, acceptBid);
    yield takeLatest(deleteBidRequest.type, deleteBid);
    yield takeLatest(deleteProjectRequest.type, deleteProject);
}
