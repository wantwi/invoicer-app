import React, { useEffect, useState, useRef } from "react";

import UserHeader from "components/Headers/UserHeader";
import {
    Button,
    Card,
    CardHeader,
    Col,
    Row,
    CardBody,
    FormGroup,
    Input,
    Modal,
    ModalBody,
    // Label,
} from "reactstrap";
import BoldReportViewer from "components/reportViewer/BoldReportViewer";

// import { CustomAxios } from "utils/CustomAxios";

import * as Yup from "yup";
import useCustomAxios from "hooks/useCustomAxios";
import DatePicker from "react-datepicker";
import { useAuth } from "hooks/useAuth";
import { MultiSelect } from "react-multi-select-component";
import { useGet } from "../hooks/useGet";
import { saveAs } from 'file-saver';
import "./report.css"
import Loader from "components/Modals/Loader"

function formatDate(date) {
  
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  // Example usage:
  const date = new Date();
  console.log(formatDate(date)); // Output: "2024-08-07" (or the current date)
  

const reportList = [
    { value: "JournalInvoiceReport", name: "Invoice Journal Report" },
    { value: "InvoicePurchaseReport", name: "Purchase Journal Report" },
    { value: "JournalRefundReport", name: "Refund Journal Report" },
    { value: "EvatDailySummaryReport", name: "EVAT Daily Summary Report" },
    // {
    //   value: "InvoiceSummaryReport",
    //   name: "Invoice Summary Report",
    // },
    {
        value: "DailySummaryReport",
        name: "Daily Summary Report",
    },
    // {
    //   value: "EvatInvoiceSummaryReport",
    //   name: "EVAT Invoice Summary Report",
    // },
    {
        value: "JournalInvoiceByCurrencyReport",
        name: "Journal Invoice By Currency Report",
    },
    // {
    //   value: "PeriodicItemReport",
    //   name: "Periodic Item Report",
    // },
];

let schemaOpt = {};
let init = {};
let schema;

function toggle(source) {
    var checkboxes = document.querySelectorAll('#check-branch"]');
    for (var i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i] != source) checkboxes[i].checked = source.checked;
    }
}

const Reports = () => {
    const CustomAxios = useCustomAxios();
    const [reportPath, setReportPath] = useState("");
    const [showReport, setShowReport] = useState(false);
    const [reportHight, setreportHight] = useState("auto");
    const [reportName, setReportName] = useState("");
    const [reportParam, setReportParam] = useState({});
    const [reportParams, setReportParams] = useState([]);
    const [reportFile, setReportFile] = useState(null);
    const [showBtn, setshowBtn] = useState(true);
    const submitBtn = useRef(null);
    const { user, getBranches } = useAuth();
    const [selectBranches, setSetselectBranches] = useState([]);
    const [reportURL, setReportURL] = useState({})
    const [dateFrom, setDateFrom] = useState("")
    const [dateTo, setDateTo] = useState("")
    const [isLoading, setisLoading] = useState(false)

    const [showReportPramasModal, setShowReportPramasModal] = useState(false);
  

    const { data: reports } = useGet("/api/GetReports", ['report-list'])
    const { data: branches } = useGet("/api/GetBranches", ['user-branch'])
    console.log({ reports });
    // useEffect(() => {
    //   toggle()

    //   return () => {
    //     second
    //   }
    // }, [third])

    console.log({ selectBranches });

    const getReportURLs = async () => {
        const { data } = await CustomAxios.get(`/api/ReportURL`)
        setReportURL(data)
    }

    const getReportParameters = async (name) => {
        let params = {};
        setReportPath(name);
        // const { data } = await CustomAxios.get(
        //   `/ReportMetadata/Get${name.slice(2)}Meta`
        // )
        const { data } = await CustomAxios.get(`/api/GetReportMeta/Get${name}Meta`);

        console.log({ GetReportMeta: data });

        let userDetails = JSON.parse(
            sessionStorage.getItem(process.env.REACT_APP_OIDC_USER)
        );

        if (data) {
            setReportParams(data);

            data.forEach((x) => {
                if (x.paramName.toLowerCase() === "userid") {
                    params[`${x.paramName}`] = user.sub;
                } else {
                    params[`${x.paramName}`] = "";
                }
            });

            // console.log({ initval: params })

            // setInitialValue(params);
            setReportParam(params);

            data.forEach((x) => {
                schemaOpt[`${x.paramName}`] =
                    x.type.toLowerCase === "date"
                        ? Yup.date().required(`${x.placeholder} is required`)
                        : x.type.toLowerCase === "number"
                            ? Yup.number().required(`${x.placeholder} is required`)
                            : Yup.string().required(`${x.placeholder} is required`);
            });

            schema = Yup.object().shape(schemaOpt);

            console.log({ datal: data });

            setReportParams(data);
        }
    };

    const handleChange = (e) => {
       // setReportParams([])
       // setSetselectBranches([])
        setReportName(e.target.value);

        //getReportParameters(e.target.value);
        e.target.value.length > 0 ? setshowBtn(true) : setshowBtn(false);

        closeModal();
    };

    const handleSubmit = async () => {

        
        try {
            setisLoading(true)
            const response = await CustomAxios.get(`/api/GetReports/${user?.sub}/${+reportName}/${formatDate(dateFrom)}/${formatDate(dateTo)}`)

            //   const pdfBlob = new Blob([response.data.data], { type: 'application/pdf' });
            //   saveAs(pdfBlob, 'downloadedFile.pdf');


            console.log({responseCode: response});
            
              
          

            // const pdfBlob = new Blob([response.data], { type: 'application/pdf' });

            // console.log({GetReprot: response?.data, pdfBlob});
            // const pdfUrl = URL.createObjectURL(pdfBlob);
            setReportFile(response?.data)
            
        } catch (error) {
            console.error({errorRes: error});
            
        }finally{
            setisLoading(false)
        }
       
        
            setShowReportPramasModal(false);
            setShowReport(true);

        // }
    };

    const closeModal = () => {
        setShowReportPramasModal(false);
        setShowReport(false);

        setreportHight("auto");
        setshowBtn(true);
    };

    const getReport = () => {
        setShowReportPramasModal(true);
        setreportHight("70vh");
        setshowBtn(false);
    };

    const handleFormChange = (e) => {
        setReportParam((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const isNotNull = () => {
        const isNull = Object.values(reportParam).filter((x) => x === "");

        return isNull.length === 0 ? true : false;
    };

    useEffect(() => {
        closeModal();
        return () => { };
    }, [reportPath]);

    useEffect(() => {
        getReportURLs()

        return () => { };
    }, []);

    console.log({ reportFile })

    return (
        <>


                {
                    isLoading && <Loader/>
                }

            <UserHeader
                message={"This is your report page. View all reports here"}
                pageName="Reports"
            />

            <div className="mt--7" style={{ width: "95%", margin: "auto" }}>
                <Row className="mt-5">
                    <Col className="mb-5 mb-xl-0" lg="12" xl="12">
                        <Card
                            className="bg-white shadow"
                            style={{ height: reportHight, overflow: "hidden" }}
                        >
                            <CardHeader
                                className="bg-secondary border-5"
                                style={{ height: 100 }}
                            >
                                <Row className="align-items-center">
                                    <Col xs="8">
                                        <Row>
                                            <Col xs="8">
                                                <h3 className="mb-2">Report</h3>
                                                <FormGroup>
                                                    <select
                                                        className="form-control font-sm"
                                                        value={reportName}
                                                        onChange={handleChange}
                                                        style={{ height: 29, padding: "0px 5px" }}
                                                    >
                                                        <option value="">Select report</option>
                                                        {reports?.map((item, i) => (
                                                            <option key={i} value={item.id}>
                                                                {item.reportDesc}
                                                            </option>
                                                        ))}
                                                    </select>
                                                   
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col className="text-right" xs="4">
                                        {showBtn ? (
                                            <Button
                                                hidden={reportName.length > 0 ? false : true}
                                                color="primary"
                                                size="sm"
                                                onClick={getReport}
                                            >
                                                Open Report
                                            </Button>
                                        ) : null}
                                    </Col>
                                </Row>
                            </CardHeader>
                            <CardBody className="mt--1">
                               
                                {showReport ? (
                                     <embed src={`data:application/pdf;base64,${reportFile}`}  width="100%" height="800"/>
                                    // <BoldReportViewer
                                    //     reportParam={{ ...reportParam, BranchCode: selectBranches.map(x => x?.value).join(",") }}
                                    //     reportPath={reportPath}
                                    //     setInitialValue={setInitialValue}
                                    //     setShowReport={setShowReport}
                                    //     reportURL={reportURL}
                                    // />
                                ) : null}
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>

            <Modal
                // style={{ width: '150%', height: '600px' }}
                className="modal-dialog-centered modal-md"
                isOpen={showReportPramasModal}
                
            >
                <div className="modal-header">
                    <h1 className="modal-title" id="exampleModalLabel">
                        Report Parameter
                    </h1>
                    <button
                        aria-label="Close"
                        className="close"
                        data-dismiss="modal"
                        type="button"
                        onClick={closeModal}
                    >
                        <span aria-hidden={true}>×</span>
                    </button>
                </div>
                <ModalBody>
                    
                    <div style={{display:"flex", flexDirection:"column", gap:20, width:"100%"}} >
                    <div >
                            <DatePicker
                                id={"dateFrom"}
                                name={"dateFrom"}
                                maxDate={new Date()}
                                placeholderText={"Start Date"}
                                className="form-control form-control-sm"
                                showIcon
                                dateFormat="yyyy/MM/dd"
                                selected={dateFrom}
                                onChange={(e) => {
                                    setDateFrom(e);
                                }}
                                style={{ height: 29, padding: "0px 5px", width:"100%" }}
                            />
                        </div>
                        <div>
                            <DatePicker
                                id={"dateTo"}
                                name={"dateTo"}
                                maxDate={new Date()}
                                placeholderText={"End Date"}
                                className="form-control form-control-sm"
                                showIcon
                                dateFormat="yyyy/MM/dd"
                                selected={dateTo}
                                onChange={(e) => {
                                    setDateTo(e);
                                }}
                                style={{ height: 29, padding: "0px 5px", width:"100%" }}
                            />
                        </div>
                    </div>
                        
                  
                    <Row className="mt-2">
                            <Col xs={6}>
                                <Button
                                    color="danger"
                                    size="sm"
                                    type="submit"
                                    onClick={closeModal}
                                    style={{ width: "100%" }}
                                >
                                    Cancel
                                </Button>
                            </Col>
                            <Col xs={6}>
                                <Button
                                    color="primary"
                                    size="sm"
                                    type="button"
                                    onClick={handleSubmit}
                                    style={{ width: "100%" }}
                                >
                                    View Report
                                </Button>
                            </Col>
                        </Row>
                </ModalBody>
            </Modal>
        </>
    );
};

export default Reports;

const styles = {
    formWrapper: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax('150px', '1fr'))",
    },
};
