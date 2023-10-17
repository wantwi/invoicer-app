
import React, { useState } from "react";
import { Modal, Button, ModalFooter } from "reactstrap";
import PdfViewer from "components/PdfViewer/PdfViewer";
import { useAuth } from "context/AuthContext";
import { useCustomPost } from "hooks/useCustomPost";
import ComfirmPrompt from "./ComfirmPrompt";
import { useOverLayLoader } from "context/LoaderProvider";
import { ToastContainer, toast } from "react-toastify";

function PrintPreview({
  setShowReport,
  formData,
  getPrintPDF,
  salesType,
  showSignature = true,
  bottom = 200,
  pdfData,
  selectedInvoiceNo,
}) {
  const [showPrompt, setShowPrompt] = useState(false)
 const {setShowLoader} = useOverLayLoader()
  
  let userDetails = JSON.parse(
    sessionStorage.getItem(process.env.REACT_APP_OIDC_USER)
  );

 const {selectedBranch, user} = useAuth()
  let env = process.env.REACT_APP_ENV;

  const printReport = () => {
    let printContents = document.getElementById("modal-body").innerHTML;
    let originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print(printContents);

    //setShowReport(false)
    document.body.innerHTML = originalContents;
    location.reload();
  };

 const {mutate} = useCustomPost('/api/CancelPurchaseReturn',"purchase-returns",
 (data)=>{
  toast.success("Cancel Refund successful");
  setShowReport(false)
  setShowLoader(false)
 
 },
()=>{
  setShowLoader(false)

 })

  const handleRefundCancel = () => {

    setShowPrompt(true)
  }
  const confirmeDelete = () => {
    let postData = {
      itemId:selectedInvoiceNo,
      nameOfUser:user?.given_name,
      branchCode:selectedBranch?.code,
      companyId:""
    }
    mutate(postData)
    setShowPrompt(false)
    setShowLoader(true)
  }

  return (
    <>
      <Modal
        className="modal-dialog-centered modal-lg"
        isOpen={true}
        toggle={() => console.log("toggled")}
      >
        <div className="modal-header" style={{ width: "50vw"}}>
          <h1 className="modal-title" id="exampleModalLabel">
           Purchase Return Invoice
          </h1>
          <div >
            {/* <Button
              type="button"
              onClick={() => {
                getPrintPDF(formData.invoiceNo);
              }}
              title="Click to Download"
            >
              <FcDownload />
            </Button> */}
            {/* <Button type="button" onClick={printReport} title="Click to Print">
              <FcPrint />
            </Button> */}
            <Button
              aria-label="Close"
              data-dismiss="modal"
              type="button"
              size="sm"
              onClick={() => setShowReport(false)}
            >
              <span aria-hidden={true}>×</span>
            </Button>
          </div>
        </div>
        {pdfData && (
          <PdfViewer invoiceNo={selectedInvoiceNo} pdfData={pdfData} />
        )}
        {/* <div id="modal-body" className="modal-body">
         
        </div> */}
        {/* OLD IMPLEMETATION HERE */}
        <ModalFooter>
        {/* <button className="btn btn-sm btn-secondary"  onClick={() => setShowReport(false)} title="Close">Close</button> */}
          <button className="btn btn-sm btn-danger" onClick={handleRefundCancel} title="Cancel Purchase Return">Cancel Purchase Return</button>
        </ModalFooter>
      </Modal>

      {/* Are you sure you want to proceed with deleting the item "Mouse pad"? */}
      <ComfirmPrompt confirmHandeler= {confirmeDelete} title={"Cancel Purchase Return"} setShowPrompt={setShowPrompt} showPrompt={showPrompt} message={"Are you sure you want to proceed?"}/>
    </>
  );
}

export default PrintPreview;

const styles = {
  preview: {
    display: "flex",
    flexDirection: "column",
    color: "black",
    fontSize: 12,
  },
  title: {
    display: "flex",
    flexDirection: "column",
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    height: 150,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },

  body: {
    // maxHeight: 200,
    // overflow: 'auto',
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    marginTop: 10,
    marginBottom: 10,
  },
  taxInfo: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 50,
    marginTop: 10,
  },
  footer: {
    height: 180,
    marginTop: 10,
    position: "relative",
  },
};
