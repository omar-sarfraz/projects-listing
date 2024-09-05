import { call, put, takeLatest } from "redux-saga/effects";
import { fetchDataRequest, fetchDataSuccess, fetchDataFailure } from "./slice";
import useAxios from "../../hooks/useAxios";
import { AxiosResponse } from "axios";
import { Project } from "../../lib/types";
import { setError } from "../error/slice";

async function fetchApi() {
    const axiosInstance = useAxios();
    return await axiosInstance.get("/projects");
}

function* fetchProjects() {
    try {
        const response: AxiosResponse = yield call(fetchApi);
        const projects: Project[] = response.data.data;

        yield put(fetchDataSuccess(projects));
    } catch (error: any) {
        console.log(error);
        yield put(fetchDataFailure());
        yield put(setError(error.response?.data?.message || error?.message));
    }
}

function* watchFetchProjects() {
    yield takeLatest(fetchDataRequest.type, fetchProjects);
}

export default function* rootSaga() {
    yield watchFetchProjects();
}
