import React, { useContext, useState } from "react"
import { ToastContainer, toast } from "react-toastify"

import {
  FormGroup,
  Form,
  Input,
  Row,
  Col,
  Button,
  Card,
  CardBody,
  Modal,
} from "reactstrap"
import { getPayableAmount } from "utils/util"
import { FormContext } from "./NewInvoice"




function EditInvoiceItem({
  updateItemData,
  setUpdateItemData,
  setShowUpdate,
  gridData,
  setGridData,
  showDiscountField,
}) {
  const {
    
    vatAndLeviesScheme
  } = useContext(FormContext);
  const handleUpdate = () => {
    // console.log(gridData)

    const { itemName, isInclusive } = updateItemData

    // console.log({ updateItemData })

    // return;
    let index = gridData.findIndex((item, i) => i == updateItemData.index)
    let data = [...gridData]
    const rowData = gridData[index]

    // alert("this");
    // console.log({ index, rowData })
    // return;

    let csttourism = 0
    //itemName === "CST Item" ? 0.05 * updateItemData.price * updateItemData.quantity ? itemName === "TRSM Item" ?
    const getotherLeviesType = () => {
      if (itemName === "CST Item" || itemName.trim() === "CST Inclusive Item") {
        return "CST "
      }
      if (itemName === "TRSM Item" || itemName === "Tourism Item") {
        return "TRSM"
      }
    }
    //
    if (itemName === "CST Item" || itemName.trim() === "CST Inclusive Item") {
      csttourism = isInclusive
        ? 0.05 *
          ((updateItemData.quantity * updateItemData.price * 100) / 127.65)
        : 0.05 * updateItemData.price * updateItemData.quantity
    } else if (itemName === "TRSM Item") {
      csttourism = isInclusive
        ? 0.01 *
          ((updateItemData.quantity * updateItemData.price * 100) / 127.65)
        : 0.01 * updateItemData.price * updateItemData.quantity
    }
    // else {
    //   setCsttourism(0);
    //   console.log("includeItem", "none", updateItemData);
    // }
    // if (item.otherLevies === "NON") {
    //   csttourism = 0;
    // } else if (item.otherLevies === "CST") {
    //   csttourism = 0.05 * item.price * item.quantity;
    // } else if (item.otherLevies === "TRSM") {
    //   csttourism = 0.01 * item.price * item.quantity;
    // }

    if (!updateItemData.isInclusive) {
      if (updateItemData.isTaxable) {
        // console.log('this is tax exclusive and taxable')
        // data[index]["discount"] = Number(updateItemData.discount);
        // data[index]["quantity"] = Number(updateItemData.quantity);
        // data[index]["price"] = updateItemData.price;
        // data[index]["taxableAmount"] =
        //   updateItemData.price * updateItemData.quantity;
        // data[index]["nhil"] =
        //   updateItemData.quantity * updateItemData.price * 0.025;
        // data[index]["getf"] =
        //   updateItemData.quantity * updateItemData.price * 0.025;
        // data[index]["covid"] =
        //   updateItemData.quantity * updateItemData.price * 0.01;
        // data[index]["vat"] =
        //   (updateItemData.quantity * updateItemData.price +
        //     data[index]["nhil"] +
        //     data[index]["getf"] +
        //     data[index]["covid"]) *
        //   0.125;
        // data[index]["totalPayable"] =
        //   data[index]["taxableAmount"] -
        //   data[index]["discount"] +
        //   data[index]["nhil"] +
        //   data[index]["getf"] +
        //   data[index]["covid"] +
        //   data[index]["vat"];
        // data[index]["otherLevies"] = csttourism;
      } else {
        // console.log('this is tax exclusive and non-taxable')
        // data[index]["discount"] = Number(updateItemData.discount);
        // data[index]["quantity"] = Number(updateItemData.quantity);
        // data[index]["price"] = updateItemData.price;
        // data[index]["taxableAmount"] =
        //   updateItemData.price * updateItemData.quantity;
        // data[index]["nhil"] = 0;
        // data[index]["getf"] = 0;
        // data[index]["covid"] = 0;
        // data[index]["totalPayable"] =
        //   data[index]["taxableAmount"] -
        //   data[index]["discount"] +
        //   data[index]["nhil"] +
        //   data[index]["getf"] +
        //   data[index]["covid"] +
        //   data[index]["vat"];
        // data[index]["otherLevies"] = csttourism;
      }

      // if (updateItemData.isTaxable) {
      //   // vatableAmt = obj.taxableAmount + obj.nhil + obj.getf + obj.covid
      //   // vat = 0.125 * vatableAmt
      // } else if (!updateItemData.isTaxable) {

      //   //vatableAmt = obj.taxableAmount
      //   // vatableAmt = obj.taxableAmount + obj.nhil + obj.getf + obj.covid
      // }
    } else {
      // console.log('this is tax inclusive')
      // data[index]["discount"] = Number(updateItemData.discount);
      // data[index]["quantity"] = Number(updateItemData.quantity);
      // data[index]["price"] = updateItemData.price;
      // data[index]["nhil"] =
      //   0.025 *
      //   ((updateItemData.quantity * updateItemData.price * 100) / 119.25);
      // data[index]["getf"] =
      //   0.025 *
      //   ((updateItemData.quantity * updateItemData.price * 100) / 119.25);
      // data[index]["covid"] =
      //   0.01 *
      //   ((updateItemData.quantity * updateItemData.price * 100) / 119.25);
      // data[index]["tourism"] = updateItemData.hasTourismLevy
      //   ? 0.01 * updateItemData.quantity * updateItemData.price
      //   : 0;
      // data[index]["taxableAmount"] =
      //   (updateItemData.quantity * updateItemData.price * 100) / 119.25;
      // let inclusiveAmt = updateItemData.quantity * updateItemData.price;
      // data[index]["totalPayable"] = inclusiveAmt - updateItemData.discount;
      // data[index]["otherLevies"] = csttourism;
    }

    const result = getPayableAmount(
      {
        ...updateItemData,
        otherLevies: rowData?.otherLeviesType,
        isTaxable: rowData?.isTaxable,
        isTaxInclusive: rowData?.isTaxInclusive,
      },
      updateItemData?.discount,
      vatAndLeviesScheme
    )
    let obj = {
      ...updateItemData,
      ...result,
      itemCode: rowData?.itemCode,
      vatItemId: rowData?.vatItemId,
    }

    data[index]["discount"] = Number(obj.discount)
    data[index]["quantity"] = Number(obj.quantity)
    data[index]["price"] = obj.price
    data[index]["taxableAmount"] = obj?.taxableAmount
    data[index]["nhil"] = obj.nhil
    data[index]["getf"] = obj?.getf
    data[index]["covid"] = obj?.covid
    data[index]["totalPayable"] = obj?.totalPayable
    data[index]["otherLevies"] = obj?.otherLevies
    data[index]["vat"] = obj?.vat
    data[index]["otherLeviesType"] = rowData?.otherLeviesType
    data[index]["isTaxable"] = rowData?.isTaxable

    // console.log({ result, data, obj })

    setGridData(data)
    setShowUpdate(false)
  }

  return (
    <>
      <Modal
        className="modal-dialog-centered modal-md"
        isOpen={true}
        toggle={() => console.log("toggled")}
      >
        <div className="modal-header">
          <h4 className="" id="exampleModalLabel">
            Update Item
          </h4>

          <button
            aria-label="Close"
            className="close"
            data-dismiss="modal"
            type="button"
            onClick={() => setShowUpdate(false)}
          >
            <span aria-hidden={true}>×</span>
          </button>
        </div>

        <div className="modal-body" style={{ marginTop: -30 }}>
          <h5 style={{ color: "teal" }}>{updateItemData.itemName}</h5>
          <Card className="shadow">
            <CardBody>
              {/* <div
                style={{
                  zIndex: 100000,
                  display: "flex",
                  flexDirection: "roq",
                  justifyContent: "center",
                  alignItems: "center",
                  position: "absolute",
                }}
              ></div> */}
              <ToastContainer />
              <Form onSubmit={(e) => e.preventDefault()}>
                <Row>
                  <Col lg="12">
                    <FormGroup>
                      <label hidden className="form-control-label">
                        Item
                      </label>
                      <Input
                        hidden
                        className="form-control font-sm"
                        placeholder="Item Name"
                        type="text"
                        disabled
                        value={updateItemData.itemName}
                        bsSize="sm"
                      />
                    </FormGroup>{" "}
                  </Col>
                </Row>
                <Row style={{ marginTop: -20 }}>
                  <Col lg="4">
                    <FormGroup>
                      <label className="form-control-label">Quantity</label>
                      <Input
                        className="form-control font-sm"
                        placeholder="Quantity"
                        type="number"
                        value={updateItemData.quantity}
                        onChange={(e) =>
                          setUpdateItemData({
                            ...updateItemData,
                            quantity: Number(e.target.value),
                          })
                        }
                        bsSize="sm"
                      />
                    </FormGroup>{" "}
                  </Col>
                  <Col lg="4">
                    <FormGroup>
                      <label className="form-control-label">Price</label>
                      <Input
                        className="form-control font-sm"
                        placeholder="Quantity"
                        type="number"
                        disabled
                        value={updateItemData.price}
                        // onChange={(e) =>
                        //   setUpdateItemData({
                        //     ...updateItemData,
                        //     price: Number(e.target.value),
                        //   })
                        // }
                        bsSize="sm"
                      />
                    </FormGroup>{" "}
                  </Col>
                  {showDiscountField && (
                    <Col lg="4">
                      <FormGroup>
                        <label className="form-control-label">Discount</label>
                        <Input
                          className="form-control font-sm"
                          placeholder="Discount"
                          type="number"
                          value={updateItemData.discount}
                          onChange={(e) =>
                            setUpdateItemData({
                              ...updateItemData,
                              discount: Number(e.target.value),
                            })
                          }
                          bsSize="sm"
                        />
                      </FormGroup>{" "}
                    </Col>
                  )}
                </Row>
              </Form>
              <Button
                size="sm"
                color="success"
                type="button"
                onClick={handleUpdate}
                style={{ width: "100%" }}
              >
                Update
              </Button>
            </CardBody>

            <div className="modal-footer"></div>
          </Card>
        </div>
      </Modal>
    </>
  )
}

export default EditInvoiceItem
