import React from 'react'
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'

export const IdleTimeOutModal = ({
  showModal,
  handleContinue,
  handleLogout,
}) => {
  return (
    <Modal isOpen={showModal}>
      <ModalHeader>You Have Been Idle!</ModalHeader>
      <ModalBody>
        Your session has been timed Out. Do you want to stay?
      </ModalBody>
      <ModalFooter>
        <Button variant='danger' onClick={handleLogout}>
          {' '}
          Logout
        </Button>{' '}
        <Button variant='primary' onClick={handleContinue}>
          Continue Session
        </Button>
      </ModalFooter>
    </Modal>
  )
}
