import { call, put, takeLatest } from "redux-saga/effects";
import { AxiosResponse } from "axios";

import useAxios from "../../hooks/useAxios";
import { Project } from "../../lib/types";

import { setError } from "../error/slice";
import { fetchProjectsRequest, fetchProjectsSuccess, fetchProjectsFailure } from "./slice";

async function fetchApi() {
    const axiosInstance = useAxios();
    return axiosInstance.get("/projects");
}

function* fetchProjects() {
    try {
        const response: AxiosResponse = yield call(fetchApi);
        const projects: Project[] = response.data.data;

        yield put(fetchProjectsSuccess(projects));
    } catch (error: any) {
        yield put(fetchProjectsFailure());
        yield put(setError(error.response?.data?.message || error?.message));
    }
}

export default function* watchFetchProjects() {
    yield takeLatest(fetchProjectsRequest.type, fetchProjects);
}
