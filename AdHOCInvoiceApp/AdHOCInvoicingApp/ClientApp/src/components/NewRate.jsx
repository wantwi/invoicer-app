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
import axios from "axios";
import { v4 as uuid } from "uuid";
import useCustomAxios from "hooks/useCustomAxios";
import DatePicker from "react-datepicker";
import moment from "moment";
import { useMutation } from "@tanstack/react-query";

let userDetails = JSON.parse(
  sessionStorage.getItem(process.env.REACT_APP_OIDC_USER)
);

const init = {
  currencyName: "",
  iso: "",
  newRate: "",
  date: "",
};

export const NewRateForm = ({ close, currencies, rate }) => {
  const [exchangeFormData, setExchangeFormData] = useState(rate);

  console.log("djks", currencies);

  const [loading, setLoading] = useState(false);

  const [showList, setShowList] = useState(false);

  const [currencyList, setCurrencyList] = useState(currencies);
  const [currencyListToPost, setCurrencyListToPost] = useState([]);

  const axios = useCustomAxios();
  const postExRate = (postData) => {
    axios.post("/api/AddExcahngeRate", postData);
  };
  const { mutate, isLoading } = useMutation({
    mutationFn: postExRate,
    onSuccess: () => {
      toast.success("Exchange Rates Successfukky Saved");
      setCurrencyList([]);
    },
    onError: (error) => {
      console.log({ error });
      toast.error(error?.message || "Rate could not be added");
    },
  });

  const handleClick = (currency) => {
    setShowList(false);

    setExchangeFormData((prev) => ({
      ...prev,

      currencyName: currency.name,

      iso: currency.code,
    }));
  };

  const handleUpdate = () => {
    console.log({
      currencyList,
      rate,
    });
  };
  console.log({
    currencyList,
    rate,
  });

  const handleAdd = () => {
    console.log({ exchangeFormData });
    if (
      exchangeFormData.newRate == "" ||
      exchangeFormData.currencyName == "" ||
      exchangeFormData.date == ""
    ) {
      toast.warning(
        "Please make sure all required information has been filled"
      );
    } else {
      exchangeFormData.idx = currencyListToPost.length;
      setCurrencyListToPost((prev) => [...prev, exchangeFormData]);

      setExchangeFormData(init);
      setShowList(false);
    }
  };

  const handleSaveList = () => {
    let postData = currencyList.map((item) => {
      return {
        currencyCode: item.iso,

        transactionDate: item.date,

        exchangeRate: item.newRate,
      };
    });

    mutate(postData);

    setLoading(true);
  };

  const handleDeleteClick = (idx) => {
    const temp = currencyListToPost.filter((itm) => itm.idx !== idx);
    setCurrencyListToPost(() => temp);
  };

  return (
    <>
      <Modal
        style={{
          // minWidth: "80%",
          maxWidth: "max-content",
          margin: "30px auto",
          // resize: "both",
          // overflow: "auto",
          // zIndex: 100,
        }}
        className="modal-dialog-centered modal-lg"
        isOpen={true}
        toggle={() => console.log("toggled")}
      >
        <div className="d-flex" style={{ height: "" }}>
          <Card className="shadow" style={{ height: "fit-content" }}>
            <CardHeader className="bg-transparent">
              <h3 className="mb-0">Add New Rate</h3>
            </CardHeader>

            <CardBody style={{ marginTop: -30 }}>
              <Row className="icon-examples"></Row>

              <Row>
                <Col lg="6">
                  <FormGroup>
                    <label
                      className="form-control-label"
                      htmlFor="input-username"
                      onClick={() => setShowList(!showList)}
                    >
                      Select Currency{" "}
                      <code style={{ color: "darkred" }}>*</code>
                      <i
                        className={
                          !showList ? "fas fa-angle-up" : "fas fa-angle-down"
                        }
                      />
                    </label>{" "}
                    {!showList ? (
                      <Input
                        className="form-control font-sm"
                        placeholder="Currency"
                        type="text"
                        value={exchangeFormData?.currencyName}
                        onClick={() => setShowList(true)}
                        onChange={() => console.log("")}
                      />
                    ) : (
                      <Card
                        style={{
                          position: "absolute",

                          width: "96%",

                          zIndex: "1000",

                          margin: 0,

                          maxHeight: "200px",

                          overflow: "auto",

                          boxShadow: "5px 10px 5px 0px rgba(189,189,189,0.75)",
                        }}
                      >
                        {currencies?.map((country, i) => {
                          return (
                            <Col
                              lg="12"
                              md="3"
                              key={i}
                              onClick={() => handleClick(country)}
                            >
                              <div
                                key={i}
                                style={{
                                  padding: "10px",

                                  borderBottom: "1px solid #e3e3e3",

                                  alignContent: "center",

                                  marginTop: 2,

                                  marginBottom: 3,

                                  cursor: "pointer",

                                  height: 29,

                                  fontSize: 12,
                                }}
                              >
                                <div>
                                  <img
                                    alt={country.name}
                                    src={`http://purecatamphetamine.github.io/country-flag-icons/3x2/${country?.code?.substr(
                                      0,

                                      2
                                    )}.svg`}
                                    style={{ height: 14, marginRight: 5 }}
                                  />

                                  {country.code}
                                </div>
                              </div>
                            </Col>
                          );
                        })}
                      </Card>
                    )}
                  </FormGroup>
                </Col>

                <Col lg="6">
                  <FormGroup>
                    <label
                      className="form-control-label"
                      htmlFor="input-username"
                    >
                      Currency Code
                    </label>{" "}
                    <Input
                      className="form-control font-sm"
                      placeholder="Current Rate"
                      type="text"
                      defaultValue={exchangeFormData?.iso}
                      disabled
                    />
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <Col lg="6">
                  <FormGroup className="rate-picker-date">
                    <label
                      className="form-control-label"
                      htmlFor="input-username"
                      style={{
                        marginBottom: "5.6px",
                      }}
                    >
                      Exchange Rate Date
                    </label>{" "}
                    <code style={{ color: "darkred" }}>*</code>
                    <DatePicker
                      id="invoiceDate"
                      // maxDate={new Date()}
                      calendarClassName="rate-picker-date"
                      placeholderText=""
                      className="form-control font-sm"
                      showIcon
                      dateFormat="yyyy/MM/dd"
                      selected={
                        exchangeFormData?.date
                          ? moment(exchangeFormData?.date).toDate()
                          : moment(
                              new Date().toLocaleDateString("en-gb")
                            ).toDate()
                      }
                      // minDate={new Date()}
                      onChange={(e) => {
                        console.log("llk",e);
                        setExchangeFormData((prev) => ({
                          ...prev,

                          date: e,
                        }));
                      }}
                      style={{ height: 29, padding: "0px 5px", width: "100%" }}
                    />
                    {/* <Input
                      className="form-control font-sm"
                      placeholder=""
                      type="date"
                      value={exchangeFormData?.date}
                      onChange={(e) =>
                        
                      }
                    /> */}
                  </FormGroup>
                </Col>

                <Col lg="6">
                  <FormGroup>
                    <label
                      className="form-control-label"
                      htmlFor="input-username"
                    >
                      Exchange Rate
                    </label>{" "}
                    <code style={{ color: "darkred" }}>*</code>
                    <Input
                      className="form-control font-sm"
                      placeholder="Rate"
                      type="number"
                      value={exchangeFormData?.newRate}
                      onChange={(e) =>
                        setExchangeFormData({
                          ...exchangeFormData,

                          newRate: Number(e.target.value),
                        })
                      }
                    />
                  </FormGroup>
                </Col>
              </Row>
            </CardBody>

            <CardFooter>
              <Row>
                <Col
                  lg="12"
                  style={{
                    display: "flex",

                    flexDirection: "row-reverse",
                  }}
                >
                  {rate?.date ? (
                    <Button size="sm" color="success" onClick={handleUpdate}>
                      Update
                    </Button>
                  ) : (
                    <Button size="sm" color="success" onClick={handleAdd}>
                      Add
                    </Button>
                  )}

                  <Button style={{ marginRight: 10 }} onClick={close} size="sm">
                    Cancel
                  </Button>
                </Col>

                <Col lg="6"></Col>
              </Row>
            </CardFooter>
          </Card>
          {currencyListToPost.length > 0 ? (
            <Col className="order-xl-2 mb-5 mb-xl-0" xl="7">
              <Card className="shadow" style={{ width: "max-content" }}>
                <CardHeader className="bg-transparent">
                  <h3 className="mb-0"> Exchange Rates</h3>
                </CardHeader>
                <CardBody style={{ height: "600px" }}>
                  <Row className="icon-examples"></Row>
                  <Row>
                    <Table
                      className="align-items-center  table-flush"
                      responsive
                    >
                      <thead className="thead-light">
                        <tr>
                          <th
                            style={{
                              width: "35%",
                            }}
                            scope="col"
                          >
                            Curency
                          </th>
                          <th scope="col">Code</th>
                          <th scope="col">Date</th>
                          <th
                            style={{
                              textAlign: "right",
                              width: "25%",
                            }}
                            scope="col"
                          >
                            Exchange Rate
                          </th>
                          <th
                            scope="col"
                            style={{
                              textAlign: "right",
                              width: "10%",
                            }}
                          >
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {currencyListToPost?.map((item, key) => (
                          <tr key={key} style={{ cursor: "pointer" }}>
                            <td>{item.currencyName}</td>

                            <td>{item.iso}</td>

                            <td>{new Date(item.date).toDateString()}</td>
                            <td style={{ textAlign: "right" }}>
                              {moneyInTxt(item.newRate)}
                            </td>
                            <td
                              style={{
                                textAlign: "right",
                                width: "10%",
                              }}
                              onClick={() => handleDeleteClick(key)}
                            >
                              <FcCancel />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Row>
                </CardBody>
                <CardFooter>
                  <Row>
                    <Col
                      lg="12"
                      style={{
                        display: "flex",
                        flexDirection: "row-reverse",
                      }}
                    >
                      <Button color="success" onClick={handleSaveList}>
                        {isLoading ? "Saving" : "Save"}
                      </Button>
                      <Button
                        color="warning"
                        style={{ marginRight: 10 }}
                        onClick={() => {
                          setCurrencyList([]);
                          setShowForm(false);
                        }}
                      >
                        Cancel
                      </Button>
                    </Col>
                    <Col lg="6"></Col>
                  </Row>
                </CardFooter>
              </Card>
            </Col>
          ) : null}
        </div>
      </Modal>
    </>
  );
};

const styles = {
  body: {},
};
