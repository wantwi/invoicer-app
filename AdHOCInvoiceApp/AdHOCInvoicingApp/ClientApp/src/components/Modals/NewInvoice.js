import InvoiceForm from "../Invoice/InvoiceForm"
import InvoicePreview from "../Invoice/InvoicePreview"
import React, { useState, createContext } from "react"
import { Modal, Button } from "reactstrap"
import { ErrorBoundary } from "react-error-boundary"
import Fallback from "components/Fallback"

const init = {
  customer: "",
  identity: "",
  email: "",
  tel: "",
  itemName: "",
  quantity: "",
  price: "",
  isTaxable: true,
  vatItemId: "",
  currency: "",
  discountType: "",
  totalDiscount: "",
  date: "",
  dueDate: "",
  pon: ""
}

export const FormContext = createContext(null)

const errorHandler = (error, errorInfo) => {
  console.log("Logging", error, errorInfo)
}

function NewInvoice({ setShowNewInvoiceModal, refetch }) {
  const [formData, setFormData] = useState(init)
  const [gridData, setGridData] = useState([])
  const [comments, setComments] = useState("")
  const [vatAndLeviesScheme, setvatAndLeviesScheme] = useState({
    covidRate: 0,
    cstRate: 0,
    cstWithVat: 0,
    getfundRate: 0,
    nhilRate: 0,
    regularLeviesWithVat: 0,
    tourismRate: 0,
    trsmWithVat: 0,
    vatRate: 0,
  })

  console.log({ vatAndLeviesScheme });

  return (
    <>
      <Modal
        style={{
          // minWidth: "80%",
          maxWidth: "max-content",
          margin: "30px auto",
          // resize: "both",
          // overflow: "auto",
          // zIndex: 100,
        }}
        // className="modal-dialog-centered modal-lg"
        isOpen={true}
        toggle={() => console.log("toggled")}
      >
        <div
          className="modal-header"
          style={{ zIndex: 100, padding: "10px 30px" }}
        >
          <h2 className="modal-title" id="exampleModalLabel">
            Create your invoice
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
          className="modal-body "
          style={{
            display: "flex",
            minWidth: "40vw",
            marginTop: -30,
            resize: "both",
            overflow: "auto",
            justifyContent: "center",
            maxWidth: "max-content"
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
              vatAndLeviesScheme,
              setvatAndLeviesScheme
            }}
          >
            <InvoiceForm refetch={refetch} />
            <InvoicePreview />
          </FormContext.Provider>

        </div>
      </Modal>
    </>
  )
}

export default NewInvoice
