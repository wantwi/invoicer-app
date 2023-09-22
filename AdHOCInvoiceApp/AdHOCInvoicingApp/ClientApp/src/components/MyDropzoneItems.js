import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import "../views/App.css";
import { ToastContainer, toast } from "react-toastify";
import { FormGroup, Row, Col, Button } from "reactstrap";
import { FaCheckCircle } from "react-icons/fa";
import { useAuth } from "context/AuthContext";

function MyDropzone({
  setuploadedData,
  previewData,
  metadata,
  setMetadata,
  setItemsList,
  setShow,
  disabled,
  setIsSearched,
}) {
  const [Files, setFiles] = useState([]);
  const [sheet_Name, setSheet_Name] = useState("");
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: ".xlsx,.xls,.csv",
    maxFiles: 1,
    // validator: validateFile,
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
  });

  
  const { user } = useAuth();
  const [importedRecords, setimportedRecords] = useState([]);
  const [header, setheader] = useState(0);
  const [first, setfirst] = useState(0);
  const [last, setlast] = useState(0);
  
  React.useEffect(() => {
    setuploadedData(acceptedFiles);
  }, [acceptedFiles]);
  
  const files = acceptedFiles.map((file) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));
  console.log({importedRecords});
  
  const getSheetData = (e) => {
    setSheet_Name(e.target.value);
    let sheetName = e.target.value;
    let xdt = previewData.Sheets[sheetName];
    let xData = Object.keys(xdt).map((key) => {
      return [key, xdt[key].v];
    });
    let xCells = [],
      vCells = [],
      xRows = [],
      xColums = [],
      vCell = {};

    for (let x = 0; x < xData.length; x++) {
      if (xData[x][1]) {
        let row = xData[x][0].replace(/[^\d.]/g, "");
        xRows.push(row);

        let col = xData[x][0].replace(row, "");
        xColums.push(col);
        vCell[`${xData[x][0]}`] = xData[x][1];
        vCells.push(vCell);

        xCells.push({
          Row: row,
          Column: col,
          Cell: xData[x][0],
          Value: xData[x][1],
        });
      }
    }


    let excelSheets = [];
    excelSheets.push({
      Data: xCells,
      Cells: vCell,
      Name: sheetName,
      First: xCells[0],
      Last: xCells[xCells.length - 1],
      Rows: xRows.filter((v, i, a) => a.indexOf(v) === i),
      Columns: xColums.filter((v, i, a) => a.indexOf(v) === i),
    });

    setimportedRecords(excelSheets[0].Data);
    setlast(Number(excelSheets[0].Last.Row));
  };
  console.log({joy: importedRecords});


  const processUpload = (arr) => {
    let keys = [...new Set(arr)];
    let names = keys.filter((item) => item.Column === "A");
    let prices = keys.filter((item) => item.Column === "B");
    let descriptions = keys.filter((item) => item.Column === "C");
    let taxables = keys.filter((item) => item.Column === "D");
    let vatinclusives = keys.filter((item) => item.Column === "E");
    let currencies = keys.filter((item) => item.Column === "F");
    let CST = keys.filter((item) => item.Column === "G");

    let ItemsNameArr = [];
    let ItemsPriceArr = [];
    let ItemsDescriptionArr = [];
    let ItemsTaxableArr = [];
    let ItemsvatinclusivesArr = [];
    //let ItemstoursimlevyapplicablesArr = []
    let currenciesArr = [];
    let CSTArr = [];

    names.forEach((name) => ItemsNameArr.push(name.Value));
    prices.forEach((price) => ItemsPriceArr.push(price.Value));
    descriptions.forEach((description) =>
      ItemsDescriptionArr.push(description.Value)
    );
    taxables.forEach((taxable) => ItemsTaxableArr.push(taxable.Value));
    vatinclusives.forEach((vatinc) => ItemsvatinclusivesArr.push(vatinc.Value));
    // toursimlevyapplicables.forEach((tourism) =>
    //   ItemstoursimlevyapplicablesArr.push(tourism.Value)
    // )
    currencies.forEach((curr) => currenciesArr.push(curr.Value));
    CST.forEach((cst) => CSTArr.push(cst.Value));

    let finalData = [];
    finalData.push(
      ItemsNameArr,
      ItemsPriceArr,
      ItemsDescriptionArr,
      ItemsTaxableArr,
      ItemsvatinclusivesArr,
      // ItemstoursimlevyapplicablesArr
      currenciesArr,
      CSTArr
    );

    let postData = [];
    let res = [];

    let obj = {};
    for (let i = 1; i < last; i++) {
      finalData.map((item, ix) => {
        obj[item[0]] = item[i];
        let ob = { [item[0]]: item[i] };
        res.push(ob);
      });
      postData = [...postData, obj];

      postData.push([obj][0]);
    }
    let chunkSize = 7;
    let chunks = [];
    for (let i = 0; i < res.length; i += chunkSize) {
      const chunk = res.slice(i, i + chunkSize);
      // do whatever
      chunks.push(chunk);
    }

    let results = [];
    chunks.map((item) => {
      let newObject = {};
      item.map((value) => {
        newObject[`${Object.keys(value)}`] = `${Object.values(value)}`;
      });

      results.push(newObject);
    });

    const renderData = results.map((value) => ({
        companyId: user?.sub,
      name: value.ItemName,
      price: value.Price,
      description: value.Description,
      istaxable: value.Taxable == "Yes" ? true : false,
      isTaxInclusive: value.VATInclusive == "Yes" ? true : false,
      // hasTourismLevy: value.TourismLevyApplicable == 'Yes' ? true : false,
      otherLevies: value["CST/Toursim"],
      currencyCode: value["Currency"],
    }));

    console.log({results,renderData})
    setItemsList(renderData);
    setIsSearched(true);
  };

  const handleHeaderChange = (e) => {
    if (e.target.value <= last) {
      setheader((prev) => e.target.value);
      setfirst((prev) => Number(e.target.value) + 1);
    } else {
      setfirst(last);
    }
  };

  return (
    <>
      <ToastContainer />
      <section className="container">
        <div {...getRootProps({ className: "dropzone" })}>
          <input
            {...getInputProps()}
            onDrop={() => console.log(acceptedFiles)}
          />
          {/* <p>Drag 'n' drop some files here, or click to select files</p> */}
          <p style={{ margin: 20 }}>Click here to select file</p>
        </div>
        <aside>
          <h4>Files</h4>
          <ul style={{ color: "green" }}>{files}</ul>
        </aside>
        <div>
          <Row>
            <Col lg="12">
              <FormGroup>
                <label className="form-control-label" htmlFor="input-email">
                  Sheet Name
                </label>
                <code style={{ color: "darkred" }}>*</code>
                <select
                  className="form-control"
                  value={sheet_Name}
                  onChange={(e) => getSheetData(e)}
                >
                  <option>Select Sheet</option>
                  {previewData.SheetNames.map((sheetname, index) => (
                    <option key={index}>{sheetname}</option>
                  ))}
                </select>
              </FormGroup>
            </Col>
          </Row>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <p>
            {acceptedFiles.length > 0 ? (
              <>
                <span>File attached </span>
                <FaCheckCircle color={"green"} />
              </>
            ) : null}
          </p>
          <Button
            disabled={sheet_Name.length === 0 ? true : false}
            color="primary"
            onClick={() => {
              setShow(false);
              processUpload(importedRecords);
            }}
          >
            Upload
          </Button>
        </div>
      </section>
    </>
  );
}

export default MyDropzone;
