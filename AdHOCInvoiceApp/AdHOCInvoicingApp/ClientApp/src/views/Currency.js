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
import useCustomAxios from "hooks/useCustomAxios2";

// const allCountries = Object.keys(countries)
//   .filter((k) => k !== 'AQ')
//   .map((k) => ({ ...countries[k], iso: k }))
//   .sort((a, b) => a.name.localeCompare(b.name))
//   .filter(
//     (country) =>
//       country.name == 'Ghana' ||
//       country.name == 'United Kingdom' ||
//       country.name == 'United States' ||
//       country.name == 'France'
//   )
// console.log(allCountries)
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
  const [currencies, setCurrencies] = useState([]);
  const [exchangeFormData, setExchangeFormData] = useState(init);
  const [showForm, setShowForm] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showList, setShowList] = useState(false);
  const [currencyList, setCurrencyList] = useState([]);
  const axios = useCustomAxios()

  const handleClick = (currency) => {
    setShowList(false);

    setExchangeFormData((prev) => ({
      ...prev,
      currencyName: currency.name,
      iso: currency.iso,
    }));
  };

  // const getCurrencies = () => {
  //   setLoading(true)
  //   fetch(`${process.env.REACT_APP_CLIENT_ROOT}/Currency`, {
  //     method: 'GET', // or 'PUT'
  //     headers: {
  //       'Content-Type': 'application/json',
  //       Authorization: `Bearer ${userDetails.access_token}`,
  //     },
  //   })
  //     .then((res) => {
  //       // console.log(res)
  //       if (res.status === 401) {
  //         toast.error('Token timed out. Logging you out')
  //         setTimeout(() => {
  //           window.location = '/'
  //         }, 3000)
  //       } else {
  //         return res.json()
  //       }
  //     })
  //     .then((data) => {
  //       if (data.length > 0) {
  //         setLoading(false)
  //         let res = data.map((item) => {
  //           return {
  //             name: item.name,
  //             iso: item.code,
  //             homeCurrency: item.homeCurrency,
  //             rate: 0,
  //           }
  //         })
  //         setCurrencies(res.filter((item) => item.homeCurrency === false))
  //       }
  //     })
  //     .catch((err) => console.log(err))
  // }

  const getCurrency = async () => {
    const request = await axios.get("/Currency")
    // const request = await fetch(
    //   `${process.env.REACT_APP_CLIENT_ROOT}/Currency`,
    //   {
    //     method: "GET", // or 'PUT'
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer ${userDetails.access_token}`,
    //     },
    //   }
    // );

    return request.data
  };

  const { data: currencyList2, refetch: refetchCurrency } = useQuery({
    queryKey: ["currency"],
    queryFn: getCurrency,
    onSuccess: (data) => {
      let res = data.map((item) => {
        return {
          name: item.name,
          iso: item.code,
          homeCurrency: item.homeCurrency,
          rate: 0,
        };
      });
      setCurrencies(res.filter((item) => item.homeCurrency === false));
    },
  });

  const postExRate = async (postData) => {
    setLoading(true);
    return await axios.post(
      `${process.env.REACT_APP_CLIENT_ROOT}/TransactionCurrency`,
      postData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userDetails.access_token}`,
        },
      }
    );
  };

  const { mutate } = useMutation({
    mutationFn: postExRate,
    onSuccess: () => {
      toast.success("Exchange Rates Successfully Saved");
      setLoading(false);
      setCurrencyList([]);
    },
    onError: (error) => {
      console.log({ useMutationError: error });
      toast.error(
        error?.response?.data?.message ||
        "Invoice could not be saved. Please try again"
      );
      setLoading(false);
    },
  });

  const handleAdd = () => {
    // setShowForm(false)
    // console.log(exchangeFormData)
    if (exchangeFormData.newRate == "" || exchangeFormData.currencyName == "" || exchangeFormData.date == "") {
      toast.warning(
        "Please make sure all required information has been filled"
      );
    } else {
      setCurrencyList((prev) => [...prev, exchangeFormData]);
      setExchangeFormData(init);
      setShowList(false);
    }
  };

  const handleSaveList = () => {
    let postData = currencyList.map((item) => {
      return {
        currencyCode: item.iso,
        companyId: userDetails.profile.company,
        transactionDate: item.date,
        exchangeRate: item.newRate,
      };
    });

    mutate(postData);

    setLoading(true);
    // fetch(`${process.env.REACT_APP_CLIENT_ROOT}/TransactionCurrency`, {
    //   method: 'POST', // or 'PUT'
    //   headers: {
    //     'Content-Type': 'application/json',
    //     Authorization: `Bearer ${userDetails.access_token}`,
    //   },
    //   body: JSON.stringify(postData),
    // })
    //   .then((response) => {
    //     if (response.status === 401) {
    //       toast.warning('Token expired. Logging you out')
    //     }
    //     return response.json()
    //   })
    //   .then((data) => {
    //     // console.log(data)
    //     if (data.failed.length == 0) {
    //       toast.success('Exchange Rates Successfully Saved')
    //     } else {
    //       toast.warning(
    //         'Exchange rates could not be saved. They may already be in the system'
    //       )
    //     }
    //   })
    //   .catch((error) => {
    //     setLoading(false)
    //     toast.error('Error occured. Please try again.')
    //   })
    //   .finally(() => {
    //     setCurrencyList([])
    //     setLoading(false)
    //   })
  };

  // useEffect(() => {
  //   getCurrencies()

  //   return () => {}
  // }, [])

  return (
    <>
      <UserHeader
        message={"Exchange Rate Setup page. Setup of your currencies here"}
        pageName="Exchange Rate Setup"
      />
      <ToastContainer />

      {loading ? (
        <Loader />
      ) : (
        <Container className="mt--7" fluid>
          <Row className="mt-5">
            <Col className="order-xl-2 mb-5 mb-xl-0" xl="5">
              <Card className="shadow">
                <CardHeader className="bg-transparent">
                  <h3 className="mb-0">Add Exchange Rates</h3>
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
                          Select Currency{" "}<code style={{ color: "darkred" }}>*</code>
                          <i
                            className={
                              !showList
                                ? "fas fa-angle-up"
                                : "fas fa-angle-down"
                            }
                          />
                        </label>{" "}
                        {!showList ? (
                          <Input
                            className="form-control font-sm"
                            placeholder="Currency"
                            type="text"
                            value={exchangeFormData.currencyName}
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
                              boxShadow:
                                "5px 10px 5px 0px rgba(189,189,189,0.75)",
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
                                        src={`http://purecatamphetamine.github.io/country-flag-icons/3x2/${country.iso.substr(
                                          0,
                                          2
                                        )}.svg`}
                                        style={{ height: 14, marginRight: 5 }}
                                      />

                                      {country.iso}
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
                          defaultValue={exchangeFormData.iso}
                          disabled
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-username"
                        >
                          Exchange Rate Date
                        </label>{" "}
                        <code style={{ color: "darkred" }}>*</code>
                        <Input
                          className="form-control font-sm"
                          placeholder=""
                          type="date"
                          value={exchangeFormData.date}
                          onChange={(e) =>
                            setExchangeFormData({
                              ...exchangeFormData,
                              date: e.target.value,
                            })
                          }
                        />
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
                          value={exchangeFormData.newRate}
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
                      {/* <Button
                        // hidden
                        onClick={() => reset(uuid())}
                        style={{ marginRight: 10 }}
                        color="danger"
                        size="sm"
                      >
                        Cancel
                      </Button> */}
                      <Button size="sm" color="success" onClick={handleAdd}>
                        Add
                      </Button>
                      <Button
                        style={{ marginRight: 10 }}
                        onClick={() => {
                          setExchangeFormData(init);
                        }}
                        size="sm"
                      >
                        Clear
                      </Button>
                    </Col>
                    <Col lg="6"></Col>
                  </Row>
                </CardFooter>
              </Card>
            </Col>

            {currencyList.length > 0 ? (
              <Col className="order-xl-2 mb-5 mb-xl-0" xl="7">
                <Card className="shadow">
                  <CardHeader className="bg-transparent">
                    <h3 className="mb-0"> Exchange Rates</h3>
                  </CardHeader>
                  <CardBody style={styles.body}>
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
                          {currencyList?.map((item, key) => (
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
                          Save
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
          </Row>
        </Container>
      )}
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
