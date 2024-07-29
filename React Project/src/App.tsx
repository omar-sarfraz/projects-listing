import { AuthContextProvider } from "./contexts/AuthContext";
import { BrowserRouter } from "react-router-dom";
import MainNavigator from "./Navigators/MainNavigator";

import { ToastContextProvider } from "./contexts/ToastContext";
import ToastContainer from "./components/ToastContainer";

function App() {
    return (
        <AuthContextProvider>
            <ToastContextProvider>
                <BrowserRouter>
                    <MainNavigator />
                </BrowserRouter>
                <ToastContainer />
            </ToastContextProvider>
        </AuthContextProvider>
    );
}

export default App;
