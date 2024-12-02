import React from "react";
import CommonContextProvider from "./CommonContextProvider";

const StoreProvider = ({ children }) => {
    return (
        <CommonContextProvider>
            <>{children}</>
        </CommonContextProvider>
    );
};

export default StoreProvider;
