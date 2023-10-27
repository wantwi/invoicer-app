import { Card } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import {
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Row,
  Col,
  Table,
  Badge,
  Alert
} from "reactstrap";
import { convertDate } from "utils/util";
import { FaTrashAlt } from "react-icons/fa";
import { getFormattedDate, moneyInTxt } from "utils/util";
import { useCustomQueryById } from "hooks/useCustomQueryById";
import { useCustomQuery } from "hooks/useCustomQuery";
import { useAuth } from "context/AuthContext";
import Autocomplete from "components/Invoice/Autocomplete";
import { useCustomPost } from "hooks/useCustomPost";
import useCustomAxios from "hooks/useCustomAxios";
import {  toast } from "react-toastify";

const NoteForm = ({ setShowNewInvoiceModal, refetch:refetchData }) => {
  const axios = useCustomAxios();
  const history = useHistory();
  const { selectedBranch, user } = useAuth();
  const [showAdd, setShowAdd] = useState(false);
  const [invoiceNo, setInvoiceNo] = useState("");
  const [invoiceDate, setInvoiceDated] = useState("");
  const [invoiceAmount, setInvoiceAmount] = useState("");
  const [customers, setCustomers] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [isCashCustomer, setIsCashCustomer] = useState(false);
  const [exchangeRate, setExchangeRate] = useState(1);
  const [forex, setForex] = useState(1);
  const [currencies, setCurrencies] = useState([]);
  const [currency, setCurrency] = useState("GHS");
  const [notValid, setNotValid] = useState(false)

  const successRespond = (response) => {
    let filteredCustomers = response?.filter(
      (customer) => customer.status === "A"
    );
    setCustomers(filteredCustomers);
  };
  console.log({ successRespond: customers, customer });

  const {refetch:customerRefetch} = useCustomQuery(
    `/api/GetCustomers/${selectedBranch?.code}`,
    "customers",
    "",
    successRespond
  );
const successResult = (response)=>{
  setCurrencies(response)

}
 const {refetch:currencyRefetch} = useCustomQuery(
    `/api/GetCurrency`,
    "currency",
    "",
    successResult
  );

  

  const checkIfRatesExist = async (currency) => {
    let today = new Date().toISOString();
    const request = await axios.get(
      `/api/checkIfRatesExist/${selectedBranch?.code}/${currency}/${today}`
    );
    // "(GHS" + data[0].exchangeRate + " / " + data[0].currencyCode
    if (request) {
      const { data } = request;
      console.log({ data });
      if (data.length > 0) {
        setForex(data[0].exchangeRate);
        setExchangeRate(
          `(GHS ${data[0].exchangeRate}/${data[0].currencyCode})`
        );
      } else {
        toast.warning(
          "There are no exchange rates set for today. Redirecting you to currency set up to add exchange rates"
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


  const { handleSubmit, control, setValue, getValues, watch } = useForm({
    defaultValues: {
      customerName: "",
      amount: 0,
      date: "",
      reason: "",
      entries: [],
    },
  });

  const { fields, append, remove, prepend } = useFieldArray({
    control,
    name: "entries",
  });

  const onSuccess = (data) => {
    append({ invoiceNo: invoiceNo, date: invoiceDate, amount: invoiceAmount });
    resetItemsForm();
  };
  const onError = (data) => {
    alert("error");
  };
  const { isLoading, refetch } = useCustomQueryById(
    `/invoice/${invoiceNo}`,
    "note",
    invoiceNo,
    onSuccess,
    onError
  );

  const noteRespond = (response) => {

    if(response?.status >=400){
      const res = JSON.parse(response?.data)?.title
      const error = new Error(res)
      error.code = response.status
      throw error;

    }
    else{
      toast.success("Note saved Successfully.")

      console.log({noteRespond: response});
      refetchData()
      setShowNewInvoiceModal(false)
    }
  
  }

  const noteError = (error)=>{
    toast.error(error?.message)

  }


  const {mutate:postNote} = useCustomPost("/api/Note", "notes", noteRespond, noteError)

  const noteType = watch("noteType")

  const onSubmit = (data) => {
    // Handle form submission here
    const postData = {
      companyId: "",
      branchId: selectedBranch?.code,
      tin:customer?.identity,
      currency,
      forexRate: Number(forex),
      name: customer?.customer,
      reason: data?.reason,
      amount: Number(data?.amount),
      date: data?.date,
      noteType,
      nameOfUser: user?.name,
      remarks: data?.reason,
      noteLines: data?.entries.map(x => ({invoiceId: x?.invoiceId}))
       
    }
    console.log({postData});
    postNote(postData)
  };

  const handleAppendEntry = () => {
    prepend({});
  };
  const handleRemove = (index) => {
    // if (getValues("entries").length === 1) return;

    remove(index);
  };
  useEffect(() => {
    setValue("entries", []);
    setValue("date",  `${new Date().getFullYear()}-${
      new Date().getMonth() + 1
    }-${new Date().getDate()}`)
    currencyRefetch()
    customerRefetch()

    return () => {};
  }, []);

  

  const toggleAddItem = () => {
    if(noteType && customer?.customer){
      setShowAdd(!showAdd);
    }
    
  };
  const resetItemsForm = () => {
    setInvoiceAmount("");
    setInvoiceDated("");
    setInvoiceNo("");
  };

  const invoiceValidateRespond = (data) => {

    console.log({invoiceValidateRespond:data});
    setNotValid(false)
    
    if(data?.status === "OK"){
      const resData = JSON.parse(data?.data)

      setInvoiceDated(resData?.invoiceDate.split("T")[0])
      setInvoiceAmount(resData?.invoiceAmount)

      append({invoiceId:resData?.invoiceId, invoiceNo: invoiceNo, date: resData?.invoiceDate.split("T")[0], amount: resData?.invoiceAmount });
      resetItemsForm();

    }else{

        const response = JSON.parse(data?.data)?.Message
      const error = new Error(response)
      error.code = data.status
      throw error;
    }


  }
  const invoiceValidateErr = (data) => {
    setNotValid(true)
    toast.error(data?.message);

  }

  const {mutate} = useCustomPost("/api/GetInvoice", "invoice", invoiceValidateRespond, invoiceValidateErr)

 

  const handleAddItems = () => {
   
    let postObj = {
      customerName:customer?.customer,
      customerTin:customer?.identity,
      invoice:invoiceNo,
      companyId:"",
      branchId: selectedBranch?.code,
      noteType
    }

    mutate(postObj)
    //console.log({postObj});


    // refetch();
  };

  const entriesList = watch("entries");
  const totalAmount =
    watch("entries")
      ?.map((x) => +x?.amount)
      ?.reduce(
        (previousValue, currentValue) => previousValue + currentValue,
        0
      ) || 0;
      //0 && invoiceDate.length > 0 && invoiceNo.length > 0
  const canAdd =
  invoiceNo.length > 0
      ? true
      : false;
  const isValidAmt =
    Number(watch("amount")) === totalAmount
      ? "primary"
      : Number(watch("amount")) < totalAmount
      ? "success"
      : "danger";

  const isValidText =
    isValidAmt === "danger"
      ? `Amount must be less than total amount for the invoice ${moneyInTxt(
          totalAmount,
          "en",
          2
        )}`
      : "";

  
  const handleCheckEvent = (e) => {
    setIsCashCustomer(!isCashCustomer);
    if (e.target.checked) {
    }
  };
const handleSetter = (data)=>{
  setCustomer(data)
  console.log({handleSetter: data});

}
  return (
    <Form onSubmit={handleSubmit(onSubmit)} className="mt-3">
      <Row>
        <Col md={5} className="pt-2" style={{ background: "#f7fafc" }}>
          <Row form className="mb-2">
            <div style={{ display: "flex", gap: 25, marginTop: 0 }}>
              <FormGroup check>
                <Label check className="text-sm">
                  <Controller
                    name="noteType"
                    control={control}
                    defaultValue="CREDIT"
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="radio"
                        value="DEBIT"
                        id="debitNote"
                        name="noteType"
                       
                      />
                    )}
                  />{" "}
                  Debit Note
                </Label>
              </FormGroup>
              <FormGroup check>
                <Label check className="text-sm">
                  <Controller
                    name="noteType"
                    control={control}
                    defaultValue="CREDIT"
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="radio"
                        value="CREDIT"
                        id="creditNote"
                        name="noteType"
                        defaultChecked={true}
                      />
                    )}
                  />{" "}
                  Credit Note
                </Label>
              </FormGroup>
            </div>
          </Row>
          <Row form style={styles.mb__5}>
            <div style={{ position: "absolute", right: 20, zIndex: 1, display:"none" }}>
              <FormGroup check>
                <Label check className="text-sm">
                  <Input
                    type="checkbox"
                    value="Yes"
                    id="checkbox"
                    name="checkbox"
                    defaultChecked={isCashCustomer}
                    onClick={handleCheckEvent}
                  />
                  Cash Customer
                </Label>
              </FormGroup>
            </div>
            <Col>
              <FormGroup>
                <Label for="customerName" className="text-sm mb-0">
                  Customer Name
                </Label>
                {!isCashCustomer ? (
                  <Autocomplete
                    suggestions={customers}
                    formData={customer}
                    setFormData={handleSetter}
                    businessPartner={"Customer"}
                  />
                ) : (
                  <Controller
                    name="customerName"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <Input
                        size={"sm"}
                        {...field}
                        type="text"
                        id="customerName"
                        className="form-control-alternative"
                      />
                    )}
                  />
                )}
              </FormGroup>

              {/* <FormGroup>
                <Label for="customerName" className="text-sm mb-0">
                  Customer Name
                </Label>
                <Controller
                  name="customerName"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Input
                      size={"sm"}
                      {...field}
                      type="text"
                      id="customerName"
                    />
                  )}
                />
              </FormGroup> */}
            </Col>
          </Row>

          <Row form style={styles.mb__5}>
            <Col md={6}>
              <FormGroup>
                <Label for="date" className="text-sm mb-0">
                  Date
                </Label>
                <Controller
                  name="date"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Input size={"sm"} {...field} type="date" id="date" />
                  )}
                />
              </FormGroup>
            </Col>
            <Col lg="6" >
                <label htmlFor="currency" className="form-control-label ">
                  Currency {exchangeRate === 1 ? "" : exchangeRate}
                </label>
                <select
                  className="form-control font-sm"
                  id="currency"
                  value={currency}
                  onChange={handleCurrencySelect}
                
                  style={{ height: 29, padding: "0px 5px" }}
                >
                  {currencies.map((currency, index) => (
                    <option
                      key={index}
                      name={currency.name}
                      id={currency.code}
                      value={currency.code}
                    >
                      {currency.code}
                    </option>
                  ))}
                </select>{" "}
              </Col>
            <Col md={6}>
              <FormGroup style={{marginTop:-15}}>
                <Label for="amount" className="text-sm mb-0">
                  Amount
                </Label>
                <Controller
                  name="amount"
                  control={control}
                  defaultValue=""
                  // rules={{
                  //   required: 'This field is required',
                  //   pattern: {
                  //     value: /^-?[0-9]*[.,]?[0-9]+$/,
                  //     message: 'Please enter a valid number.',
                  //   },
                  // }}
                  render={({ field }) => (
                    <Input size={"sm"} {...field} type="text" id="amount"/>
                    
                  )}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row form>
            <Col>
              <FormGroup>
                <Label for="reason" className="text-sm mb-0">
                  Reason
                </Label>
                <Controller
                  name="reason"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Input type="textarea" size={"sm"} {...field} id="reason" />
                  )}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row form>
            <Badge
              color="primary"
              onClick={toggleAddItem}
              style={{ cursor: "pointer" }}
            >
              {showAdd ? (
                <i className="fa fa-minus"></i>
              ) : (
                <i className="fa fa-plus"></i>
              )}{" "}
              Add Item
            </Badge>
          </Row>
          {showAdd ? (
            <>
              {" "}
              <Row form>
                <Col md={12}>
                  <FormGroup>
                    <Label for="reason" className="text-sm mb-0">
                      Invoice #
                    </Label>
                    <Input
                      type="text"
                      value={invoiceNo}
                      name="incoiceNo"
                      size={"sm"}
                      id="incoiceNo"
                      onChange={(e) => setInvoiceNo(e.target.value)}
                    />
                  </FormGroup>
                  {
                    notValid ? <Alert color="danger">Invoice No. is not valid</Alert> : null
                  }
                </Col>
                <Col md={6} hidden>
                  <FormGroup style={{ marginTop: -20 }}>
                    <Label for="date" className="text-sm mb-0">
                      Date
                    </Label>
                    <Input
                      type="date"
                      value={invoiceDate}
                      name="invoiceDate"
                      size={"sm"}
                      id="invoiceDate"
                      onChange={(e) => setInvoiceDated(e.target.value)}
                    />
                  </FormGroup>
                </Col>
                <Col md={6} hidden>
                  <FormGroup style={{ marginTop: -20 }}>
                    <Label for="date" className="text-sm mb-0 mt-0">
                      Invoice Amount
                    </Label>
                    <Input
                      type="text"
                      value={invoiceAmount}
                      name="invoiceAmt"
                      size={"sm"}
                      id="invoiceAmt"
                      onChange={(e) => setInvoiceAmount(e.target.value)}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row form>
                <Col md={6}>
                  <Button
                    style={{
                      width: "100%",
                      cursor: canAdd ? "pointer" : "not-allowed",
                    }}
                    size="sm"
                    onClick={handleAddItems}
                    type="button"
                    color="primary"
                    disabled={!canAdd || isLoading}
                  >
                    {isLoading ? "Please wait" : "Add"}
                  </Button>
                </Col>
                <Col md={6}>
                  <Button
                    style={{
                      width: "100%",
                      cursor:
                        entriesList.length === 0 ? "not-allowed" : "pointer",
                    }}
                    size="sm"
                    type="submit"
                    color="success"
                    disabled={entriesList.length === 0}
                  >
                    Submit
                  </Button>
                </Col>
              </Row>
            </>
          ) : null}
        </Col>
        <Col md={7}>
          <Card elevation={5} className="p-0">
            <div
              className="table-responsive"
              style={{
                height: window.screen.height > 864 ? "32.5vh":"40vh",

                overflowY: "auto",
                width: "100%",
              }}
            >
              <Table size="sm">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Invoice Number</th>
                    <th>Date</th>
                    <th style={{ textAlign: "right" }}>Amount</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {entriesList?.map((entry, index) => (
                    <tr key={entry?.id}>
                      <td>{index + 1}</td>
                      <td>{entry?.invoiceNo}</td>
                      <td>{convertDate(entry?.date)}</td>
                      <td style={{ textAlign: "right" }}>
                        {moneyInTxt(+entry?.amount, "en", 2)}
                      </td>
                      <td>
                        <FaTrashAlt
                          color="darkred"
                          title="Remove"
                          onClick={() => handleRemove(index)}
                          size={10}
                          style={{ cursor: "pointer" }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
            <Table size="sm" className=" m-0">
              <tbody>
                <tr>
                  <td>
                    <Badge color="primary">
                      Count: {entriesList?.length || 0}
                    </Badge>
                  </td>
                  <td colSpan={3}>
                    <div style={{ width: "11vw" }}></div>
                  </td>
                  <td>
                    <Badge
                      style={{ fontSize: 12 }}
                      title={isValidText}
                      color={isValidAmt}
                    >
                      Total: {moneyInTxt(totalAmount, "en", 2)}
                    </Badge>
                  </td>
                </tr>
              </tbody>
            </Table>
          </Card>
        </Col>
      </Row>

      {/* <Button type="button" color="primary" onClick={handleAppendEntry}>
        Add Entry
      </Button> */}
    </Form>
  );
};

export default NoteForm;

const styles = {
  mb__5: {
    marginBottom: "-12px",
    position: "relative",
  },
};

{
  /* <div
className="table-responsive"
style={{ maxHeight: "35vh", overflowY: "auto" }}
>
<Table>
  <thead>
    <tr>
      <th>#</th>
      <th>Invoice Number</th>
      <th>Date</th>
      <th>Amount</th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    {fields.map((entry, index) => (
      <tr key={entry?.id}>
        <td>{fields.length - index}</td>
        <td>
          <>
            <Controller
              name={`entries[${index}].invoiceNo`}
              control={control}
              defaultValue=""
              render={({ field }) => (
                <>
                  <Input
                    size={"sm"}
                    {...field}
                    type="text"
                    id={`entries[${index}].invoiceNo`}
                    placeholder="Invoice number"
                  />{" "}
                </>
              )}
            />
          </>
        </td>
        <td>
          <>
          {
            entry.value
          }
            <Controller
              name={`entries[${index}].date`}
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Input
                  size={"sm"}
                  {...field}
                  type="date"
                  id={`entries[${index}].date`}
                />
              )}
            />
          </>
        </td>
        <td>
          <>
            <Controller
              name={`entries[${index}].amount`}
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Input
                  size={"sm"}
                  {...field}
                  type="number"
                  id={`entries[${index}].amount`}
                />
              )}
            />
          </>
        </td>
        <td>
          <Button
            hidden={index >= 1}
            size="sm"
            color="primary"
            onClick={handleAppendEntry}
          >
            <i className="fa fa-plus"></i>
          </Button>
          <Button
            size="sm"
            className="btn-danger"
            onClick={() => handleRemove(index)}
          >
            <i className="fa fa-trash"></i>
          </Button>
        </td>
      </tr>
    ))}
  </tbody>
</Table>
</div> */
}
