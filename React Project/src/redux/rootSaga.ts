import { all } from "redux-saga/effects";

import watchProjectSagas from "./project/sagas";
import watchFetchProjects from "./projects/sagas";

export default function* rootSaga() {
    yield all([watchFetchProjects(), watchProjectSagas()]);
}
