import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "@redux-saga/core";
import { useDispatch, useSelector } from "react-redux";

import { createReduxHistoryContext } from "redux-first-history";
import { createBrowserHistory } from "history";

const { createReduxHistory, routerMiddleware, routerReducer } = createReduxHistoryContext({
    history: createBrowserHistory(),
});

import rootSaga from "./rootSaga";

import projectsReducer from "./projects/slice";
import projectReducer from "./project/slice";
import errorSlice from "./error/slice";

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
    reducer: {
        projects: projectsReducer,
        error: errorSlice,
        project: projectReducer,
        router: routerReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat([sagaMiddleware, routerMiddleware]),
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

export const history = createReduxHistory(store);
