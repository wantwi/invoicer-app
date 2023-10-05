import React, { useState, useContext, useEffect } from "react";
import { Card, Table } from "reactstrap";
import graLogo from "../../assets/img/theme/gra.png";
import companyLogo from "../../assets/img/theme/logo.png";
import { FormContext } from "components/Modals/NewInvoice";
import { GrEdit } from "react-icons/gr";
import { FaTrashAlt } from "react-icons/fa";
import EditInvoiceItem from "components/Modals/EditInvoiceItem";
import moment from "moment";
import { getUser } from "services/AuthService";

export const moneyInTxt = (value, standard, dec = 2) => {
  var nf = new Intl.NumberFormat(standard, {
    minimumFractionDigits: dec,
    maximumFractionDigits: 2,
  });
  return nf.format(Number(value) ? value : 0.0);
};
let userDetails = null;

function InvoicePreview() {
  const { formData, gridData, setGridData, comments, vatAndLeviesScheme } = useContext(FormContext);
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
  
  const [userDetails, setUserDetails] = useState(null);
  useEffect(async () => {
    let temp = await getUser();
    setUserDetails(temp);
    return () => {};
  }, []);

  const [updateItemData, setUpdateItemData] = useState({
    itemName: "",
    quantity: 0,
    price: 0,
    discount: 0,
  });
  const [showUpdate, setShowUpdate] = useState(false);

  const handleEditItem = (item, index) => {
    // console.log({ item });
    setUpdateItemData({
      index: index,
      itemName: item.itemName,
      quantity: item.quantity,
      price: item.price,
      discount: Number(item.discount),
      isInclusive: item.isINC,
      isTaxable: item.taxable,
      otherLevies: item?.otherLevies || 0,
    });
    setShowUpdate(true);
  };

  return (
    <>
      <Card
        className="shadow"
        style={{
          width: "60%",
          height: "550px",
          marginLeft: "10px",
          padding: "15px",
          position: "relative",
        }}
      >
        <div style={styles.header}>
          <div style={styles.leftHeader}>
            <img src={graLogo} style={{ height: 45, width: "45%" }} />
          </div>

          <div style={styles.rightHeader}>
            {/* <img src={companyLogo} style={{ height: 30, width: '40%' }} /> */}
            <h3>{userDetails?.profile?.companyname}</h3>
            <h4 style={{ margin: 0 }}>INVOICE</h4>
            <h6>
              Issued on :{" "}
              {formData?.date
                ? moment(formData?.date).format("D MMM, YYYY")
                : "N/A"}
            </h6>
            <h6>
              Due Date:{" "}
              {formData?.dueDate
                ? moment(formData?.dueDate).format("D MMM, YYYY")
                : "N/A"}
            </h6>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-even",
            marginTop: "-20px",
            marginBottom: "0px",
          }}
        >
          <h5>Invoice for</h5>

          <h5>: &nbsp;{formData.customer}</h5>
        </div>

        <div style={styles.body}>
          <Table
            className="table-flush"
            responsive
            style={{ tableLayout: "auto" }}
          >
            <thead className="thead">
              <tr style={{ lineHeight: "10px" }}>
                <th scope="col" style={{ width: "30%" }}>
                  Item
                </th>
                <th scope="col" style={{ width: "10%", textAlign: "right" }}>
                  Quantity
                </th>
                <th scope="col" style={{ width: "20%", textAlign: "right" }}>
                  Price
                </th>
                <th scope="col" style={{ width: "20%", textAlign: "right" }}>
                  Amount
                </th>
                <th scope="col" style={{ width: "10%" }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {gridData.map((item, index) => (
                <tr style={{ lineHeight: "1px" }} key={index}>
                  {/* <td style={{ fontSize: '10px' }}>{item.itemCode}</td> */}
                  <td
                    style={{ fontSize: "10px", cursor: "pointer" }}
                    title={item.itemName}
                  >
                    {item.itemName.substring(0, 20)}
                  </td>
                  <td style={{ fontSize: "10px", textAlign: "right" }}>
                    {item.quantity}
                  </td>
                  <td style={{ fontSize: "10px", textAlign: "right" }}>
                    {moneyInTxt(item.price)}
                  </td>
                  <td style={{ fontSize: "10px", textAlign: "right" }}>
                    {moneyInTxt(item.quantity * item.price)}
                  </td>
                  <td
                    style={{
                      fontSize: "10px",
                      textAlign: "right",
                      cursor: "pointer",
                    }}
                  >
                    <GrEdit
                      color="green"
                      title="Edit"
                      style={{ marginRight: 20 }}
                      onClick={() => handleEditItem(item, index)}
                    />
                    <FaTrashAlt
                      color="darkred"
                      title="Remove"
                      onClick={() => {
                        setGridData(
                          gridData.filter(
                            (i, index) => i.itemCode !== item.itemCode
                          )
                        );
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        <div style={styles.footer}>
          <div style={styles.total}>
            <h6 style={{ padding: 0, margin: 0 }}>
              SUBTOTAL (EXCL) :{"   "}
              {moneyInTxt(
                gridData.reduce((total, item) => total + item.taxableAmount, 0)
              )}
            </h6>
            <h6 style={{ padding: 0, margin: 0 }}>
              DISCOUNT : {"   "}
              {formData?.discountType
                ? formData?.discountType === "general"
                  ? moneyInTxt(
                      gridData.reduce((total, item) => total + item.discount, 0)
                    )
                  : moneyInTxt(formData?.totalDiscount)
                : "0.00"}
            </h6>
            <h6 style={{ padding: 0, margin: 0 }}>
              NHIL ({vatAndLeviesScheme.nhilRate}%): {"   "}
              {moneyInTxt(
                gridData.reduce((total, item) => total + item.nhil, 0)
              )}
            </h6>
            <h6 style={{ padding: 0, margin: 0 }}>
              GETF ({vatAndLeviesScheme.getfundRate}%):{" "}
              {moneyInTxt(
                gridData.reduce((total, item) => total + item.getf, 0)
              )}
            </h6>
            <h6 style={{ padding: 0, margin: 0 }}>
              COVID19 ({vatAndLeviesScheme.covidRate}%):
              {moneyInTxt(
                gridData.reduce((total, item) => total + item.covid, 0)
              )}{" "}
            </h6>
            <h6 style={{ padding: 0, margin: 0 }}>
               (CST: {vatAndLeviesScheme?.cstRate}%) / (TOURISM: {vatAndLeviesScheme?.tourismRate}%):{" "}
              {moneyInTxt(
                gridData.reduce((total, item) => total + item.otherLevies, 0)
              )}{" "}
            </h6>
            <h6 style={{ padding: 0, margin: 0 }} hidden>
              TOURISM (TOURISM{vatAndLeviesScheme?.tourismRate}%):{" "}
              {moneyInTxt(
                gridData.reduce((total, item) => total + item.otherLevies, 0)
              )}{" "}
            </h6>
            <h6 style={{ padding: 0, margin: 0 }}>
              VAT ({vatAndLeviesScheme?.vatRate}%):
              {moneyInTxt(
                gridData.reduce((total, item) => total + item.vat, 0)
              )}{" "}
            </h6>{" "}
            <h6 style={{ padding: 0, margin: 0 }}>
              <hr className="my-1" />
              <strong>
                TOTAL PAYABLE
                {/* TOTAL PAYABLE{isVATinclusive ? '(INC)' : '(EXC)'}{' '} */}:{" "}
              </strong>
              {formData.currency}{" "}
              {formData?.discountType
                ? formData?.discountType === "selective"
                  ? moneyInTxt(
                      gridData.reduce(
                        (total, item) => total + item.totalPayable,
                        0
                      ) - formData?.totalDiscount
                    )
                  : moneyInTxt(formData?.totalDiscount)
                : moneyInTxt(
                    gridData.reduce(
                      (total, item) => total + item.totalPayable,
                      0
                    )
                  )}
            </h6>
          </div>
        </div>
        <div>
          <div
            className="shadow-5xl"
            style={{
              ...styles.comments,
              top: 465,
            }}
          >
            <h6>{comments || "No remarks"}</h6>
          </div>
        </div>
      </Card>

      {showUpdate && (
        <EditInvoiceItem
          updateItemData={updateItemData}
          setUpdateItemData={setUpdateItemData}
          setShowUpdate={setShowUpdate}
          gridData={gridData}
          setGridData={setGridData}
          showDiscountField={formData?.discountType}
        />
      )}
    </>
  );
}

const styles = {
  header: {
    display: "flex",
    height: "20%",
    marginBottom: 20,
  },
  bottomcomments: {
    display: "flex",
    justifyContent: "space-between",
  },
  leftHeader: {
    display: "flex",
    width: "50%",
    flexDirection: "column",
    alignItems: "flex-start",
    //border: '1px solid blue',
  },
  rightHeader: {
    display: "flex",
    width: "50%",
    flexDirection: "column",
    alignItems: "flex-end",
    //border: '1px solid green',
  },
  title: {
    height: "14%",
    backgroundColor: "#eff4fd",
    borderRadius: 10,
    padding: 10,
    marginBottom: 3,
  },
  body: {
    marginTop: 0,
    height: "280px",
    maxHeight: "280px",
    overflow: "auto",
  },
  footer: {
    display: "flex",
    marginTop: 10,
    height: "30%",
    justifyContent: "flex-end",
    //backgroundColor: 'red',
  },
  total: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingTop: 10,
    width: "50%",
    height: "100%",
    borderTop: "1px  solid #e3e3e3",
    lineHeight: 0,
  },
  comments: {
    height: 64,
    width: "47%",
    overflow: "auto",
    flexDirection: "row",
    backgroundColor: "#eff4fd",
    borderRadius: 10,
    padding: 10,
    color: "#cecece",
    position: "absolute",
    bottom: 30,
  },

  tablehead: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
};

export default InvoicePreview;
