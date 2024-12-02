import React from "react";
import { HashRouter } from "react-router-dom";
import StoreProvider from "./store/StoreProvider";
import ConfigProviderWrapper from "./config/ConfigProviderWrapper";
import TestPage from "./pages/TestPage";

const App = () => {
    return (
        <HashRouter>
            <StoreProvider>
                <ConfigProviderWrapper>
                    <TestPage />
                </ConfigProviderWrapper>
            </StoreProvider>
        </HashRouter>
    );
};

export default App;
