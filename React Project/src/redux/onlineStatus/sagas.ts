import { takeLatest, put, call, take } from "redux-saga/effects";
import { setOnline, setOffline, listenOnlineStatus } from "./slice";
import { eventChannel, EventChannel } from "redux-saga";

interface OnlineStatusEvent {
    online: boolean;
}

function createOnlineOfflineChannel() {
    return eventChannel((emit) => {
        const onlineHandler = () => emit({ online: true });
        const offlineHandler = () => emit({ online: false });

        window.addEventListener("online", onlineHandler);
        window.addEventListener("offline", offlineHandler);

        return () => {
            window.removeEventListener("online", onlineHandler);
            window.removeEventListener("offline", offlineHandler);
        };
    });
}

function* listenStatus() {
    const channel: EventChannel<OnlineStatusEvent> = yield call(createOnlineOfflineChannel);

    try {
        while (true) {
            const { online } = yield take(channel);
            if (online) {
                yield put(setOnline());
            } else {
                yield put(setOffline());
            }
        }
    } finally {
        channel.close();
    }
}

export function* watchOnlineOfflineStatus() {
    yield takeLatest(listenOnlineStatus.type, listenStatus);
}
