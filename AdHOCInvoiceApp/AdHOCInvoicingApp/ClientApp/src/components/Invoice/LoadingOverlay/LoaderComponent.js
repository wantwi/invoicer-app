import { useOverLayLoader } from 'context/LoaderProvider';
import React, { useState } from 'react';
import LoadingOverlay from "react-loading-overlay";




const LoaderComponent = (props) => {
    const { showLoader } = useOverLayLoader()
  
    return (
        <>
            < LoadingOverlay
                active={showLoader}
                spinner
            >
                {props.children}
            </ LoadingOverlay>
        </>
    )

}

export default LoaderComponent;