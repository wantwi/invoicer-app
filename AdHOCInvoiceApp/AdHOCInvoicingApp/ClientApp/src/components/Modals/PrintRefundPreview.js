import { moneyInTxt } from "components/Invoice/InvoicePreview";
import React from "react";
import { Modal, Button } from "reactstrap";
import graLogo from "../../assets/img/theme/gra.png";
import { FcDownload, FcPrint } from "react-icons/fc";
import QRCode from "react-qr-code";
import moment from "moment";
import { useAuth } from "context/AuthContext";

export const PrintRefundPreview = ({
  setShowReport,
  formData,
  // getPrintPDF,
  salesType,
  showSignature = true,
  bottom = 200,
}) => {
  let userDetails = JSON.parse(
    sessionStorage.getItem(process.env.REACT_APP_OIDC_USER)
  );

  let env = process.env.REACT_APP_ENV;

  const printReport = () => {
    let printContents = document.getElementById("modal-body").innerHTML;
    let originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print(printContents);
   const {user} = useAuth()

    //setShowReport(false)
    document.body.innerHTML = originalContents;
    location.reload();
  };

  // console.log({ formData });

  // return <Modal isOpen={true}>Yeaa</Modal>

  console.log("print preview component mounted!!!")

  return (
    <>
      <Modal
        className="modal-dialog-centered modal-lg"
        isOpen={true}
        toggle={() => console.log("toggled")}
      >
        <div className="modal-header">
          <h1 className="modal-title" id="exampleModalLabel">
            Invoice
          </h1>
          <div>
            <Button
              type="button"
              onClick={() => {
                // getPrintPDF(formData.invoiceNo);
              }}
              title="Click to Download"
            >
              <FcDownload />
            </Button>
            <Button type="button" onClick={printReport} title="Click to Print">
              <FcPrint />
            </Button>
            <Button
              aria-label="Close"
              data-dismiss="modal"
              type="button"
              onClick={() => setShowReport(false)}
            >
              <span aria-hidden={true}>×</span>
            </Button>
          </div>
        </div>
        <div id="modal-body" className="modal-body" style={styles.preview}>
          <div style={styles.title}>
            <img src={graLogo} style={{ width: 100, marginBottom: 15 }} />
            <h3 style={{ fontWeight: 900 }}>
              <u>VAT INVOICE REFUND</u>
            </h3>
          </div>
          <div style={styles.header}>
            <table>
              <tbody>
                <tr style={{ height: 30 }}>
                  <td>
                    <span style={{ fontWeight: 900 }}>CUSTOMER:</span>
                  </td>
                  <td>{formData?.customerName} </td>
                  <td>
                    <span style={{ fontWeight: 900 }}>INVOICE DATE:</span>
                  </td>
                  <td>{new Date(formData?.date).toDateString()} </td>
                </tr>
                <tr style={{ height: 30 }}>
                  <td>
                    <span style={{ fontWeight: 900 }}>CUSTOMER TIN:</span>
                  </td>
                  <td>{formData?.customerTinghcard} </td>
                  {/* <td>
                    <span style={{ fontWeight: 900 }}>REFUND TYPE</span>
                  </td>
                  <td>{formData?.refundType}</td> */}
                  <td>
                    <span style={{ fontWeight: 900 }}>CURRENCY</span>
                  </td>
                  <td>{formData?.currency}</td>
                </tr>
                <tr style={{ height: 30 }}>
                  <td>
                    <span style={{ fontWeight: 900 }}>REFUND NO:</span>
                  </td>
                  <td> {formData?.refundNo} </td>
                  <td>
                    <span style={{ fontWeight: 900 }}>PHONE NO:</span>
                  </td>
                  <td> {formData?.customerTel} </td>
                </tr>
                <tr style={{ height: 30 }}>
                  <td>
                    <span style={{ fontWeight: 900 }}>INVOICE NO:</span>
                  </td>
                  <td>
                    {formData?.invoiceNo}
                    {/* {moment(formData?.date).format("D MMM, YYYY")} */}
                  </td>
                  <td>
                    <span style={{ fontWeight: 900 }}>SERVED BY:</span>
                  </td>
                  <td>{formData?.nameOfUser}</td>
                </tr>
                <tr style={{ height: 30 }}>
                  <td>
                    <span style={{ fontWeight: 900 }}>REFUND DATE:</span>
                  </td>
                  <td>
                    {new Date(formData?.date).toDateString()}
                    {/* {moment(formData?.dueDate).format("D MMM, YYYY")} */}
                  </td>
                  
                </tr>
              </tbody>
            </table>
          </div>
          <div
            className="body-wrapper"
            style={{
              height: "max-content",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: "min-content",
                border: "0px solid green",
                flexGrow: 1,
                marginBottom: "40vh  ",
              }}
            >
              <div style={styles.body}>
                <table border={1}>
                  <tbody>
                    <tr>
                      <td style={{ fontWeight: 900 }}>Item Code</td>
                      <td style={{ fontWeight: 900, width: "45%" }}>
                        Item&nbsp;Description
                      </td>
                      <td style={{ fontWeight: 900, textAlign: "right" }}>
                        Item&nbsp;Price{" "}
                      </td>
                      <td style={{ fontWeight: 900, textAlign: "right" }}>
                       Quantity
                      </td>
                      <td style={{ fontWeight: 900, textAlign: "right" }}>
                        VAT Rate
                      </td>
                      <td style={{ fontWeight: 900, textAlign: "right" }}>
                        VATAMt
                      </td>
                      <td style={{ fontWeight: 900, textAlign: "right" }}>
                        Total&nbsp;Amount
                      </td>
                    </tr>
                    {formData?.invoiceItems?.map((invoice, index) => {
                      return (
                        <tr key={index}>
                          <td>{invoice.itemCode}</td>
                          <td>{invoice.itemDescription}</td>
                          <td style={{ textAlign: "right" }}>
                            {moneyInTxt(invoice.unitPrice)}
                          </td>
                          <td style={{ textAlign: "right" }}>
                            {invoice.quantity}
                          </td>
                          <td style={{ textAlign: "right" }}>
                            {moneyInTxt(invoice.price)}
                          </td>
                          <td style={{ textAlign: "right" }}>
                            {invoice?.refundQty}
                          </td>
                          <td style={{ textAlign: "right" }}>
                            {moneyInTxt(invoice?.refundAmount)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <div style={{ ...styles.taxInfo }}>
                  <p style={{ fontWeight: 900, fontSize: 13 }}>
                    REMARKS:{" "}
                    <label style={{ fontWeight: 200 }}>
                      {formData?.remarks}
                    </label>
                  </p>
                  <table>
                    <tbody>
                      <tr>
                        <td style={{ fontWeight: 900 }}>TOTAL (EXCL TAXES):</td>
                        <td>
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        </td>
                        <td style={{ textAlign: "right" }}>
                          {moneyInTxt(formData?.totalExVatAmount)}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ fontWeight: 900 }}>DISCOUNT:</td>
                        <td>
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        </td>
                        <td style={{ textAlign: "right" }}>
                          {moneyInTxt(formData?.totalDiscount)}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ fontWeight: 900 }}>NHIL(2.5%):</td>
                        <td></td>
                        <td style={{ textAlign: "right" }}>
                          {moneyInTxt(
                            formData?.invoiceItems?.reduce(
                              (total, item) => total + item.nhil,
                              0
                            )
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ fontWeight: 900 }}>GETFUND LEVY(2.5%):</td>
                        <td></td>
                        <td style={{ textAlign: "right" }}>
                          {moneyInTxt(
                            formData?.invoiceItems?.reduce(
                              (total, item) => total + item.getFund,
                              0
                            )
                          )}
                        </td>
                      </tr>
                      <tr>
                        {" "}
                        <td style={{ fontWeight: 900 }}>CST (5%):</td>
                        <td></td>
                        <td style={{ textAlign: "right" }}>
                          {moneyInTxt(formData?.totalCst)}
                        </td>
                      </tr>
                      <tr>
                        {" "}
                        <td style={{ fontWeight: 900 }}>TOURISM (1%):</td>
                        <td></td>
                        <td style={{ textAlign: "right" }}>
                          {moneyInTxt(formData?.totalTourism)}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ fontWeight: 900 }}>COVID LEVY(1%):</td>
                        <td></td>
                        <td style={{ textAlign: "right" }}>
                          {moneyInTxt(
                            formData?.invoiceItems?.reduce(
                              (total, item) => total + item.covid,
                              0
                            )
                          )}
                        </td>
                      </tr>

                      <tr>
                        <td style={{ fontWeight: 900 }}>
                          {/* TOTAL VAT({formData?.invoiceItems[0]?.taxRate}%): */}
                        </td>
                        <td></td>
                        <td style={{ textAlign: "right" }}>
                          {moneyInTxt(
                            formData?.invoiceItems?.reduce(
                              (total, item) => total + item.vat,
                              0
                            )
                          )}
                        </td>
                      </tr>
                      <tr style={{ borderTop: "2px solid black" }}>
                        <td style={{ fontWeight: 900 }}>TOTAL:</td>
                        <td></td>
                        <td> {moneyInTxt(formData?.totalAmount)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            {showSignature && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderTop: "3px  solid #000",
                  borderBottom: "3px  solid #000",
                  height: 190,
                  position: "absolute",
                  bottom: 30,
                  width: "95%",
                }}
              >
                <div>
                  <span style={{ fontWeight: 900, marginLeft: 100 }}>
                    <u>SDC INFORMATION</u>
                  </span>
                  <table>
                    <tbody>
                      <tr style={{ height: 25 }}>
                        <td style={{ fontWeight: 900 }}>SDC ID:</td>
                        <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
                        <td>{formData?.ysdcid}</td>
                      </tr>
                      <tr style={{ height: 25 }}>
                        <td style={{ fontWeight: 900 }}>RECEIPT NUMBER:</td>
                        <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
                        <td>{formData?.ysdcrecnum}</td>
                      </tr>
                      <tr style={{ height: 25 }}>
                        <td style={{ fontWeight: 900 }}>MRC TIME:</td>
                        <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
                        <td>
                          {new Date(formData?.ysdcmrctim).toDateString()}{" "}
                          {new Date(formData?.ysdcmrctim).toLocaleTimeString()}
                        </td>
                      </tr>
                      <tr style={{ height: 25 }}>
                        <td style={{ fontWeight: 900 }}>MRC:</td>
                        <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
                        <td>{formData?.ysdcmrc}</td>
                      </tr>
                      <tr style={{ height: 25 }}>
                        <td style={{ fontWeight: 900 }}>INTERNAL DATA:</td>
                        <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
                        <td>{formData?.ysdcintdata}</td>
                      </tr>
                      <tr>
                        <td style={{ fontWeight: 900 }}>RECEIPT SIGNATURE:</td>
                        <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
                        <td>{formData?.ysdcregsig}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div>
                  <QRCode
                    size={256}
                    style={{
                      objectFit: "contain",
                      width: 120,
                      height: 120,
                      position: "absolute",
                      right: 50,
                      top: 30,
                    }}
                    viewBox={`0 0 512 512`}
                    value={
                      env === "Dev"
                        ? formData?.qrData
                        : formData?.qrCode ||
                          `https://authsrv.e-vatghana.com/verification/searchBySignature.jsp?SIGNATURE=${formData?.ysdcregsig?.replaceAll(
                            "-",
                            ""
                          )}`
                    }
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

const styles = {
  preview: {
    display: "flex",
    flexDirection: "column",
    color: "black",
    fontSize: 12,
  },
  title: {
    display: "flex",
    flexDirection: "column",
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    height: 150,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },

  body: {
    // maxHeight: 200,
    // overflow: 'auto',
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    marginTop: 10,
    marginBottom: 10,
  },
  taxInfo: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 50,
    marginTop: 10,
  },
  footer: {
    height: 180,
    marginTop: 10,
    position: "relative",
  },
};
