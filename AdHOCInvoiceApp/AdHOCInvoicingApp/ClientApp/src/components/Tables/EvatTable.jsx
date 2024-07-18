import { Table } from "reactstrap";
import { moneyInTxt } from "components/Invoice/InvoicePreview";
import React from "react";
import { usePagination, useTable, useSortBy } from "react-table";
import Loader from "components/Modals/Loader";
import { CircularProgress } from "@mui/material";

export const EvatTable = ({
  columns=[],
  data =[],
  isLoading,
  setSelectedRow,
  getPrintPDF = () => null,
  sortKey,
  message,
  tablesm=""
}) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    footerGroups,
    page,
  } = useTable(
    {
      columns,
      data,
      initialState: {
        pageIndex: 0,
        sortBy: [
          {
            id: sortKey || "",
            desc: true,
          },
        ],
      },
      defaultColumn: {
        width: "auto",
        maxWidth: 150,
      },
    },
    useSortBy,
    usePagination
  );
  return (
    <>
    
     <div id="evat-table-wrapper" style={{ position: "relative" }}>
      <>
      {isLoading && (
       
       <div
       style={{
         display: "flex",
         flexDirection: "column",
         justifyContent: "center",
         alignItems: "center",
         position: "absolute",
         width: "100%",
         height: "100%",
         top: 0,
        
         placeContent: "center",
         zIndex: 9999999,
         background: "#000",
         opacity: 0.6,
         color: "#fff",
       }}
     >
      
      <CircularProgress size={30} />
      
     </div>
    
   )}
     
      </>
      
      <p
        id="table-info"
        className="text-info text-center"
        style={{ zIndex: "1000", marginTop: "190px" }}
      >
        {message}
      </p>

      <div style={{ position: "relative", lineHeight: 1, height: "520px" }}>
        <Table
          {...getTableProps()}
          className={`align-items-center table-flush ${tablesm} `}
          id="index-table"
          responsive
        >
          <thead className="thead-light">
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    className="thead-light"
                    style={{ ...column.getHeaderProps.style }}
                    {...column.getHeaderProps({
                      ...column.getSortByToggleProps(),
                      style: { width: column.width },
                    })}
                  >
                    {column.render("Header")}
                    <span className="">
                      {column.isSorted
                        ? column.isSortedDesc
                          ? " 🔽"
                          : " 🔼"
                        : ""}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody {...getTableBodyProps()} style={{ lineHeight: 0.5 }}>
            {page.map((row, i) => {
              prepareRow(row);
              return (
                <tr
                  {...row.getRowProps()}
                  className="table-record"
                  //onClick={() => console.log({row})}
                  // onClick={() => setSelectedRow(row?.original?.id)}
                 // onClick={() =>  getPrintPDF(row?.original?.id)}
                >
                  {row.cells.map((cell) => {
                    return (
                      <td
                        // className="px-6 align-middle border-l-0 border-r-0 text-base whitespace-nowrap"
                        {...cell.getCellProps({
                          className: cell.column.className,
                          style: { width: cell.column.width },
                        })}
                      >
                        {cell.render("Cell")}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>

          <tfoot>
            {footerGroups.map((group) => (
              <tr
                className="bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                {...group.getFooterGroupProps()}
              >
                {group.headers.map((column) => (
                  <td
                    className="border-t-0 px-6 align-middle text-right border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
                    {...column.getFooterProps()}
                  >
                    {column.Footer && column.render("Footer")}
                  </td>
                ))}
              </tr>
            ))}
          </tfoot>
        </Table>
      </div>
    </div>
    </>
  
  );
};
