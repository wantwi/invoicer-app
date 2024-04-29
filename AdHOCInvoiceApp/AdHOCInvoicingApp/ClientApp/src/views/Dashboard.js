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
import useCustomAxios from "hooks/useCustomAxios";
import Loader from "components/Modals/Loader";
import { useAuth } from "context/AuthContext";

function getCurrentMonthDates() {
    // Get current date
    var currentDate = new Date();

    // Get year and month
    var year = currentDate.getFullYear();
    var month = currentDate.getMonth() + 1; // Months are zero indexed

    // Format month and day to have leading zeros if necessary
    var formattedMonth = month < 10 ? '0' + month : month;

    // Get the first day of the current month
    var firstDay = year + '-' + formattedMonth + '-01';

    // Get the last day of the current month
    var lastDay = new Date(year, month, 0).toISOString().split('T')[0];

    return {
        firstDay: firstDay,
        lastDay: lastDay
    };
}

const BRANCH_INFO = JSON.parse(sessionStorage.getItem("BRANCH_INFO"))
const Dashboard = () => {
  const axios = useCustomAxios()
  const { user } = useAuth()
  const [period, setPeriod] = useState("today");
  const [from, setfrom] = useState("");
  const [to, setTo] = useState("");
  const [isLoading, setisLoading] = useState(false)
  const [userAccount, setuserAccount] = useState({ companyName: "", sub: "", tin: "" })
  const [url, seturl] = useState("")

  const [isCustom, setIsCustom] = useState(false);
  const { data = "" } = useCustomQuery("/api/GetDashboard")
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

    return () => { };
  }, [period]);

  const getUserInfo = async () => {
    setisLoading(true)

    try {
      const request = await axios.get("/api/UserInfo")
      console.log({ request });
      setuserAccount(request?.data?.user)
      seturl(request?.data?.path)
    } catch (error) {

    } finally {
      setisLoading(false)
    }

  }

  useEffect(() => {

    getUserInfo()

    return () => { }
  }, [])


    console.log({ user, userAccount });



  return (
    <>
      {isLoading ? <Loader /> : null}
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
                              {data && <EmbededDashboard url={url} from={getCurrentMonthDates()?.firstDay} to={getCurrentMonthDates()?.lastDay} companyId={userAccount?.sub} />}
              </Card>
            </Col>
          </Row>
        </Container>
      </ErrorBoundary >
    </>
  );
};

console.log({ BRANCH_INFO });

const EmbededDashboard = ({ url, from, to, companyId }) => {
  return (
    <>
      <CardBody>
        <iframe
          src={`${url}CompanyId=${companyId}&FromDate=${from}&ToDate=${to}&Br_ch=${BRANCH_INFO?.code || ""}`}
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
