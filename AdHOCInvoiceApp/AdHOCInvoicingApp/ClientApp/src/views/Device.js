import React, { useEffect, useState } from "react";
import {
  Button,
  Table,
  Card,
  CardHeader,
  CardFooter,
  CardBody,
  FormGroup,
  Form,
  Input,
  Container,
  Row,
  Col,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Badge,
} from "reactstrap";
import { FcCancel } from "react-icons/fc";

import UserHeader from "components/Headers/UserHeader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "components/Modals/Loader";
import excelFile from "../assets/GRA_INVOICER_ITEMS_TEMPLATE.xlsx";
import ItemsUploadExcel from "components/Modals/ItemsUploadExcel";
import { moneyInTxt } from "components/Invoice/InvoicePreview";
import { GrEdit, GrClose } from "react-icons/gr";
import { debounce } from "lodash";
import { FaCircle } from "react-icons/fa";
import DeletePrompt from "components/Modals/DeletePromptGlobal";
import { useQuery } from "@tanstack/react-query";
import { useCustomQuery } from "hooks/useCustomQuery";
import { useCustomPost } from "hooks/useCustomPost";
import { useDebounce } from "use-debounce";
import { useCustomPut } from "hooks/useCustomPut";
import useAuth from "hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import CurrencyInput from "react-currency-input-field";
import { X } from "react-feather";

const initData = {
  name: "",
  brand: "",
  model: "",
  serialNumber: "",
};

const DevicePage = () => {
  const queryClient = useQueryClient();
  const { selectedBranch, user } = useAuth();

  const [formData, setFormData] = useState(initData);
  const [itemsList, setItemsList] = useState([]);
  const [istaxable, setIstaxable] = useState(false);
  const [isTaxInclusive, setIsTaxInclusive] = useState(false);
  const [hasTourismLevy, setHasTourismLevy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [isViewMode, setIsviewMode] = useState(false);
  const [showBulkListButt, setshowBulkListButt] = useState(false);
  const [itemSelected, setitemSelected] = useState(false);
  const [isSearched, setIsSearched] = useState(false);
  const [status, setStatus] = useState(true);
  const [showPrompt, setShowPrompt] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [currencies, setCurrencies] = useState([]);
  const [showList, setShowList] = useState(false);
  const [currencyCode, setCurrencyCode] = useState("");
  const [otherLevies, setOtherLevies] = useState("NON");
  const [searchText, setSearchText] = useState("");
  const [value] = useDebounce(searchText, 500);
  const [isViewed, setIsViewed] = useState(false);
  const [hasDiscount, setHasDiscount] = useState(false);
  const [isClicked, setIsClick] = useState(false);

  const {
    refetch: getItemsList,
    isLoading,
    isFetching,
  } = useCustomQuery(
    //if search value is defined the url is different
    !value ? `/api/InvoiceDevice` : `/api/InvoiceDevice/${value}`,
    "items",
    value,
    (data) => {
      setIsViewed(true);
      setitemSelected(false);
      setIsClick(false);
      setItemsList(data);
      setLoading(false);
      setIsSearched(true);
      //   if (data.length > 0) {
      //     let results = data.map((item) => {
      //       return {
      //         id: item.id,
      //         name: item.name,
      //         istaxable: item.taxable,
      //         code: item.code,
      //         price: item.price,
      //         taxRate: item.taxRate,
      //         description: item.description,
      //         isTaxInclusive: item.isTaxInclusive,
      //         otherLevies: item.otherLevies,
      //         status: item.status,
      //         hasTrans: item.hasTrans,
      //         currencyCode: item.currencyCode,
      //         discountType: item?.discountType,
      //         discount: item?.discount,
      //       };
      //     });
      //     setLoading(false);
      //     setItemsList(results);
      //     setIsSearched(true);
      //   } else {
      //     setItemsList([]);
      //   }
    },
    (err) => {
      setLoading(false);
      toast.warning("You have no products/services saved yet");
    },
    { isEnabled: false, queryTag: "DONT_USE_QUERY_BECAUSE_OF_BFF" }
  );

  const handleClear = () => {
    setitemSelected(false);
    setHasTourismLevy(false);
    setIstaxable(false);
    setIsTaxInclusive(false);
    setFormData(initData);
    setCurrencyCode("");
    setOtherLevies("");
    setHasDiscount(false);
  };

  const postSuccess = (data) => {
    if (data.status > 201) {
      toast.error("We are unable to save your device. Please contact admin.");
      setLoading(false);
      return;
    }
    toast.success("Device successfully saved");
    setLoading(false);

    setSearchText(formData?.name);
    handleClear();
  };
  const postError = (err) => {
    toast.error(
      err?.response?.Message || "Technical error! Please contact support"
    );
    setLoading(false);
  };

  const putSuccess = (data) => {
    toast.success("Successfully Updated");
    setLoading(false);
    handleClear();
    setSearchText(formData?.name);
    getItemsList();
  };

  const handleChangeEvent = (e) => {
    setFormData((pre) => ({
      ...pre,
      [e.target.name]: e.target.value,
    }));
  };

  const { mutate, isLoading: isPostLoading } = useCustomPost(
    `/api/InvoiceDevice`,
    "devices",
    postSuccess,
    postError
  );
  const { mutate: putmutate } = useCustomPut(
    `/api/InvoiceDevice/${formData?.id}`,
    "updatedItems",
    putSuccess,
    postError
  );

  const saveItem = () => {
    if (Object.values(formData)?.some((x) => x?.length === 0)) {
      toast.warning("Please fill all necessary information");
    } else {
      let postData = formData;
      setLoading(true);
      mutate([{ ...postData, CompanyId: "" }]);
    }
  };

  const updateItem = (item) => {
    putmutate({ ...formData, companyId: "", status: status ? "A" : "I" });
  };

  const handleSaveOrUpdate = () => {
    itemSelected ? updateItem(formData) : saveItem();
  };

  const handleEditItem = (item) => {
    console.log({ handleEditItem: item });
    setFormData(item);
    setitemSelected(true);

    // if (item?.discountType === 2001 || item?.discountType === 2002) {
    //   setHasDiscount(true);
    // } else {
    //   setHasDiscount(false);
    // }

    // setIstaxable(item.istaxable);
    // setHasTourismLevy(item.hasTourismLevy);
    // setIsTaxInclusive(item.isTaxInclusive);
    // setitemSelected(true);
    // // setFormData((prev) => {
    // // });
    // setCurrencyCode(item.currencyCode);
    // setOtherLevies(item.otherLevies);

    if (item.status === "A") {
      setStatus(true);
    } else if (item.status !== "A") {
      setStatus(false);
    }
  };

  const handleDeleteItem = (item) => {
    setItemToDelete(item);
    setShowPrompt(true);
  };

  const handleEnterSearch = (event) => {
    if (event.key === "Enter") {
      setSearchText(event.target.value);
    }
  };

  const { mutate: bultData, isLoading: isPutLoading } = useCustomPost(
    `/api/CreateItem/${selectedBranch?.code}`,
    "items",
    () => {
      setLoading(false);
      toast.success("Items List successfully Added");
      setItemsList([]);
      setshowBulkListButt(false);
      getItemsList();
      setSearchText("");
    },
    (err) => {
      toast.error(
        err?.response?.Message || "Technical error! Please contact support"
      );
      setLoading(false);
    }
  );

  const submitItemList = () => {
    setLoading(true);
    let postData = itemsList.map((item) => {
      return {
        name: item.name,
        description: item.description,
        taxable: item.istaxable,
        code:
          "TXC00" +
          Math.ceil(Math.random() * 1000) +
          new Date().toISOString().substring(8, 10),
        taxRate: item.istaxable ? 0.125 : 0,
        price: Number(item.price),
        companyId: user?.sub,
        isTaxInclusive: item.isTaxInclusive,
        currencyCode: item.currencyCode,
        otherLevies: item.otherLevies,
      };
    });

    bultData(postData);
  };

  const query = useCustomQuery(
    `/api/GetCurrency`,
    "currency",
    "",
    (data) => {
      if (data?.length > 0) {
        setLoading(false);
        let res = data?.map((item) => {
          return {
            name: item.name,
            iso: item.code,
            homeCurrency: item.homeCurrency,
            rate: 0,
          };
        });
        setCurrencies(res);
      }
    },
    (err) => {
      console.log(err);
    },
    {
      refetchOnMount: true,
    }
  );

  useEffect(() => {
    query.refetch();

    return () => {};
  }, []);

  useEffect(() => {
    if (isTaxInclusive === true) {
      setIstaxable(true);
    }
  }, [isTaxInclusive, istaxable]);

  useEffect(() => {
    if (value.length > 1) {
      getItemsList();
    }
    if (searchText.length === 0 && isViewed) {
      getItemsList();
    }
  }, [value, searchText]);

  return (
    <>
      {isLoading && isClicked ? <Loader /> : null}
      <UserHeader
        message={
          "This is your device setup page. Manage your mobile sales device here"
        }
        pageName="Device Registration"
      />
      {(isPostLoading || isPutLoading) && <Loader />}

      <ToastContainer />
      <Container className="mt--7" fluid>
        <Row className="mt-5">
          {itemsList && isSearched ? (
            <Col className="order-xl-2 mb-5 mb-xl-0" xl="8" md={8} sm={12}>
              <Card className="shadow" style={{ height: 550 }}>
                <CardHeader
                  className="bg-secondary border-5"
                  style={{ height: 126, position: "relative" }}
                >
                  <Row className="align-items-center">
                    <Col sm="12">
                      <h3 className="mb-0">Registered Devices</h3>
                      <br />
                      <div className="navbar-search navbar-search-light form-inline ">
                        <FormGroup className="mb-0">
                          <InputGroup className="input-group-alternative">
                            <InputGroupAddon
                              addonType="prepend"
                              className="mt-2"
                            >
                              <InputGroupText>
                                <i className="fas fa-search" />
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              placeholder="Search..."
                              type="text"
                              value={searchText}
                              onChange={(e) => {
                                setSearchText(e.target.value);
                              }}
                              style={{ width: 300 }}
                              onKeyDown={handleEnterSearch}
                            />
                          </InputGroup>
                          {value ? (
                            <Button
                              onClick={() => {
                                setItemsList([]);
                                setSearchText("");
                              }}
                            >
                              Reset
                            </Button>
                          ) : null}
                        </FormGroup>
                      </div>
                    </Col>

                    <Col
                      className="text-right"
                      xs="8"
                      sm={12}
                      style={{ position: "absolute", top: 20, right: 0 }}
                    >
                      <Button
                        onClick={() => {
                          setitemSelected(false);
                          setshowBulkListButt(false);
                          setIsClick(true);
                          setIsviewMode(!isViewMode);
                          setItemsList([]);
                          setIsSearched(false);
                          setFormData(initData);
                        }}
                        size="sm"
                      >
                        <GrClose />
                      </Button>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody style={styles.body}>
                  {/* {loading ? <Loader /> : null} */}
                  <Table className="align-items-center  table-flush" responsive>
                    <thead className="thead-light">
                      <tr>
                        <th style={{ width: "10%" }} scope="col">
                          Code
                        </th>
                        <th style={{ width: "30%" }} scope="col">
                          Name
                        </th>

                        <th scope="col">Brand</th>

                        <th style={{}} scope="col">
                          Model
                        </th>
                        <th scope="col">Serial #</th>
                        <th scope="col">Configured</th>
                        <th scope="col">Status</th>

                        <th
                          style={{
                            textAlign: "right",
                            width: "10%",
                          }}
                          scope="col"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {itemsList.map((item, key) => (
                        <tr key={key} onClick={() => handleEditItem(item)}>
                          <td style={{ cursor: "pointer" }} title={item.code}>
                            {item?.code}
                          </td>
                          <td>{item.name}</td>

                          <td style={{ width: "25%" }}>{item?.brand}</td>
                          <td style={{ width: "25%" }}>{item?.model}</td>
                          <td style={{ width: "25%" }}>{item?.serialNumber}</td>

                          <td style={{ textAlign: "right" }}>
                            <input
                              type="checkbox"
                              value={item.isConfigured}
                              checked={item.isConfigured}
                              readOnly
                            />
                          </td>
                          <td>
                            <input
                              type="checkbox"
                              value={item.status === "A" ? true : false}
                              checked={item.status === "A" ? true : false}
                              readOnly
                            />
                          </td>
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
                              onClick={() => handleEditItem(item)}
                            />
                            <FcCancel
                              title="Remove"
                              onClick={() => handleDeleteItem(item)}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </CardBody>
                <CardFooter style={{ height: 65 }}>
                  <Row style={{ marginTop: -10 }}>
                    <Col
                      lg="12"
                      className="text-align"
                      style={{
                        display: "flex",
                        // flexDirection: 'row-reverse',
                      }}
                    >
                      {showBulkListButt && (
                        <>
                          <Button
                            color="success"
                            onClick={submitItemList}
                            size="sm"
                          >
                            Submit Bulk List
                          </Button>
                        </>
                      )}
                    </Col>
                  </Row>
                </CardFooter>
              </Card>
            </Col>
          ) : null}
          {loading ? <Loader /> : null}

          <Col
            className="order-xl-1 mb-5 mb-xl-0"
            xs="12"
            sm="12"
            lg="4"
            xl="4"
          >
            <Card
              className="bg-white shadow"
              style={{ height: 550, backgroundColor: "#fff" }}
            >
              <CardHeader
                className="bg-secondary border-5"
                style={{ height: 126 }}
              >
                <Row
                  className="align-items-center"
                  style={{ height: "max-content" }}
                >
                  <Col className="text-right" lg="12" xs="12" sm={12}>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat( auto-fit, minmax(150px, 1fr) )",
                        gap: 10,
                      }}
                    >
                      <Button
                        color="info"
                        onClick={() => {
                          getItemsList();
                          setIsviewMode(!isViewMode);
                          setshowBulkListButt(false);
                          setIsClick(true);
                        }}
                        size="sm"
                        style={{
                          cursor: isViewMode ? "not-allowed" : "pointer",
                          paddingLeft: 0,
                          marginLeft: 0,
                          textAlign: "center",
                        }}
                      >
                        View Registered Device
                      </Button>
                      {/* <Button
                                                color="info"
                                                size="sm"
                                                title="Download Customer List Excel Template"
                                                style={{ paddingLeft: 0, marginLeft: 0 }}
                                            >
                                                <a href={excelFile} style={{ color: "white" }}>
                                                    Download Template
                                                </a>
                                            </Button> */}

                      {/* <Button
                                                title="Upload your  excel file"
                                                color="primary"
                                                onClick={() => {
                                                    setshowBulkListButt(true);
                                                    setItemsList([]);
                                                    setLoading(false);
                                                    setShow(true);
                                                    // setIsSearched(true)
                                                }}
                                                size="sm"
                                                style={{ paddingLeft: 0, marginLeft: 0 }}
                                            >
                                                Upload Excel File
                                            </Button> */}
                    </div>
                  </Col>
                  <Col xs="12" lg="12" className="m-2 pt-0 pb-0">
                    <h3 className="mb-0">Add New Device</h3>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody
                style={{ minHeight: "max-content", backgroundColor: "#fff" }}
              >
                <Form>
                  <div
                    style={{
                      display: "flex",
                      gap: 20,
                      justifyContent: "space-between",
                    }}
                  >
                    <h6
                      className="heading-small text-muted"
                      style={{ marginTop: -20 }}
                    >
                      Device information
                    </h6>
                    {formData?.code ? (
                      <span
                        color="info"
                        className="heading-small text-muted"
                        style={{ marginTop: -20, paddingBottom: 0 }}
                      >
                        Device Code: {formData?.code}
                      </span>
                    ) : null}
                  </div>

                  <div className="" style={{ marginTop: -10 }}>
                    <Row>
                      <Col lg="7">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-username"
                          >
                            Name
                          </label>{" "}
                          <code style={{ color: "darkred" }}>*</code>
                          <Input
                            className="form-control font-sm"
                            placeholder="Name of device"
                            type="text"
                            name="name"
                            // disabled={itemSelected}
                            value={formData.name}
                            onChange={handleChangeEvent}
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="5">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-brand"
                          >
                            Brand
                          </label>{" "}
                          <code style={{ color: "darkred" }}>*</code>
                          <Input
                            className="form-control font-sm"
                            placeholder="Brand"
                            name="brand"
                            type="text"
                            // disabled={itemSelected}
                            value={formData.brand}
                            onChange={handleChangeEvent}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="5">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-username"
                          >
                            Model
                          </label>{" "}
                          <code style={{ color: "darkred" }}>*</code>
                          <Input
                            className="form-control font-sm"
                            placeholder="Model"
                            type="text"
                            name="model"
                            // disabled={itemSelected}
                            value={formData.model}
                            onChange={handleChangeEvent}
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="7">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-username"
                          >
                            Serial Number
                          </label>{" "}
                          <code style={{ color: "darkred" }}>*</code>
                          <Input
                            className="form-control font-sm"
                            placeholder="Serial Number"
                            type="text"
                            name="serialNumber"
                            disabled={
                              itemSelected && formData?.isConfigured
                                ? true
                                : false
                            }
                            value={formData.serialNumber}
                            onChange={handleChangeEvent}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row style={{ marginTop: -20 }} hidden>
                      <Col lg="7">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-username"
                            onClick={() => setShowList(!showList)}
                            onHover={() => {
                              if (!currencies?.length) {
                                queryClient.invalidateQueries("currency");
                              }
                            }}
                          >
                            Select Currency{" "}
                            <i
                              className={
                                !showList
                                  ? "fas fa-angle-up"
                                  : "fas fa-angle-down"
                              }
                            />{" "}
                            <code style={{ color: "darkred" }}>*</code>
                          </label>{" "}
                          {!showList ? (
                            <Input
                              className="form-control font-sm"
                              placeholder="Currency"
                              type="text"
                              // disabled={itemSelected}
                              value={currencyCode}
                              onClick={() => setShowList(true)}
                              onChange={() => setCurrencyCode(currencyCode)}
                              bsSize="sm"
                            />
                          ) : (
                            <Card
                              style={{
                                position: "absolute",
                                width: "96%",
                                zIndex: "1000",
                                margin: 0,
                                maxHeight: "200px",
                                overflow: "auto",
                                boxShadow:
                                  "5px 10px 5px 0px rgba(189,189,189,0.75)",
                              }}
                            >
                              {currencies?.map((country, i) => {
                                return (
                                  <Col
                                    lg="12"
                                    md="3"
                                    key={i}
                                    onClick={() => {
                                      setCurrencyCode(country.iso);
                                      setShowList(false);
                                    }}
                                  >
                                    <div
                                      key={i}
                                      style={{
                                        padding: "10px",
                                        borderBottom: "1px solid #e3e3e3",
                                        alignContent: "center",
                                        marginTop: 2,
                                        marginBottom: 3,
                                        cursor: "pointer",
                                        height: 29,
                                        fontSize: 12,
                                      }}
                                    >
                                      <div>
                                        <img
                                          alt={country.name}
                                          src={`http://purecatamphetamine.github.io/country-flag-icons/3x2/${country.iso.substr(
                                            0,
                                            2
                                          )}.svg`}
                                          style={{ height: 14, marginRight: 5 }}
                                        />

                                        {country.iso}
                                      </div>
                                    </div>
                                  </Col>
                                );
                              })}
                            </Card>
                          )}
                        </FormGroup>
                      </Col>
                      <Col sm="12" lg="5" className="mt-4">
                        <FormGroup>
                          <input
                            className="form-control-checkbox"
                            type="checkbox"
                            value={isTaxInclusive}
                            onChange={() => {
                              setIsTaxInclusive(!isTaxInclusive);
                            }}
                            checked={isTaxInclusive}
                          />
                          &nbsp; &nbsp;
                          <label
                            htmlFor="isTaxInclusive"
                            className="form-control-label"
                          >
                            Tax Inclusive?
                          </label>
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row style={{ marginTop: -20 }} hidden>
                      <Col>
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-email"
                          >
                            Description
                          </label>
                          <Input
                            className="form-control"
                            placeholder="type something descriptive"
                            type="textarea"
                            rows={2}
                            value={formData.description}
                            // onChange={(e) =>
                            //   setFormData({
                            //     ...formData,
                            //     description: e.target.value,
                            //   })
                            // }
                            style={{
                              resize: "none",
                              marginTop: -5,
                              fontSize: 12,
                            }}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>
                  <hr className="my-1 mt-0" hidden />
                  {/* Address */}
                  <h6 className="heading-small text-muted mb-0" hidden>
                    Tax information <code style={{ color: "darkred" }}>*</code>
                  </h6>
                  <div className="pl-lg-4" hidden>
                    <Row>
                      <Col lg="4" className="pt-4">
                        <Input
                          className="form-control-checkbox "
                          type="checkbox"
                          value={istaxable}
                          onChange={() => setIstaxable(!istaxable)}
                          checked={istaxable}
                        />
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-first-name"
                          >
                            Is Taxable?
                          </label>
                        </FormGroup>
                      </Col>
                      <Col lg="8">
                        <label
                          className="form-control-label"
                          htmlFor="input-first-name"
                        >
                          Tourism/CST
                        </label>
                        <select
                          className="form-control font-sm"
                          value={otherLevies}
                          onChange={(e) => setOtherLevies(e.target.value)}
                          style={{ height: 29, padding: "0px 5px" }}
                        >
                          <option value={"NON"}>None</option>
                          <option value={"CST"}>CST</option>
                          <option value={"TRSM"}>Tourism</option>
                        </select>
                      </Col>
                    </Row>
                  </div>

                  {itemSelected && (
                    <Row>
                      <Col lg="12">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-email"
                          >
                            Device Status
                          </label>
                          <Button
                            className="form-control"
                            id="status"
                            name="status"
                            value={status ? "Active" : "Inactive"}
                            onClick={() => setStatus(!status)}
                          >
                            <FaCircle
                              color={status ? "green" : "red"}
                              style={{ marginRight: 20 }}
                            />{" "}
                            {status ? "Active" : "Inactive"}
                          </Button>
                        </FormGroup>
                      </Col>
                    </Row>
                  )}
                </Form>
              </CardBody>
              <CardFooter style={{ height: 60 }}>
                <Row style={{ marginTop: -10 }}>
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
                      onClick={handleSaveOrUpdate}
                      size="sm"
                      disabled={loading}
                    >
                      {itemSelected ? "Update" : "Save"}
                    </Button>
                    <Button
                      style={{ marginRight: 10 }}
                      color="secondary"
                      disabled={loading}
                      onClick={handleClear}
                      size="sm"
                    >
                      Clear
                    </Button>
                  </Col>
                </Row>
              </CardFooter>
            </Card>
          </Col>
        </Row>
      </Container>

      <ItemsUploadExcel
        show={show}
        setShow={setShow}
        setItemsList={setItemsList}
        setIsSearched={setIsSearched}
      />

      <DeletePrompt
        message={`Are you sure you want to proceed with deleting the device "${itemToDelete?.name}"?`}
        showPrompt={showPrompt}
        setShowPrompt={setShowPrompt}
        itemToDelete={itemToDelete}
        setItemsList={setItemsList}
        setLoading={setLoading}
        setSearchText={setSearchText}
        value={value}
        refetch={getItemsList}
        url="/api/InvoiceDevice"
        key="devices"
      />
    </>
  );
};

export default DevicePage;

const styles = {
  body: {
    marginTop: 0,
    height: "inherit",
    maxHeight: "inherit",
    overflow: "auto",
    marginBottom: 40,
    paddingTop: "4px",
  },
};
