import {
  Card,
  CardHeader,
  Container,
  Row,
  Col,
  CardBody,
  FormGroup,
  Input,
} from "reactstrap";

import UserHeader from "components/Headers/UserHeader";
import { useEffect, useState } from "react";
import moment from "moment";
import { Modal, Button } from "reactstrap";
import { useCustomQuery } from "hooks/useCustomQuery"
import Fallback from "components/Fallback"
import { ErrorBoundary } from "react-error-boundary"

const Dashboard = () => {
  const [period, setPeriod] = useState("today");
  const [from, setfrom] = useState("");
  const [to, setTo] = useState("");

    const [isCustom, setIsCustom] = useState(false);
    const { data="" } = useCustomQuery("/api/GetDashboard")
    console.log({ data })

  const handleSubmit = ({ from, to }) => {
    setfrom(from);
    setTo(to);
    setIsCustom(false);
    };

    const errorHandler = (error, errorInfo) => {
        console.log("Logging", error, errorInfo)
    }


  useEffect(() => {
    let temp = null;
    switch (period) {
      case "all":
        temp = new Date("2021-11-01").toLocaleDateString();
        temp = moment(temp).format("YYYY-MM-DD");
        setfrom(temp);
        break;
      case "custom":
        setIsCustom(true);
        break;

      default:
        temp = new Date(moment().startOf(period)).toLocaleDateString();
        temp = moment(temp).format("YYYY-MM-DD");
        setfrom(temp);

        temp = new Date(moment().startOf("day")).toLocaleDateString();
        temp = moment(temp).format("YYYY-MM-DD");
        setTo(temp);
        break;
    }

    return () => {};
  }, [period]);

  return (
    <>
          <ErrorBoundary FallbackComponent={Fallback} onError={errorHandler}>
      <UserHeader message={"Dashboard"} />
      {isCustom && (
        <CustomDateFormModal
          handleSubmit={handleSubmit}
          setIsCustom={setIsCustom}
        />
      )}
      <Container className="mt--7" fluid>
        <Row className="mt-5">
          <Col className="mb-5 mb-xl-0" xl="12">
            <Card className="shadow">
              <CardHeader className="border-0">
                <div
                  calssname="filterCard"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "19px",
                    height: "43px",
                    paddingRight: "20px",
                  }}
                >
                  <span>Business&nbsp;Insights</span>
                  
                </div>
              </CardHeader>
              {data && <EmbededDashboard from={from} to={to} companyId={data} />}
            </Card>
          </Col>
        </Row>
              </Container>
          </ErrorBoundary >
    </>
  );
};

const EmbededDashboard = ({ from, to, companyId }) => {
    const dashboardUrl = "https://reports.cimsgh.com/bi/site/newsite2/dashboards/d3624c35-3aa3-45a1-bbfc-15efadd916be/Sales/Dashboard?isembed=true&hide_tool=dp&export=true%27&CompanyId=B129E013-19C5-485D-B2B8-6334B68E55E2"
    return (
    <>
      <CardBody>
        <iframe
                    src={`${dashboardUrl}&CompanyId=${companyId}&FromDate=${from}&ToDate=${to}`}
          id="dashboard-frame"
          width="100%"
          height="900px"
          allowFullScreen
          frameBorder="0"
        ></iframe>
      </CardBody>
    </>
  );
};

const CustomDateFormModal = ({ setIsCustom, handleSubmit }) => {
  const [selDate, setselDate] = useState({
    from: "",
    to: "",
  });
  return (
    <Modal
      className="modal-dialog-centered modal-md"
      isOpen={true}
      style={{ width: "fit-content" }}
    >
      <div className="modal-header">
        <h1 className="modal-title" id="exampleModalLabel">
          Dashboard Parameter
        </h1>
        <button
          aria-label="Close"
          className="close"
          data-dismiss="modal"
          type="button"
          onClick={() => setIsCustom(false)}
        >
          <span aria-hidden={true}>×</span>
        </button>
      </div>
      <div className="modal-body">
        <FormGroup>
          <h3 className="mb-0">Date From</h3>
          <Input
            type={`date`}
            onChange={(e) =>
              setselDate((prev) => {
                return { ...prev, from: e.target.value };
              })
            }
            value={selDate.from}
          />
        </FormGroup>
        <FormGroup>
          <h3 className="mb-0">Date To</h3>
          <Input
            type={`date`}
            onChange={(e) =>
              setselDate((prev) => {
                return { ...prev, to: e.target.value };
              })
            }
            value={selDate.to}
          />
        </FormGroup>
        <Row>
          <Col xs={6}>
            <Button
              color="danger"
              size="md"
              type="submit"
              onClick={() => setIsCustom(false)}
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
              onClick={() => handleSubmit(selDate)}
              style={{ width: "100%" }}
            >
              View Report
            </Button>
          </Col>
        </Row>
      </div>
    </Modal>
  );
};

export default Dashboard;
