import { call, put, select, delay, takeLatest } from "redux-saga/effects";

import { listenProjectEvents, removeOfflineEvent, selectEvents } from "./slice";
import { OfflineEventType } from "../../lib/types";

import { createProjectFormData } from "../../pages/SubmitProject/utils";
import { usePlainAxios } from "../../hooks/useAxios";

const axiosInstance = usePlainAxios();

const postProject = ({ payload }: OfflineEventType) => {
    const formData = createProjectFormData(payload.data);
    return axiosInstance.post(payload.url, formData, payload.requestOptions);
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
                    if (event.id) yield put(removeOfflineEvent({ id: event.id }));
                } catch (error) {
                    console.error(`Failed to process event with ID ${event.id}:`, error);
                }
            }
        }

        yield delay(10000);
    }
}

export function* watchProjectEvents() {
    yield takeLatest(listenProjectEvents.type, processEvents);
}
