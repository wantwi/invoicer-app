import React, { useState, useEffect } from "react";
import {
  Button,
  Table,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Row,
  Col,
  CardFooter,
} from "reactstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "components/Modals/Loader";
import UserHeader from "components/Headers/UserHeader";
import { FcCancel } from "react-icons/fc";
import UploadExcel from "components/Modals/UploadExcel";
 import excelFile from "../assets/GRA_INVOICER_BUSINESS_PARTNERS.xlsx";
import { GrEdit, GrClose } from "react-icons/gr";
import { useRef } from "react";
import { debounce } from "lodash";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FaCircle } from "react-icons/fa";
import DeletePromptCustomer from "components/Modals/DeletePromptCustomer";
import ErrorBoundary from "components/ErrorBoundary";
import { useCustomQuery } from "hooks/useCustomQuery";
import { useDebounce } from "use-debounce";
import { useCustomPost } from "hooks/useCustomPost";
import { useCustomPut } from "hooks/useCustomPut";
import { useAuth } from "context/AuthContext";

const Customers = () => {
    const { getUser, user, logout, selectedBranch } = useAuth();

  // const [formData, setFormData] = React.useState({
  //   companyId: userDetails.profile.company,
  //   customerName: '',
  //   customerTin: '',
  //   customerEmail: '',
  //   customerPhone: '',
  //   customerAddress: '',
  //   customerCity: '',
  //   customerDigitalAddress: '',
  // })

  const formik = useFormik({
    initialValues: {
          companyId: user?.sub,
      customerName: "",
      customerTin: "",
      customerEmail: "",
      customerPhone: "",
      customerAddress: "",
      customerCity: "",
      customerDigitalAddress: "",
      customerType: "CUS",
    },
    validationSchema: Yup.object({
      customerName: Yup.string().required("Required"),
      customerTin: Yup.string()
        .required("Required")
        .nullable()
        .min(11, "Must be 11  or 15 characters")
        .max(15, "Must be 11  or 15 characters"),
      customerEmail: Yup.string()
        .email("Invalid email address")
        .nullable()
        .required("Required"),
      customerPhone: Yup.string()
        .required("Required")
        .matches(
          /(\+\d{1,3}\s?)?((\(\d{3}\)\s?)|(\d{3})(\s|-?))(\d{3}(\s|-?))(\d{4})(\s?(([E|e]xt[:|.|]?)|x|X)(\s?\d+))?/g,
          "not a valid phone number"
        ),
    }),

    onSubmit: (values) => {
      //console.log(values)
      handleSaveOrUpdate(values);
    },
  });
  const [customerList, setCustomerList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [isViewMode, setIsviewMode] = useState(false);
  const [showBulkListButt, setshowBulkListButt] = useState(false);
  //const [loggedInUser, setLoggedInUser] = React.useState(null)
  const [itemSelected, setitemSelected] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const [invoiceQuery, setinvoiceQuery] = useState("");
  const [isSearched, setIsSearched] = useState(false);
  const [businessPartnerType, setBusinessPartnerType] =
    useState("Customers List");
  const [status, setStatus] = useState(true);
  const [showPrompt, setShowPrompt] = useState(false);
  const [customerToDelete, setcustomerToDelete] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [value] = useDebounce(invoiceQuery, 500);
  const [value_sup] = useDebounce(searchText, 500);
  const [isViewed_cus, setIsViewed_cus] = useState(false);
  const [isCustomers, setIsCustomer] = useState(true);
  const [isViewed, setIsViewed] = useState(false);
  const [isViewed_sup, setIsViewed_sup] = useState(false);
  const [cusType, setcusType] = useState("CUS");

  const customerRef = useRef();
    const clearBtn = useRef(null);

  const onSuccess = (data) => {
    if (isCustomers) {
      setIsViewed(true);
      setIsViewed_sup(false);
    } else {
      setIsViewed(false);
      setIsViewed_sup(true);
    }
      setLoading(false);

    let allCustomers = data.map((customer) => {
      return {
        customerID: customer.id,
        customerName: customer.name,
        customerTin: customer.tin,
        customerEmail: customer.email,
        customerPhone: customer.telephone,
        customerAddress: customer.address,
        customerCity: customer.city,
        customerDigitalAddress: customer.digitalAddress,
        type: customer.type,
        status: customer.status || "A",
        hasTrans: customer.hasTrans || false,
      };
    });
    // console.log(allCustomers)
    if (allCustomers.length < 1) {
      setLoading(false);
      setCustomerList([]);
      // toast.warning('You dont have any customers on your list yet')
    } else {
      setLoading(false);
      setIsSearched(true);
      setCustomerList(allCustomers);
    }
  };

    const { refetch: getCustomerList, isLoading } = useCustomQuery(
      !value ? `/api/GetCompanyCustomerslist/${selectedBranch?.code}` : `/api/GetCompanyCustomers/${value}/${selectedBranch?.code}`,
    "customers",
    value,
    onSuccess,
    (err) => {
      setLoading(false);
      toast.warning("You have no products/services saved yet");
    },
    { isEnabled: false, queryTag: "?search=" }
  );

    const { refetch: getSupplierList, isLoading:isLoadingSuppliers } = useCustomQuery(
        !value_sup ? `/api/GetCompanySupplierslist/${selectedBranch?.code}` : `/api/GetCompanySuppliers/${value_sup}/${selectedBranch?.code}`,
    "suppliers",
    value_sup,
    onSuccess,
    (err) => {
      setLoading(false);
      toast.warning("You have no products/services saved yet");
    },
    { isEnabled: false, queryTag: "?search=" }
  );

  const handleGetCustomer = () => {
    setinvoiceQuery("");
    setSearchText("");
    setBusinessPartnerType("Customers List");
    setIsCustomer(true);
    setLoading(true);
    setIsviewMode(!isViewMode);
    getCustomerList();
    setshowBulkListButt(()=>false);
  };

  const handleGetSupplier = () => {
    setBusinessPartnerType("Suppliers List");
    setinvoiceQuery("");
    setSearchText("");
    setIsCustomer(false);
    setLoading(true);
    setIsviewMode(!isViewMode);
    getSupplierList();
    setshowBulkListButt(()=>false);
  };

  const handleOnchange = (e) => {
    setIsFocus(true);

    if (isCustomers) {
      setinvoiceQuery(e.target.value);
      setSearchText("");
    } else {
      setSearchText(e.target.value);
      setinvoiceQuery("");
    }

    // isCustomers ? setinvoiceQuery(e.target.value): searchText(e.target.value)
  };

  useEffect(() => {
    if (value_sup.length > 1) {
      getSupplierList();
    }
    if (searchText.length === 0 && isViewed_sup) {
      getSupplierList();
    }
  }, [value_sup, searchText]);

  useEffect(() => {
    if (value.length > 1) {
      getCustomerList();
    }
    if (invoiceQuery.length === 0 && isViewed) {
      getCustomerList();
    }
  }, [value, invoiceQuery]);

  const postSuccess = () => {
    setLoading(false);
      setshowBulkListButt(()=>false)

    if (cusType === "SUP") {
      toast.success("Supplier successfully saved");
      setSearchText(formik?.values?.customerName);
    } else {
      toast.success("Customer successfully saved");
      setinvoiceQuery(formik?.values?.customerName);
    }
      formik.resetForm();
  };
    const postError = (err) => {
        console.log({err})
            toast.error(
                err?.response?.Message || "Error creating customer"
        );
        setLoading(false)

    
    };

    const putError = (err) => {
        console.log({err})
            toast.error(
                err?.response?.Message || "Error updating customer"
            );
        setLoading(false)
    };

  const putSuccess = (data) => {
    setLoading(false);
      setshowBulkListButt(false)
    formik.resetForm();

    if (cusType === "SUP") {
      toast.success("Supplier successfully saved");
      setSearchText(formik?.values?.customerName);
    } else {
      toast.success("Customer successfully saved");
      setinvoiceQuery(formik?.values?.customerName);
      }
    setitemSelected(false);
  };

    const { mutate, isLoading:isPostingLoad, isSuccess } = useCustomPost(
      `/api/CreateCustomer`,
    value,
    postSuccess,
    postError
    );
    console.log({ isSuccess })

    const { mutate: putmutate, isLoading: isPutLoading } = useCustomPut(
      `/api/UpdateCreateCustomer/${formik?.values?.customerID}`,
    value_sup,
    putSuccess,
        putError
  );

  const saveCustomer = (customer) => {
    customer = formik.values;

    if (
      !customer.customerName ||
      !customer.customerTin ||
      !customer.customerPhone
    ) {
      toast.warning("Please fill all necessary information");
    } else {
      let newList = [customer];

      /*post data */
      let postData = newList.map((customer) => {
        return {
          companyId: customer.companyId,
          customerTin: customer.customerTin,
          customerName: customer.customerName,
          type: customer.customerType,
          customerTel: customer.customerPhone,
          customerEmail: customer.customerEmail,
          ghPostGps: customer.customerDigitalAddress,
          city: customer.customerCity,
          address: customer.customerAddress,
          digitalAddress: customer.customerDigitalAddress,
          branchCode:selectedBranch?.code
        };
      });

      setcusType(postData[0]?.type);
      mutate(postData);
      setLoading(true);
    }
  };

  const updateCustomer = (customer) => {
    customer = formik.values;
    let postData = {
      id: customer.customerID,
      tin: customer.customerTin,
      name: customer.customerName,
      email: customer.customerEmail,
      telephone: customer.customerPhone,
      digitalAddress: customer.customerDigitalAddress,
      city: customer.customerCity,
      address: customer.customerAddress,
      contactPersonName: "",
      contactPersonPhone: "",
      contactPersonPosition: "",
      status: status ? "A" : "I",
      type: customer.type,
    };

    setcusType(postData?.type);
    setLoading(true);
    putmutate(postData);
  };

  const handleSaveOrUpdate = () => {
    itemSelected ? updateCustomer(formik) : saveCustomer(formik);
  };

  const handleEditCustomer = (customer) => {
    if (customer.customerAddress == null) {
      customer = { ...customer, customerAddress: "" };
    }
    if (customer.customerDigitalAddress == null) {
      customer = { ...customer, customerDigitalAddress: "" };
    }
    if (customer.customerCity == null) {
      customer = { ...customer, customerCity: "" };
    }
    if (customer.customerPhone == null) {
      customer = { ...customer, customerPhone: "" };
    }
    if (customer.status === "A") {
      setStatus(true);
    } else if (customer.status !== "A") {
      setStatus(false);
    }

    formik.setValues(customer);
    setitemSelected(true);
  };

  const handleDeleteCustomer = (item) => {
    console.log(item);
    setcustomerToDelete(item);
    setShowPrompt(true);
  };

  const { mutate: bultData } = useCustomPost(
    `/api/CreateCustomer`,
    "",
    () => {
      setLoading(false);
      toast.success("Customer List successfully Added");
      setLoading(false);
      setCustomerList([]);
        getCustomerList();
        setshowBulkListButt(false)
    },
    (err) => {
      toast.error("Could not submit list. Please try again.");
      setLoading(false);
    }
  );

  const submitCustomerList = () => {
    setLoading(true);
    bultData(customerList);
    
  };

    useEffect(() => {
        //console.log("kl", formik.values?.customerTin?.length)
        //if (
        //    formik.values.customerTin?.length !== 11 ||
        //    formik.values.customerTin?.length == 15
        //) {
        //    formik.errors.customerTin = "Must be 11 or 15 characters";
        //} else {
        //    formik.errors.cusromerTin = ""
        //}
    }, [formik]);

    console.log(showBulkListButt)
  return (
    <>
      <UserHeader
        message={
          "This is your customer setup page. Manage your client list here"
        }
        pageName="Business Partner Setup"
      />
      <ToastContainer />
      <ErrorBoundary>
        <Container className="mt--7" fluid>
          <Row className="mt-5">
            {customerList && isSearched && (
              <Col className="order-xl-2 mb-5 mb-xl-0" xs="7" lg="7" xl="7">
                <Card className="shadow" style={{ height: 619 }}>
                  <CardHeader className="bg-white border-0">
                    <Row className="align-items-center">
                      <Col xs="4">
                                              {showBulkListButt ?
                                                  <Col
                                                  lg="12"
                                                  className="text-align"
                                                  style={{
                                                      display: "flex",
                                                      // flexDirection: 'row-reverse',
                                                  }}
                                              >

                                                  <Button
                                                      color="success"
                                                      onClick={submitCustomerList}
                                                      size="md"
                                                  >
                                                      Submit Bulk List
                                                  </Button>
                                              </Col>
                                              :
                                                  <Form
                                                      className="navbar-search navbar-search-light form-inline "
                                                      onSubmit={(e) => e.preventDefault()}
                                                  >
                                                      <FormGroup className="mb-0">
                                                          <InputGroup className="input-group-alternative">
                                                              <InputGroupAddon
                                                                  addonType="prepend"
                                                                  style={{ marginTop: 8 }}
                                                              >
                                                                  <InputGroupText>
                                                                      <i className="fas fa-search" />
                                                                  </InputGroupText>
                                                              </InputGroupAddon>
                                                              <Input
                                                                  placeholder="Search..."
                                                                  type="text"
                                                                  value={invoiceQuery || searchText}
                                                                  onChange={handleOnchange}
                                                                  style={{ width: 300 }}
                                                              />
                                                              <InputGroupAddon addonType="append">
                                                                  <InputGroupText
                                                                      onClick={() => setinvoiceQuery("")}
                                                                  >
                                                                      {isFocus && <i className="fas fa-times" />}
                                                                  </InputGroupText>
                                                              </InputGroupAddon>
                                                          </InputGroup>
                                                      </FormGroup>
                                                  </Form>
                                              }
                        
                      </Col>
                      <Col className="text-right" xs="8">
                        {/* {isViewMode && ( */}
                        <Button
                          onClick={() => {
                            setshowBulkListButt(false);
                            setIsviewMode(!isViewMode);
                            setCustomerList([]);
                            setIsSearched(false);
                            formik.resetForm();
                            setitemSelected(false);
                          }}
                          size="sm"
                        >
                          <GrClose />
                        </Button>
                        {/* )} */}
                      </Col>
                    </Row>
                  </CardHeader>
                  <CardBody style={styles.body}>
                                      <h3 className="pb-1">{businessPartnerType}</h3>

                    <Table
                      className="align-items-center  table-flush"
                      responsive
                    >
                      <thead className="thead-light">
                        <tr>
                          <th style={{ width: "30%" }} scope="col">
                            Name
                          </th>
                          <th style={{ width: "25%" }} scope="col">
                            Ghana Card/TIN
                          </th>
                          <th style={{ width: "25%" }} scope="col">
                            Email Address
                          </th>
                                                  {!showBulkListButt &&
                                                      <th
                                                          style={{ textAlign: "right", width: "10%" }}
                                                          scope="col"
                                                      >
                                                          Actions
                                                      </th>}
                        </tr>
                      </thead>
                      <tbody>
                        {customerList.map((customer, key) => (
                          <tr
                            style={{
                              cursor: "pointer",
                              lineHeight: 0,
                            }}
                            key={key}
                            ref={customerRef}
                          >
                            <td onClick={() => handleEditCustomer(customer)}>
                              {customer?.customerName}
                            </td>
                            <td>{customer?.customerTin}</td>
                                <td>{customer?.customerEmail}</td>
                                {( !showBulkListButt) && (
                              <td
                                style={{
                                  textAlign: "right",
                                  width: "20%",
                                  height: 20,
                                  cursor: "pointer",
                                }}
                              >
                                <GrEdit
                                  title="Edit"
                                  style={{ marginRight: 20 }}
                                  onClick={() => handleEditCustomer(customer)}
                                />
                                <FcCancel
                                  title="Remove"
                                  style={{ marginRight: 20 }}
                                  onClick={() => handleDeleteCustomer(customer)}
                                />
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </CardBody>
                 
                </Card>
              </Col>
                      )}{" "}
            <Col
              className="order-xl-1 mb-5 mb-xl-0"
              sm="12"
              xs="12"
              lg="5"
              xl="5"
            >
              <Card className="bg-secondary shadow">
                <CardHeader className="bg-white border-5">
                  <Row className="align-items-center pl-3">
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          marginBottom: 10,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            marginBottom: 10,
                          }}
                        >
                          <Button
                            color="info"
                            size="sm"
                            onClick={handleGetCustomer}
                          >
                            View Existing Customers
                          </Button>
                          <Button
                            color="primary"
                            size="sm"
                            onClick={handleGetSupplier}
                          >
                            View Existing Suppliers
                          </Button>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          <Button
                            color="info"
                            size="sm"
                            title="Download Customer List Excel Template"
                            style={{ width: "100%", height: 29 }}
                          >
                                                      <a href={excelFile} style={{ color: "white" }}>
                              Download Template
                            </a>
                          </Button>

                          <Button
                            title="Upload your  excel file"
                            color="primary"
                            onClick={() => {
                              setshowBulkListButt(true);
                              setCustomerList([]);
                              setShow(true);
                              // setIsSearched(true)
                            }}
                            size="sm"
                            style={{ width: "100%", height: 29 }}
                          >
                            Upload Excel File
                          </Button>
                        </div>
                      </div>
                      <h3 className="mb-0">Add Business Partner</h3>
                    </div>

                    {/* <Col xs='4' lg='4'>
                      <h3 className='mb-0'>Add Business Partner</h3>
                    </Col>
                    <Col className='text-right' lg='12' xs='12'>
                     
                     
                      
                    </Col> */}
                  </Row>
                </CardHeader>
                <CardBody>
                  <Form>
                    <h6
                      className="heading-small text-muted"
                      style={{ marginTop: -20 }}
                    >
                      User information
                    </h6>
                    <div className="" style={{ marginTop: -10 }}>
                      <Row>
                        <Col lg="6" style={{ margin: 0 }}>
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-username"
                            >
                              Name
                            </label>{" "}
                            <code style={{ color: "darkred" }}>
                              *{" "}
                              {formik.touched.customerName &&
                                formik.errors.customerName}
                            </code>
                            <Input
                              className="form-control font-sm"
                              id="customerName"
                              name="customerName"
                              placeholder="Full name"
                              type="text"
                              value={formik.values.customerName}
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                            />
                          </FormGroup>
                        </Col>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-username"
                            >
                              Type
                            </label>{" "}
                            <code style={{ color: "darkred" }}>
                              *{" "}
                              {formik.touched.customerName &&
                                formik.errors.customerName}
                            </code>
                            <select
                              className="form-control font-sm"
                              id="customerType"
                              name="customerType"
                              value={formik.values.customerType}
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                              style={{ height: 29, padding: "0px 5px" }}
                            >
                              <option value={"CUS"}>Customer</option>
                              <option value={"SUP"}>Supplier</option>
                            </select>
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row style={{ marginTop: -15 }}>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="customerTin"
                            >
                              Ghana Card/TIN
                            </label>{" "}
                            <code style={{ color: "darkred" }}>
                              *{" "}
                              {formik.touched.customerTin &&
                                formik.errors.customerTin}
                            </code>
                            <Input
                              className="form-control font-sm"
                              placeholder="Ghana Card/TIN"
                              id="customerTin"
                              name="customerTin"
                                                          type="text"
                                                          disabled={itemSelected}
                              value={formik.values.customerTin}
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                              bsSize="sm"
                            />
                          </FormGroup>
                        </Col>
                        {itemSelected && (
                          <Col lg="6">
                            <FormGroup>
                              <label
                                className="form-control-label"
                                htmlFor="input-status"
                              >
                                Status
                              </label>{" "}
                              <Button
                                className="form-control font-sm"
                                id="status"
                                name="status"
                                type="button"
                                color="white"
                                value={status ? "Active" : "Inactive"}
                                onClick={() => setStatus(!status)}
                                size="sm"
                              >
                                <FaCircle
                                  color={status ? "green" : "red"}
                                  style={{ marginRight: 20 }}
                                />{" "}
                                {status ? "Active" : "Inactive"}
                              </Button>
                            </FormGroup>
                          </Col>
                        )}
                      </Row>

                      <Row style={{ marginTop: -15 }}>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-email"
                            >
                              Email address
                            </label>{" "}
                            <code style={{ color: "darkred" }}>
                              *{" "}
                              {formik.touched.customerEmail &&
                                formik.errors.customerEmail}
                            </code>
                            <Input
                              className="form-control font-sm"
                              id="customerEmail"
                              name="customerEmail"
                              placeholder="somename@somemail.com"
                              type="email"
                              value={formik.values.customerEmail}
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                              bsSize="sm"
                            />
                          </FormGroup>
                        </Col>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-last-name"
                            >
                              Phone Number
                            </label>{" "}
                            <code style={{ color: "darkred" }}>
                              *{" "}
                              {formik.touched.customerPhone &&
                                formik.errors.customerPhone}
                            </code>
                            <Input
                              className="form-control font-sm"
                              id="customerPhone"
                              name="customerPhone"
                              placeholder="phone"
                              type="tel"
                              value={formik.values.customerPhone}
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                              bsSize={"sm"}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                    </div>
                    <hr className="my-2" />
                    {/* Address */}
                    <h6 className="heading-small text-muted">
                      Contact information
                    </h6>
                    <div>
                      <Row style={{ marginTop: -10 }}>
                        <Col md="12">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-address"
                            >
                              Address
                            </label>
                            <Input
                              className="form-control font-sm"
                              id="customerAddress"
                              name="customerAddress"
                              placeholder="Address"
                              type="text"
                              value={formik.values.customerAddress}
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                              bsSize={"sm"}
                            />
                          </FormGroup>
                        </Col>
                      </Row>

                      <Row style={{ marginTop: -15 }}>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-city"
                            >
                              City
                            </label>
                            <Input
                              className="form-control font-sm"
                              id="customerCity"
                              name="customerCity"
                              placeholder="City"
                              type="text"
                              value={formik.values.customerCity}
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                              bsSize={"sm"}
                            />
                          </FormGroup>
                        </Col>

                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-country"
                            >
                              Ghana Post Service
                            </label>
                            <Input
                              className="form-control font-sm"
                              id="customerDigitalAddress"
                              name="customerDigitalAddress"
                              placeholder="GA-XXX-XXXX"
                              type="text"
                              value={formik.values.customerDigitalAddress}
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                              bsSize={"sm"}
                            />
                          </FormGroup>
                        </Col>
                      </Row>

                      <Row>
                        <Col
                          lg="12"
                          className="text-align"
                          style={{
                            display: "flex",
                            flexDirection: "row-reverse",
                          }}
                        >
                          <Button
                            color="success"
                            // onClick={handleSaveOrUpdate}
                            onClick={formik.handleSubmit}
                            size="sm"
                            disabled={false}
                          >
                            {itemSelected ? "Update" : "Save"}
                          </Button>
                          <Button
                            style={{ marginRight: 10 }}
                                                      color="secondary"
                                                      disabled={(isPostingLoad || isPutLoading)}
                                                      ref={clearBtn }
                            onClick={() => {
                              setitemSelected(false);

                              formik.resetForm();
                            }}
                            size="sm"
                          >
                            Clear
                          </Button>
                        </Col>
                      </Row>
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </Col>
                  </Row>

        </Container>

        <UploadExcel
          show={show}
          setShow={setShow}
          setCustomerList={setCustomerList}
          setIsSearched={setIsSearched}
        />

        <DeletePromptCustomer
                  message={`Are you sure you want to proceed with deleting  "${customerToDelete?.customerName}"?`}
                  showPrompt={showPrompt}
                  setShowPrompt={setShowPrompt}
                  customerToDelete={customerToDelete}
                  setCustomerList={setCustomerList}
                  setLoading={setLoading}
                  getCustomerList={getCustomerList}
                  getSupplierList={getSupplierList}
                  resetFormBtn={clearBtn }
        />
              {(loading || isPutLoading || isPostingLoad) ? <Loader /> : null}
      </ErrorBoundary>
    </>
  );
};

export default Customers;

const styles = {
  body: {
    marginTop: 0,
    height: "inherit",
    maxHeight: "inherit",
    overflow: "auto",
    marginBottom: 40,
  },
};
