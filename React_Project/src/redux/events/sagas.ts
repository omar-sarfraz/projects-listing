import { call, put, select, delay, takeLatest } from "redux-saga/effects";

import { listenEvents, removeOfflineEvent, selectEvents } from "./slice";
import { CreateBid, CreateProject, OfflineEventType } from "../../lib/types";

import { usePlainAxios } from "../../hooks/useAxios";

const axiosInstance = usePlainAxios();

const postProject = ({ payload }: OfflineEventType) => {
    const { data, url } = payload as CreateProject;
    return axiosInstance.post(url, data);
};

const postBid = ({ payload }: OfflineEventType) => {
    const { data, url } = payload as CreateBid;
    return axiosInstance.post(url, data);
};

function* processEvents() {
    while (true) {
        const events: OfflineEventType[] | undefined = yield select(selectEvents);

        if (events && events.length > 0) {
            for (const event of events) {
                try {
                    if (event.name === "CREATE_PROJECT") {
                        yield call(postProject, event);
                    }

                    if (event.name === "CREATE_BID") {
                        yield call(postBid, event);
                    }

                    if (event.id) yield put(removeOfflineEvent({ id: event.id }));
                } catch (error) {
                    console.error(`Failed to process event with ID ${event.id}:`, error);
                }
            }
        }

        yield delay(10000);
    }
}

export function* watchEvents() {
    yield takeLatest(listenEvents.type, processEvents);
}
