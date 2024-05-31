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

// const reportList = [
//     { value: "JournalInvoiceReport", name: "Invoice Journal Report" },
//     { value: "InvoicePurchaseReport", name: "Purchase Journal Report" },
//     { value: "JournalRefundReport", name: "Refund Journal Report" },
//     { value: "EvatDailySummaryReport", name: "EVAT Daily Summary Report" },
//     // {
//     //   value: "InvoiceSummaryReport",
//     //   name: "Invoice Summary Report",
//     // },
//     {
//         value: "DailySummaryReport",
//         name: "Daily Summary Report",
//     },
//     // {
//     //   value: "EvatInvoiceSummaryReport",
//     //   name: "EVAT Invoice Summary Report",
//     // },
//     {
//         value: "JournalInvoiceByCurrencyReport",
//         name: "Journal Invoice By Currency Report",
//     },
//     // {
//     //   value: "PeriodicItemReport",
//     //   name: "Periodic Item Report",
//     // },
// ];

let schemaOpt = {};
let init = {};
let schema;

function toggle(source) {
    var checkboxes = document.querySelectorAll('#check-branch"]');
    for (var i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i] != source) checkboxes[i].checked = source.checked;
    }
}

function getCurrentDateFormatted() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

const Reports = () => {
    const CustomAxios = useCustomAxios();
    const [reportPath, setReportPath] = useState("");
    const [showReport, setShowReport] = useState(false);
    const [reportHight, setreportHight] = useState("auto");
    const [reportName, setReportName] = useState("");
    const [reportParam, setReportParam] = useState({});
    const [reportParams, setReportParams] = useState([]);
    const [intialValue, setInitialValue] = useState({});
    const [showBtn, setshowBtn] = useState(true);
    const submitBtn = useRef(null);
    const { user, getBranches, branches } = useAuth();
    const [selectBranches, setSetselectBranches] = useState([]);
    const [reportURL, setReportURL] = useState({})
    const [reportList, setReportList] = useState([])

    const [showReportPramasModal, setShowReportPramasModal] = useState(false);
    console.log({ branches });

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

    const getReports = async () => {
        const { data } = await CustomAxios.get(`/api/Reports`)
        setReportList(data?.map(x => ({ value: x?.id, name: x?.reportDesc })))
    }

    const getReportParameters = async (name) => {
        let params = {};
        setReportPath(name);
        // const { data } = await CustomAxios.get(
        //   `/ReportMetadata/Get${name.slice(2)}Meta`
        // )
        const { data } = await CustomAxios.get(`/api/GetReportMeta/Get${name}Meta`);

        // console.log({ data });

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
        setReportParams([])
        setSetselectBranches([])
        setReportName(e.target.value);

        // getReportParameters(e.target.value);
        e.target.value.length > 0 ? setshowBtn(true) : setshowBtn(false);

        closeModal();
    };


    const getReportsById = async () => {
        const { data } = await CustomAxios.get(`/api/Reports/${reportName}/${getCurrentDateFormatted(reportParam?.DateFrom)}/${getCurrentDateFormatted(reportParam?.DateTo)}`)

        console.log({ getReportsById: data });
        setShowReportPramasModal(false);
        setShowReport(true);

    }


    const handleSubmit = (values) => {
        if (isNotNull()) {

            getReportsById()
        }
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
        // setshowBtn(false);
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
        getReports()
        getReportURLs()


        return () => { };
    }, []);

    // console.log({ reportURL })

    return (
        <>
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
                                                        {reportList.map((item, i) => (
                                                            <option key={i} value={item.value}>
                                                                {item.name}
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
                                    <embed />
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

                className="modal-dialog-centered"
                isOpen={showReportPramasModal}
                size="small"
            >
                <div className="modal-header">
                    <h3 className="modal-title" id="exampleModalLabel">
                        Report Parameter
                    </h3>
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

                    <div className="row">
                        <div className="col-md-6">
                            <FormGroup>

                                <div><label className="text-small" htmlFor="dateFrom">Date From</label></div>
                                <DatePicker
                                    id="dateFrom"
                                    name="DateFrom"
                                    maxDate={new Date()}
                                    placeholderText=""
                                    className="form-control form-control-sm"
                                    showIcon
                                    dateFormat="yyyy/MM/dd"
                                    selected={reportParam?.DateFrom}
                                    onChange={(e) => {
                                        setReportParam((prev) => ({
                                            ...prev,
                                            DateFrom: e,
                                        }));
                                    }}
                                    style={{ height: 29, padding: "0px 5px" }}
                                />
                            </FormGroup>
                        </div>
                        <div className="col-md-6">
                            <FormGroup>
                                <div><label htmlFor="dateFrom">Date To</label></div>
                                <DatePicker
                                    id="dateTo"
                                    name="DateTo"
                                    maxDate={new Date()}
                                    placeholderText=""
                                    className="form-control form-control-sm"
                                    showIcon
                                    dateFormat="yyyy/MM/dd"
                                    selected={reportParam?.DateTo}
                                    onChange={(e) => {
                                        setReportParam((prev) => ({
                                            ...prev,
                                            DateTo: e,
                                        }));
                                    }}
                                    style={{ height: 29, padding: "0px 5px" }}
                                />
                            </FormGroup>
                        </div>
                    </div>
                    <Row>
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
                                type="submit"
                                onClick={handleSubmit}
                                style={{ width: "100%" }}
                            >
                                View Report
                            </Button>
                        </Col>
                    </Row>

                </ModalBody>




                {/* {
                    reportParams.length > 0 ? <div className="modal-body" id="report-modal">
                        {reportParams.map((x, i) => {
                            const { type, isRequired, placeholder, value, paramName } = x;
                            return (
                                <>
                                    {
                                        <FormGroup key={`${i}__${paramName}b`}>
                                            <h3
                                                hidden={
                                                    paramName.toLowerCase() === "userid" ? true : false
                                                }
                                                className="mb-0"
                                                key={`${i}__${paramName}a`}
                                            >
                                                {placeholder}{" "}
                                            </h3>
                                            {type.toLowerCase() === "date" ? (
                                                <>
                                                    <DatePicker
                                                        id={paramName}
                                                        name={paramName}
                                                        maxDate={new Date()}
                                                        placeholderText={placeholder}
                                                        className="form-control"
                                                        showIcon
                                                        dateFormat="yyyy/MM/dd"
                                                        selected={reportParam[paramName]}
                                                        onChange={(e) => {
                                                            setReportParam((prev) => ({
                                                                ...prev,
                                                                [paramName]: e,
                                                            }));
                                                        }}
                                                        style={{ height: 29, padding: "0px 5px" }}
                                                    />
                                                </>
                                            ) : (
                                                <>
                                                    <Input
                                                        hidden={
                                                            paramName.toLowerCase() === "userid" ? true : false
                                                        }
                                                        key={`${i}_${paramName}`}
                                                        name={paramName}
                                                        id={paramName}
                                                        type={`${type.toLowerCase()}`}
                                                        placeholder={placeholder}
                                                        onChange={handleFormChange}
                                                        value={reportParam.paramName}
                                                    />
                                                </>
                                            )}
                                        </FormGroup>
                                    }
                                </>
                            );
                        })}
                        <Row>
                            <Col>
                                <h3>Branch</h3>
                                <MultiSelect
                                    options={branches.map((x) => ({
                                        label: x?.name,
                                        value: x?.code,
                                    }))}
                                    value={selectBranches}
                                    onChange={setSetselectBranches}
                                    labelledBy="Select"
                                />
                            </Col>
                        </Row>
                        <br />

                        <Row>
                            <Col xs={6}>
                                <Button
                                    color="danger"
                                    size="md"
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
                                    size="md"
                                    type="submit"
                                    onClick={handleSubmit}
                                    style={{ width: "100%" }}
                                >
                                    View Report
                                </Button>
                            </Col>
                        </Row>
                    </div> : 'Loading report parameters...'
                } */}

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
