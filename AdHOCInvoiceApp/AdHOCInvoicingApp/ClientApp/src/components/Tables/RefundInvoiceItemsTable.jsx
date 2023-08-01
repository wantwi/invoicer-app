import { Table } from "reactstrap";
import { moneyInTxt } from "components/Invoice/InvoicePreview";
import React from "react";
import { useState } from "react";
import { GrEdit } from "react-icons/gr";

export const RefundInvoiceItemsTable = ({
  invoiceItems,
  handleEditItem,
  isRefunded,
  togglePartialRefund,
}) => {
  return (
    <Table className="table-flush" responsive>
      <thead className="thead">
        <tr style={{ lineHeight: "10px" }}>
          <th scope="col" style={{ width: "10% !important" }}>
            Code
          </th>
          <th scope="col" style={{ width: "30%" }}>
            Desc
          </th>
          <th scope="col" style={{ width: "16%", textAlign: "right" }}>
            Original Qty
          </th>
          <th scope="col" style={{ width: "16%", textAlign: "right" }}>
            Available Qty
          </th>
          {/* <th scope="col" style={{ width: "15%", textAlign: "right" }}>
            Unit Price
          </th> */}
          <th scope="col" style={{ width: "15%", textAlign: "right" }}>
            Amount
          </th>
          {!isRefunded && togglePartialRefund && (
            <th scope="col" style={{ width: "11%", textAlign: "right" }}>
              Actions
            </th>
          )}
        </tr>
      </thead>
      <tbody>
        {invoiceItems.map((item, index) => (
          <tr style={{ lineHeight: "1px" }} key={index}>
            <td style={{ fontSize: "10px" }}>{item.itemCode}</td>
            <td style={{ fontSize: "10px" }}>
              {item.itemDescription.length > 20
                ? item.itemDescription.substring(0, 35) + "..."
                : item.itemDescription}
            </td>
            <td style={{ fontSize: "10px", textAlign: "right" }}>
              {item?.originalQty}
            </td>
            <td style={{ fontSize: "10px", textAlign: "right" }}>
              {item?.availableQty}
            </td>
            {/* <td style={{ fontSize: "10px", textAlign: "right" }}>
              {moneyInTxt(item.unitPrice)}
            </td> */}
            <td style={{ fontSize: "10px", textAlign: "right" }}>
              {moneyInTxt(item.price)}
            </td>
            {!isRefunded && togglePartialRefund && (
              <td
                style={{
                  fontSize: "10px",
                  textAlign: "right",
                  cursor: "pointer",
                }}
              >
                <GrEdit
                  color="darkred"
                  title="Edit"
                  style={{ marginRight: 20, cursor: "pointer" }}
                  onClick={() => {
                    handleEditItem(index);
                  }}
                />
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
