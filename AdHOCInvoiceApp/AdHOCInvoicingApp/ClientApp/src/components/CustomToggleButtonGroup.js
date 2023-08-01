import React from 'react'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Tooltip from "react-tooltip"
import { toast } from 'react-toastify'

const CustomToggleButtonGroup = ({ settogglePartialRefund, canFullRefund = false }) => {
  const [alignment, setAlignment] = React.useState('partial')
  // console.log({ canFullRefund });
  const handleChange = (e) => {
    // console.log(e.target.value)
    if (e.target.value === 'partial') {
      setAlignment('partial')
      settogglePartialRefund(true)
    } else {
      if (!canFullRefund) {
        // toast.info("Full refund operation cannot be performed on this invoice because it has been partially refunded")
        return
      }
      setAlignment('full')
      settogglePartialRefund(false)
    }

    // console.log(e.target.value)
  }
  return (
    <>

      <ToggleButtonGroup
        color='primary'
        value={alignment}
        exclusive
        onChange={handleChange}
        aria-label='Platform'
      >
        <ToggleButton color='warning' value='partial'>
          Partial Refund
        </ToggleButton>
        <ToggleButton color='success' value='full'>
          <span data-tip
            data-for="discount-type" id="discount-type">
            Full Refund
          </span>
        </ToggleButton>
      </ToggleButtonGroup>
      {!canFullRefund && <Tooltip
        id="discount-type"
        place="top"
        type="info"
        effect="float"
      >
        <span>
          Full refund operation cannot be performed<br /> on this invoice because it has been<br /> partially refunded
        </span>
      </Tooltip>}
    </>
  )
}

export default CustomToggleButtonGroup
