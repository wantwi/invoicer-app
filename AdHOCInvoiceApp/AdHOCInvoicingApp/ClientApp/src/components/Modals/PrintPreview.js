import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  ModalFooter,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
import PdfViewer from "components/PdfViewer/PdfViewer";
import { useAuth } from "context/AuthContext";
import { useCustomPost } from "hooks/useCustomPost";
import ComfirmPrompt from "./ComfirmPrompt";
import { useOverLayLoader } from "context/LoaderProvider";
import { ToastContainer, toast } from "react-toastify";

let isFirst = true;
const getPrintType = localStorage.getItem("printType");
function PrintPreview({
  setShowReport,
  formData,
  getPrintPDF,
  salesType,
  showSignature = true,
  bottom = 200,
  pdfData,
  selectedInvoiceNo,
  title = "Invoice",
  isRefund = false,
  isActive = true,
  refetch,
  setPrintType = () => {},
  printType,
  showBtn = false,
}) {
  const [showPrompt, setShowPrompt] = useState(false);
  const { setShowLoader } = useOverLayLoader();
  const [activeTab, setActiveTab] = useState(printType);

  let userDetails = JSON.parse(
    sessionStorage.getItem(process.env.REACT_APP_OIDC_USER)
  );

  const { selectedBranch, user } = useAuth();
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

  const { mutate } = useCustomPost(
    "/api/CancelRefund",
    "refunds",
    (data) => {
      if (data.status >= 400) {
        const response = JSON.parse(data?.data)?.Message;
        const error = new Error(response);
        error.code = data.status;
        throw error;
      } else {
        toast.success("Cancel Refund successful");
        setShowReport(false);
        setShowLoader(false);
      }

      refetch();
    },
    (error) => {
      toast.error(error?.message || "Refund faild. Please contact admin.");
      setShowLoader(false);
    }
  );

  const handleRefundCancel = () => {
    setShowPrompt(true);
  };
  const confirmeDelete = () => {
    let postData = {
      itemId: selectedInvoiceNo,
      nameOfUser: user?.given_name,
      branchCode: selectedBranch?.code,
      companyId: "",
    };
    mutate(postData);
    setShowPrompt(false);
    setShowLoader(true);
  };

  const toggle = (tab) => {
    setPrintType(tab);
    setActiveTab(tab);
    localStorage.setItem("printType", tab);
  };

  return (
    <>
      <Modal
        className="modal-dialog-centered modal-lg"
        isOpen={true}
        toggle={() => console.log("toggled")}
      >
        <div className="modal-header" style={{ width: "50vw" }}>
          <h1 className="modal-title" id="exampleModalLabel">
            {title}
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
              onClick={() => {
                // setPrintType("");
                setShowReport(false);
              }}
            >
              <span aria-hidden={true}>×</span>
            </Button>
          </div>
        </div>
        {showBtn && (
          <div className="pl-2">
            <Button
              size="sm"
              color={printType !== "A" ? "primary" : ""}
              onClick={() => {
                toggle("default");
              }}
              value="default"
            >
              A4 Size
            </Button>
            <Button
              color={printType === "A" ? "primary" : ""}
              size="sm"
              onClick={() => {
                toggle("A");
              }}
              value="A"
            >
              POS Receipt
            </Button>
          </div>
        )}

        {pdfData && (
          <PdfViewer invoiceNo={selectedInvoiceNo} pdfData={pdfData} />
        )}
        {/*<Nav tabs>*/}
        {/*    <NavItem>*/}
        {/*        <NavLink*/}

        {/*            onClick={() => { toggle('default'); }}*/}
        {/*        >*/}
        {/*            A4 Size*/}
        {/*        </NavLink>*/}
        {/*    </NavItem>*/}
        {/*    <NavItem>*/}
        {/*        <NavLink*/}

        {/*            onClick={() => { toggle('A'); }}*/}
        {/*        >*/}
        {/*           A7 Size*/}
        {/*        </NavLink>*/}
        {/*    </NavItem>*/}
        {/*</Nav>*/}
        {/*<TabContent activeTab={activeTab}>*/}
        {/*    <TabPane tabId="default">*/}

        {/*    </TabPane>*/}
        {/*    <TabPane tabId="A">*/}

        {/*    </TabPane>*/}
        {/*</TabContent>*/}

        {/* <div id="modal-body" className="modal-body">
         
        </div> */}
        {/* OLD IMPLEMETATION HERE */}
        <ModalFooter>
          {/* <button className="btn btn-sm btn-secondary"  onClick={() => setShowReport(false)} title="Close">Close</button> */}
          {isRefund ? (
            <button
              hidden={!isActive}
              className="btn btn-sm btn-danger"
              onClick={handleRefundCancel}
              title="Cancel Refund"
            >
              Cancel Refund
            </button>
          ) : null}
        </ModalFooter>
      </Modal>

      {/* Are you sure you want to proceed with deleting the item "Mouse pad"? */}
      <ComfirmPrompt
        confirmHandeler={confirmeDelete}
        title={"Cancel Refund"}
        setShowPrompt={setShowPrompt}
        showPrompt={showPrompt}
        message={"Are you sure you want to proceed?"}
      />
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
