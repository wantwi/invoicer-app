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
import NewPurchaseInvoice from "../components/Modals/NewPurchaseInvoice2";
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
import useAuth from "hooks/useAuth";

export const PurchaseContext = createContext();
const DebitAndCredit = () => {
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
  const { selectedBranch, user } = useAuth();
  const [noteType, setNoteType] = useState("CREDIT")

  let userDetails = JSON.parse(
    sessionStorage.getItem(process.env.REACT_APP_OIDC_USER)
  );
  const columns = React.useMemo(
    () => [
      {
        Header: "Note #",
        accessor: "number",
        className: " text-left ",
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
        Header: "customer Name",
        accessor: "name",
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
      {
        Header: () => (
          <span align="right" style={{ float: "right", width: "100%" }}>
            Amount
          </span>
        ),
        accessor: "amount",
        className: " text-right ",
        Cell: ({ cell: { value } }) => <>{moneyInTxt(value)}</>,
        width: "auto",
      },
      {
        Header: "Reason",
        accessor: "reason",
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

      {
        Header: () => <div align="center">View</div>,
        disableSortBy: true,
        className: " text-center table-action",
        Cell: ({ row }) => {
          return (
            <Button
              style={{ padding: "2px 8px" }}
              className="badge-success"
              onClick={(e) => {
                // loadPreview(value);
                setSelectedRow(row?.values);
                getInvoiceById(row?.values?.id);
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

  const errorHandler = (err) => {
    return <h1>Something happened while previewing purchase</h1>;
  };

  const getInvoiceById = async (id) => {
    setIsReportDownloading(true);
    const res = await axios.post(
      `/api/GenerateCreditReportAsync`,
      id
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
      let base64 = `data:application/pdf;base64,` + data;
      const pdfContentType = "application/pdf";

      setIsReportDownloading(false);
      setSelectedRow(null);
      setFormData(base64);
      setShowReport(true);
    },
    onError: (res) => {
      setIsReportDownloading(false);
      toast.error(
        res?.data || "Error. Unable to load preview. Please try again"
      );
    },
  });

  // useEffect(() => {
  //   if (selectedRow.length > 0) {
  //     refetchGetById();
  //   }
  //   return () => {};
  // }, [selectedRow]);

  const getInvoice = async (pageNumber, searchText) => {
    // setShowLoader(true);
    let url, result;
    if (searchText.length > 1) {
      url = `/api/Notes/${period}/${pageNumber}/${pageSize}/${searchText}/${noteType}`;
    } else {
      url = `/api/Notes/${period}/${pageNumber}/${pageSize}/${selectedBranch?.code}/${noteType}`;
    }

    const request = await axios.get(url);

    console.log({ getInvoice: request });
    setShowLoader(false);

    if (request?.data?.notes) {
      const result = request?.data?.notes;

      console.log({ getInvoice2: result });
      return result;
      // let obj = {},
      //   pageObj = {};
      // pageObj.paging = 1;
      // pageObj.items = result?.items;
      // obj.invoices = pageObj;
      // obj.summaries = result;

      // setPageInfo(result?.paging);
      // return obj;
    } else {

      // setPageInfo(result.notes?.paging);
      // return result;
    }

    // if(JSON.parse(request?.data)?.StatusCode >=400){
    //    const response = JSON.parse(request?.data)?.ErrorMessage
    //    const error = new Error(response)
    //   error.code = JSON.parse(request?.data)?.StatusCode
    //   throw error;

    // }else{
    //   setShowLoader(false)

    //   console.log({getInvoice: request});

    //   if (searchText.length > 1) {
    //     result = request?.data?.notes;
    //     let obj = {},
    //       pageObj = {};
    //     pageObj.paging = 1;
    //     pageObj.items = result;
    //     obj.invoices = pageObj;
    //     obj.summaries = result;
    //     return obj;
    //   } else {
    //     result = request?.data.notes;

    //     setPageInfo(result.notes?.paging);
    //     return result;
    //   }
    // }
  };

  

  const query = useQuery({
    queryKey: ["notes", pageNumber, Number(period), value, noteType],
    queryFn: () => getInvoice(pageNumber, value),
    onSuccess: (data) => {
      console.log({ onSuccess: data });

      if (!data?.items.length) {
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

      setInvoices(data?.items);
      setPageInfo(data?.paging);
      setSummary({
        totalPayable: data.totalPayable,
        totalSalesVAT: data.totalSalesVAT,
        totalNoSalesInvoices: data.totalNoSalesInvoices,
      });
      setMessage(null);
    },
    onError: (err) => {
      console.log({ treat: err });
    },

    //  placeholderData: true
  });
  const { data, refetch, isFetching, isLoading, isError } = query;

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

  const handleNoteTypeChange = (e)=>{
     setNoteType(e.target.value)
  }

  console.log({ invoices,pageInfo });

  useEffect(() => {
    setShowLoader(isLoading);
  
    return () => {
      
    }
  }, [isLoading])
  
  console.log({isLoading, isError});

  return (
    <PurchaseContext.Provider value={{ invoices, setInvoices }}>
      <Header
        summary={summary}
        period={period}
        setPeriod={setPeriod}
        dayOfWeekSelRef={dayOfWeekSelRef}
        pageName="Debit & Credit Note"
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
                    <Col md="2">
                    <select className="form-control" value={noteType} onChange={handleNoteTypeChange}>
                      <option disabled selected>Select note type</option>
                      <option value={"DEBIT"}>DEBIT</option>
                      <option value={"CREDIT"}>CREDIT</option>
                    </select>
                    </Col>
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
                          <InputGroup className="input-group-alternative ">
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
                        <FaEdit /> Add Note
                      </Button>
                    </div>
                  </Row>
                </CardHeader>
                <div style={styles.body}>
                  <EvatTable
                    isLoading={showLoader || isReportDownloading}
                    columns={columns}
                    data={invoices}
                    getPrintPDF={() => null}
                    message={message}
                    sortKey="date"
                  />
                </div>

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
              refetch={refetch}
            />
          ) : null}
        </Container>
      </ErrorBoundary>
    </PurchaseContext.Provider>
  );
};

export default DebitAndCredit;

const styles = {
  body: {
    marginTop: 0,
    // height: 420,
    // maxHeight: "450px",
    overflow: "auto",
  },
};
