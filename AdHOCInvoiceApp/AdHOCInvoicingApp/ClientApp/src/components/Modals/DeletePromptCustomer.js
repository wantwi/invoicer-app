import React, { useEffect, useState } from 'react'
import { Modal, Button } from 'reactstrap'
import { toast } from 'react-toastify'
import { useCustomDelete } from 'hooks/useCustomDelete'

export default function DeletePromptCustomer({
  message,
  showPrompt,
  setShowPrompt,
  customerToDelete,
  setLoading,
  setCustomerList,
  getCustomerList,
  getSupplierList
}) {
  let userDetails = JSON.parse(
    sessionStorage.getItem(process.env.REACT_APP_OIDC_USER)
  )

  // const getCustomerList = async () => {
  //   try {
  //     let results = await fetch(
  //       `${process.env.REACT_APP_CLIENT_ROOT}/Customers/GetCustomerByCompanyId/${userDetails.profile.company}`,
  //       {
  //         method: 'GET', // or 'PUT'
  //         headers: {
  //           'Content-Type': 'application/json',
  //           Authorization: `Bearer ${userDetails.access_token}`,
  //         },
  //       }
  //     )

  //     if (results.ok) {
  //       let apiResponse = await results.json()
  //       // console.log(apiResponse)
  //       let allCustomers = apiResponse.map((customer) => {
  //         return {
  //           customerID: customer.id,
  //           customerName: customer.name,
  //           customerTin: customer.tin,
  //           customerEmail: customer.email,
  //           customerPhone: customer.telephone,
  //           customerAddress: customer.address,
  //           customerCity: customer.city,
  //           customerDigitalAddress: customer.digitalAddress,
  //           type: customer.type,
  //           status: customer.status || 'A',
  //           hasTrans: customer.hasTrans || false,
  //         }
  //       })
  //       // console.log(allCustomers)
  //       if (allCustomers.length < 1) {
  //         setLoading(false)
  //         toast.warning('You dont have any customers on your list yet')
  //       } else {
  //         setLoading(false)

  //         setCustomerList(allCustomers)
  //       }
  //     } else {
  //       if (results.status === 401) {
  //         toast.error('Unauthorized. Logging you out')
  //         setTimeout(() => {
  //           window.location = '/'
  //         }, 3000)
  //       }
  //     }
  //   } catch (error) {
  //     setLoading(false)
  //     console.error(error.message)
  //   }
  // }

  // const getSupplierList = async () => {
  //   try {
  //     let apiResponse = await (
  //       await fetch(
  //         `${process.env.REACT_APP_CLIENT_ROOT}/Customers/GetSuppliersByCompanyId/${userDetails.profile.company}`,
  //         {
  //           method: 'GET', // or 'PUT'
  //           headers: {
  //             'Content-Type': 'application/json',
  //             Authorization: `Bearer ${userDetails.access_token}`,
  //           },
  //         }
  //       )
  //     ).json()
  //     // console.log(apiResponse)
  //     let allCustomers = apiResponse.map((customer) => {
  //       return {
  //         customerID: customer.id,
  //         customerName: customer.name,
  //         customerTin: customer.tin,
  //         customerEmail: customer.email,
  //         customerPhone: customer.telephone,
  //         customerAddress: customer.address,
  //         customerCity: customer.city,
  //         customerDigitalAddress: customer.digitalAddress,
  //         type: customer.type,
  //         status: customer.status || 'A',
  //         hasTrans: customer.hasTrans || false,
  //       }
  //     })
  //     // console.log(allCustomers)
  //     if (allCustomers.length < 1) {
  //       setLoading(false)
  //       toast.warning('You dont have any suppliers on your list yet')
  //       setCustomerList([])
  //     } else {
  //       setLoading(false)

  //       setCustomerList(allCustomers)
  //     }
  //   } catch (error) {
  //     setLoading(false)
  //     console.error(error.message)
  //   }
  // }

    const { mutate } = useCustomDelete(`/api/DeleteCustomer/${customerToDelete?.customerID}`,"customer",customerToDelete?.customerID,
  (data)=>{
    if (customerToDelete.type === 'CUS') {
      toast.success('Customer successfully deleted from system')
      getCustomerList()
    } else {
      toast.success('Supplier successfully deleted from system')
      getSupplierList()
    }
    setShowPrompt(false)
  },
  (error)=>{
   
    setShowPrompt(false)
    // console.log({useMutationError: error});
    toast.error(error?.response?.data?.message ||"Invoice could not be saved. Please try again")
    setLoading(false)
  }
  )

  const handleDeleteCustomer = (customer) => {
    setLoading(true)
    // setCustomersList(CustomersList.filter((i, index) => i.code !== Customer.code)),
    if (customer.hasTrans) {
      toast.warning(
        'Customer has already been used in a transaction.  Try d instead'
      )
      setShowPrompt(false)
    } else {
      mutate()
    //   fetch(
    //     `${process.env.REACT_APP_CLIENT_ROOT}/Customers/${customer.customerID}`,
    //     {
    //       method: 'DELETE', // or 'PUT'
    //       headers: {
    //         'Content-Type': 'application/json',
    //         Authorization: `Bearer ${userDetails.access_token}`,
    //       },
    //     }
    //   )
    //     .then((response) => {
    //       if (response.ok) {
    //         setLoading(false)
    //         if (customer.type === 'CUS') {
    //           toast.success('Customer successfully deleted from system')
    //           getCustomerList()
    //         } else {
    //           toast.success('Supplier successfully deleted from system')
    //           getSupplierList()
    //         }
    //       } else {
    //         toast.error('Could not delete Customer. Please try again.')
    //         setLoading(false)
    //       }
    //       return response.json()
    //     })
    //     .catch((error) => {
    //       setLoading(false)
    //       toast.error('Could not delete Customer. Please try again.')
    //     })
    //     .finally(() => {
    //       setShowPrompt(false)
    //     })
     }
  }

  return (
    <>
      <Modal
        className='modal-dialog-centered modal-danger'
        contentClassName='bg-gradient-danger'
        isOpen={showPrompt}
      >
        <div className='modal-header'>
          <h6 className='modal-title' id='modal-title-notification'>
            Your attention is required
          </h6>
          <button
            aria-label='Close'
            className='close'
            data-dismiss='modal'
            type='button'
            onClick={() => {
              setShowPrompt(false)
            }}
          >
            <span aria-hidden={true}>×</span>
          </button>
        </div>
        <div className='modal-body'>
          <div className='py-3 text-center'>
            <i className='ni ni-bell-55 ni-3x' />
            <h4 className='heading mt-4'>Hi there...</h4>
            <p>{message}</p>
          </div>
        </div>
        <div className='modal-footer'>
          <Button
            className='btn-white'
            color='default'
            type='button'
            onClick={() => handleDeleteCustomer(customerToDelete)}
          >
            Yes
          </Button>
          <Button
            className='text-white ml-auto'
            color='link'
            data-dismiss='modal'
            type='button'
            onClick={() => {
              setShowPrompt(false)
            }}
          >
            No
          </Button>
        </div>
      </Modal>
    </>
  )
}
