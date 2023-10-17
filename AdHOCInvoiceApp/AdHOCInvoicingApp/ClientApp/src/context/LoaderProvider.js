import React, { useContext } from "react";
import { createContext, useState } from "react";

const LoadingContext = createContext({});

export const useOverLayLoader =  () => useContext(LoadingContext);

export const LoaderProvider = ({ children }) => {
    const [showLoader, setShowLoader] = useState(false);
   

    return (
        <LoadingContext.Provider value={{ showLoader, setShowLoader}}>
            {children}
        </LoadingContext.Provider>
    )
}

export default LoadingContext;


