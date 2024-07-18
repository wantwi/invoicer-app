import React from "react";
import { FaPlus } from "react-icons/fa";
import { Button, Col } from "reactstrap";

const PageHeader = ({
  color = "primary",
  setShowModal,
  showModal,
  icon,
  queryText,
  setQueryText,
  placeholder = "Search by Invoice No. or Customer name",
  btnLable = "Create Invoice",
}) => {
  return (
    <>
      <Col md={4} sm={12} className="mb-1">
        <input
          type="search"
          placeholder={placeholder}
          className="form-control form-control-sm"
          value={queryText}
          onChange={(e) => {
            setQueryText(e.target.value);
          }}
          style={{
            borderRadius: 30,
            fontSize: 12,
            padding: "10px 9px",
            fontFamily: "sans-serif",
            height: 30,
          }}
        />
      </Col>
      <Col md="6">
        <Button
          color={color}
          style={{ float: "right" }}
          onClick={(e) => setShowModal(!showModal)}
          size="sm"
        >
          {icon} {btnLable}
        </Button>
      </Col>
    </>
  );
};

export default PageHeader;
