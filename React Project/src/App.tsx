import { AuthContextProvider } from "./contexts/AuthContext";
import { BrowserRouter } from "react-router-dom";
import MainNavigator from "./Navigators/MainNavigator";

import { ToastContextProvider } from "./contexts/ToastContext";
import ToastContainer from "./components/ToastContainer";

import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";

function App() {
    return (
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
    );
}

export default App;
