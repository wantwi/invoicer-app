import React, { useContext, useEffect, useState, useRef } from "react";
import Autocomplete from "./Autocomplete";
import AutocompleteItems from "./AutocompleteItems";
import { ToastContainer, toast } from "react-toastify";
import "../../views/App.css";
import "./invoicestyle.css";
import {
    FormGroup,
    Form,
    Input,
    Row,
    Col,
    Button,
    Card,
    CardBody,
    Badge,
} from "reactstrap";
import { AppContext } from "views/Index";
import { FormContext } from "components/Modals/NewInvoice";
import "react-toastify/dist/ReactToastify.css";
import Loader from "components/Modals/Loader";
import { useHistory } from "react-router-dom";
import DatePicker from "react-datepicker";
import subDays from "date-fns/subDays";
import addDays from "date-fns/addDays";
import {
    useMutation,
    useQueries,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
// import axios from 'axios'
import useCustomAxios from "../../hooks/useCustomAxios";
import { getPayableAmount } from "utils/util";
import useMultiFetchAllSettled from "hooks/useMultiFetchAllSettled";
import useAuth from "hooks/useAuth";
import { useCustomQueryById } from "hooks/useCustomQueryById";
import { getFormattedDate } from "utils/util";
import { moneyInTxt } from "./InvoicePreview";
import CurrencyInput from "react-currency-input-field";

// import 'react-tooltip/dist/react-tooltip.css'

// import SelectSearch from 'react-select-search'

const currenciesInit = [
    {
        id: "7466f25a-773e-488f-af26-c443cf8f1950",
        code: "GHS",
        name: "Ghana Cedis",
        homeCurrency: true,
    },
    {
        id: "6b333df2-39aa-427e-91b4-fa9ea6b5af07",
        code: "USD",
        name: "US Dollar",
        homeCurrency: false,
    },
    {
        id: "fe7713c9-c701-44a6-991c-8fec88522539",
        code: "EUR",
        name: "Euro",
        homeCurrency: false,
    },
    {
        id: "67dee4f7-3cb8-41bf-96d2-a4d179dc859d",
        code: "GBP",
        name: "Great Britain Pounds",
        homeCurrency: false,
    },
];

function InvoiceForm({ refetch }) {
    const history = useHistory();
    const queryClient = useQueryClient();

    const axios = useCustomAxios();

    // const searchInput = useRef()
    const { invoices } = useContext(AppContext);
    const {
        formData,
        setFormData,
        gridData,
        setGridData,
        setShowNewInvoiceModal,
        comments,
        setComments,
        vatAndLeviesScheme,
        setvatAndLeviesScheme
    } = useContext(FormContext);

    const [isItemAdded, setIsItemAdded] = useState(false);

    const [products, setProducts] = useState([]);
    const [showAddItem, setShowAddItem] = useState(false);
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isTaxable, setIsTaxable] = useState(false);
    const [disabled, setDisabled] = useState(true);
    const [discount, setDiscount] = useState(0.0);
    const [currencies, setCurrencies] = useState([]);
    const [currency, setCurrency] = useState("GHS");
    const [isCurrencyDisabled, setIsCurrencyDisbled] = useState(false);
    const [exchangeRate, setExchangeRate] = useState(1);
    const [forex, setForex] = useState(1);
    const [productsList, setProductsList] = useState([]);
    const [defaultProductsList, setDefaultProductsList] = useState([]);
    const [poTaxes, setPOTaxes] = useState(null)
    const [showLoading, setShowLoading] = useState(false)
    // const [vatAndLeviesScheme, setvatAndLeviesScheme] = useState({
    //   covidRate: 0,
    //   cstRate: 0,
    //   cstWithVat: 0,
    //   getfundRate: 0,
    //   nhilRate: 0,
    //   regularLeviesWithVat: 0,
    //   tourismRate: 0,
    //   trsmWithVat: 0,
    //   vatRate: 0,
    // });
    const [schemeDate, setSchemeDate] = useState(
        `${new Date().getFullYear()}-${new Date().getMonth() + 1
        }-${new Date().getDate()}`
    );
    // const [discount, setDiscount] = useState({
    //   type: "",
    //   amount: 0.0,
    //   amountOnItem: 0.0
    // })
    const {
        covidRate,
        cstRate,
        cstWithVat,
        getfundRate,
        nhilRate,
        regularLeviesWithVat,
        tourismRate,
        trsmWithVat,
        vatRate,
    } = vatAndLeviesScheme;
    const [discountTypeToShow, setDiscountTypeToShow] = useState({
        discountAmount: false,
        itemDiscountAmnt: false,
    });

    const [cashCustomerTin, setCashCustomerTin] = useState("");

    const { selectedBranch, user } = useAuth();
    console.log({ user });

    let userDetails = JSON.parse(
        sessionStorage.getItem(process.env.REACT_APP_OIDC_USER)
    );

    //Ensure an item is added before taking discount amount
    useEffect(() => {
        // if (
        //   // formData?.discountType === "selective" &&
        //   !gridData?.length 
        //   // formData?.totalDiscount
        // ) {
        //   toast.error("Please add Item(s) first");
        //   setFormData((prev) => ({ ...prev, totalDiscount: "" }));
        //   return;
        // }

        //ensure discount amount is not greater than total payable
        let totalPayable = gridData.reduce(
            (total, item) => total + item.totalPayable,
            0
        );

        // console.log({ totalPayable, key: formData?.totalDiscount })
        if (parseFloat(formData?.totalDiscount) >= totalPayable) {
            toast.error("Discount amount must be less than total payable");
            setFormData((prev) => ({ ...prev, totalDiscount: 0 }));
            return;
        }

        return () => { };
    }, [formData?.discountType, formData?.totalDiscount]);

    const handleOnchangeOfDiscountAmt = () => { };


    const requstCallback = (response) => {
        const productResponse = response[2];
        const currencyResponse = response[1];
        const customerResponse = response[0];

        if (productResponse?.status === "fulfilled") {
            console.log({ requstCallback1: productResponse?.value.data });
            setProductsList(productResponse?.value.data);
            setDefaultProductsList(productResponse?.value.data)
        }
        if (currencyResponse?.status === "fulfilled") {
            console.log({ requstCallback2: currencyResponse?.value.data });

            if (currencyResponse?.value.data.length > 0) {
                setCurrencies(currencyResponse?.value.data || []);
            } else {
                setCurrencies(currenciesInit);
            }
        }
        if (customerResponse?.status === "fulfilled") {
            console.log({ requstCallback3: customerResponse?.value.data });
            let filteredCustomers = customerResponse?.value.data.filter(
                (customer) => customer.status === "A"
            );
            setCustomers(filteredCustomers);
            setCashCustomerTin(
                customerResponse?.value.data.find(
                    (cust) => cust.name == "cash customer"
                )?.tin
            );
        }
    };

    const {
        data,
        error,
        isLoading: multifLoading,
        setUrls,
    } = useMultiFetchAllSettled(
        [
            `/api/GetCustomers/${selectedBranch?.code}`,
            "/api/GetCurrency",
            `/api/GetProductList/${currency}`,
        ],
        requstCallback
    );

    //  const {refetch: refetchPOItems} = useCustomQueryById(`/api/GetPOItems/${formData?.pon}`,formData?.pon, (data) => {
    //   alert("This")
    //   console.log({refetchPOItems: data});
    //   // setProductsList(data)
    //   })

    const refetchProductList = async () => {


        try {
            const request = await axios.get(`/api/GetProductList/${currency}`)
            console.log({ responseData: request })

            responseData?.data.length === 0 ? setProductsList([]) : setProductsList(responseData?.data || [])

        } catch (error) {

        }

    }

    // const {refetch: refetchProductList} = useCustomQueryById(`/api/GetProductList/${currency}`, currency, (data) => {
    //   // setProductsList(data)
    //   })


    const onSuccess = (data) => {
        console.log({ GetVatAndLeviesByScheme: data });
        setvatAndLeviesScheme(data);
    };

    const { refetch: refetchTaxScheme } = useCustomQueryById(
        `/api/GetVatAndLeviesByScheme/${schemeDate}/${selectedBranch?.taxScheme || 0}`,
        "taxScheme",
        formData?.date,
        onSuccess
    );

    useEffect(() => {
        refetchTaxScheme();

        return () => { };
    }, [formData?.date]);

    const getPOItems = (e) => {

        if (e.target.value.length > 0) {
            refetchPOItems()
        } else {
            refetchProductList()
        }

    }

    console.log({ defaultProductsList });

    // const fd = new Date(formData?.date)

    // console.log({useCustomQueryById: `${new Date(formData?.date).getFullYear()}-${new Date(formData?.date).getMonth()+ 1}-${new Date(formData?.date).getDate()}`});

    const postInvoice = async (postData) => {
        setLoading(true);
        return await axios.post(
            `/api/PostInvoice/${selectedBranch?.code}`,
            postData
        );
    };
    // `/api/PostInvoice/${selectedBranch?.code}`,

    const { mutate } = useMutation({
        mutationFn: postInvoice,
        onSuccess: (data) => {

            const res = JSON.parse(data?.data?.data)
            console.log({ onSuccess: res });
            if (res?.status >= 400) {
                const error = new Error(res?.message)
                error.code = res?.status
                throw error
            } else {
                toast.success("Invoice successfully saved");
                refetch();
                //queryClient.invalidateQueries({ queryKey: ["invoices", 1, 1, ""] });
                setShowNewInvoiceModal(false);
                setLoading(false);
            }




        },
        onError: (error) => {
            if (error?.response?.status === 500) {
                toast.error(
                    error?.response?.data ||
                    error?.response?.data ||
                    "Error creating invoice"
                );
                setLoading(false);
                return;
            }
            console.log({ useMutationError: error });
            toast.error(

                error?.message ||
                "Invoice could not be saved. Please contact support."
            );
            setLoading(false);
        },
    });

    //used for setting the min value of Issued Date input field
    let today = new Date().toISOString().split("T")[0];

    const validateInput = (value) => {
        // console.log(value)

        if ((value != "" && value < 0.00001) || value == "e") {
            // setFormData({ ...formData, quantity: 1 })
            toast.info("Please make sure quantity is greater than 0");
        }
    };

    const addRecordToData = (item) => {
        // setIsCurrencyDisbled(true)

        if (item?.price < 1 || item?.price === "" || item?.price === undefined) {
            toast.error("Invalid price value");
            return
        }

        let csttourism = 0;
        if (item.otherLevies === "NON") {
            csttourism = 0;
        } else if (item.otherLevies === "CST") {
            csttourism =
                (cstRate / 100) * item.price * item.quantity;
        } else if (item.otherLevies === "TRSM") {
            csttourism =
                (tourismRate / 100) * item.price * item.quantity;
        }

        if (item.itemName === "") {
            toast.warning("Please select an item first");
        } else if (item.quantity === "") {
            toast.warning("Please provide a value for quantity");
        } else if (item.price === "") {
            toast.warning("Please provide a value for price");
        } else {
            const gridItem = getPayableAmount(
                { ...item, isTaxable },
                discount,
                vatAndLeviesScheme
            );


            setGridData((gridData) => ([
                ...gridData,
                { ...gridItem, discountTypeName: item?.discountTypeName, discountType: item?.discountType, discount: item?.discount, otherLeviesType: item.otherLevies },
            ]));
            setFormData({ ...formData, itemName: "", quantity: 1, price: "" });
            setDiscount(0.0);
            setIsItemAdded(true);
            setDisabled(true);
        }
    };

    const saveInvoice = async () => {
        if (gridData?.length === 0) {
            toast.error("Please add invoice item(s)");
            return;
        }
        let postData = {
            date: new Date(formData?.date).toISOString(),
            dueDate: formData.dueDate
                ? new Date(formData.dueDate).toISOString()
                : new Date().toISOString(),
            remarks: comments,
            nameOfUser: user?.name,
            customerName: formData.customer,
            customerTinghcard: formData.identity,
            transactionType: "SALES",
            currency: formData.currency,
            forexRate: forex,
            amount: gridData.reduce((total, item) => total + item.totalPayable, 0),
            pon: formData?.pon,

            invoiceItems: gridData?.map((item) => {
                return {
                    price: item.taxableAmount,
                    itemCode: item.itemCode,
                    itemDescription: item.itemName,
                    unitPrice: item.price,
                    itemDiscount: item?.discount || 0,
                    taxCode: "",
                    quantity: item.quantity,
                    vatItemId: item.vatItemId,
                    //isTaxable,
                };
            }),
        };
        //if discount is applied add it to data to post
        if (formData?.discountType) {
            if (formData?.discountType === "selective" && !formData?.totalDiscount) {
                toast.error("Provide discount amount");
                return;
            }
            const subTotalAmt = gridData.reduce(
                (total, item) => total + item.taxableAmount,
                0
            );
            if (
                (formData?.discountType === "selective") &
                (formData?.totalDiscount >= subTotalAmt)
            ) {
                toast.error("Discount amount is invalid");
                return;
            }
            postData["totalDiscount"] = Number(formData.totalDiscount).toFixed(4);
            postData["discountType"] = String(formData.discountType).toUpperCase();
        }

        if (isCashCustomer) {
            postData["customerTinghcard"] = cashCustomerTin;
            postData["customerName"] = `${formData.customer}(cash customer)`;
        }
        // console.log({cashCustomerTin, postData })
        // return

        if (isItemAdded) {
            mutate(postData);
        } else {
            toast.warning("Please add an item first");
        }
    };

    const checkIfRatesExist = async (currency, date) => {
        let today = new Date(formData.date).toISOString();
        const request = await axios.get(
            `/api/checkIfRatesExist/${selectedBranch?.code}/${currency}/${new Date(date).toISOString().split("T")[0]}`
        );
        // "(GHS" + data[0].exchangeRate + " / " + data[0].currencyCode
        if (request) {
            const { data } = request;
            console.log({ data });
            if (data.length > 0) {
                setForex(data[0].exchangeRate);
                setExchangeRate(
                    `(GHS ${data[0].exchangeRate}/${data[0].currencyCode})`
                );
            } else {
                toast.warning(
                    `There are no exchange rates set for ${new Date(new Date(formData.date).toISOString().split("T")[0]).toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' })}. Redirecting you to currency set up to add exchange rates`
                );
                setTimeout(() => {
                    history.push("/admin/currency");
                }, 3000);
            }
        }
    };


    const handleCurrencySelect = (e) => {
        setCurrency(e.target.value);
        //if (e.target.value !== "GHS") {
        //    checkIfRatesExist(e.target.value);
        //} else {
        //    setExchangeRate("");
        //}
    };

    const handleDiscountTypeOnchange = (e) => {
        setFormData({
            ...formData,
            discountType: e.target.value,
        });

        switch (e.target.value) {
            case "general":
                setDiscountTypeToShow({
                    discountAmount: false,
                    itemDiscountAmnt: true,
                });
                break;
            case "selective":
                setDiscountTypeToShow({
                    discountAmount: true,
                    itemDiscountAmnt: false,
                });
                break;
            default:
                setDiscountTypeToShow({
                    discountAmount: false,
                    itemDiscountAmnt: false,
                });
                break;
        }
    };



    useEffect(() => {
        //console.log('Currency', currency)
        setUrls([
            `/api/GetCustomers/${selectedBranch?.code}`,
            "/api/GetCurrency",
            `/api/GetProductList/${currency}`,
        ]);
        setFormData((prev) => ({ ...prev, currency: currency }));
    }, [currency]);

    useEffect(() => {

        if (currency && formData.date) {
            if (currency !== "GHS") {
                checkIfRatesExist(currency, formData.date);
            }
        }


    }, [currency, formData.date]);



    const [isCashCustomer, setIsCashCustomer] = useState(true);

    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            identity: "",
            date: new Date(Date.now()),
        }));
        // if (isCashCustomer) {
        // } else {
        //   setFormData((prev) => ({ ...prev, date: "" }));
        // }

        return () => { };
    }, [isCashCustomer]);



    const refetchPOItems = async () => {
        setShowLoading(true)

        try {
            const request = await axios.get(`/api/GetPOItems/${formData?.pon}/${formData?.identity}`)

            console.log({ request: request.data })

            if (request?.data) {

                const { taxes } = request.data

                const { levy1Rate = 0, levy2Rate = 0, levy3Rate = 0, levy4Rate = 0, spLevy1Rate = 0, vatRate = 15 } = taxes

                const vatObj = {
                    covidRate: levy3Rate,
                    cstRate: levy4Rate,
                    cstWithVat: 0,
                    getfundRate: levy2Rate,
                    nhilRate: levy1Rate,
                    regularLeviesWithVat: 0,
                    tourismRate: spLevy1Rate,
                    trsmWithVat: 0,
                    vatRate: vatRate
                }

                setPOTaxes(vatObj)

                setFormData((prev) => ({ ...prev, ponTaxes: vatObj }))

                setGridData([])
                setProductsList([])
                let arr = [], gridItem = {}
                for (let i = 0; i < request.data.items.length; i++) {
                    let obj = {}
                    const item = request.data.items[i];
                    const getItem = defaultProductsList.find(x => x?.code === item?.itemCode)

                    console.log({ getItem })

                    if (getItem != undefined) {
                        obj = {
                            ...getItem,
                            price: item?.price,
                            stockQuantity: item?.quantity,
                            quantity: 1,
                            itemName: getItem.name,
                            price: item?.price,
                            vatItemId: getItem?.id,
                            itemCode: item?.itemCode,
                            otherLevies: getItem?.otherLevies,
                            isTaxInclusive: getItem?.isTaxInclusive,
                            discountType: getItem?.discountType,
                            discount: getItem?.discount,
                            // isTaxable: getItem?.taxable,
                            otherLeviesType: getItem?.otherLevies,
                            taxable: true,
                            isTaxable: true
                        }

                        let csttourism = 0;
                        if (getItem.otherLevies === "NON") {
                            csttourism = 0;
                        } else if (getItem.otherLevies === "CST") {
                            csttourism =
                                (cstRate / 100) * obj.price * obj.quantity;
                        } else if (getItem.otherLevies === "TRSM") {
                            csttourism =
                                (tourismRate / 100) * obj.price * obj.quantity;
                        }

                        gridItem = getPayableAmount(
                            { ...obj },
                            discount,
                            poTaxes
                        );
                        setGridData((gridData) => ([...gridData, { ...gridItem, stockQuantity: obj?.stockQuantity, taxable: true, isTaxable: true }]));

                        console.log({ refetchPOItemsfound: gridItem })

                        setProductsList((prev) => ([...prev, obj]))
                        setShowAddItem(true)
                        setIsItemAdded(true)

                    } else {
                        console.log({ refetchPOItemsfoundNot: getItem })
                    }
                }
            }

            // const responseData = JSON.parse(request?.data)

            responseData?.data.length === 0 ? setProductsList([]) : setProductsList(responseData?.data)

        } catch (error) {

        } finally {
            setShowLoading(false)
        }

    }

    useEffect(() => {

        if (formData?.pon.length === 0) {
            setGridData([])
            setProductsList(defaultProductsList)
        } else {
            refetchPOItems()
        }

        return () => {
            //cleanup
        };
    }, [formData?.pon]);

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            refetchPOItems()
        }
    };


    return (
        <>
            {loading ? <Loader /> : null}
            {showLoading ? <Loader /> : null}
            <Card
                className="bg-secondary shadow"
                style={{ width: "40%", height: "550px" }}
            >
                <CardBody>
                    <div
                        style={{
                            zIndex: 100000,
                            display: "flex",
                            flexDirection: "roq",
                            justifyContent: "center",
                            alignItems: "center",
                            position: "absolute",
                        }}
                    >
                        {" "}
                    </div>
                    {/* <ToastContainer /> */}
                    {/* to show tooltip after item has been added and discount type input disabled */}

                    <Form>
                        <h6 className="heading-small text-muted mb-2">Invoice Details</h6>
                        <div className="pl-lg-4"></div>
                        <Row style={{ marginBottom: 5 }}>
                            <Col lg="12">
                                <div
                                    style={{ display: "flex", justifyContent: "space-between" }}
                                >
                                    <label
                                        className="form-control-label label-mb-0 "
                                        style={{ alignSelf: "center" }}
                                    >
                                        Customer <code style={{ color: "darkred" }}>*</code>
                                    </label>
                                    <span>
                                        <input
                                            id="custType"
                                            disabled={Boolean(gridData.length)}
                                            className="m-2 mb-1"
                                            type="checkbox"
                                            onChange={(e) => {
                                                setIsCashCustomer(e.target.checked);
                                                setFormData((prev) => ({ ...prev, customer: "" }));
                                                setShowAddItem(false);
                                            }}
                                            checked={Boolean(isCashCustomer)}
                                            value={isCashCustomer}
                                        />
                                        <label htmlFor="custType">Cash Customer</label>
                                    </span>
                                </div>
                                {!isCashCustomer ? (
                                    <Autocomplete
                                        suggestions={customers}
                                        formData={formData}
                                        setFormData={setFormData}
                                        businessPartner={"Customer"}
                                    />
                                ) : (
                                    <Input
                                        className="form-control font-sm"
                                        placeholder="Cash customer name"
                                        value={formData.customer}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                customer: e.target.value,
                                            })
                                        }
                                        bsSize="sm"
                                    />
                                )}
                            </Col>
                        </Row>
                        <Row style={{ marginBottom: 5 }}>
                            <Col lg="6">
                                <label htmlFor="custTin" className="form-control-label">
                                    {" "}
                                    Ghana Card/TIN
                                </label>
                                <Input
                                    // style={{ marginTop: "32px" }}
                                    disabled
                                    id="custTin"
                                    className="form-control font-sm"
                                    bsSize="sm"
                                    placeholder="Ghana Card / TIN"
                                    value={formData.identity}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            identity: e.target.value,
                                        })
                                    }
                                />
                            </Col>
                            <Col lg="6">
                                <label htmlFor="currency" className="form-control-label ">
                                    Currency {exchangeRate === 1 ? "" : exchangeRate}
                                </label>
                                <select
                                    className="form-control font-sm"
                                    id="currency"
                                    value={currency}
                                    onChange={handleCurrencySelect}
                                    disabled={Boolean(gridData.length)}
                                    style={{ height: 29, padding: "0px 5px" }}
                                >
                                    {currencies && currencies?.map((currency, index) => (
                                        <option
                                            key={index}
                                            name={currency?.name || ""}
                                            id={currency?.code || ""}
                                            value={currency?.code || ""}
                                        >
                                            {currency?.code || ""}
                                        </option>
                                    ))}
                                </select>{" "}
                            </Col>
                        </Row>

                        <Row style={{ marginBottom: 5 }}>
                            <Col lg="6">
                                <label
                                    htmlFor="invoiceDate"
                                    className="form-control-label label-mb-0"
                                >
                                    Invoice Date <code style={{ color: "darkred" }}>*</code>
                                </label>
                                <DatePicker
                                    id="invoiceDate"
                                    maxDate={new Date()}
                                    placeholderText="Invoice date"
                                    className="form-control font-sm"
                                    showIcon
                                    dateFormat="yyyy/MM/dd"
                                    disabled={Boolean(gridData?.length)}
                                    selected={formData.date}
                                    minDate={new Date(2023, 0, 1)}
                                    onChange={(e) => {
                                        //set invoice date and reset due date when invoice date changes
                                        setFormData({ ...formData, date: e, dueDate: null });

                                    }}
                                    style={{ height: 29, padding: "0px 5px" }}
                                />
                            </Col>
                            <Col lg="6">
                                <label
                                    htmlFor="dueDate"
                                    className="form-control-label label-mb-0"
                                >
                                    Due Date
                                </label>
                                <DatePicker
                                    id="dueDate"
                                    minDate={formData.date ? formData.date : null}
                                    placeholderText="Due date"
                                    className="form-control font-sm"
                                    disabled={!formData.date || Boolean(gridData?.length)}
                                    showIcon
                                    dateFormat="yyyy/MM/dd"
                                    selected={formData.dueDate}
                                    onChange={(e) => {
                                        console.log({ e });
                                        setFormData({ ...formData, dueDate: e });
                                    }}
                                    style={{ height: 29, padding: "0px 5px" }}
                                />
                            </Col>
                        </Row>
                        <Row style={{ marginBottom: 5 }}>
                            <Col
                                data-tip
                                data-for="discount-type"
                                lg="6"
                                style={{ position: "relative" }}
                            >
                                <label className="form-control-label" htmlFor="discountType">
                                    Discount&nbsp;Type
                                </label>
                                {/* {Boolean(gridData?.length) && (
                  <Tooltip
                    id="discount-type"
                    place="top"
                    type="info"
                    effect="float"
                  >
                    <span>
                      Discount type cannot be changed after
                      <br />
                      an item has been added.
                      <br />
                      Please remove item(s) and try again
                    </span>
                  </Tooltip>
                )} */}
                                <select
                                    data-tip="discount-type"
                                    id="discountType"
                                    className="form-control font-sm"
                                    value={formData.discountType}
                                    onChange={handleDiscountTypeOnchange}
                                    // disabled={!isCashCustomer}
                                    style={{ height: 29, padding: "0px 5px" }}
                                >
                                    <option value={""}>No discount</option>
                                    <option value={"general"}>General</option>
                                    <option value={"selective"}>Selective</option>
                                </select>{" "}
                            </Col>
                            {discountTypeToShow.discountAmount && (
                                <Col lg="6">
                                    <label
                                        className="form-control-label label-mb-0"
                                        htmlFor="discountAmt"
                                    >
                                        Discount&nbsp;Amount
                                    </label>
                                    <Input
                                        type="number"
                                        className="form-control"
                                        placeholder="Discount amount"
                                        id="discountAmt"
                                        step={0.01}
                                        min={0}
                                        value={formData?.totalDiscount}
                                        // max={gridData?.reduce((total, item) => total + item.totalPayable, 0)|| }
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                totalDiscount: e.target.value,
                                            })
                                        }
                                        bsSize="sm"
                                    />
                                </Col>
                            )}
                            <Col lg="6" hidden={isCashCustomer} >
                                <label
                                    className="form-control-label label-mb-0"
                                    htmlFor="discountAmt"
                                >
                                    Purchase Order Number
                                </label>
                                <Input
                                    type="text"
                                    title="Enter Purchase Order Number and press enter"
                                    className="form-control"
                                    placeholder="Purchase order number"
                                    id="pon"
                                    name="pon"
                                    onBlur={getPOItems}
                                    onKeyPress={handleKeyPress}

                                    value={formData?.pon || ""}

                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            pon: e.target.value,
                                        })
                                    }
                                    bsSize="sm"
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col lg="6">
                                <button
                                    style={{
                                        backgroundColor: "transparent",
                                        border: "none",
                                        marginBottom: -50,
                                        marginTop: 5,
                                    }}
                                    type="button"
                                    onClick={() => {
                                        if (!formData?.date) {
                                            toast.warning("Please enter invoice date first");
                                            return;
                                        }
                                        if (
                                            formData.customer ||
                                            (isCashCustomer && formData.customer)
                                        ) {
                                            setShowAddItem(true);
                                        } else {
                                            toast.warning("Please enter customer name first");
                                        }
                                    }}
                                >
                                    {!showAddItem ? (
                                        <span aria-hidden={true}>
                                            <h4>+ Add Item</h4>
                                        </span>
                                    ) : null}
                                </button>
                            </Col>
                        </Row>

                        {showAddItem && (
                            <>
                                <Row
                                    style={{
                                        marginBottom: 5,
                                        marginTop: -20,
                                        position: "relative",
                                    }}
                                >
                                    <Col lg="12">
                                        <label
                                            className="form-control-label label-mb-0"
                                            htmlFor="input-email"
                                        >
                                            Item
                                        </label>
                                        {multifLoading ? (
                                            <p>Please wait, loading items ...</p>
                                        ) : (
                                            <>
                                                {/* <div hidden={formData?.pon.length > 0 ? false : true}>
                          <input disabled className="form-control" style={{ height: 30 }} />
                        </div>
                        <div hidden={formData?.pon.length > 0 ? true : false}> */}
                                                <AutocompleteItems
                                                    gridData={gridData}
                                                    suggestions={productsList}
                                                    formData={formData}
                                                    setFormData={setFormData}
                                                    setDisabled={setDisabled}
                                                    setIsTaxable={setIsTaxable}
                                                // setSelectedItem={setSelectedItem}
                                                />
                                                {/* </div> */}
                                            </>

                                        )}
                                    </Col>
                                    <Col
                                        style={{
                                            position: "absolute",
                                            // right: "-67%",

                                            // float: "right",
                                            // cursor: "not-allowed",
                                        }}
                                        sm="12"
                                        md={12}
                                    >
                                        <input
                                            className="form-control-checkbox"
                                            id="isTaxable"
                                            type="checkbox"
                                            checked={isTaxable}
                                            onClick={() => {
                                                return;
                                            }}
                                            hidden
                                        />
                                        {/* &nbsp; &nbsp; */}
                                        {formData?.itemName ? (
                                            <label
                                                className="form-control-label font-sm"
                                                htmlFor="isTaxable"
                                                style={{
                                                    color: "teal",
                                                    fontSize: 11,
                                                    position: "absolute",
                                                    right: 20,
                                                    top: 10,
                                                }}
                                            >
                                                {isTaxable ? "Taxable" : "Non-Taxable"}
                                            </label>
                                        ) : null}
                                    </Col>
                                </Row>

                                <Row style={{ marginBottom: 10 }}>
                                    <Col lg="6">
                                        <label
                                            className="form-control-label label-mb-0"
                                            htmlFor="qty"
                                        >
                                            Quantity
                                        </label>
                                        <Input
                                            disabled={disabled}
                                            className="form-control-alternative"
                                            id="qty"
                                            // step={0.01}
                                            placeholder="Quantity"
                                            type="number"
                                            value={formData?.quantity}
                                            onChange={(e) => {
                                                setFormData({
                                                    ...formData,
                                                    quantity: e.target.value,
                                                });
                                                // let valNum = new RegExp(/^\d*(\.\d{0,2})?$/);
                                                // if (valNum.test(e.target.value)) {
                                                // }
                                            }}
                                            onBlur={() => {
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    quantity: Number(formData?.quantity).toFixed(4),
                                                }));
                                            }}
                                        // onKeyUp={validateInput(formData.quantity)}
                                        />
                                    </Col>
                                    <Col lg="6">
                                        <label
                                            className="form-control-label label-mb-0"
                                            htmlFor="price"
                                        >
                                            Price({formData.currency}){" "}
                                            {isTaxable &&
                                                (formData.isTaxInclusive ? "-Tax Incl." : "-Tax Excl.")}
                                        </label>
                                        <CurrencyInput
                                            min={1}
                                            id="price"
                                            name="price"
                                            className={`form-control form-control-alternative form-control-sm text-right`}
                                            placeholder="0.00"
                                            defaultValue={formData.price}
                                            value={formData.price}
                                            decimalsLimit={3}
                                            onValueChange={(value, name) => {

                                                value < 1 ? setFormData({
                                                    ...formData,
                                                    price: 0,
                                                }) :

                                                    setFormData({
                                                        ...formData,
                                                        price: value,
                                                    })
                                            }}
                                        />
                                        <Input
                                            hidden
                                            disabled={formData?.pon.length > 0 ? true : false}
                                            className="form-control-alternative"
                                            id="price"
                                            placeholder="Price"
                                            type="number"
                                            value={formData.price}
                                            min={"1"}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    price: e.target.value,
                                                })
                                            }
                                            onBlur={() => {
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    price: Number(formData?.price).toFixed(4),
                                                }));
                                            }}
                                            style={{ textAlign: "right" }}
                                        // onKeyDown={validateInput(formData.price)}
                                        />
                                        {
                                            formData.discountType === "general" ? <Badge style={{ fontSize: 9, float: "right" }} className="mt-1" color='primary' >Discount Amount: {moneyInTxt(formData?.discount, 'en', 2) || 0}</Badge> : null
                                        }


                                    </Col>
                                </Row>

                                <Row hidden style={{ marginBottom: 5 }}>
                                    <Col
                                        lg="6"
                                        style={{
                                            paddingTop: "0px",
                                        }}
                                    >
                                        <input
                                            className="form-control-checkbox"
                                            id="isTaxable"
                                            type="checkbox"
                                            checked={isTaxable}
                                        // disabled
                                        />
                                        &nbsp; &nbsp;
                                        <label className="form-control-label" htmlFor="isTaxable">
                                            Is it taxable?{"     "}
                                        </label>
                                    </Col>
                                    {discountTypeToShow.itemDiscountAmnt && (
                                        <Col lg="6">
                                            <label
                                                className="form-control-label label-mb-0"
                                                htmlFor="discountAmnt"
                                            >
                                                Discount Amount
                                                {/* Discount Price (at 0.0%) */}
                                            </label>
                                            <Input
                                                className="form-control-alternative font-sm"
                                                id="discountAmnt"
                                                placeholder="Discount Amount"
                                                type="number"
                                                step={0.01}
                                                value={discount}
                                                min={"0"}
                                                onChange={(e) => setDiscount(e.target.value)}
                                                onKeyDown={validateInput(formData.price)}
                                                bsSize="sm"
                                            />
                                        </Col>
                                    )}
                                </Row>
                                <Row style={{ marginBottom: 13 }}>
                                    <Col lg="12">
                                        <label
                                            className="form-control-label label-mb-0"
                                            htmlFor="remarks"
                                        >
                                            Remarks
                                        </label>
                                        <Input
                                            disabled={false}
                                            className="form-control-alternative"
                                            id="remarks"
                                            placeholder="Remarks"
                                            type="text"
                                            value={comments}
                                            onChange={(e) => setComments(e.target.value)}
                                        />
                                    </Col>
                                </Row>

                                <Row>
                                    <Col lg="6">
                                        <Button
                                            disabled={formData.quantity > 0 || formData?.price > 0 || loading ? false : true}
                                            color="primary"
                                            onClick={() => addRecordToData(formData)}
                                            type="button"
                                            style={{ width: "100%" }}
                                            size="sm"
                                        >
                                            ADD ITEM
                                        </Button>
                                    </Col>
                                    <Col lg="6">
                                        <Button
                                            disabled={loading}
                                            color="success"
                                            type="button"
                                            onClick={saveInvoice}
                                            style={{ width: "100%" }}
                                            size="sm"
                                        >
                                            {loading ? "Submitting..." : "SUBMIT INVOICE"}
                                        </Button>
                                    </Col>
                                </Row>
                                <Row></Row>
                            </>
                        )}
                    </Form>
                </CardBody>

                <div className="modal-footer"></div>
            </Card>
        </>
    );
}

export default InvoiceForm;

const styles = {
    th: {
        background: "white",
        position: "sticky",
        top: 0 /* Don't forget this, required for the stickiness */,
    },
};
