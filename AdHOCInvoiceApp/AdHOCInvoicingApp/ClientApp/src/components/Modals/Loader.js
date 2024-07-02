import React from 'react'
import loader from '../../assets/img/theme/Loading.gif'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'

function Loader() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        width: '100%',
        height: '50vh',
        // left: 0, right: 270, top: 0, bottom: 0,
        placeContent: "center",
        zIndex: 9999999,
      }}
    >
      <CircularProgress size={48} />
      <em>Loading...</em>
      {/* <Box sx={{ display: 'flex' }}>
      </Box> */}
    </div>
  )
}

export default Loader
