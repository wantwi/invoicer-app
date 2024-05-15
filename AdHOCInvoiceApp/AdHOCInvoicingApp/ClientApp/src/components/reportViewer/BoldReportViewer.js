import React, { useEffect, useRef, useState } from "react";
//Report Viewer source
import "@boldreports/javascript-reporting-controls/Scripts/bold.report-viewer.min";
import "@boldreports/javascript-reporting-controls/Content/material/bold.reports.all.min.css";
//Data-Visualization
import "@boldreports/javascript-reporting-controls/Scripts/data-visualization/ej.bulletgraph.min";
import "@boldreports/javascript-reporting-controls/Scripts/data-visualization/ej.chart.min";
//Reports react base
import "@boldreports/react-reporting-components/Scripts/bold.reports.react.min";
import useAuth from "hooks/useAuth";
import useCustomAxios from "hooks/useCustomAxios";

var toolbarSettings = {
  items: ~ej.ReportViewer.ToolbarItems.Parameters,
};
const { REACT_APP_REPORTSERVERPath } = process.env;
// console.log({ REACT_APP_REPORTSERVERPath });

const BoldReportViewer = ({
  setInitialValue,
  setShowReport,
  reportParam,
  reportPath,
  reportURL
}) => {
  //<bold-report-viewer id="reportviewer1" report-service-url="../SyncReport" report-path="~/WHT/AllTransactionsReport" report-server-url="http://psl-dbserver-vm/Reports_SSRS/" processing-mode="Remote" ajax-before-load="ajaxBeforeLoad" />
  const reportviewrinstance = useRef(null);
  const auth = useAuth();
  const axios = useCustomAxios()
  const [params, setparams] = useState([]);

  console.log({ auth });




  // const getReportURLs = async () => {
  //   const { data } = await axios.get(`/api/ReportURL`)
  //   setReportURL(data)
  // }

  // var parameters = [{
  //   name: 'SalesOrderNumber',
  //   labels: ['SO50751'],
  //   values: [SO50751],
  //   nullable: false
  //   }];

  const renderD = () => {
    let arr = [];
    const obKeys = Object.keys(reportParam);
    obKeys.forEach((x) => {
      let obj = {
        name: x,
        labels: [x],
        values: [reportParam[x]],
        nullable: false,
      };

      arr.push(obj);
    });

    return arr;
  };

  // console.log({ auth })

  // useEffect(() => {
  //   getReportURLs()

  //   return () => { };
  // }, []);

  useEffect(() => {
    // dReportDateFrom
    // dReportDateFrom

    return () => {
      setInitialValue({});
      setShowReport(false);
    };
  }, [reportPath]);

  function onShowError(event) {
    alert(
      "Error code : " +
      event.errorCode +
      "\n" +
      "Error Detail : " +
      event.errorDetail +
      "\n" +
      "Error Message : " +
      event.errorMessage
    );
    event.cancel = true;
  }
  const onAjaxRequest = (args) => {
    // localStorage.removeItem("fromBold")
    // localStorage.setItem("fromBold", JSON.stringify(args))
    console.log({ args });

    args?.headerReq.push({
      key: "Authorization",
      value: `Bearer ${reportURL?.access}`,
    });

  };

  console.log({ reportviewrinstance: reportURL });

  return (

    <BoldReportViewerComponent
      id="reportviewer-container"

      reportServerUrl={reportURL?.reportServerUrl}
      reportServiceUrl={reportURL?.reportServiceUrl}
      reportPath={`${reportURL?.reportPath}${reportPath}`}
      onShowError={onShowError}
      // ajaxBeforeLoad={onAjaxRequest}

      parameters={renderD()}
      ref={reportviewrinstance}
      toolbarSettings={toolbarSettings}
      printMode={true}
    />
    // <BoldReportViewerComponent
    //   id="reportviewer-container"
    //   reportServerUrl={`http://192.168.0.71/ReportServer_SSRS/`}
    //   reportServiceUrl={`https://psl-app-vm3/evat-api-reports/api/ReportViewer`}
    //   reportPath={`/eVAT/eVAT_Report/${reportPath}`}
    //   //reportServerUrl={"/api/GetReportMeta" + reportPath}
    //   //  reportServerUrl={process.env.REACT_APP_REPORTSERVERURL}
    //   // // reportServiceUrl={"http://192.168.0.26/BReport/api/ReportViewer"}
    //   //     reportServiceUrl={process.env.REACT_APP_REPORTSERVICEURL}
    //   // reportPath={`${REACT_APP_REPORTSERVERPath}${reportPath}`}
    //   onShowError={onShowError}
    //   // ajaxBeforeLoad={onAjaxRequest}

    //   toolbarSettings={toolbarSettings}
    //   parameters={renderD()}
    //   ref={reportviewrinstance}
    //   printMode={true}
    // />
  );
};

export default BoldReportViewer;
