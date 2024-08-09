import React, { useEffect, useState } from 'react'
import { Modal, Button } from 'reactstrap'
import { toast } from 'react-toastify'
import { useCustomDelete } from 'hooks/useCustomDelete'
import Loader from "components/Modals/Loader";

export default function DeletePrompt({
  message,
  showPrompt,
  setShowPrompt,
  itemToDelete,
  setItemsList,
  setLoading,
  setSearchText,
    value,
  refetch=()=>null
}) {
  

    const { mutate, isLoading } = useCustomDelete(`/api/DeleteItem/${itemToDelete?.id}`,"items",value,
  ()=>{
    toast.success('Item successfully deleted from system')
    setLoading(false)
    setSearchText("")
      setShowPrompt(false)
      refetch()
      console.log("hjhj", refetch())
    
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
    }
  }

  return (
      <>
          {/* {isLoading && <Loader /> } */}
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
            disabled={isLoading}
          >
            {isLoading ? "Please wait" : "Yes"}
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
