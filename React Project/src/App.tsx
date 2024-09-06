import { AuthContextProvider } from "./contexts/AuthContext";
import { HistoryRouter as Router } from "redux-first-history/rr6";
import MainNavigator from "./Navigators/MainNavigator";

import { ToastContextProvider } from "./contexts/ToastContext";
import ToastContainer from "./components/ToastContainer";

import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";

import { Provider } from "react-redux";
import { history, store } from "./redux/store";

function App() {
    return (
        <Provider store={store}>
            <MantineProvider>
                <AuthContextProvider>
                    <ToastContextProvider>
                        <Router history={history}>
                            <MainNavigator />
                        </Router>
                        <ToastContainer />
                    </ToastContextProvider>
                </AuthContextProvider>
            </MantineProvider>
        </Provider>
    );
}

export default App;
