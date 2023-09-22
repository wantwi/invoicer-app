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
import useAuth from "hooks/useAuth";

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
  const { selectedBranch } = useAuth();
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
    currency: "all",
    period: 0,
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
  console.log({pageNumber});
  const columns = React.useMemo(
    () => [
      {
        Header: "Currency",
        accessor: "currencyCode",
        className: " text-left ",

        width: "auto",
      },

      {
        Header: "Date Added",
        accessor: "transactionDate",
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
            }}
          >
            Rate
          </span>
        ),
        accessor: "exchangeRate",
        className: " text-right ",
        width: "auto",
      },
      {
        Header: () => <div align="center">Status</div>,
        accessor: "status",
        className: " text-center ",
        align: "center",
        width: "auto",
        Cell: (props) => {
          return (
            <span style={{ color: props.value === "A" ? "green" : "red" }}>
              {props.value == "A" ? "Active" : "Inactive"}
            </span>
          );
        },
      },
    ],
    []
  );

  const handleClose = () => {
    setShowForm(false);
    setExchangeFormData(init);
  };

  const getCurrency = async () => {
    const request = await axios.get(
      `/api/GetRates/${selectedBranch?.code}/${filter.currency}/${Number(
        filter.period
      )}/${pageInfo.pageNumber}/${pageInfo.pageSize}`
    );

    console.log({ hey: request });

    return request.data.data;
  };

  const getCurrencies = async () => {
    const request = await axios.get("/api/GetCurrency");
    return request.data.filter((item) => item.homeCurrency === false);
  };

  const { data: currenciesLList = [], isLoading } = useQuery({
    queryFn: getCurrencies,
    queryKey: "currencies",
  });

  const { data: currencies = [], refetch } = useQuery({
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
                        <option value="all">All</option>
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
                        <option value="0">Current</option>
                        <option value="1">This Week</option>
                        <option value="2">This Month</option>
                        <option value="3">This Year</option>
                        <option value="4">All Transactions</option>
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
                  isLoading={isLoading}
                  columns={columns}
                  data={currencies}
                  // sortKey="transactionDate"
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
            close={handleClose}
            refetchCurrencies={refetch}
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
