import Header from "components/Headers/Header";
import React, { useState, useEffect, useRef } from "react";
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
import { ToastContainer, toast } from "react-toastify";
import Loader from "components/Modals/Loader";
import NewPurchaseInvoice from "../components/Modals/NewPurchaseInvoice";
import { moneyInTxt } from "components/Invoice/InvoicePreview";
import { FaEdit, FaEye } from "react-icons/fa";
import { createContext } from "react";
import PrintPreview from "components/Modals/PrintPreview";
import { debounce } from "lodash";
import { ErrorBoundary } from "react-error-boundary";
import FcCallback from "components/Fallback";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import useCustomAxios from "hooks/useCustomAxios";
import { EvatTable } from "components/Tables/EvatTable";
import ReactTooltip from "react-tooltip";
export const PurchaseContext = createContext();
const Purchases = () => {
  const axios = useCustomAxios();
  const [showLoader, setShowLoader] = useState(false);
  const [showNewInvoiceModal, setShowNewInvoiceModal] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(5);
  const [pageInfo, setPageInfo] = useState({
    totalItems: 1,
    pageNumber: 1,
    pageSize: 5,
    totalPages: 1,
  });
  const [isReportDownloading, setIsReportDownloading] = useState(false);
  const [formData, setFormData] = useState({});
  const [showReport, setShowReport] = useState(false);
  const [invoiceQuery, setinvoiceQuery] = useState("");
  const [summary, setSummary] = useState({
    totalPayable: 0,
    totalSalesVAT: 0,
    totalNoSalesInvoices: 0,
  });
  const [period, setPeriod] = useState(1);
  const [salesType, setSalesType] = useState("Purchase");
  const [message, setMessage] = useState(null);
  const dayOfWeekSelRef = useRef();
  const [value] = useDebounce(invoiceQuery, 100);
  const [selectedRow, setSelectedRow] = useState(null);

  let userDetails = JSON.parse(
    sessionStorage.getItem(process.env.REACT_APP_OIDC_USER)
  );
  const columns = React.useMemo(
    () => [
      {
        Header: "Invoice #",
        accessor: "invoiceNo",
        className: " text-left ",

        width: 140,
      },
      {
        Header: "Date",
        accessor: "date",
        className: " text-left ",

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
          )
        },
        // minWidth: 340,
        width: "auto",
      },
      {
        Header: "Served By",
        accessor: "nameOfUser",
        className: " text-left ",

        Cell: ({ cell: { value } }) => {
          return (
            <>
              <span data-tip={value}>{value}</span>
              <ReactTooltip />
            </>
          )
        },
        // minWidth: 340,
        width: "auto",
      },

      {
        Header: () => (
          <span align="right" style={{ float: "right", width: "100%" }}>
            Total Payable (GHS)
          </span>
        ),
        accessor: "totalAmount",
        className: " text-right ",
        Cell: ({ cell: { value } }) => <>{moneyInTxt(value)}</>,
        width: "auto",
      },
      {
        Header: () => <div align="center">View</div>,
        disableSortBy: true,
        className: " text-center table-action",
        Cell: ({ row },) => {
          return (
            <Button
              style={{ padding: "2px 8px" }}
              className="badge-success"
              onClick={(e) => {
                // loadPreview(value);
                setSelectedRow(row?.values)
                getInvoiceById(row?.values?.id)
              }}
              title="Preview"
            >
              <FaEye />
            </Button>
          )
        },
        accessor: "id",
      },
    ],
    []
  )



  const errorHandler = (err) => {
    return <h1>Something happened while previewing purchase</h1>;
  };

  const getInvoiceById = async (id) => {
    setIsReportDownloading(true);
    const res = await axios.post(
        `/api/GenerateVAPurchaseInvoiceReportAsync`,id
    );
    return res?.data;

  };

  const {
    refetch: refetchGetById,
    data: invoceData,
    isLoading: isInvoiceLoading,
  } = useQuery({
    queryKey: ["purchase-invoice", selectedRow?.id],
    queryFn: () => getInvoiceById(selectedRow?.id),
    enabled: Boolean(selectedRow?.id),
    onSuccess: (data) => {
      let base64 = `data:application/pdf;base64,` + data
      const pdfContentType = "application/pdf"

      setIsReportDownloading(false);
      setSelectedRow(null);
      setFormData(base64);
      setShowReport(true);
    },
    onError: (res) => {
      setIsReportDownloading(false);
      toast.error(res?.data || "Error. Unable to load preview. Please try again");
    },
  });

  // useEffect(() => {
  //   if (selectedRow.length > 0) {
  //     refetchGetById();
  //   }
  //   return () => {};
  // }, [selectedRow]);

  const getInvoice = async (pageNumber, searchText) => {
    setShowLoader(true)
    let url, result;
    if (searchText.length > 1) {
      url = `/api/GetPurchaseSearch/${period}/${pageNumber}/${pageSize}/${searchText}`;
    } else {
      url = `/api/GetPurchase/${period}/${pageNumber}/${pageSize}`;
    }

    const request = await axios.get(url);
    setShowLoader(false)

    if (searchText.length > 1) {
      result = request?.data;
      let obj = {},
        pageObj = {};
      pageObj.paging = 1;
      pageObj.items = result;
      obj.invoices = pageObj;
      obj.summaries = result;
      return obj;
    } else {
      result = request?.data;

      setPageInfo(result.invoices?.paging);
      return result;
    }
  };

  const query = useQuery({
    queryKey: ["purchase-invoices", pageNumber, Number(period), value],
    queryFn: () => getInvoice(pageNumber, value),
    onSuccess: (data) => {
      if (!data?.invoices?.items.length) {
        const msg =
          "No invoices available for " +
          dayOfWeekSelRef.current.options[dayOfWeekSelRef.current.selectedIndex]
            .innerText;
        // toast.info(msg)
        setMessage(msg);
        setPageInfo({});
        setInvoices([]);
        return;
      }
      setInvoices(data.invoices?.items);
      setPageInfo(data.invoices?.paging);
      setSummary({
        totalPayable: data.totalPayable,
        totalSalesVAT: data.totalSalesVAT,
        totalNoSalesInvoices: data.totalNoSalesInvoices,
      });
      setMessage(null);
    },

    //  placeholderData: true
  });
  const { data, refetch, isFetching, isLoading } = query;

  useEffect(() => {
    refetch();
    return () => { };
  }, [period, pageNumber]);

  useEffect(() => {
    if (value.length > 1) {
      refetch();
    }
    if (invoiceQuery) {
      setInvoices([]);
      refetch();
    }
    return () => { };
  }, [value]);

  return (
    <PurchaseContext.Provider value={{ invoices, setInvoices }}>
      <Header
        summary={summary}
        period={period}
        setPeriod={setPeriod}
        dayOfWeekSelRef={dayOfWeekSelRef}
        pageName="Purchase Invoice"
      />
      <ErrorBoundary FallbackComponent={FcCallback} onError={errorHandler}>
        {/* Page content */}
        <Container className="mt--7" fluid>
          <ToastContainer />
          <Row className="my-5">
            <Col className="mb-5 mb-xl-0" xl="12">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <Row className="align-items-center">
                    <div className="col">
                      <Form
                        className="navbar-search navbar-search-light form-inline "
                        onSubmit={(e) => {
                          e.preventDefault();
                          // handleSearchInvoice(e)
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
                                setinvoiceQuery(e.target.value);
                                //handleSearchInvoice(e.target.value)
                              }}
                              style={{ width: 400 }}
                            />
                            <InputGroupAddon addonType="append">
                              <InputGroupText
                                onClick={() => setinvoiceQuery("")}
                              >
                                {/* {isFocus && <i className='fas fa-times' />} */}
                              </InputGroupText>
                            </InputGroupAddon>
                          </InputGroup>
                        </FormGroup>
                      </Form>
                    </div>
                    <div className="col text-right mt-0">
                      <Button
                        color="primary"
                        onClick={(e) =>
                          setShowNewInvoiceModal(!showNewInvoiceModal)
                        }
                        size="md"
                      >
                        <FaEdit /> Record Invoice
                      </Button>
                    </div>
                  </Row>
                </CardHeader>
                <div style={styles.body}>
                  <EvatTable
                    isLoading={(showLoader || isReportDownloading)}
                    columns={columns}
                    data={invoices || []}
                    getPrintPDF={()=>null}
                  />

                </div>
                {message && <p className="text-info text-center">{message}</p>}

                {pageInfo?.totalItems > 0 && (
                  <CardFooter className="py-4">
                    <nav aria-label="...">
                      <Pagination
                        className="pagination justify-content-center mb-0"
                        listClassName="justify-content-center mb-0"
                      >
                        <PaginationItem>
                          <PaginationLink
                            onClick={(e) => {
                              if (pageInfo?.pageNumber > 1) {
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
                          <PaginationLink onClick={(e) => e.preventDefault()}>
                            {pageInfo?.pageNumber}
                          </PaginationLink>
                        </PaginationItem>

                        <PaginationItem>
                          <PaginationLink
                            onClick={(e) => setPageNumber(pageInfo.totalPages)}
                          >
                            {pageInfo?.totalPages}
                          </PaginationLink>
                        </PaginationItem>

                        <PaginationItem>
                          <PaginationLink
                            onClick={(e) => {
                              if (pageInfo.pageNumber < pageInfo.totalPages) {
                                setPageNumber((prev) => Number(prev) + 1);
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
                    </nav>
                  </CardFooter>
                )}
              </Card>
            </Col>
          </Row>
          {showNewInvoiceModal ? (
            <NewPurchaseInvoice
              setShowNewInvoiceModal={setShowNewInvoiceModal}
            />
          ) : null}
          {showReport && (
            <PrintPreview
              setShowReport={setShowReport}
              pdfData={formData}
              getPrintPDF={() => null}
              salesType={salesType}
              showSignature={false}
              selectedInvoiceNo={selectedRow?.invoiceNo}
              bottom={0}
            />
          )}
        </Container>
      </ErrorBoundary>
    </PurchaseContext.Provider>
  );
};

export default Purchases;

const styles = {
  body: {
    marginTop: 0,
    height: 420,
    maxHeight: "450px",
    overflow: "auto",
  },
};
