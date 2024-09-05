import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "@redux-saga/core";
import { useDispatch, useSelector } from "react-redux";

import rootSaga from "./rootSaga";

import projectsReducer from "./projects/slice";
import projectReducer from "./project/slice";
import errorSlice from "./error/slice";

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
    reducer: { projects: projectsReducer, error: errorSlice, project: projectReducer },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
