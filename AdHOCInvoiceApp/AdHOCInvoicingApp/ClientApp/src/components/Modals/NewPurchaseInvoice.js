import PurchaseInvoiceForm from "../Invoice/PurchaseInvoiceForm";
import PurchaseInvoicePreview from "../Invoice/PurchaseInvoicePreview";
import React, { useState, createContext, useEffect } from "react";
import { Modal, Button } from "reactstrap";
import moment from "moment";
import useAuth from "hooks/useAuth";
import { useCustomQueryById } from "hooks/useCustomQueryById";

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
  const { selectedBranch, user } = useAuth();
  const [formData, setFormData] = useState(init);
  const [gridData, setGridData] = useState([]);
  const [comments, setComments] = useState("");
  const [schemeDate, setSchemeDate] = useState(
    `${new Date().getFullYear()}-${new Date().getMonth() + 1
    }-${new Date().getDate()}`
  );
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

  const onSuccess = (data) => {
    console.log({ GetVatAndLeviesByScheme: data });
    setvatAndLeviesScheme(data);
  };

  const { refetch: refetchTaxScheme } = useCustomQueryById(
    `/api/GetVatAndLeviesByScheme/${schemeDate}/${selectedBranch?.taxScheme || 0}`,
    "taxScheme",
    formData?.date,
    onSuccess
  );

  useEffect(() => {
    refetchTaxScheme();

    return () => { };
  }, [formData?.date]);

  return (
    <>
      <Modal
        style={{ minWidth: "45vw", maxWidth: "max-content" }}
        className="modal-dialog-top modal-xl"
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
              vatAndLeviesScheme,
              setvatAndLeviesScheme
            }}
          >
            <PurchaseInvoiceForm setvatAndLeviesScheme={setvatAndLeviesScheme} vatAndLeviesScheme={vatAndLeviesScheme} />
            <PurchaseInvoicePreview vatAndLeviesScheme={vatAndLeviesScheme} />
          </FormContext.Provider>
        </div>
      </Modal>
    </>
  );
}
