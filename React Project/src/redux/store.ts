import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import createSagaMiddleware from "@redux-saga/core";

import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import projectsReducer from "./projects/slice";
import onlineStateSlice from "./onlineStatus/slice";

import rootSaga from "./rootSaga";

const persistConfig = {
    key: "root",
    storage,
};

const rootReducer = combineReducers({ projects: projectsReducer, isUserOnline: onlineStateSlice });
const persistedReducer = persistReducer(persistConfig, rootReducer);

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
