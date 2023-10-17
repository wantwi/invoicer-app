import React, { useState, useEffect } from "react";
import {
  Modal,
  Card,
  Table,
  Button,
  Row,
  Col,
  Form,
  FormGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  InputGroup,
} from "reactstrap";
import graLogo from "../../assets/img/theme/gra.png";
import companyLogo from "../../assets/img/theme/logo.png";
import refund from "../../assets/img/theme/refundimg.png";
import { toast, ToastContainer } from "react-toastify";
import CustomToggleButtonGroup from "components/CustomToggleButtonGroup2";
import { GrEdit } from "react-icons/gr";

import EditPreviewInvoiceItem from "./EditPreviewInvoiceItem2";
import { RefundInvoiceItemsTable } from "components/Tables/RefundInvoiceItemsTable";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { v4 as uuid } from "uuid";
import Loader from "components/Modals/Loader";
import useCustomAxios from "hooks/useCustomAxios";

const moneyInTxt = (value, standard, dec = 2) => {
  var nf = new Intl.NumberFormat(standard, {
    minimumFractionDigits: dec,
    maximumFractionDigits: 2,
  });
  return nf.format(Number(value) ? value : 0.0);
};

function InvoicePreviewRefund({
  show,
  setOpen,
  setshowPrompt,
  setrefundInvoice,
  setPromptMessage,
  setRefundType,
  refundType,
  setRefundTypeForPost,
  reset,
}) {
  const [invoiceQuery, setinvoiceQuery] = useState("");
  const [showInvoice, setShowInvoice] = useState(false);
  const [searchResults, setsearchResults] = useState({
    invoiceNo: "",
    invoiceItems: [],
  });
  const [isFocus, setIsFocus] = useState(false);
  const [isRefunded, setIsRefunded] = useState(false);
  const [showToggle, setShowToggle] = useState(false);
  const [togglePartialRefund, settogglePartialRefund] = useState(true);
  const [showUpdate, setShowUpdate] = useState(false);
  const [updateItemData, setUpdateItemData] = useState({
    itemName: "",
    quantity: 0,
    price: 0,
    priceAfterRefund: 0,
    qtyToRefund: 1,
  });
  const [confirmDisabled, setConfirmDisabled] = useState(false);
  const [invoicesPrePost, setInvoicesPrePost] = useState([]);
  const [amountToRefund, setAmountToRefund] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hideSearch, setHideSearch] = useState(false)
  let axios = useCustomAxios();

  const transformPayload = (data = []) => {
    return data.map((item) => ({
      ...item,
      originalQty: item.quantity,
      quantity: item.quantity,
      itemDescription: item.itemDescription,
      itemCode: item.itemCode,
      availableQty: item.quantity - item.quantityRefunded,
      unitPrice: item.unitPrice,
      price: item.payablePrice,
    }));
  };

  const findInvoice = async (text) => {
    try {
      setIsLoading(true);
      const request = await axios.get(`/api/GetByInvoiceNoTaxpayerId/${text}`);

      return request?.data;
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const { refetch, data } = useQuery({
    queryKey: ["invoice-preview-refund", invoiceQuery],
    queryFn: () => findInvoice(invoiceQuery),
    enabled: false,
    onSuccess: (data) => {
      if (data.body) {
        // if (data?.body?.signatureStatus != "SUCCESS") {
        //   toast.info(
        //     "Invoice is without signature. Refund operation cannot be performed"
        //   );
        //   return;
        // }
        setHideSearch(!hideSearch)
        setShowInvoice(true);
        setsearchResults(data.body);
        setInvoicesPrePost(transformPayload(data.body.invoiceItems));
        setIsRefunded(data.isRefunded);
        setAmountToRefund(0);
      } else {
        toast.warning("Invoice does not exist");
      }
    },
    cacheTime: 0,
    onError: (error) => {
      if (error?.response?.status === 500) {
        toast.error(error?.response?.data || "Technical error!");
        return;
      }
      // console.log({ useMutationError: error });
      toast.error(error?.response?.data || "Invoice could not be saved.");
    },
  });

  const handleSearchInvoice = (e) => {
    e.preventDefault();
    refetch();
    // console.log(invoiceQuery
    // fetch(
    //   `${process.env.REACT_APP_CLIENT_ROOT}/Invoices/GetByInvoiceNoTaxpayerId/${invoiceQuery}/${userDetails?.profile?.company}`,
    //   {
    //     method: 'GET', // or 'PUT'
    //     headers: {
    //       'Content-Type': 'application/json',
    //       Authorization: `Bearer ${userDetails.access_token}`,
    //     },
    //   }
    // )
    //   .then((res) => res.json())
    //   .then((data) => {
    //     if (data.body) {
    //       setShowInvoice(true)
    //       setsearchResults(data.body)
    //       setInvoicesPrePost(data.body.invoiceItems)
    //       // console.log({ data })
    //       setIsRefunded(data.isRefunded)
    //     } else {
    //       toast.warning('Invoice does not exist')
    //     }
    //   })
    //   .catch((err) => console.log(err))
    // .finally(() => setShowLoader(false))
  };

  const handleEditItem = (index) => {
    let temp = invoicesPrePost[index];
    // console.log({ temp })
    setUpdateItemData({
      ...temp,
      index: index,
      itemName: temp.itemDescription,
      quantity: temp.quantity,
      price: temp.price,
      qtyToRefund: "",
      priceAfterRefund: "",
    });
    setShowUpdate(true);
  };

  useEffect(() => {
    if (togglePartialRefund) {
      setPromptMessage("Do you want to proceed with the PARTIAL refund?");
      setRefundTypeForPost("Partial");
      setRefundType("Partial");
      // setConfirmDisabled(true);
    } else {
      setPromptMessage("Do you want to proceed with a FULL refund?");
      setRefundTypeForPost("Full");
      setRefundType("Full");
      // setConfirmDisabled(false);
    }
  }, [togglePartialRefund]);

  //If refund type is full set invoiceprepost to data from the query call
  useEffect(() => {
    if (refundType == "Full") {
      setInvoicesPrePost(transformPayload(data?.body?.invoiceItems));
      setAmountToRefund(searchResults.totalAmount);
    }

    if (refundType == "Partial") {
      setAmountToRefund(0);
    }
  }, [refundType]);

  const handleOnConfirmClick = () => {
    //check if at least one item has been refunded if refund type is partial
    const temp = invoicesPrePost.findIndex((item) => item?.refundQuantity);
    if (refundType == "Partial" && temp == -1) {
      toast.error("No change in item");
      return;
    }

    //if item has been refunded refund type is always partial
    if (searchResults?.refundType !== "NO REFUNDS") {
      // setRefundType("Partial");
      setRefundTypeForPost("Partial");

      setPromptMessage("Do you want to proceed with the PARTIAL Return Purchace item(s)?");
      setrefundInvoice({
        ...searchResults,
        invoiceItemsToPost: invoicesPrePost,
      });
      setIsRefunded(false);
      setshowPrompt(true);
      return;
    }

    const isFullRefund = invoicesPrePost.every(
      (item) => item.availableQty == 0
    );
    // console.log("got here", invoicesPrePost, isFullRefund)
    if (isFullRefund || refundType == "Full") {
      // setRefundType("Full");
      setRefundTypeForPost("Full");

      setPromptMessage(
        "Your current setup is a FULL refund. Do you want to proceed?"
      );
    } else {
      // setRefundType("Partial");
      setRefundTypeForPost("Partial");

      setPromptMessage("Do you want to proceed with the PARTIAL refund?");
    }
    setrefundInvoice({ ...searchResults, invoiceItemsToPost: invoicesPrePost });
    setIsRefunded(false);
    setshowPrompt(true);
  };

  // console.log({len:searchResults?.refundType})

  return (
    <>
      <ToastContainer />
      {isLoading && <Loader />}
      <Modal
        className="modal-dialog-centered modal-lg refund-modal-wrapper"
        isOpen={show}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            margin: 15,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <img
              src={refund}
              alt="refund"
              style={{ height: 30, marginRight: 20 }}
            />
            <h2 className="modal-title" id="exampleModalLabel">
              Purchase Return Invoice
            </h2>
          </div>
          {showInvoice && !showToggle && !isRefunded ? (
            <CustomToggleButtonGroup
              settogglePartialRefund={settogglePartialRefund}
              canFullRefund={Boolean(searchResults?.refundType == "NO REFUNDS")}
            />
          ) : (
            <button
              aria-label="Close"
              className="close"
              type="button"
              onClick={() => {
                setinvoiceQuery("");
                setShowInvoice((prev) => false);
                setIsFocus(false);
                setOpen(false);
              }}
            >
              <span aria-hidden={true}>{!showInvoice ? "x" : null}</span>
            </button>
          )}
          {isRefunded && (
            <Button
              onClick={() => {
                setIsRefunded(false);
                setOpen(false);
                setinvoiceQuery("");
                setShowInvoice(false);
                setIsFocus(false);
                setShowToggle(false);
              }}
           
            >
              <span aria-hidden={true}>{"x"}</span>
            </Button>
          )}
        </div>
        <div className="modal-header">
          <div
            style={{
              width: "100%",
            }}
          >
            <Form
              className="navbar-search navbar-search-light form-inline "
              onSubmit={(e) => handleSearchInvoice(e)}
              hidden={hideSearch}
              
            >
              <FormGroup className="mb-0">
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend" className="mt-2">
                    <InputGroupText>
                      <i className="fas fa-search" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Search by Invoice No"
                    type="text"
                    value={invoiceQuery}
                    onChange={(e) => {
                      setinvoiceQuery(e.target.value);
                      if (invoiceQuery.length > 0) {
                        setIsFocus(true);
                      }
                    }}
                    style={{ width: 650 }}
                  />
                  <InputGroupAddon addonType="append">
                    <InputGroupText>
                      <button
                        aria-label="Close"
                        className="close"
                        type="button"
                        onClick={() => {
                          setinvoiceQuery("");
                          setShowInvoice(false);
                          setIsFocus(false);
                        }}
                      >
                        <span aria-hidden={true}>{isFocus ? "x" : null}</span>
                      </button>
                    </InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
              </FormGroup>
            </Form>
          </div>
        </div>

        <Card
          hidden={!showInvoice}
          className="shadow"
          style={{
            // height: "750px",
            marginLeft: "10px",
            padding: "30px",
            marginTop:-40
          }}
        >
          <div style={styles.header}>
            <div style={styles.leftHeader}>
              <img src={graLogo} />
            </div>

            <div style={styles.rightHeader}>
              {/* <img src={companyLogo} style={{ height: 30, width: '40%' }} /> */}
              {/* <h3>{userDetails.profile.companyname}</h3> */}
              <h3>INVOICE </h3>
              <h4>#{searchResults.invoiceNo || ""}</h4>
              <h6>
                Issued on :{" "}
                {new Date(searchResults.date).toDateString().substring(3)}
              </h6>
              <h6>
                Due Date:{" "}
                {new Date(searchResults.date).toDateString().substring(3)}
              </h6>
            </div>
          </div>
          <div style={styles.title}>
            <h4>
              Invoice for: &nbsp;<b>{searchResults.customerName}</b>
            </h4>
          </div>

          <div style={styles.body}>
            <RefundInvoiceItemsTable
              isRefunded={isRefunded}
              togglePartialRefund={togglePartialRefund}
              handleEditItem={handleEditItem}
              invoiceItems={invoicesPrePost}
            />
          </div>
          <div style={styles.footer}>
            <div style={styles.total}>
              <h5>
                Total Paid (GH&#8373;)
                {/* {moneyInTxt(searchResults.totalAmount)} */}
                {moneyInTxt(searchResults.totalAmountToRefund)}
              </h5>
              <h5>
                Total Amount to Refund (GH&#8373;){moneyInTxt(amountToRefund)}
                {/* {moneyInTxt(searchResults.totalAmount)} */}
                {/* {moneyInTxt(
                  invoicesPrePost.reduce(
                    (total, item) => total + item.unitPrice * item.quantity,
                    0
                  )
                )} */}
              </h5>
            </div>
          </div>
          {/* <div style={styles.bottomcomments}>
            <div style={styles.comments}>
              <h5>{searchResults.comments || 'no comments'}</h5>
            </div>
          </div> */}
        </Card>

        {isRefunded ? (
          <p
            style={{
              backgroundColor: "pink",
              margin: 10,
              color: "red",
              padding: 10,
              fontWeight: 600,
              borderRadius: 10,
            }}
          >
            Invoice already refunded
          </p>
        ) : (
          <div hidden={!showInvoice} style={{ margin: "5px", float: "right" }}>
            <Row>
              <Col lg="8"></Col>
              <Col lg="2">
                <Button
                  disabled={false}
                  color="warning"
                  data-dismiss="modal"
                  style={{ width: "100%" }}
                  onClick={() => {
                    setIsRefunded(false);
                    setOpen(false);
                    setinvoiceQuery("");
                    setShowInvoice(false);
                    setIsFocus(false);
                    setShowToggle(false);
                    reset(uuid());
                  }}
                  size="sm"
                >
                  <span className="btn-inner--text">Cancel</span>
                </Button>
              </Col>
              <Col lg="2">
                <Button
                  disabled={confirmDisabled}
                  color="success"
                  data-dismiss="modal"
                  style={{ width: "100%" }}
                  onClick={handleOnConfirmClick}
                  size="sm"
                >
                  <span className="btn-inner--text">Submit</span>
                </Button>
              </Col>
            </Row>
          </div>
        )}
      </Modal>

      {showUpdate && (
        <EditPreviewInvoiceItem
          updateItemData={updateItemData}
          setUpdateItemData={setUpdateItemData}
          setInvoicesPrePost={setInvoicesPrePost}
          invoicesPrePost={invoicesPrePost}
          setShowUpdate={setShowUpdate}
          searchResults={searchResults}
          setConfirmDisabled={setConfirmDisabled}
          setAmountToRefund={setAmountToRefund}
        />
      )}
    </>
  );
}

const styles = {
  header: {
    display: "flex",
    // height: "20%",
    // marginBottom: 20,
  },
  bottomcomments: {
    display: "flex",
    justifyContent: "space-between",
  },
  leftHeader: {
    display: "flex",
    width: "50%",
    flexDirection: "column",
    alignItems: "flex-start",
    //border: '1px solid blue',
  },
  rightHeader: {
    display: "flex",
    width: "50%",
    flexDirection: "column",
    alignItems: "flex-end",
    //border: '1px solid green',
  },
  title: {
    // height: "14%",
    // backgroundColor: "#eff4fd",
    // borderRadius: 10,
    // padding: 10,
    // marginBottom: 25,
  },
  body: {
    marginTop: 0,
    minHeight: "10vh",
    overflow: "auto",
  },
  footer: {
    display: "flex",
    flexDirection: "row",
    marginTop: 10,
    height: "10%",
    overflow: "auto",
  },
  total: {
    display: "block",
    borderTop: "1px solid rgb(227, 227, 227)",
    padding: "10px",
    /* margin-top: 10px; */
    textAlign: "right",
    width: "100%",
  },
  comments: {
    height: 100,
    width: "47%",
    overflow: "auto",
    flexDirection: "row",
    backgroundColor: "#eff4fd",
    borderRadius: 10,
    padding: 10,
    color: "#cecece",
    marginTop: 40,
  },

  tablehead: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
};

export default InvoicePreviewRefund;
