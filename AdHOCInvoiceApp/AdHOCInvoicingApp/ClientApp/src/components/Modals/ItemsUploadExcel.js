import React from "react";
import { Card, CardHeader, Row, Col, CardBody, Modal } from "reactstrap";

import MyDropzone from "components/MyDropzoneItems";
import * as XLSX from "xlsx";

const ItemsUploadExcel = ({ show, setShow, setItemsList, setIsSearched }) => {
  const [uploadedData, setuploadedData] = React.useState([]);
  const [previewData, setPreviewData] = React.useState({
    SheetNames: [],
    Sheets: {},
  });
  const [metadata, setMetadata] = React.useState({
    header: 0,
    start: 0,
    end: 0,
  });
  const [disabled, setdisabled] = React.useState(true);

  React.useEffect(() => {
    // console.log('Uploaded Data', uploadedData)
    if (uploadedData.length > 0) {
      setdisabled(false);

      const reader = new FileReader();
      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = (e) => {
        // Do whatever you want with the file contents
        let data = e.target.result;
        let workbook = XLSX.read(data, {
          type: "binary",
        });

        // console.log(workbook)
        setPreviewData({
          SheetNames: workbook.SheetNames,
          Sheets: workbook.Sheets,
        });
      };
      reader.readAsArrayBuffer(uploadedData[0], "utf-8");
    }
    // console.log(previewData.Sheets)

    return () => {
      //
    };
  }, [uploadedData]);

  return (
    <div>
      <Modal className="modal-dialog-centered modal-md" isOpen={show}>
        <Card className="shadow" style={{ height: "max-content" }}>
          <CardHeader className="bg-white border-0">
            <Row className="align-items-center">
              <Col xs="8">
                <h3 className="mb-0">Drag and Drop File Here</h3>
              </Col>
              <Col xs="4">
                <button
                  aria-label="Close"
                  className="close"
                  data-dismiss="modal"
                  type="button"
                  onClick={() => setShow(false)}
                >
                  <span aria-hidden={true}>x</span>
                </button>
              </Col>
            </Row>
          </CardHeader>
          <CardBody>
            {" "}
            <MyDropzone
              setuploadedData={setuploadedData}
              previewData={previewData}
              metadata={metadata}
              setMetadata={setMetadata}
              setItemsList={setItemsList}
              setdisabled={setdisabled}
              disabled={disabled}
              setShow={setShow}
              setIsSearched={setIsSearched}
            />
          </CardBody>
        </Card>
      </Modal>
    </div>
  );
};

export default ItemsUploadExcel;
