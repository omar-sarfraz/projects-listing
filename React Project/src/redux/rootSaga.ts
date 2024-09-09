import { all } from "redux-saga/effects";
import { watchProjectEvents } from "./projects/sagas";
import { watchOnlineOfflineStatus } from "./onlineStatus/sagas";

export default function* rootSaga() {
    yield all([watchProjectEvents(), watchOnlineOfflineStatus()]);
}
