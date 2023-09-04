import React, { useEffect, useRef, useState } from "react";
import Header from "components/Headers/Header.js";
import { moneyInTxt } from "components/Invoice/InvoicePreview";
import {
  Container,
  Card,
  CardHeader,
  CardFooter,
  Row,
  Col,
  Pagination,
  PaginationItem,
  PaginationLink,
  Button,
  Form,
  FormGroup,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
} from "reactstrap";
import { useCustomPaginationQuery } from "hooks/useCustomPaginationQuery";
import { FaEye } from "react-icons/fa";
import { useDebounce } from "use-debounce";
import { ToastContainer, toast } from "react-toastify";
import { useCustomQueryById } from "hooks/useCustomQueryById";
import useCustomAxios from "hooks/useCustomAxios";
import { EvatTable } from "components/Tables/EvatTable";
import PrintPreview from "components/Modals/PrintPreview";
import useAuth from "hooks/useAuth";

const Refunds = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [refunds, setrefunds] = useState([]);
  const [pageSize] = useState(9);
  const [pageInfo, setPageInfo] = useState({
    totalItems: 10,
    pageNumber: 1,
    pageSize: 5,
    totalPages: 10,
  });
  const [summary, setSummary] = useState({
    totalPayable: 0,
    totalSalesVAT: 0,
    totalNoSalesInvoices: 0,
  });
  const [period, setPeriod] = useState(1);
  const dayOfWeekSelRef = useRef();
  const [showReport, setShowReport] = useState(false);

  const [invoiceQuery, setinvoiceQuery] = useState("");
  const [value] = useDebounce(invoiceQuery, 500);
  const [selectedRow, setSelectedRow] = useState("");
  const [message, setMessage] = useState(null);
  const [formData, setFormData] = useState({});
  const axios = useCustomAxios();
  const [pdfData, setPdfData] = useState("");
  const [selectedInvoiceNo, setSelectedInvoiceNo] = useState("");
  const [isRefundLoading, setRefundIsLoading] = useState(false);
  const [, setIsReportDownloading] = useState(false);
  const { selectedBranch } = useAuth();

  const columns = React.useMemo(
    () => [
      {
        Header: "Invoice #",
        accessor: "invoiceNo",
        className: " text-left ",

        width: 190,
      },
      {
        Header: "Refund #",
        accessor: "refundNo",
        className: " text-left ",

        width: 190,
      },
      {
        Header: "Refund Date",
        accessor: "date",
        className: " text-left ",
        Cell: ({ cell: { value } }) => (
          <>{new Date(value).toLocaleDateString("en-GB")}</>
        ),
        width: 140,
      },
      {
        Header: "Customer",
        accessor: "customerName",
        className: " text-left ",

        width: "auto",
      },
      {
        Header: "Type",
        accessor: "refundType",
        className: " text-left ",

        width: 140,
      },

      {
        Header: "Total Refund Amount",
        accessor: "totalAmount",
        className: " text-left ",

        Cell: ({ cell: { value } }) => {
          return (
            <>
              <div style={{ textAlign: "right", width: "10%" }}>
                {moneyInTxt(value)}
              </div>
            </>
          );
        },
        width: 140,
      },
      {
        Header: () => <div align="center">View</div>,
        disableSortBy: true,
        className: " text-center table-action",
        accessor: "action",
        width: 140,
        Cell: (data) => {
          return (
            <Button
              style={{ padding: "2px 8px" }}
              className="badge-success"
              onClick={(e) => {
                getPrintPDF(data?.row?.original?.id);
              }}
              title="Preview"
            >
              <FaEye />
            </Button>
          );
        },
      },
    ],
    []
  );

  const controller = new AbortController();

  const getPrintPDF = async (invoiceNo) => {
    setSelectedInvoiceNo(invoiceNo);
    setRefundIsLoading(true);
    let base64 = "";

    try {
      const request = await axios.post(
        `/api/GenerateRefundReportAsync`,
        invoiceNo
      );
      if (request) {
        const { data } = request;
        base64 = `data:application/pdf;base64,` + data;
        const pdfContentType = "application/pdf";

        setPdfData(base64);
        setShowReport(true);
        setRefundIsLoading(false);
        const base64toBlob = (data) => {
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
      }
    } catch (error) {
      setIsReportDownloading(false);
      toast.error("System failed to download invoice ");
      setRefundIsLoading(false);
    }
  };

  const { data, refetch, isFetching, isLoading } = useCustomPaginationQuery(
    !value
      ? `/api/GetRefunds/${period}/${pageNumber}/${pageSize}/${selectedBranch?.code}`
      : `/api/GetRefundsSearch/${value}`,
    "refunds",
    pageNumber,
    Number(period),
    value,
    (data) => {
      // return
      setrefunds(data?.invoices?.items || []);
      setPageInfo(data.invoices?.paging);
      setSummary(data?.summaries || []);

      if (data?.invoices?.items?.length === 0) {
        const msg = !value
          ? "No Invoice Available For " +
            dayOfWeekSelRef?.current?.options[
              dayOfWeekSelRef?.current?.selectedIndex
            ]?.innerText
          : "No invoice matched your search: " + value;
        toast.info(msg);
        setMessage(msg);
      } else {
        setMessage(null);
      }
    },
    (err) => {
      toast.error(err?.response?.data || "Error loading Refunds");
    },
    {
      filterUrl: `/api/GetRefundsSearch/${value}`,
      shouldTransform: false,
    }
  );

  const {
    refetch: refetchGetById,
    data: refundData,
    isLoading: isInvoiceLoading,
    isFetching: isPageFetching,
  } = useCustomQueryById(
    `/api/GetRefundsById/${selectedRow}`,
    "refund-detail",
    selectedRow,
    (data) => {
      setSelectedRow("");
      setFormData(data);
      setShowReport(true);
      if (data.signatureStatus === "SUCCESS") {
        setFormData(data);
        setShowReport(true);
      } else {
        setFormData(data);
      }
    },
    (err) => {
      toast.error(
        err?.message || err?.Message || "Could not get Refund detail"
      );
      setShowReport(false);
    },
    {
      isEnabled: false,
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
    return () => {};
  }, [period, pageNumber]);

  useEffect(() => {
    if (value.length > 1) {
      refetch();
    }
    return () => {};
  }, [value]);

  useEffect(() => {
    if (selectedRow.length > 0) {
      refetchGetById();
    }
    return () => {};
  }, [selectedRow]);

  return (
    <>
      <Header
        dayOfWeekSelRef={dayOfWeekSelRef}
        summary={summary}
        period={period}
        // displayRecent={false}
        setPeriod={setPeriod}
        pageName="Refunds"
      />
      <ToastContainer />
      <Container className="mt--7" fluid>
        <Row className="mt-5">
          <Col className="mb-5 mb-xl-0" xl="12">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <Form
                      className="navbar-search navbar-search-light form-inline "
                      onSubmit={(e) => {}}
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
                            placeholder="Search by Invoice No, Refund No or Customer name"
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
                            <InputGroupText></InputGroupText>
                          </InputGroupAddon>
                        </InputGroup>
                      </FormGroup>
                    </Form>
                  </div>
                </Row>
              </CardHeader>
              <div style={styles.body}>
                <EvatTable
                  isLoading={isLoading || isInvoiceLoading || isRefundLoading}
                  columns={columns}
                  data={refunds}
                  sortKey={"date"}
                  setSelectedRow={() => null}
                  getPrintPDF={() => null}
                  pdfData={pdfData}
                  message={message}
                />
              </div>
              <CardFooter className="py-1">
                {!(isLoading || isInvoiceLoading || isRefundLoading) &&
                  refunds?.length > 0 && (
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
                            <PaginationLink onClick={(e) => e.preventDefault()}>
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
                                if (pageInfo.pageNumber < pageInfo.totalPages) {
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
      </Container>
      {showReport && (
        <PrintPreview
          setShowReport={setShowReport}
          formData={formData}
          getPrintPDF={getPrintPDF}
          pdfData={pdfData}
          selectedInvoiceNo={selectedInvoiceNo}
        />
      )}
    </>
  );
};

export default Refunds;

const styles = {
  body: {
    marginTop: -10,
    // height: 420,
    // maxHeight: 420,
    overflow: "auto",
    cursor: "pointer",
  },
};
