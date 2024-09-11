import { all } from "redux-saga/effects";
import { watchEvents } from "./events/sagas";
import { watchOnlineOfflineStatus } from "./onlineStatus/sagas";

export default function* rootSaga() {
    yield all([watchEvents(), watchOnlineOfflineStatus()]);
}
