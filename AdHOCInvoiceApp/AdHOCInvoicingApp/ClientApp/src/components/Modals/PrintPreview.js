import { moneyInTxt } from "components/Invoice/InvoicePreview";
import React from "react";
import { Modal, Button } from "reactstrap";
import graLogo from "../../assets/img/theme/gra.png";
import { FcDownload, FcPrint } from "react-icons/fc";
import QRCode from "react-qr-code";
import moment from "moment";

import PdfViewer from "components/PdfViewer/PdfViewer";

function PrintPreview({
  setShowReport,
  formData,
  getPrintPDF,
  salesType,
  showSignature = true,
  bottom = 200,
  pdfData,
  selectedInvoiceNo
}) {
  let userDetails = JSON.parse(
    sessionStorage.getItem(process.env.REACT_APP_OIDC_USER)
  );

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

  // console.log({pdfData})
 
  return (
    <>
      <Modal
        className="modal-dialog-centered modal-lg"
        isOpen={true}
        toggle={() => console.log("toggled")}
      >
        <div className="modal-header">
          <h1 className="modal-title" id="exampleModalLabel">
            Invoice
          </h1>
          <div>
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
        {pdfData && <PdfViewer invoiceNo = {selectedInvoiceNo} pdfData = {pdfData}/>}
        {/* <div id="modal-body" className="modal-body">
         
        </div> */}
       {/* OLD IMPLEMETATION HERE */}
      </Modal>
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
