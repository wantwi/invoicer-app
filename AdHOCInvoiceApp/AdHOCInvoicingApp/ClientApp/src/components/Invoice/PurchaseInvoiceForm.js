import React, { useContext, useEffect, useState, useRef } from "react";
import Autocomplete from "./Autocomplete";
import AutocompleteItems from "./AutocompleteItems";
import { ToastContainer, toast } from "react-toastify";
import "../../views/App.css";
import "./invoicestyle.css";

import {
  FormGroup,
  Form,
  Input,
  Row,
  Col,
  Button,
  Card,
  CardBody,
} from "reactstrap";
import { PurchaseContext } from "views/Purchases";

import "react-toastify/dist/ReactToastify.css";
import Loader from "components/Modals/Loader";
import { FormContext } from "components/Modals/NewPurchaseInvoice";
import { moment } from "moment";
import { useCustomQuery } from "hooks/useCustomQuery";
import { useCustomPost } from "hooks/useCustomPost";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import useCustomAxios from "hooks/useCustomAxios";
import useMultiFetchAllSettled from "hooks/useMultiFetchAllSettled";
import useAuth from "hooks/useAuth";
import DatePicker from "react-datepicker";
import { useCustomQueryById } from "hooks/useCustomQueryById";
import { useHistory } from "react-router-dom";

function PurchaseInvoiceForm({ vatAndLeviesScheme, setvatAndLeviesScheme }) {
  const queryClient = useQueryClient();
  const axios = useCustomAxios();
  const { selectedBranch, user } = useAuth();
  const history = useHistory();


  const { invoices, setInvoices } = useContext(PurchaseContext);
  const {
    formData,
    setFormData,
    gridData,
    setGridData,
    setShowNewInvoiceModal,
    // vatAndLeviesScheme, 
    // setvatAndLeviesScheme
  } = useContext(FormContext);

  const {
    covidRate,
    cstRate,
    cstWithVat,
    getfundRate,
    nhilRate,
    regularLeviesWithVat,
    tourismRate,
    trsmWithVat,
    vatRate,
  } = vatAndLeviesScheme;

  const [isItemAdded, setIsItemAdded] = useState(false);

  const [products, setProducts] = useState([]);
  const [showAddItem, setShowAddItem] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isTaxable, setIsTaxable] = useState(true);
  const [disabled, setDisabled] = useState(true);
  const [discount, setDiscount] = useState(0.0);
  const [currencies, setCurrencies] = useState([]);
  const [currency, setCurrency] = useState("GHS");
  const [isCurrencyDisabled, setIsCurrencyDisbled] = useState(false);
  const [exchangeRate, setExchangeRate] = useState(1);
  const [forex, setForex] = useState(1);
  const [vatType, setVatType] = useState(0);

  const [schemeDate, setSchemeDate] = useState(
    `${new Date().getFullYear()}-${new Date().getMonth() + 1
    }-${new Date().getDate()}`
  );

  let userDetails = JSON.parse(
    sessionStorage.getItem(process.env.REACT_APP_OIDC_USER)
  );



  // Get products list

  useCustomQuery(
    `/api/GetProductList/${currency}`,
    "products",
    "",
    (data) => {
      let options = data?.map((item, index) => {
        return {
          name: item.name,
          key: index,
          value: item.id,
          code: item.code,
          description: item.description,
          price: item.price,
          taxRate: item.taxRate,
          taxable: item.taxable,
          trsmCst: item.trsmCst,
          isTaxInclusive: item.isTaxInclusive,
          id: item.id,
          status: item.status,
        };
      });

      let activeItems = options.filter((item) => item.status === "A");

      setProducts(activeItems);
    },
    (err) => {
      // console.log({ err });
    }
  );

  //customers list

  useCustomQuery(
    `/api/GetCompanySupplierslist/${selectedBranch?.code}`,
    "suppliers",
    "",
    (data) => {
      let filteredCustomers = data.filter(
        (customer) => customer.status === "A"
      );
      setCustomers(filteredCustomers);
    },
    (err) => {
      // console.log({ err });
    }
  );

  const validateInput = (value) => {
    // console.log(value)
    if ((value != "" && value < 0.00001) || value == "e") {
      // setFormData({ ...formData, quantity: 1 })
      toast.info("Please make sure quantity is at greater than 0");
    }
  };

  const addRecordToData = (item) => {
    // console.log(item)
    // return
    let csttourism = 0;
    if (item.trsmCst === "NON") {
      csttourism = 0;
    } else if (item.trsmCst === "CST") {
      csttourism = (cstRate / 100) * item.price * item.quantity;
    } else if (item.trsmCst === "TRSM") {
      csttourism = (tourismRate / 100) * item.price * item.quantity;
    }

    if (item.itemName === "") {
      toast.warning("Please select an item first");
    } else if (item.quantity === "") {
      toast.warning("Please provide a value for quantity");
    } else if (item.price === "") {
      toast.warning("Please provide a value for price");
    } else if (item.invoiceNumber === "") {
      toast.warning("Please provide a value for invoice number");
    } else {
      let obj = {};
      let vatableAmt = 0;
      let vat = 0;
      let totalPayable = 0;
      let isINC = false;

      //console.log(item)

      if (!item.isTaxInclusive) {
        obj = {
          taxable: isTaxable,
          discount: Number(discount),
          itemCode: item.itemCode,
          itemName: item.itemName,
          quantity: Number(item.quantity),
          price: Number(item.price),
          taxableAmount: item.quantity * item.price,
          nhil: (nhilRate / 100) * item.quantity * item.price,
          getf: (getfundRate / 100) * item.quantity * item.price,
          covid: (covidRate / 100) * item.quantity * item.price,
          otherLevies: csttourism,
          vatItemId: item.vatItemId,
        };

        if (isTaxable) {
          vatableAmt = obj.taxableAmount + obj.nhil + obj.getf + obj.covid;
          vat = (vatRate / 100) * vatableAmt;
        } else {
          obj.nhil = 0;
          obj.getf = 0;
          obj.covid = 0;
          vatableAmt = obj.taxableAmount;
          // vatableAmt = obj.taxableAmount + obj.nhil + obj.getf + obj.covid
        }
        totalPayable = vatableAmt + vat + obj.otherLevies - obj.discount;
      } else {
        isINC = true;
        obj = {
          discount: Number(discount) || 0,
          itemCode: item.itemCode, //'ITM' + Math.floor(Math.random() * 1000 + 1),
          itemName: item.itemName,
          quantity: Number(item.quantity),
          price: Number(item.price),
          nhil: (nhilRate / 100) * ((item.quantity * item.price * 100) / 121.9),
          getf: (getfundRate / 100) * ((item.quantity * item.price * 100) / 121.9),
          covid: (covidRate / 100) * ((item.quantity * item.price * 100) / 121.9),
          otherLevies: csttourism,
          vatItemId: item.vatItemId,
          taxableAmount: (item.quantity * item.price * 100) / 121.9,
        };

        if (isTaxable) {
          vatableAmt = obj.taxableAmount + obj.nhil + obj.getf + obj.covid;
          vat = 0.15 * vatableAmt;
        } else {
          obj.nhil = 0;
          obj.getf = 0;
          obj.covid = 0;
          vatableAmt = obj.taxableAmount;
        }
        let inclusiveAmt = item.quantity * item.price;
        totalPayable = inclusiveAmt - discount;
      }

      let gridItem = {
        ...obj,
        vatableAmt,
        vat,
        totalPayable,
        isINC,
      };
      setGridData((gridData) => [
        ...gridData,
        {
          itemName: item?.itemName,
          unitPrice: item?.price,
          itemDiscount: item?.itemDiscount,
          quantity: item?.quantity,
          vatItemId: item?.vatItemId,
          isTaxable: item?.isTaxable,
          isTaxInclusive: item?.isTaxInclusive,
          trsmCst: item?.trsmCst,
          ...gridItem,
        },
      ]);
      setFormData({
        ...formData,
        itemName: "",
        quantity: "1",
        price: "",
        isTaxable: true,
        isTaxInclusive: false,
        trsmCst: "NON",
      });
      setIsItemAdded(true);
    }
  };

  const { mutate } = useCustomPost(
    `/api/CreatePurchaseInvoice/${selectedBranch?.code}`,
    "purchase-invoices",
    () => {
      toast.success("Invoice successfully saved");
      setLoading(false);
      setShowNewInvoiceModal(false);
      queryClient.invalidateQueries({
        queryKey: ["purchase-invoices", 1, 1, ""],
      });
    },
    (error) => {
      // console.log({ useMutationError: error });
      toast.error(
        error?.response?.data || "Invoice could not be saved. Please try again"
      );
      setLoading(false);
    }
  );

  const saveInvoice = async () => {
    console.log({ formData });
    if (!formData?.date) {
      toast.warn("Invoice date is required");
      return;
    }
    let postData = {
      date: new Date(formData?.date).toISOString(),
      supplierName: formData.customer,
      nameOfUser: user?.name,
      supplierScheme: `${vatType}`,
      transactionType: "PURCHASE",
      currency: currency,
      forexRate: forex,
      supplierTinghcard: formData.identity,
      invoiceNo: formData.invoiceNumber,
      nameOfUser: user?.name,
      amount: gridData.reduce((total, item) => total + item.totalPayable, 0),
      ysdcid: "",
      ysdcrecnum: formData.recNum,
      ysdcintdata: "",
      ysdcregsig: "",
      ysdcitems: gridData.length,
      ysdcmrc: "",
      ysdcmrctim: "",
      ysdctime: "",
      // branchId: selectedBranch?.code,
      invoiceItems: gridData?.map((item) => ({
        // itemName: item?.itemName,
        unitPrice: item?.price,
        itemDiscount: item?.itemDiscount,
        quantity: item?.quantity,
        vatItemId: item?.vatItemId,
        isTaxable: item?.isTaxable,
        isTaxInclusive: item?.isTaxInclusive,
        trsmCst: item?.trsmCst,
      })),
    };
    if (isItemAdded) {
      setLoading(true);
      mutate(postData);
    } else {
      toast.warning("Please add an item to the invoice first");
    }
  };

  const checkIfRatesExist = async (currency) => {
    let issuedDate = formData.date ? new Date(formData.date).toDateString() : null;
    if (!issuedDate) {
      toast.info("Select invoice date first");
      return;
    }
    console.log({ issuedDate });
    const request = await axios.get(
      `/api/checkIfRatesExist/${selectedBranch?.code}/${currency}/${issuedDate}`
    );

    if (request) {
      const { data } = request;
      if (data.length > 0) {
        console.log({ now: data })
        setForex(data[0].exchangeRate);
        setExchangeRate(
          "at GHS" + data[0]?.exchangeRate + " per " + data[0]?.currencyCode
        );
      } else {
        toast.warning(
          "There are no exchange rates set for this invoice date. Redirecting you to currency set up to add exchange rates"
        );
        setTimeout(() => {
          history.push("/admin/currency");
        }, 3000);
      }
    }
  };

  const handleCurrencySelect = (e) => {
    setCurrency(e.target.value);
    if (e.target.value !== "GHS") {
      checkIfRatesExist(e.target.value);
    } else {
      setExchangeRate("");
    }
  };

  const makeCall = async (url = "") => {
    const res = await axios.get(url);
    return res;
  };

  const res = useQueries({
    queries: [
      {
        queryKey: ["purchase-products"],
        queryFn: () => makeCall(`/api/GetProductList/${currency}`),
        enabled: Boolean(currency),
        cacheTime: 0,
        onSuccess: ({ data }) => {
          setProducts(data);
        },
      },
      {
        queryKey: ["currency-list"],
        queryFn: () => makeCall(`/api/GetCurrency`),
        cacheTime: 0,
        onSuccess: ({ data }) => {
          setCurrencies(data);
        },
      },
      {
        queryKey: ["suppliers"],
        queryFn: () => makeCall(`/api/GetCompanySupplierslist/${selectedBranch?.code}`),
        cacheTime: 0,
        onSuccess: ({ data }) => {
          let filteredCustomers = data.filter(
            (customer) => customer.status === "A"
          );
          setCustomers(filteredCustomers);
          setCashCustomerTin(
            data.find((cust) => cust.name == "cash customer")?.tin
          );
        },
      },
    ],
  });
  // const requstCallback = (response) => {
  //   const productResponse = response[2];
  //   const currencyResponse = response[1];
  //   const suppliersResponse = response[0];

  //   if (productResponse?.status === "fulfilled") {
  //     console.log({ requstCallback1: productResponse?.value.data });
  //     setProductsList(productResponse?.value.data);
  //   }
  //   if (currencyResponse?.status === "fulfilled") {
  //     console.log({ requstCallback2: currencyResponse?.value.data });

  //     if (currencyResponse?.value.data.length > 0) {
  //       console.log("true");
  //       setCurrencies(currencyResponse?.value.data);
  //     } else {
  //       console.log({ request: "no currency like that", currencyResponse });
  //       setCurrencies(currenciesInit);
  //     }
  //   }
  //   if (suppliersResponse?.status === "fulfilled") {
  //     console.log({ requstCallback3: customerResponse?.value.data });
  //     let filteredCustomers = customerResponse?.value.data.filter(
  //       (customer) => customer.status === "A"
  //     );
  //     setCustomers(filteredCustomers);
  //     setCashCustomerTin(
  //       customerResponse?.value.data.find(
  //         (cust) => cust.name == "cash customer"
  //       )?.tin
  //     );
  //   }
  // };

  // const {
  //   data,
  //   error,
  //   isLoading: multifLoading,
  //   setUrls,
  // } = useMultiFetchAllSettled(
  //   [
  //     `/api/GetCompanySuppliers`,
  //     "/api/GetCurrency",
  //     `/api/GetProductList/${currency}`,
  //   ],
  //   requstCallback
  // );

  // useEffect(() => {
  //   // console.log('Currency', currency)
  //   setFormData((prev) => ({ ...prev, currency: currency }));
  //   setUrls([
  //     `/api/GetCompanySuppliers`,
  //     "/api/GetCurrency",
  //     `/api/GetProductList/${currency}`,
  //   ]);
  //   if (currency !== "") {
  //     // getProducts()
  //   }
  // }, [currency]);

  const onSuccess = (data) => {
    console.log({ GetVatAndLeviesByScheme: data });
    setvatAndLeviesScheme(data);
  };

  const { refetch: refetchTaxScheme } = useCustomQueryById(
    `/api/GetVatAndLeviesByScheme/${schemeDate}/${vatType}`,
    "taxScheme",
    vatType,
    onSuccess
  );

  useEffect(() => {
    refetchTaxScheme();

    return () => { };
  }, [vatType]);

  const handleVatTypeChange = (e) => {
    setVatType(+e.target.value)
  }


  return (
    <>
      {loading ? <Loader /> : null}
      <Card
        className="bg-secondary shadow"
        style={{ width: "42%", height: "750px" }}
      >
        <CardBody>
          <div
            style={{
              zIndex: 100000,
              display: "flex",
              flexDirection: "roq",
              justifyContent: "center",
              alignItems: "center",
              position: "absolute",
            }}
          ></div>
          {/* <ToastContainer /> */}
          <Form>
            <Row style={{ marginBottom: 10 }}>
              <Col lg="12">
                <label className="form-control-label label-mb-0">
                  Supplier <code style={{ color: "darkred" }}>*</code>
                </label>
                <Autocomplete
                  suggestions={customers}
                  formData={formData}
                  setFormData={setFormData}
                  businessPartner={"Supplier"}
                />
              </Col>
            </Row>

            <Row style={{ marginBottom: 10 }}>
              <Col>
                <label className="form-control-label">Ghana Card / TIN </label>
                <Input
                  disabled
                  className="form-control font-sm"
                  placeholder="GHA-XXXXXXXXXXXX"
                  value={formData.identity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      identity: e.target.value,
                    })
                  }
                  bsSize="sm"
                />
              </Col>
              <Col>
                <label className="form-control-label">VAT Type </label>
                <select
                  className="form-control font-sm"
                  value={vatType}
                  onChange={handleVatTypeChange}

                  style={{ height: 29, padding: "0px 5px" }}
                >
                  <option value={0}>Standard Rate</option>
                  <option value={1}>Flat Rate</option>
                </select>
              </Col>
            </Row>
            <Row style={{ marginBottom: 10 }}>
              <Col lg="6">
                <label htmlFor="invoiceDate" className="form-control-label">
                  Invoice Date <code style={{ color: "darkred" }}>*</code>
                </label>
                <DatePicker
                  id="dueDate"
                  maxDate={new Date()}
                  placeholderText="Due date"
                  className="form-control font-sm"
                  // disabled={!formData.date || Boolean(gridData?.length)}
                  showIcon
                  dateFormat="yyyy/MM/dd"
                  selected={formData.date}
                  onChange={(e) => {
                    // console.log({e})
                    setFormData({ ...formData, date: e });
                  }}
                  style={{ height: 29, padding: "0px 5px" }}
                />
                {/* <DatePicker
                  id="invoiceDate"
                  maxDate={new Date().toDateString()}
                  placeholderText="Invoice date"
                  className="form-control font-sm"
                  showIcon
                  dateFormat="yyyy/MM/dd"
                  // disabled={Boolean(gridData?.length)}
                  selected={formData?.issuedDate}
                  // minDate={new Date(2023, 0, 1)}
                  onChange={(e) => {
                    // console.log({e});
                    //set invoice date and reset due date when invoice date changes
                    setFormData({
                      ...formData,
                      issuedDate: e,
                    })
                  }}
                  style={{ height: 29, padding: "0px 5px" }}
                /> */}
              </Col>
              <Col lg="6">
                <label className="form-control-label ">
                  Currency {exchangeRate === 1 ? "" : exchangeRate}
                </label>
                <select
                  className="form-control font-sm"
                  value={currency}
                  onChange={handleCurrencySelect}
                  disabled={isCurrencyDisabled}
                  style={{ height: 29, padding: "0px 5px" }}
                >
                  {currencies && currencies?.map((currency, index) => (
                    <option
                      key={index}
                      name={currency.name}
                      id={currency.code}
                      value={currency.code}
                    >
                      {currency.code}
                    </option>
                  ))}
                </select>
              </Col>
            </Row>

            <Row style={{ marginBottom: 10 }}>
              <Col lg="6">
                <label className="form-control-label ">
                  Invoice No <code style={{ color: "darkred" }}>*</code>
                </label>
                <Input
                  className="form-control font-sm"
                  placeholder="Invoice No."
                  value={formData.invoiceNumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      invoiceNumber: e.target.value,
                    })
                  }
                  bsSize="sm"
                />
              </Col>

              <Col lg="6">
                <label className="form-control-label">E-VAT Receipt No </label>
                <Input
                  className="form-control font-sm"
                  placeholder="Receipt No."
                  value={formData.recNum}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      recNum: e.target.value,
                    })
                  }
                  bsSize="sm"
                />
              </Col>
            </Row>
            <Row style={{ marginBottom: 0 }}>
              <Col lg="6">
                <button
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                  }}
                  type="button"
                  onClick={() => {
                    if (formData.customer) {
                      setShowAddItem(true);
                    } else {
                      toast.warning("Please select customer first");
                    }
                  }}
                >
                  {!showAddItem ? (
                    <span aria-hidden={true}>
                      <h4>+ Add Item</h4>
                    </span>
                  ) : null}
                </button>
              </Col>
            </Row>

            {showAddItem && (
              <>
                <Row style={{ marginBottom: 10, marginTop: -20 }}>
                  <Col lg="12">
                    <label
                      className="form-control-label label-mb-0"
                      htmlFor="input-email"
                    >
                      Item<code style={{ color: "darkred" }}>*</code>
                    </label>
                    <AutocompleteItems
                      gridData={gridData}
                      suggestions={products}
                      formData={formData}
                      setFormData={setFormData}
                      setDisabled={setDisabled}
                      setIsTaxable={setIsTaxable}
                      isPurchasing={true}
                    />
                  </Col>
                </Row>

                <Row style={{ marginBottom: 10 }}>
                  <Col lg="6">
                    <label className="form-control-label " htmlFor="input-city">
                      Quantity<code style={{ color: "darkred" }}>*</code>
                    </label>
                    <Input
                      disabled={disabled}
                      className="form-control-alternative font-sm"
                      id="input-city"
                      placeholder="Quantity"
                      type="number"
                      value={formData?.quantity}
                      min={"1"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          quantity: e.target.value,
                        })
                      }
                      onBlur={() =>
                        setFormData((prev) => ({
                          ...prev,
                          quantity: Number(formData.quantity).toFixed(4),
                        }))
                      }
                      bsSize="sm"
                    />
                  </Col>
                  <Col lg="6">
                    <label
                      className="form-control-label"
                      htmlFor="input-country"
                    >
                      Price({formData?.currency}) {"-"}
                      {formData.isTaxInclusive ? "Tax Incl." : "Tax Excl."}
                      <code style={{ color: "darkred" }}>*</code>
                    </label>
                    <Input
                      // disabled={disabled}
                      className="form-control-alternative font-sm"
                      id="input-country"
                      placeholder="Price"
                      type="number"
                      step={0.01}
                      value={formData?.price}
                      min={"1"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          price: e.target.value,
                        })
                      }
                      onBlur={() =>
                        setFormData((prev) => ({
                          ...prev,
                          price: Number(formData.price).toFixed(4),
                        }))
                      }
                    />
                  </Col>
                </Row>

                <Row>
                  <Col lg="6">
                    <FormGroup
                      style={{
                        /* padding: 0; */
                        marginTop: "14px",
                        marginBottom: 0,
                      }}
                    >
                      <input
                        className="form-control-checkbox"
                        id="isTaxable"
                        type="checkbox"
                        checked={formData?.isTaxable}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            isTaxable: e.target.checked,
                          })
                        }
                        value={formData?.isTaxable}
                      // disabled
                      />
                      &nbsp; &nbsp;
                      <label htmlFor="isTaxable" className="form-control-label">
                        Is taxable?{"     "}
                      </label>
                    </FormGroup>
                    <FormGroup>
                      <input
                        className="form-control-checkbox"
                        id="isTaxInclusive"
                        type="checkbox"
                        checked={formData.isTaxInclusive}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            isTaxInclusive: e.target.checked,
                          })
                        }
                        value={formData?.isTaxInclusive}
                      // disabled
                      />
                      &nbsp; &nbsp;
                      <label
                        htmlFor="isTaxInclusive"
                        className="form-control-label"
                      >
                        Is tax inclusive?{"     "}
                      </label>
                    </FormGroup>
                    {/* <FormGroup>
                      <input
                        className='form-control-checkbox'
                        type='checkbox'
                        checked={formData.hasTourismLevy}
                        disabled
                      />
                      &nbsp; &nbsp;
                      <label className='form-control-label'>
                        Is Tourism applicable?{'     '}
                      </label>
                    </FormGroup> */}
                  </Col>
                  <Col lg="6">
                    <label className="form-control-label" htmlFor="trsncst">
                      Tourism/CST
                    </label>
                    <select
                      className="form-control font-sm"
                      value={formData?.trsmCst}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          trsmCst: e.target.value,
                        })
                      }
                      style={{ height: 29, padding: "0px 5px" }}
                    >
                      <option value={"NON"}>None</option>
                      <option value={"CST"}>CST</option>
                      <option value={"TRSM"}>Tourism</option>
                    </select>
                  </Col>
                </Row>

                <Row style={{ marginTop: -20 }}>
                  <Col lg="6">
                    <Button
                      color="primary"
                      onClick={() => addRecordToData(formData)}
                      type="button"
                      style={{ width: "100%" }}
                      size="sm"
                    >
                      ADD ITEM
                    </Button>
                  </Col>
                  <Col lg="6">
                    {gridData?.length > 0 && (
                      <Button
                        color="success"
                        type="button"
                        onClick={saveInvoice}
                        style={{ width: "100%" }}
                        size="sm"
                      >
                        SUBMIT INVOICE
                      </Button>
                    )}
                  </Col>
                </Row>
                <Row></Row>
              </>
            )}
          </Form>
        </CardBody>

        <div className="modal-footer"></div>
      </Card>
    </>
  );
}

export default PurchaseInvoiceForm;

const styles = {
  th: {
    background: "white",
    position: "sticky",
    top: 0 /* Don't forget this, required for the stickiness */,
  },
};
