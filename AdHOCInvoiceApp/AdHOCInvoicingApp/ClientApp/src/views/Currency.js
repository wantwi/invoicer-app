import React, { useEffect } from "react";
import {
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Container,
  FormGroup,
  Input,
  CardFooter,
  Button,
  Table,
  Pagination,
  PaginationItem,
  PaginationLink,
  Modal,
} from "reactstrap";
import UserHeader from "components/Headers/UserHeader";
import { ToastContainer, toast } from "react-toastify";
import { countries } from "countries-list";
import { useState } from "react";
import Loader from "components/Modals/Loader";
import { moneyInTxt } from "components/Invoice/InvoicePreview";
import { FcCancel } from "react-icons/fc";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { v4 as uuid } from "uuid";
import useCustomAxios from "hooks/useCustomAxios";
import { EvatTable } from "components/Tables/EvatTable";
import { NewRateForm } from "components/NewRate";
import { FaEdit } from "react-icons/fa";

const init = {
  currencyName: "",
  iso: "",
  newRate: "",
  date: "",
};

let userDetails = JSON.parse(
  sessionStorage.getItem(process.env.REACT_APP_OIDC_USER)
);
const CurrencySetupWithReset = ({ reset }) => {
  const [exchangeFormData, setExchangeFormData] = useState(init);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showList, setShowList] = useState(false);
  const [currencyList, setCurrencyList] = useState([]);
  const axios = useCustomAxios();
  const [pageInfo, setPageInfo] = useState({
    totalItems: 10,
    pageNumber: 1,
    pageSize: 10,
    totalPages: 5,
  });

  const [filter, setfilter] = useState({
    currency: "GHS",
    period: "CURRENT",
  });

  const [pageNumber, setPageNumber] = useState(1);

  const handleClick = (currency) => {
    setShowList(false);

    setExchangeFormData((prev) => ({
      ...prev,
      currencyName: currency.name,
      iso: currency.iso,
    }));
  };

  const prepData = [
    {
      invoiceNo: "9201921",
      date: new Date().toLocaleDateString(),
      rate: 11.3,
    },
    {
      invoiceNo: "9201921",
      date: new Date().toLocaleDateString(),
      rate: 8.95,
    },
  ];

  const columns = React.useMemo(
    () =>
      filter.period == "PAST"
        ? [
            {
              Header: "#",
              accessor: "invoiceNo",
              className: " text-left ",

              width: "auto",
            },

            {
              Header: "Date Added",
              accessor: "date",
              className: " text-left ",

              width: "auto",
              Cell: ({ cell: { value } }) => (
                <>{new Date(value).toLocaleDateString("en-GB")}</>
              ),
            },

            {
              Header: () => (
                <span
                  align="right"
                  style={{
                    float: "right",
                    display: "inline-block",
                    width: "100%",
                    paddingRight: "20px",
                  }}
                >
                  Rate
                </span>
              ),
              accessor: "rate",
              className: " text-right ",
              width: "auto",
            },
            ,
          ]
        : [
            {
              Header: "#",
              accessor: "invoiceNo",
              className: " text-left ",

              width: 90,
            },

            {
              Header: "Date Added",
              accessor: "date",
              className: " text-left ",

              width: 140,
              Cell: ({ cell: { value } }) => (
                <>{new Date(value).toLocaleDateString("en-GB")}</>
              ),
            },

            {
              Header: () => (
                <span
                  align="right"
                  style={{
                    float: "right",
                    display: "inline-block",
                    width: "100%",
                    paddingRight: "20px",
                  }}
                >
                  Rate
                </span>
              ),
              accessor: "rate",
              className: " text-right ",
              // Cell: ({ cell: { value } }) => <>{moneyInTxt(value)}</>,
              width: 200,
            },
            {
              Header: () => <div align="center">Action</div>,
              disableSortBy: true,
              className: " text-center table-action",
              Cell: ({ cell }) => {
                return (
                  <Button
                    style={{ padding: "2px 8px" }}
                    className="badge-success"
                    onClick={(e) => {
                      setExchangeFormData(() => ({
                        newRate: cell?.row?.original?.rate,
                        date: new Date(cell?.row?.original?.date).toLocaleDateString("en-gb"),
                        currencyName: "Ghana Cedis",
                        iso: "GHS",
                      }));
                      setShowForm(true);
                    }}
                    title="Preview"
                  >
                    <FaEdit />
                  </Button>
                );
              },
              accessor: "something",
              width: 100,
            },
          ],
    [filter.period]
  );

  const getCurrency = async () => {
    const request = await axios.get(
      `/api/GetCurrency/${filter.currency}/${filter.period}`
    );

    return request.data;
  };

  const getCurrencies = async () => {
    const request = await axios.get("/api/GetCurrency");

    return request.data;
  };

  const { data: currenciesLList = [], isLoading } = useQuery({
    queryFn: getCurrencies,
    queryKey: "currencies",
  });

  const { data: currencies } = useQuery({
    queryKey: ["currencies", filter.currency, filter.period],
    queryFn: getCurrency,
    onSuccess: (data) => {
      // console.log({ data });
      // let res = data?.map((item) => {
      //   return {
      //     name: item.name,
      //     iso: item.code,
      //     homeCurrency: item.homeCurrency,
      //     rate: 0,
      //   };
      // });
      // setCurrencies(res.filter((item) => item.homeCurrency === false));
    },
    enabled: Boolean(filter.currency || filter.period),
  });

  console.log({ exchangeFormData });

  return (
    <>
      <UserHeader
        message={"Exchange Rate Setup page. Setup your currencies here"}
        pageName="Exchange Rate Setup"
      />
      <ToastContainer />

      <Container className="mt--7" fluid>
        <Row className="mt-5">
          <Col className="">
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <div
                  style={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div className="d-flex">
                    <div>
                      <label htmlFor="currency" className="form-control-label ">
                        Currency
                      </label>
                      <select
                        className="form-control font-sm"
                        id="currency"
                        value={filter.currency}
                        onChange={(e) =>
                          setfilter((prev) => ({
                            ...prev,
                            currency: e.target.value,
                          }))
                        }
                        style={{
                          height: 29,
                          padding: "0px 5px",
                          width: "300px",
                        }}
                      >
                        <option value="GHS">GHS</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="YEN">YEN</option>
                      </select>{" "}
                    </div>
                    <div className="ml-2">
                      <label htmlFor="currency" className="form-control-label ">
                        Filter by
                      </label>
                      <select
                        className="form-control font-sm"
                        id="currency"
                        value={filter.period}
                        onChange={(e) =>
                          setfilter((prev) => ({
                            ...prev,
                            period: e.target.value,
                          }))
                        }
                        style={{
                          height: 29,
                          padding: "0px 5px",
                          width: "300px",
                        }}
                      >
                        <option value="CURRENT">Current</option>
                        <option value="PAST">Past</option>
                      </select>{" "}
                    </div>
                  </div>
                  <Button
                    color="primary"
                    onClick={() => setShowForm(true)}
                    type="button"
                    // style={{ width: "100%" }}
                    size="sm"
                  >
                    Add Rate
                  </Button>
                </div>
              </CardHeader>
              <CardBody style={{ marginTop: -30 }}>
                <EvatTable
                  isLoading={false}
                  columns={columns}
                  data={new Array(15).fill({
                    invoiceNo: "9201921",
                    date: new Date().toLocaleDateString(),
                    rate: 11.3,
                  })}
                  // data2={invoices}
                  // setSelectedRow={setSelectedRow}
                  // getPrintPDF={getPrintPDF}
                  // pdfData={pdfData}
                />
                {currencies?.length > 0 && (
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
                        onClick={(e) => setPageNumber(pageInfo.totalPages)}
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
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
        {showForm && (
          <NewRateForm
            rate={exchangeFormData}
            currencies={currenciesLList}
            close={() => {
              setShowForm(false);
              setExchangeFormData(init);
            }}
          />
        )}
      </Container>
    </>
  );
};

const CurrencySetup = () => {
  const [forceRender, setForceRender] = useState("");

  return (
    <>
      <CurrencySetupWithReset key={forceRender} reset={setForceRender} />
    </>
  );
};

export default CurrencySetup;

const styles = {
  body: {
    marginTop: 0,
    height: 400,
    maxHeight: "inherit",
    overflow: "auto",
    marginBottom: 40,
  },
};
