import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import "../views/App.css";
import { ToastContainer, toast } from "react-toastify";
import { FormGroup, Row, Col, Button } from "reactstrap";
import { FaCheckCircle } from "react-icons/fa";

function MyDropzone({
  setuploadedData,
  previewData,
  metadata,
  setMetadata,
  setCustomerList,
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

  const [importedRecords, setimportedRecords] = useState([]);
  const [header, setheader] = useState(0);
  const [first, setfirst] = useState(0);
  const [last, setlast] = useState(0);

  React.useEffect(() => {
    setuploadedData(acceptedFiles);
  }, [acceptedFiles]);

  React.useEffect(() => {
    // console.log('header:', header)
    // console.log('start', first)
    // console.log('end:', last)
  }, [header]);

  const files = acceptedFiles.map((file) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  const getSheetData = (e) => {
    setSheet_Name(e.target.value);
    let sheetName = e.target.value;
    let xdt = previewData.Sheets[sheetName];
    let xData = Object.keys(xdt).map((key) => {
      return [key, xdt[key].v];
    });
    // console.log(xData)

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

    // setheaderrow([...new Set(xRows)])
    // setStartRowIndices([...new Set(xRows)])
    // setEndRows([...new Set(xRows)])

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
    console.log(excelSheets[0]);
    setlast(Number(excelSheets[0].Last.Row));
  };

  const processUpload = () => {
    let arr = importedRecords;
    let keys = [...new Set(arr)];
    let names = keys.filter((item) => item.Column === "A");
    let ghanacard = keys.filter((item) => item.Column === "B");
    let email = keys.filter((item) => item.Column === "C");
    let tel = keys.filter((item) => item.Column === "D");
    let address = keys.filter((item) => item.Column === "E");
    let city = keys.filter((item) => item.Column === "F");
    let gps = keys.filter((item) => item.Column === "G");
    let type = keys.filter((item) => item.Column === "H");

    let customerNameArr = [];
    let customerTinArr = [];
    let customerEmailArr = [];
    let customerTelArr = [];
    let addressArr = [];
    let cityArr = [];
    let ghPostGpsArr = [];
    let typeArr = [];

    names.forEach((name) => customerNameArr.push(name.Value));
    ghanacard.forEach((card) => customerTinArr.push(card.Value));
    email.forEach((email) => customerEmailArr.push(email.Value));
    tel.forEach((tel) => customerTelArr.push(tel.Value));
    address.forEach((address) => addressArr.push(address.Value));
    city.forEach((city) => cityArr.push(city.Value));
    gps.forEach((gps) => ghPostGpsArr.push(gps.Value));
    type.forEach((bustype) => typeArr.push(bustype.Value));

    let finalData = [];
    finalData.push(
      customerNameArr,
      customerTinArr,
      customerEmailArr,
      customerTelArr,
      addressArr,
      cityArr,
      ghPostGpsArr,
      typeArr
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
    let chunkSize = 8;
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
      // console.log(results)
    });

    let userDetails = JSON.parse(
      sessionStorage.getItem(process.env.REACT_APP_OIDC_USER)
    );

    const renderData = results.map((value) => ({
      customerTin: value.GhanaCardTIN,
      customerName: value.Name,
      type: value.TypeOfBusinessPartner.substr(0, 3).toUpperCase() || "CUS",
      customerTel: value.Phone,
      customerEmail: value.Email,
      ghPostGps: value.GhanaPost,
      city: value.City,
      address: value.Address,
      digitalAddress: value.GhanaPost,
    }));

    setCustomerList(renderData);
    setIsSearched(true);
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
                  <option value="">Select Sheet</option>
                  {previewData.SheetNames.map((sheetname, index) => (
                    <option key={index}>{sheetname}</option>
                  ))}
                </select>
              </FormGroup>
            </Col>
          </Row>

          {/* <Row>
            <Col lg='4'>
              <FormGroup>
                <label className='form-control-label' htmlFor='input-email'>
                  Header Row
                </label>
                <select
                  className='form-control'
                  value={header}
                  onChange={(e) => handleHeaderChange(e)}
                >
                  <option>Select</option>
                  {headerrow.map((row) => (
                    <option key={row}>{row} </option>
                  ))}
                </select>
              </FormGroup>
            </Col>
            <Col lg='4'>
              <FormGroup>
                <label className='form-control-label' htmlFor='input-email'>
                  Start Row
                </label>
                <select
                  className='form-control'
                  value={metadata.start}
                  onChange={(e) =>
                    setMetadata({ ...metadata, start: Number(e.target.value) })
                  }
                >
                  <option>Select </option>
                  {startrows.map((row) => (
                    <option key={row}>{row} </option>
                  ))}
                </select>
              </FormGroup>
            </Col>
            <Col lg='4'>
              <FormGroup>
                <label className='form-control-label' htmlFor='input-email'>
                  End Row
                </label>
                <select
                  className='form-control'
                  value={metadata.end}
                  onChange={(e) =>
                    setMetadata({ ...metadata, end: Number(e.target.value) })
                  }
                >
                  <option>Select </option>
                  {endRows.map((row) => (
                    <option key={row}>{row} </option>
                  ))}
                </select>
              </FormGroup>
            </Col>
          </Row> */}
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
              processUpload();
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
