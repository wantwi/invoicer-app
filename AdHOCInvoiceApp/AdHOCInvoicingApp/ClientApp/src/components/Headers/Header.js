import React, { useEffect, useState } from "react";
import { Card, CardBody, CardTitle, Container, Row, Col } from "reactstrap";
// import { useNavigate } from "react-router-dom";
import { moneyInTxt } from "components/Invoice/InvoicePreview";
import { logout } from "services/AuthService";
import { FcMoneyTransfer, FcOvertime } from "react-icons/fc";
import { toast } from "react-toastify";

const Header = ({
  pageName = "",
  summary,
  currencyFilter,
  setCurrencyFilter,
  period,
  setPeriod,
  dayOfWeekSelRef,
  displayRecent = true,
}) => {
  let userDetails = JSON.parse(
    sessionStorage.getItem(process.env.REACT_APP_OIDC_USER)
  );

  // const history = useNavigate();
  // console.log({ history });

  const [dashboardSummary, setDashboardSummary] = useState(summary[1]);

  const handleCurrencyFilterChange = (e) => {
    setCurrencyFilter(e.target.value);
    let data = summary.find((items) => items.currency === e.target.value);
    if (data) {
      setDashboardSummary(data);
    } else {
      toast.warning("No invoices available for this currency");
    }
  };

  useEffect(() => {
    setDashboardSummary(summary[1]);
  }, []);

  useEffect(() => {
    setDashboardSummary(dashboardSummary);
    // console.log(summary)
  }, [currencyFilter]);

  return (
    <>
      <div className="header bg-gradient-info pb-5 pt-5 pt-md-5">
        <Container fluid>
          <div className="header-body">
            {/* Card stats */}

            <h2 className="mt-1 mb-1" style={{ color: "white" }}>
              {pageName}
            </h2>

            <Row>
              <Col lg="4" xl="4">
                <Card
                  className="card-stats mb-0 mb-xl-0 bg"
                  style={{ height: 60 }}
                >
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        ></CardTitle>
                        <select
                          className="form-control"
                          value={period}
                          onChange={(e) => {
                            setPeriod(e.target.value);
                            // console.log({
                            //   d: dayOfWeekSelRef.current.innerText,
                            // });
                          }}
                          ref={dayOfWeekSelRef}
                          style={{
                            height: 30,
                            fontSize: 13,
                            padding: 0,
                            paddingLeft: 8,
                          }}
                        >
                          {displayRecent && <option value={0}>Recent</option>}
                          <option value={1}>This Week</option>
                          <option value={2}>This Month</option>
                          <option value={3}>Last Month</option>
                          <option value={4}>This Year</option>
                          <option value={5}>Last Year</option>
                          <option value={6}>All Transactions</option>
                        </select>
                      </div>
                      <Col className="col-auto">
                        <div
                          className="icon icon-shape bg-info text-white rounded-circle shadow"
                          style={{ width: 40, height: 40, marginTop: -5 }}
                        >
                          <FcOvertime size="large" />
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>

              {/* <Col lg='4' xl='4'>
                <Card className='card-stats mb-4 mb-xl-0'>
                  <CardBody>
                    <Row>
                      <div className='col'>
                        <CardTitle
                          tag='h5'
                          className='text-uppercase text-muted mb-0'
                        ></CardTitle>
                        <select
                          className='form-control mb-0'
                          value={currencyFilter}
                          onChange={handleCurrencyFilterChange}
                        >
                          <option value={'GHS'}>GHS</option>
                          <option value={'USD'}>USD</option>
                          <option value={'GBP'}>GBP</option>
                          <option value={'EUR'}>EUR</option>
                        </select>
                      </div>
                      <Col className='col-auto'>
                        <div className='icon icon-shape bg-info text-white rounded-circle shadow'>
                          <FcMoneyTransfer />
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>

              <Col lg='4' xl='4'>
                <Card className='card-stats mb-4 mb-xl-0'>
                  <CardBody>
                    <Row>
                      <div className='col'>
                        <CardTitle
                          tag='h5'
                          className='text-uppercase text-muted mb-0'
                        >
                          Total Invoices
                        </CardTitle>
                        <span className='h2 font-weight-bold mb-0'>
                          {dashboardSummary?.totalNoInvoices || 0}
                        </span>
                      </div>
                      <Col className='col-auto'>
                        <div className='icon icon-shape bg-info text-white rounded-circle shadow'>
                          <i className='fas fa-users' />
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col> */}
            </Row>
            <br></br>
            {/* <Row>
              <Col lg='4' xl='4'>
                <Card className='card-stats mb-4 mb-xl-0 '>
                  <CardBody>
                    <Row>
                      <div className='col'>
                        <CardTitle
                          tag='h5'
                          className='text-uppercase text-muted mb-0'
                        >
                          Total Payable Amount
                        </CardTitle>
                        <span className='h2 font-weight-bold '>
                          {dashboardSummary?.currency}{' '}
                          {moneyInTxt(dashboardSummary?.totalSalesPayable) ||
                            0.0}
                        </span>
                      </div>
                      <Col className='col-auto '>
                        <div className='icon icon-shape bg-success text-white rounded-circle shadow'>
                          <i className='ni ni-money-coins' />
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>

              <Col lg='4' xl='4'>
                <Card className='card-stats mb-4 mb-xl-0'>
                  <CardBody>
                    <Row>
                      <div className='col'>
                        <CardTitle
                          tag='h5'
                          className='text-uppercase text-muted mb-0'
                        >
                          Total VAT Amount
                        </CardTitle>
                        <span className='h2 font-weight-bold mb-0'>
                          {dashboardSummary?.currency}{' '}
                          {moneyInTxt(dashboardSummary?.totalSalesVAT) || 0.0}{' '}
                        </span>
                      </div>
                      <Col className='col-auto'>
                        <div className='icon icon-shape bg-success text-white rounded-circle shadow'>
                          <i className='ni ni-money-coins' />
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row> */}
          </div>
        </Container>
      </div>
    </>
  );
};

export default Header;
