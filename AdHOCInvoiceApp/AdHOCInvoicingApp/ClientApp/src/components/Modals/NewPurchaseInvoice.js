import PurchaseInvoiceForm from "../Invoice/PurchaseInvoiceForm";
import PurchaseInvoicePreview from "../Invoice/PurchaseInvoicePreview";
import React, { useState, createContext } from "react";
import { Modal, Button } from "reactstrap";
import moment from "moment";

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

export default function NewPurchaseInvoice({ setShowNewInvoiceModal }) {
  const [formData, setFormData] = useState(init);
  const [gridData, setGridData] = useState([]);
  const [comments, setComments] = useState("");

  return (
    <>
      <Modal
        style={{ minWidth: "max-content", margin: "30px auto" }}
        className="modal-dialog-centered modal-xl"
        isOpen={true}
        toggle={() => console.log("toggled")}
      >
        <div className="modal-header">
          <h2 className="modal-title" id="exampleModalLabel">
            Record purchase invoice
          </h2>
          <Button
            aria-label="Close"
            // className='close'
            data-dismiss="modal"
            type="button"
            onClick={() => setShowNewInvoiceModal(false)}
            size="sm"
          >
            <span aria-hidden={true}>×</span>
          </Button>
        </div>
        <div
          className="modal-body"
          style={{
            display: "flex",
            marginTop: -30,
            resize: "both",
            overflow: "auto",
          }}
        >
          <FormContext.Provider
            value={{
              formData,
              gridData,
              setFormData,
              setGridData,
              setShowNewInvoiceModal,
              init,
              comments,
              setComments,
            }}
          >
            <PurchaseInvoiceForm />
            <PurchaseInvoicePreview />
          </FormContext.Provider>
        </div>
      </Modal>
    </>
  );
}
