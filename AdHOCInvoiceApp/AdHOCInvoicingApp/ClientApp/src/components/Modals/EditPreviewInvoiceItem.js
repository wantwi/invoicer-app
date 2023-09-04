import { moneyInTxt } from "components/Invoice/InvoicePreview";
import React, { useCallback, useLayoutEffect, useMemo, useState } from "react";
import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";

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
} from "reactstrap";
import { FormContext } from "./NewInvoice";

const validateRefundQty = (updateItemData) => {
  // console.log({ updateItemData });
  //ensure refundQty is less than available qty and not less than zero
  if (Number(updateItemData.qtyToRefund) > updateItemData.availableQty) {
    return {
      msg: "Refund quantity must not be greater than available quantity",
      isError: true,
    };
  } else if (updateItemData.qtyToRefund <= 0) {
    return {
      msg: "Refund quantity is invalid",
      isError: true,
    };
  } else {
    return {
      msg: null,
      isError: false,
    };
  }
};

const calcuLateRefundAmount = (params) => {
  // console.log({params})
  let temp = (params.payablePrice / params.quantity) * params.qtyToRefund
  // let temp = (params.quantity / params.qtyToRefund) * params.price;
  return Number(temp).toFixed(4) || 0;
};

function EditPreviewInvoiceItem({
  setShowUpdate,
  updateItemData,
  setUpdateItemData,
  invoicesPrePost,
  setInvoicesPrePost,
  setConfirmDisabled,
  setAmountToRefund
}) {
  // console.log({ invoicesPrePost });
  const [refundQty, setRefundQty] = useState(1);
  const [errMsg, setErrMsg] = useState(null);

  useEffect(() => {
    const isValidInput = validateRefundQty(updateItemData);
    // console.log({ isValidInput });
    if (!isValidInput.isError) {
      const newRefundAmount = calcuLateRefundAmount(updateItemData);
      setUpdateItemData((prev) => {
        return {
          ...prev,
          priceAfterRefund: newRefundAmount,
        };
      });
    } else {
      setUpdateItemData((prev) => {
        return {
          ...prev,
          qtyToRefund: "",
          // priceAfterRefund: prev.price,
        };
      });
    }
    setErrMsg(isValidInput.msg);
    return () => { };
  }, [updateItemData.qtyToRefund]);

  const handleUpdate = () => {
    const isValidInput = validateRefundQty(updateItemData);

    if (!isValidInput.isError) {
      setAmountToRefund(prev => prev + parseFloat(updateItemData.priceAfterRefund))
      setShowUpdate(false);
      setConfirmDisabled(false);
      let gridData = invoicesPrePost;
      let index = gridData.findIndex((item, i) => i == updateItemData.index);
      let data = JSON.parse(JSON.stringify(gridData));
      data[index]["refundQuantity"] = updateItemData.qtyToRefund
      data[index]["availableQty"] = updateItemData.availableQty - updateItemData.qtyToRefund;
      data[index]["price"] = data[index]["unitPrice"] * data[index]["availableQty"];
      data[index]["taxableAmount"] =
      updateItemData.price * updateItemData.availableQty;
      setInvoicesPrePost(data);

      setShowUpdate(false);
      setConfirmDisabled(false);
      return
      data[index]["nhil"] =
        updateItemData.quantity * updateItemData.price * 0.025;
      data[index]["getf"] =
        updateItemData.quantity * updateItemData.price * 0.025;
      data[index]["covid"] =
        updateItemData.quantity * updateItemData.price * 0.01;
      data[index]["vat"] =
        updateItemData.quantity * updateItemData.price * 0.125;


    } else {
      toast.error(isValidInput.msg);
      setUpdateItemData((prev) => {
        return {
          ...prev,
          qtyToRefund: "",
        };
      });
    }
  };

  const handleQtyToRefundOnChange = useCallback(
    (e) => {
      setUpdateItemData((prev) => {
        return {
          ...prev,
          qtyToRefund: Number(e.target.value),
        };
      });
    },
    [updateItemData]
  );

  return (
    <>
      <Modal
        className="modal-dialog-centered modal-md"
        isOpen={true}
        toggle={() => console.log("toggled")}
      >
        <div className="modal-header">
          <h1 className="modal-title" id="exampleModalLabel">
            {"Refund Item"}
          </h1>
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
        <div className="modal-body" style={{ display: "flex" }}>
          <Card className=" shadow" style={{ width: "100%", height: "380px" }}>
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
              <ToastContainer />
              <Form onSubmit={(e) => e.preventDefault()}>
                <Row>
                  <Col lg="12">
                    <FormGroup>
                      <label className="form-control-label">Item</label>
                      <Input
                        className="form-control"
                        placeholder="Item Name"
                        type="text"
                        disabled
                        value={updateItemData.itemName}
                      />
                    </FormGroup>{" "}
                  </Col>
                </Row>
                <Row>
                  <Col lg="6" md="6">
                    <FormGroup>
                      <label className="form-control-label">Qty</label>
                      <Input
                        className="form-control"
                        placeholder="Item Name"
                        type="text"
                        disabled
                        value={updateItemData.availableQty}
                      />
                    </FormGroup>{" "}
                  </Col>
                  <Col lg="6" md="6">
                    <FormGroup>
                      <label className="form-control-label">Amount Paid</label>
                      <Input
                        className="form-control"
                        placeholder="Item Name"
                        type="text"
                        disabled
                        value={updateItemData.price}
                      />
                    </FormGroup>{" "}
                  </Col>
                </Row>
                <Row>
                  <Col lg="6">
                    <FormGroup>
                      <label className="form-control-label">
                        Qty To Refund
                      </label>

                      <Input
                        className="form-control"
                        placeholder="Quantity"
                        type="number"
                        name="Quantity"
                        value={updateItemData.qtyToRefund}
                        onChange={handleQtyToRefundOnChange}
                      />
                    </FormGroup>{" "}
                  </Col>
                  <Col lg="6">
                    <FormGroup>
                      <label className="form-control-label">
                        Refund Amount
                      </label>
                      <Input
                        className="form-control"
                        placeholder="Quantity"
                        type="number"
                        disabled
                        value={updateItemData.priceAfterRefund}
                      />
                    </FormGroup>{" "}
                  </Col>
                </Row>
              </Form>
            </CardBody>
            <div className="modal-footer">
              <Button
                color="warning"
                type="button"
                onClick={() => setShowUpdate(false)}
              >
                Cancel
              </Button>
              <Button color="success" type="button" onClick={handleUpdate}>
                Update
              </Button>
            </div>
          </Card>
        </div>
      </Modal>
    </>
  );
}

export default EditPreviewInvoiceItem;
