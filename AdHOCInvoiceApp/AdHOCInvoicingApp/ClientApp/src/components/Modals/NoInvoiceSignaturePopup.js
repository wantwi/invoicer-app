import React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { toast } from 'react-toastify'
import { CircularProgress } from '@mui/material'
import { useState } from 'react'
import { useCustomQueryById } from 'hooks/useCustomQueryById'
import { useCustomDelete } from 'hooks/useCustomDelete'

const NoInvoiceSignaturePopup = ({
  handleClose,
  open,
  selectedInvoiceNo,
  setShowRetryLoader,
}) => {
  let userDetails = JSON.parse(
    sessionStorage.getItem(process.env.REACT_APP_OIDC_USER)
  )

  const [loading, setLoading] = useState(false)

  const {refetch} = useCustomQueryById(`${process.env.REACT_APP_CLIENT_ROOT}/Invoices/GetSignatureSales/${selectedInvoiceNo.invoiceNo}`,"invoice",selectedInvoiceNo.invoiceNo,
  ()=>{
    setLoading(false)
    toast.success('Successs')
    handleClose()
  },
  (err)=>{
    setLoading(false)
    toast.warning(err)
  },

  
  )
  const handleRetry = async () => {
    setLoading(true)
    refetch()
    // try {
    //   let response = await fetch(
    //     `${process.env.REACT_APP_CLIENT_ROOT}/Invoices/GetSignatureSales/${selectedInvoiceNo.invoiceNo}`,
    //     {
    //       method: 'GET', // or 'PUT'
    //       headers: {
    //         'Content-Type': 'application/json',
    //         Authorization: `Bearer ${userDetails.access_token}`,
    //       },
    //     }
    //   )
    //   let data = await response.json()
    //   // console.log(response)
    //   if (response.status == 200) {
    //     toast.success('Successs')
    //     handleClose()
    //   } else {
    //     toast.error(data.message)
    //   }

    //   // handleClose()
    // } catch (err) {
    //   toast.warning(err)
    // } finally {
    //   setLoading(false)
    //   handleClose()
    // }
  }



  const {mutate} = useCustomDelete( `${process.env.REACT_APP_CLIENT_ROOT}/Invoices?id=${selectedInvoiceNo.id}`,"invoices","",
  ()=>{
    setLoading(false)
    handleClose()
    //location.reload()
  },
  (err)=>{
    setLoading(false)
    handleClose()
    toast.warning(err)
  })

  const handleRefund = () => {
    // console.log('...delete')
    setLoading(true)
    mutate()
    // try {
    //   fetch(
    //     `${process.env.REACT_APP_CLIENT_ROOT}/Invoices?id=${selectedInvoiceNo.id}`,
    //     {
    //       method: 'DELETE', // or 'PUT'
    //       headers: {
    //         Accept: 'application/json',
    //         'Content-Type': 'application/json',
    //         Authorization: `Bearer ${userDetails.access_token}`,
    //       },
    //     }
    //   ).then((response) => {
    //     handleClose()
    //     location.reload()
    //   })

    //   // handleClose()
    // } catch (err) {
    //   handleClose()
    //   toast.warning(err)
    // } finally {
    //   setLoading(false)
    // }
  }
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        {' '}
        <DialogTitle id='alert-dialog-title'>{'Error'}</DialogTitle>
        <DialogContent style={{ textAlign: 'center' }}>
          {loading ? <CircularProgress size={24} /> : null}
          <DialogContentText id='alert-dialog-description'>
            {selectedInvoiceNo.ysdcregsig == null
              ? 'Your invoice does not have a signature. Please try again'
              : selectedInvoiceNo.ysdcregsig}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant='outlined' color='secondary' onClick={handleClose}>
            Cancel
          </Button>
          <Button variant='outlined' color='warning' onClick={handleRefund}>
            Refund
          </Button>
          <Button
            variant='outlined'
            color='success'
            onClick={handleRetry}
            autoFocus
          >
            Retry
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default NoInvoiceSignaturePopup
