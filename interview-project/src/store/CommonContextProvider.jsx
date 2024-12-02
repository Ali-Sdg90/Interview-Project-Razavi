import React, { createContext, useEffect, useState } from "react";

export const CommonContext = createContext();

const CommonContextProvider = ({ children }) => {
    const [toastifyObj, setToastifyObj] = useState({
        title: "",
        mode: "",
    });

    return (
        <CommonContext.Provider
            value={{ toastifyObj, setToastifyObj }}
        >
            {children}
        </CommonContext.Provider>
    );
};

export default CommonContextProvider;
