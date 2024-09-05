import { AuthContextProvider } from "./contexts/AuthContext";
import { BrowserRouter } from "react-router-dom";
import MainNavigator from "./Navigators/MainNavigator";

import { ToastContextProvider } from "./contexts/ToastContext";
import ToastContainer from "./components/ToastContainer";

import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";

import { Provider } from "react-redux";
import { store } from "./redux/store";

function App() {
    return (
        <Provider store={store}>
            <MantineProvider>
                <AuthContextProvider>
                    <ToastContextProvider>
                        <BrowserRouter>
                            <MainNavigator />
                        </BrowserRouter>
                        <ToastContainer />
                    </ToastContextProvider>
                </AuthContextProvider>
            </MantineProvider>
        </Provider>
    );
}

export default App;
