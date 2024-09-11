import { AuthContextProvider } from "./contexts/AuthContext";
import { BrowserRouter } from "react-router-dom";

import MainNavigator from "./Navigators/MainNavigator";
import { ToastContextProvider } from "./contexts/ToastContext";
import ToastContainer from "./components/ToastContainer";

import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";

import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store";

function App() {
    return (
        <Provider store={store}>
            <MantineProvider>
                <PersistGate persistor={persistor} loading={<div>Loading...</div>}>
                    <AuthContextProvider>
                        <ToastContextProvider>
                            <BrowserRouter>
                                <MainNavigator />
                            </BrowserRouter>
                            <ToastContainer />
                        </ToastContextProvider>
                    </AuthContextProvider>
                </PersistGate>
            </MantineProvider>
        </Provider>
    );
}

export default App;
