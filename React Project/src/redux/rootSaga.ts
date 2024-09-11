import { all } from "redux-saga/effects";
import { watchProjectEvents } from "./events/sagas";
import { watchOnlineOfflineStatus } from "./onlineStatus/sagas";

export default function* rootSaga() {
    yield all([watchProjectEvents(), watchOnlineOfflineStatus()]);
}
