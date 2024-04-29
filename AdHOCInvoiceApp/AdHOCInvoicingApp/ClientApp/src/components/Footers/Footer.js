import React from 'react'
const appVersion = process.env.REACT_APP_VERSION
export const AppVersion = () => {
    return (
        <span style={versionStyle}>v2.0.1</span>
    )
}

const versionStyle = {
    fontSize: "0.6em",
    textAlign: "center",
    display: "block",
}
