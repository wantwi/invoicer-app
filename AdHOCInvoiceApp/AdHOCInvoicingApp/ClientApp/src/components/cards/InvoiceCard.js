import React from "react";
import { Card, CardBody, CardTitle, Row, Col, Button } from "reactstrap";
import invoiceIcon from "../../assets/img/theme/invoice.png";
import "../../views/App.css";
import { FaEye } from "react-icons/fa";
const InvoiceCard = ({ item }) => {
  return (
    <div>
      <Card className="refund" style={styles.body}>
        <CardBody>
          <Row>
            <div className="col">
              <CardTitle tag="h5" className="text-uppercase text-muted mb-5">
                Invoice # {item.invoiceNo}
              </CardTitle>
            </div>
            <Col className="col-auto">
              <Button title={"View Invoice Details"} onClick={() => null}>
                <FaEye color={"green"} />
              </Button>
            </Col>
          </Row>
          <Row>
            <Col className="col-auto">
              <img src={invoiceIcon} style={{ height: 100 }} />
            </Col>
            <Col>
              <>{item.customerName}</>

              <br />
              <h2>GHS {item.totalVat}</h2>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </div>
  );
};

export default InvoiceCard;

const styles = {
  body: {
    height: 220,
    backgroundColor: "#f1f1f1",
  },
};
