import React, { useEffect, useState } from 'react'
import { Modal, Button } from 'reactstrap'
import { toast } from 'react-toastify'
import { useCustomDelete } from 'hooks/useCustomDelete'

export default function DeletePrompt({
  message,
  showPrompt,
  setShowPrompt,
  itemToDelete,
  setItemsList,
  setLoading,
  setSearchText,
  value
}) {
  let userDetails = JSON.parse(
    sessionStorage.getItem(process.env.REACT_APP_OIDC_USER)
  )

  // const getItemsList = async () => {
  //   setLoading(true)
  //   fetch(
  //     `${process.env.REACT_APP_CLIENT_ROOT}/VatItems/GetByCompanyId/${userDetails.profile.company}`,
  //     {
  //       method: 'GET', // or 'PUT'
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: `Bearer ${userDetails.access_token}`,
  //       },
  //     }
  //   )
  //     .then((res) => {
  //       if (res.status === 401) {
  //         toast.warning('Unauthorized. Logging you out')
  //         setTimeout(() => {
  //           logout()
  //         }, 2000)
  //       } else {
  //         return res.json()
  //       }
  //     })
  //     .then((data) => {
  //       if (data.length > 0) {
  //         let results = data.map((item) => {
  //           return {
  //             id: item.id,
  //             name: item.name,
  //             istaxable: item.taxable,
  //             code: item.code,
  //             price: item.price,
  //             taxRate: item.taxRate,
  //             description: item.description,
  //             isTaxInclusive: item.isTaxInclusive,
  //             hasTourismLevy: item.hasTourismLevy,
  //             status: item.status,
  //             hasTrans: item.hasTrans,
  //           }
  //         })
  //         setLoading(false)
  //         setItemsList(results)
  //       } else {
  //         setLoading(false)
  //         toast.warning('You have no products/services saved yet')
  //       }
  //     })
  //     .catch((err) => console.log(err))
  // }

  const {mutate} = useCustomDelete(`${process.env.REACT_APP_CLIENT_ROOT}/VatItems/${itemToDelete?.id}`,"items",value,
  ()=>{
    toast.success('Item successfully deleted from system')
    setLoading(false)
    setSearchText("")
    setShowPrompt(false)
    
  },
  (error)=>{
    // console.log({error});
    setLoading(false)
    toast.error('Could not delete item. Please try again.')
    setShowPrompt(false)
  }
  )

  const handleDeleteItem = (item) => {
    // setItemsList(itemsList.filter((i, index) => i.code !== item.code)),
    if (item.hasTrans) {
      toast.warning(
        'Item has already been used in a transaction. It can not be deleted. Try disabling it instead'
      )
      setShowPrompt(false)
    } else {

      mutate()
      // fetch(`${process.env.REACT_APP_CLIENT_ROOT}/VatItems/${item.id}`, {
      //   method: 'DELETE', // or 'PUT'
      //   headers: {
      //     'Content-Type': 'application/json',
      //     Authorization: `Bearer ${userDetails.access_token}`,
      //   },
      // })
      //   .then((response) => {
      //     if (response.ok) {
      //       toast.success('Item successfully deleted from system')
      //       setLoading(false)
      //       // getItemsList()
      //     }
      //     return response.json()
      //   })
      //   .catch((error) => {
      //     setLoading(false)
      //     toast.error('Could not delete item. Please try again.')
      //   })
      //   .finally(() => {
      //     setLoading(false)
      //     setShowPrompt(false)
      //   })
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
            onClick={() => handleDeleteItem(itemToDelete)}
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
