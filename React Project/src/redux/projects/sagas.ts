import { call, put, takeLatest } from "redux-saga/effects";
import { listenProjectEvents } from "./slice";

function* listenEvents() {
    // TO-DO: Listen for Project Events
}

export function* watchProjectEvents() {
    yield takeLatest(listenProjectEvents.type, listenEvents);
}
