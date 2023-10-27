
import React, { useState, createContext } from "react";
import { Modal, Button, ModalBody } from "reactstrap";
import moment from "moment";
import DebitAndCreditForm from "components/forms/DebitAndCreditForm";

const init = {
  customer: "",
  identity: "",
  email: "",
  tel: "",
  itemName: "",
  quantity: "",
  price: "",
  isTaxable: false,
  vatItemId: "",
  invoiceNumber: "",
  recNum: "",
  issuedDate: "",
  isTaxable: true,
  vatItemId: "",
  currency: "",
  discountType: "",
  totalDiscount: "",
  date: null,
  dueDate: null,
  itemDiscount: 0,
  quantity: "",
  isTaxInclusive: false,
  trsmCst: "NON",
};
export const FormContext = createContext(null);

export default function NewPurchaseInvoice({ setShowNewInvoiceModal, refetch }) {


  return (
    
      <Modal
       
        className="modal-dialog-top"
        isOpen={true}
        size="lg"
        style={{minWidth:"40vw"}}
      >
        <div className="modal-header">
          <h2 className="modal-title" id="exampleModalLabel">
            Add Note
          </h2>
          <Button
            aria-label="Close"
            // className='close'
            data-dismiss="modal"
            type="button"
            onClick={() => setShowNewInvoiceModal(false)}
            size="sm"
            style={{zIndex:1}}
          >
            <span aria-hidden={true}>×</span>
          </Button>
        </div>
        <ModalBody style={{marginTop:-50}}>
           <DebitAndCreditForm refetch={refetch} setShowNewInvoiceModal={setShowNewInvoiceModal}/>
        </ModalBody>
       
         
          
       
      </Modal>

  );
}
