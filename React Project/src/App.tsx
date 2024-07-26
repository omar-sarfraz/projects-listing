import { AuthContextProvider } from "./contexts/AuthContext";
import { BrowserRouter } from "react-router-dom";
import MainNavigator from "./Navigators/MainNavigator";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
    return (
        <AuthContextProvider>
            <BrowserRouter>
                <MainNavigator />
            </BrowserRouter>
            <ToastContainer />
        </AuthContextProvider>
    );
}

export default App;
