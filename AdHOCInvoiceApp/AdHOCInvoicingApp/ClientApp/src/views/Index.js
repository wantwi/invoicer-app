import { useState, createContext, useEffect, useRef } from "react";
import NewInvoice from "../components/Modals/NewInvoice";
import { FaEye, FaPlus } from "react-icons/fa";
import refund from "../assets/img/theme/refundimg.png";

import {
  Button,
  Card,
  CardHeader,
  Table,
  Container,
  Row,
  Col,
  CardFooter,
  Pagination,
  PaginationItem,
  PaginationLink,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  FormGroup,
  Form,
} from "reactstrap";

import Header from "components/Headers/Header.js";
import { moneyInTxt } from "components/Invoice/InvoicePreview";
import Loader from "components/Modals/Loader";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { ToastContainer, toast } from "react-toastify";
import Prompt from "components/Modals/Prompt";
import InvoicePreviewRefund from "components/Modals/InvoicePreviewRefund";
import { logout } from "services/AuthService";
import PrintPreview from "components/Modals/PrintPreview";
import NoInvoiceSignaturePopup from "components/Modals/NoInvoiceSignaturePopup";
import ErrorBoundary from "components/ErrorBoundary";
import { EvatTable } from "components/Tables/EvatTable";
import ReactTooltip from "react-tooltip";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import useAuth from "hooks/useAuth";
import { useCustomPaginationQuery } from "hooks/useCustomPaginationQuery";
import { useCustomQueryById } from "hooks/useCustomQueryById";
import useCustomAxios from "hooks/useCustomAxios";
import { string } from "prop-types";
import RetryPrompt from "components/Modals/RetryPrompt";
import { useCustomPost } from "hooks/useCustomPost";

export const AppContext = createContext(null);

const Index = () => {
  const axios = useCustomAxios();
  const { selectedBranch } = useAuth();
  const [showNewInvoiceModal, setShowNewInvoiceModal] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [showLoader, setShowLoader] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);
  const [pageInfo, setPageInfo] = useState({
    totalItems: 10,
    pageNumber: 1,
    pageSize: 10,
    totalPages: 5,
  });
  const [open, setOpen] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [refundInvoice, setrefundInvoice] = useState({});
  const [isFocus, setIsFocus] = useState(false);
  const [invoiceQuery, setinvoiceQuery] = useState("");
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [isReportDownloading, setIsReportDownloading] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [formData, setFormData] = useState({});
  const [promptMessage, setPromptMessage] = useState("");
  const [refundType, setRefundType] = useState("Partial");
  const [errorOpen, setErrorOpen] = useState(false);
  const [selectedInvoiceNo, setSelectedInvoiceNo] = useState("");
  const [summary, setSummary] = useState([]);
  const [period, setPeriod] = useState(0);
  const [currencyFilter, setCurrencyFilter] = useState("");
  const [showRetryLoader, setShowRetryLoader] = useState(false);
  const [isPostLoading, setIsPostLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const dayOfWeekSelRef = useRef();
  const [value] = useDebounce(invoiceQuery, 500);
  const [selectedRow, setSelectedRow] = useState("");
  const [rowData, setRowData] = useState(null)
  const [refundTypeForPost, setRefundTypeForPost] = useState("");
  const [isReportLoading, setReportIsLoading] = useState(false);

  const [
    resetInvoicePreviewRefundComponent,
    setResetInvoicePreviewRefundComponent,
  ] = useState("");
  const [pdfData, setPdfData] = useState("");

  // console.log({ selectedInvoiceNo })

  const columns = React.useMemo(
    () => [
      {
        Header: "Invoice #",
        accessor: "invoiceNo",
        className: " text-left ",
        sticky: "left",
        width: 190,
      },
      {
        Header: "Date",
        accessor: "date",
        className: " text-left ",
        sticky: "left",
        width: 140,
        Cell: ({ cell: { value } }) => (
          <>{new Date(value).toLocaleDateString("en-GB")}</>
        ),
      },
      {
        Header: "Customer",
        accessor: "customerName",
        className: " text-left ",

        Cell: ({ cell: { value } }) => {
          return (
            <>
              <span data-tip={value}>{value}</span>
              <ReactTooltip />
            </>
          );
        },
        // minWidth: 340,
        width: "auto",
      },
      // {
      //   Header: "Currency",
      //   accessor: "currency",
      //   width: 90,

      // },
      {
        Header: () => (
          <span align="left" style={{ float: "left", width: "100%" }}>
            Created By
          </span>
        ),
        accessor: "nameOfUser",
        className: " text-left ",
        Cell: ({ cell: { value } }) => <>{value}</>,
        width: "auto",
      },
      {
        Header: () => (
          <span align="right" style={{ float: "right", width: "100%" }}>
            Currency
          </span>
        ),
        accessor: "currency",
        className: " text-right ",
        // Cell: ({ cell: { value } }) => <>{moneyInTxt(value)}</>,
        width: 141,
      },
      {
        Header: () => (
          <span align="right" style={{ float: "right", width: "100%" }}>
            EX VAT amount
          </span>
        ),
        accessor: "totalExVatAmount",
        className: " text-right ",
        Cell: ({ cell: { value } }) => <>{moneyInTxt(value)}</>,
        width: 141,
      },
      {
        Header: () => (
          <span align="right" style={{ float: "right", width: "100%" }}>
            Total Payable
          </span>
        ),
        accessor: "totalAmount",
        className: " text-right ",
        Cell: ({ cell: { value } }) => <>{moneyInTxt(value)}</>,
        width: 139,
      },
      {
        Header: () => <div align="center">View</div>,
        disableSortBy: true,
        className: " text-center table-action",
        Cell: ({ row }) => {
          console.log({ row, gh: row?.original?.signatureStatus?.toUpperCase() });
          return (
            <Button
              style={{ padding: "2px 8px" }}
              className="badge-success"
              onClick={(e) => {
                // if (row?.original?.signatureStatus?.toUpperCase() !== "SUCCESS") {
                //   e.stopPropagation()
                //   setShowPrompt(true)
                //   // toast.info("Invoice cannot be previewed because it has no signature")
                //   return
                // }
                // loadPreview(value);
                setRowData(row.original)
                setSelectedRow(row.original.id);
                getPrintPDF(row.original.id, row?.original?.signatureStatus?.toUpperCase())
                // signatureStatus:"SUCCESS"
              }}
              title="Preview"
            >
              <FaEye />
            </Button>
          );
        },
        accessor: "id",
      },
    ],
    []
  );

  const handleClose = () => {
    setErrorOpen(false);
  };

  let userDetails = JSON.parse(
    sessionStorage.getItem(process.env.REACT_APP_OIDC_USER)
  );
  const controller = new AbortController();

  const getPrintPDF = async (invoiceNo, isSuccess) => {
    setSelectedInvoiceNo(invoiceNo);
    // toast.info('PDF document not available for invoice ' + invoiceNo + ' yet')
    setIsReportDownloading(true);
    // toast.info('Downloading report file. Please wait... ')
    let base64 = "";

    //https://api.cimsgh.com/api/v1/Reports/GenerateVATInvoiceReportAsync?InvoiceNo=2305229002

    try {
      setReportIsLoading(true);
      setMessage("Fetching invoice detail...");
      const request = await axios.post(
        `/api/GenerateVATInvoiceReportAsync`,
        invoiceNo
      );
      if (request) {
        console.log({ request })
        const { data } = request;

        base64 = `data:application/pdf;base64,` + JSON.parse(data?.data);
        const pdfContentType = "application/pdf";

        if (isSuccess != "SUCCESS") {
          setPdfData(base64 + "#toolbar=0");
          setShowReport(true);
          setTimeout(() => {
            setShowPrompt(true)
          }, 300);
        } else {
          setPdfData(base64);
          setShowReport(true);
          //
        }

        const base64toBlob = (data) => {
          // Cut the prefix `data:application/pdf;base64` from the raw base 64
          const base64WithoutPrefix = data.substr(
            `data:${pdfContentType};base64,`.length
          );

          const bytes = atob(base64WithoutPrefix);
          let length = bytes.length;
          let out = new Uint8Array(length);

          while (length--) {
            out[length] = bytes.charCodeAt(length);
          }

          return new Blob([out], { type: pdfContentType });
        };

        const link = document.createElement("a");
        link.href = URL.createObjectURL(base64toBlob(base64));
        link.download = "Invoice Report";
        // link.click()
        setIsReportDownloading(false);
        // toast.success("Download complete")
      }
    } catch (error) {
      console.log({ error });
      setIsReportDownloading(false);
      toast.error(error?.response?.data || "System failed to download invoice");
    } finally {
      setReportIsLoading(false);
      setMessage(null);
    }
  };

  const handleSearchInvoice = (e) => { };

  console.log({ pageNumber, pageInfo });

  useEffect(() => {
    setCurrencyFilter("GHS");
  }, []);

  console.log({ pageInfo });

  const {
    refetch: refetchGetById,
    data: invoceData,
    isLoading: isInvoiceLoading,
    isFetching: isPageFetching,
  } = useCustomQueryById(
    `/api/GetSalesInvoicesDetail/${selectedRow}`,
    "invoice",
    selectedRow,
    (data) => {
      setSelectedRow("");
      setIsReportDownloading(false);
      if (data.signatureStatus === "SUCCESS") {
        setIsReportDownloading(false);
        setFormData(data);
        setShowReport(true);
      } else {
        setIsReportDownloading(false);
        setErrorOpen(true);
      }
    },
    (err) => {
      setSelectedInvoiceNo(data);
      setIsReportDownloading(false);
    },
    {
      isEnabled: false,
    }
  );

  const { data, refetch, isFetching, isLoading } = useCustomPaginationQuery(
    `/api/GetTransactionSummary/${period}/${pageNumber}/${pageSize}/${selectedBranch?.code}`,
    "salesinvoices",
    pageNumber,
    Number(period),
    value,
    (data) => {
      // data = JSON.parse(data);
      // const res = JSON.parse(data.data);
      setInvoices(data?.invoices?.items || []);
      setPageInfo(data.invoices?.paging);
      setSummary(data?.summaries || []);

      if (data?.invoices?.items.length === 0) {
        const msg = !value
          ? "No Invoice Available For " +
          dayOfWeekSelRef?.current?.options[
            dayOfWeekSelRef?.current?.selectedIndex
          ]?.innerText
          : "No invoice matched your search: " + value;
        toast.info(msg);
        setMessage(msg);
        return;
      }
      setMessage(null);
    },
    (err) => { },
    {
      filterUrl: `/api/GetSalesInvoicesByCompanyId/${value}`,
    }
  );
  useEffect(() => {
    if (pageNumber === 0) {
      setPageInfo({
        totalItems: 10,
        pageNumber: 1,
        pageSize: 10,
        totalPages: 5,
      });
      setPageNumber(1);
    }
    refetch();
    return () => { };
  }, [period, pageNumber]);

  useEffect(() => {
    if (value.length > 1) {
      refetch();
    }
    return () => { };
  }, [value]);


  // const retrySuccess = () => {
  //   if (data?.data?.signatureStatus !== "SUCCESS") {
  //     toast.error("Sorry, your invoice could not be signed.")
  //   } else {
  //     toast.success("Invoice Signed Successfully.")
  //     setShowPrompt(false)
  //     set
  //     getPrintPDF(data?.data?.id)
  //   }

  // }
  // const postError = (error) => {
  //   const errData = JSON.parse(error?.data)
  //   console.log({ errData });
  //   toast.error(errData?.message || "Sorry, your invoice could not be signed. Please contact support.")
  // }
  // const { mutate, isLoading: isPostLoading } = useCustomPost("/api/RemoveInvoice", postSuccess, postError)
  // const { mutate: retryMutate, isLoading: isRetryLoading } = useCustomPost("/api/RetryInvoice", retrySuccess, postError)

  const removeIvoice = async () => {
    try {
      setIsPostLoading(true)
      const response = await axios.post("/api/RemoveInvoice", { id: rowData?.id, invoiceNumber: rowData?.invoiceNo })
      console.log({ response });
      if (response.data?.status === "OK") {
        toast.success("Invoice Removed.")

      } else {
        toast.error("Invoice not removed. Please contact support.")
      }

    } catch (error) {
      toast.error("Invoice not removed. Please contact support.")
    } finally {
      refetch()
      setShowPrompt(false)
      setShowReport(false);
      setIsPostLoading(false)

    }
  }
  const retryIvoice = async () => {
    try {
      setIsPostLoading(true)
      const response = await axios.post("/api/RetryInvoice", { id: rowData?.id, invoiceNumber: rowData?.invoiceNo })
      console.log({ response });
      // if (response.data?.status === "OK") {
      //   toast.success("Invoice Removed.")

      // } else {
      //   toast.error("Invoice not removed. Please contact support.")
      // }

    } catch (error) {
      toast.error("Invoice not removed. Please contact support.")
    } finally {
      refetch()
      setShowPrompt(false)
      setShowReport(false);
      setIsPostLoading(false)

    }
  }
  const cancelHandeler = () => removeIvoice()
  const confirmHandeler = () => retryIvoice()

  const handleClosePrompt = () => {
    setShowPrompt(false)
    setShowReport(false);
  }

  useEffect(() => {
    const handleContextmenu = e => {
      e.preventDefault()
    }
    document.addEventListener('contextmenu', handleContextmenu)
    return function cleanup() {
      document.removeEventListener('contextmenu', handleContextmenu)
    }
  }, [])

  return (
    <>
      {isPostLoading ? <Loader /> : null}
      {/* {showRetryLoader || isFetching && <Loader />} */}
      <RetryPrompt isRetryLoading={isPostLoading} isRemoveLoading={isPostLoading} handleClose={handleClosePrompt} confirmHandeler={confirmHandeler} cancelHandeler={cancelHandeler} title="No Signature Invoice" showPrompt={showPrompt} setShowPrompt={setShowPrompt} message="Sorry, this invoice does not have a signature. Would you like to retry obtaining the signature or remove the invoice?" />
      <AppContext.Provider value={{ invoices, setInvoices }}>

        <Header
          summary={summary}
          currencyFilter={currencyFilter}
          setCurrencyFilter={setCurrencyFilter}
          period={period}
          setPeriod={setPeriod}
          dayOfWeekSelRef={dayOfWeekSelRef}
          pageName="Sales Invoice"
        />
        {/* Page content */}
        <Container className="mt--7" fluid>
          {/* <ToastContainer /> */}
          <Row className="my-5">
            <Col className="mb-5 mb-xl-0" xl="12">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <Row className="align-items-center">
                    <div className="col">
                      {/* <h3 className='mb-2'>Transactions</h3> */}

                      {/* <h5 className='mb-0'>List of all invoices</h5> */}
                      <Form
                        className="navbar-search navbar-search-light form-inline "
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleSearchInvoice(e);
                        }}
                      >
                        <FormGroup className="mb-0">
                          {" "}
                          <InputGroup className="input-group-alternative">
                            <InputGroupAddon
                              addonType="prepend"
                              style={{ marginTop: 7 }}
                            >
                              <InputGroupText>
                                <i className="fas fa-search" />
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              placeholder="Search Transactions by Invoice No or Customer name"
                              type="text"
                              value={invoiceQuery}
                              onChange={(e) => {
                                if (invoiceQuery?.length > 25) {
                                  setinvoiceQuery((prev) =>
                                    prev.substring(0, 16)
                                  );
                                  setMessage("Your search query is too long");
                                  return;
                                }
                                setinvoiceQuery(e.target.value);
                              }}
                              style={{ width: 400 }}
                            />
                            <InputGroupAddon addonType="append">
                              <InputGroupText
                                onClick={() => setinvoiceQuery("")}
                              >
                                {isFocus && <i className="fas fa-times" />}
                              </InputGroupText>
                            </InputGroupAddon>
                          </InputGroup>
                          {invoiceQuery.length > 0 && (
                            <button
                              onClick={() => {
                                // loadInvoices(1, 6);
                                setPageNumber(1);
                                setinvoiceQuery("");
                                refetch();
                              }}
                              className="ml-4 btn btn-secondary"
                            >
                              Reset
                            </button>
                          )}
                        </FormGroup>
                      </Form>
                    </div>
                    <div className="col text-right mt-0">
                      <Button
                        color="primary"
                        //href='#pablo'
                        onClick={(e) =>
                          setShowNewInvoiceModal(!showNewInvoiceModal)
                        }
                        size="md"
                      >
                        <FaPlus /> Create Invoice
                      </Button>
                    </div>
                  </Row>
                </CardHeader>
                <div style={styles.body}>
                  <EvatTable
                    isLoading={isLoading || isReportLoading}
                    columns={columns}
                    data={data?.invoices?.items || []}
                    data2={invoices}
                    setSelectedRow={setSelectedRow}
                    getPrintPDF={getPrintPDF}
                    pdfData={pdfData}
                    message={message}
                    sortKey="date"
                  />
                </div>
                <CardFooter className="py-1">
                  {!isLoading && data?.invoices?.items.length > 0 && (
                    <nav aria-label="...">
                      {pageInfo?.pageNumber ? (
                        <Pagination
                          className="pagination justify-content-center mb-0"
                          listClassName="justify-content-center mb-0"
                        >
                          <PaginationItem>
                            <PaginationLink
                              onClick={(e) => {
                                e.preventDefault();
                                if (pageInfo.pageNumber > 1) {
                                  if (pageNumber < 1) {
                                    return;
                                  }

                                  setPageNumber((prev) => Number(prev) - 1);
                                } else {
                                  return;
                                }
                              }}
                            >
                              <i className="fas fa-angle-left" />
                              <span className="sr-only">Previous</span>
                            </PaginationLink>
                          </PaginationItem>

                          <PaginationItem>
                            <PaginationLink onClick={(e) => setPageNumber(1)}>
                              1
                            </PaginationLink>
                          </PaginationItem>

                          <PaginationItem className="active">
                            <PaginationLink
                              onClick={(e) => e.preventDefault()}
                            >
                              {pageInfo.pageNumber}
                            </PaginationLink>
                          </PaginationItem>

                          <PaginationItem>
                            <PaginationLink
                              onClick={(e) =>
                                setPageNumber(pageInfo.totalPages)
                              }
                            >
                              {pageInfo.totalPages}
                            </PaginationLink>
                          </PaginationItem>

                          <PaginationItem>
                            <PaginationLink
                              onClick={(e) => {
                                if (
                                  pageInfo.pageNumber < pageInfo.totalPages
                                ) {
                                  if (pageNumber === pageInfo.totalPages) {
                                    return;
                                  } else {
                                    setPageNumber((prev) => Number(prev) + 1);
                                  }
                                } else {
                                  return;
                                }
                              }}
                            >
                              <i className="fas fa-angle-right" />
                              <span className="sr-only">Next</span>
                            </PaginationLink>
                          </PaginationItem>
                        </Pagination>
                      ) : null}
                    </nav>
                  )}
                </CardFooter>
              </Card>
            </Col>
          </Row>
          {showNewInvoiceModal ? (
            <NewInvoice
              refetch={refetch}
              setShowNewInvoiceModal={setShowNewInvoiceModal}
            />
          ) : null}

          {showReport && (
            <PrintPreview
              setShowReport={setShowReport}
              formData={formData}
              getPrintPDF={getPrintPDF}
              pdfData={pdfData}
              selectedInvoiceNo={selectedInvoiceNo}
            />
          )}
          <NoInvoiceSignaturePopup
            handleClose={handleClose}
            open={errorOpen}
            selectedInvoiceNo={selectedInvoiceNo}
            setShowRetryLoader={setShowRetryLoader}
          />
        </Container>

      </AppContext.Provider>
    </>
  );
};

export default Index;

const styles = {
  body: {
    marginTop: 0,
    height: 520,
    // maxHeight: "450px",
    overflow: "auto",
    // maxHeight: '450px',
    // overflowX: 'scroll',
  },
};
