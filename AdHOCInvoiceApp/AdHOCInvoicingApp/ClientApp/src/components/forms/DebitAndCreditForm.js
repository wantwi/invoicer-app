import { Card } from "@mui/material";
import React, { useEffect, useState } from "react";
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
} from "reactstrap";
import { convertDate } from "utils/util";
import { FaTrashAlt } from "react-icons/fa";
import { getFormattedDate,moneyInTxt } from "utils/util";
import { useCustomQueryById } from "hooks/useCustomQueryById";

const NoteForm = ({ setShowNewInvoiceModal }) => {
  const [showAdd, setShowAdd] = useState(false)
  const [invoiceNo, setInvoiceNo] =useState("")  
  const [invoiceDate, setInvoiceDated] =useState("")  
  const [invoiceAmount, setInvoiceAmount] =useState("")  

  const { handleSubmit, control, setValue, getValues, watch } = useForm({
    defaultValues:{
      customerName:"",
      amount: 0,
      date:"",
      reason:"",
      entries:[]
    }
  });


  const { fields, append, remove, prepend } = useFieldArray({
    control,
    name: "entries",
  });

  const onSuccess = (data)=>{
    append({ invoiceNo: invoiceNo, date: invoiceDate, amount: invoiceAmount })
    resetItemsForm()

  }
  const onError = (data)=>{
    alert("error")
    
  }
  const {isLoading, refetch} = useCustomQueryById(`/invoice/${invoiceNo}`,"note",invoiceNo, onSuccess, onError)


  
  const onSubmit = (data) => {
    // Handle form submission here
    console.log(data);
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
    //{ invoiceNo: "", date: "", amount: "" }

    return () => {};
  }, []);
  const toggleAddItem = () => {
    setShowAdd(!showAdd)
  }
  const resetItemsForm = ()=>{
    setInvoiceAmount("")
    setInvoiceDated("")
    setInvoiceNo("")
  }
  const handleAddItems = ()=>{
    refetch()
  }

  

  const entriesList = watch("entries")
  const totalAmount = watch("entries")?.map(x => +x?.amount)?.reduce( (previousValue,currentValue) => previousValue + currentValue  , 0) || 0
  const canAdd = invoiceAmount.length > 0 && invoiceDate.length > 0 && invoiceNo.length > 0 ? true : false
  const isValidAmt =
  Number(watch("amount")) === totalAmount ? "primary" :
  Number(watch("amount")) < totalAmount ? "success" : "danger";

  const isValidText =
  isValidAmt === "danger" ? `Amount must be less than total amount for the invoice ${moneyInTxt(totalAmount, "en", 2)}`  : "";




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
                    defaultValue="Debit Note"
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="radio"
                        value="Debit Note"
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
                    defaultValue="Credit Note"
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="radio"
                        value="Credit Note"
                        id="creditNote"
                        name="noteType"
                      />
                    )}
                  />{" "}
                  Credit Note
                </Label>
              </FormGroup>
            </div>
          </Row>
          <Row form style={styles.mb__5}>
            <div style={{ position: "absolute", right: 20, zIndex: 1 }}>
              <FormGroup check>
                <Label check className="text-sm">
                  <Input
                    type="checkbox"
                    value="Yes"
                    id="checkbox"
                    name="checkbox"
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
              </FormGroup>
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
            <Col md={6}>
              <FormGroup>
                <Label for="amount" className="text-sm mb-0">
                  Amount
                </Label>
                <Controller
                  name="amount"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Input size={"sm"} {...field} type="number" id="amount" />
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
            <Badge color="primary" onClick={toggleAddItem} style={{cursor:"pointer"}}>
              {showAdd?<i className="fa fa-minus"></i>: <i className="fa fa-plus"></i>} Add Item
            </Badge>
          </Row>
         {showAdd ?<> <Row form>
            <Col md={6}>
              <FormGroup>
                <Label for="reason" className="text-sm mb-0">
                  Invoice #
                </Label>
                <Input type="text" value={invoiceNo} name="incoiceNo" size={"sm"} id="incoiceNo" onChange={(e) => setInvoiceNo(e.target.value)} />
               
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="date" className="text-sm mb-0">
                  Date
                </Label>
                <Input type="date" value={invoiceDate} name="invoiceDate" size={"sm"} id="invoiceDate" onChange={(e) => setInvoiceDated(e.target.value)} />
                
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup style={{ marginTop: -20 }}>
                <Label for="date" className="text-sm mb-0 mt-0">
                  Invoice Amount
                </Label>
                <Input type="text" value={invoiceAmount} name="invoiceAmt" size={"sm"} id="invoiceAmt" onChange={(e) => setInvoiceAmount(e.target.value)} />
               
              </FormGroup>
            </Col>
          </Row>
          <Row form>
            <Col md={6}>
              <Button
                style={{ width: "100%", cursor: canAdd ? "pointer" : "not-allowed" }}
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
                style={{ width: "100%", cursor: entriesList.length === 0 ? "not-allowed" : "pointer" }}
                size="sm"
                type="submit"
                color="success"
                disabled={entriesList.length === 0}
              >
                Submit
              </Button>
            </Col>
          </Row></>:null}
        </Col>
        <Col md={7}>
          <Card elevation={5} className="p-0">
            <div
              className="table-responsive"
              style={{
                height: "33vh",
                
                overflowY: "auto",
                width: "100%",
              }}
            >
              <Table size="sm" >
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Invoice Number</th>
                    <th>Date</th>
                    <th style={{textAlign:"right"}}>Amount</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {entriesList?.map((entry, index) => (
                    <tr key={entry?.id}>
                      <td>{index + 1}</td>
                      <td>{entry?.invoiceNo}</td>
                      <td>{convertDate(entry?.date)}</td>
                      <td style={{textAlign:"right"}}>{moneyInTxt(+entry?.amount, "en", 2)}</td>
                      <td>
                      <FaTrashAlt
                      color="darkred"
                      title="Remove"
                      onClick={() => handleRemove(index)}
                      size={10}
                      style={{cursor:"pointer"}}
                      />
                       
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
             
            </div>
            <Table size="sm" className=" m-0" >
            
              <tbody>
                <tr>
                  <td>
                    
                    <Badge color="primary">
                    Count: {entriesList?.length || 0}
                  </Badge>
                     </td>
                <td colSpan={3} ><div style={{width:"11vw"}}></div></td>
                <td>
                <Badge style={{fontSize: 12}} title={isValidText} color={isValidAmt}>
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
