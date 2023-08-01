import React, { useState, useContext } from "react"
 import { useGet } from "../hook/useGet"
 

export const InvoiceContext = React.createContext()
export const useInvoice = () => useContext(InvoiceContext)

export const InvoiceProvider = ({
    children
}) => {


    const [invoices, setInvoices] = useState([])
    const [newInvoiceFormData, setNewInvoiceFormData] = useState({})
    const [itemsCategories, setitemsCategories] = useState([])
    const [currencies, setCurrencies] = useState([])
    const [taxSummary, setTaxSammary] = useState({})
    /*const axios = useCustomAxios()*/
    const onSuccess = (data) => {
       
        if (data?.StatusCode === 401) {
                window.location.href = `${process.env.REACT_APP_BASENAME}/login`
        } else {
            setitemsCategories(JSON.parse(data?.data))
        }
       
    }

    const onError = (error) => {
        console.log({error})
        window.location.href = `${process.env.REACT_APP_BASENAME}/login`
    }
    const onSuccess_Crr = (data) => {
        if (data?.StatusCode === 401) {
            window.location.href = `${process.env.REACT_APP_BASENAME}/login`
        } else {
            setCurrencies(JSON.parse(data?.data))
        }
     
    }

    const onError_Crr = (error) => {
        console.log({error})
        window.location.href = `${process.env.REACT_APP_BASENAME}/login`

    }

    const { refetch: getItemCategories } = useGet(`/api/GetItemCategories`, "items-categories", onSuccess, onError)

    const { refetch: getCurrencies } = useGet(`/api/GetTransactionCurrencies`, "currencies", onSuccess_Crr, onError_Crr)

    const handleSearch = async () => {
       
        return "helloo"
    }


    return (
        <InvoiceContext.Provider
            value={{
                invoices,
                setInvoices,
                handleSearch,
                newInvoiceFormData,
                setNewInvoiceFormData,
                getItemCategories,
                itemsCategories,
                setitemsCategories,
                currencies,
                getCurrencies,
                taxSummary, 
                setTaxSammary
            }}
        >
            {children}
        </InvoiceContext.Provider>
    )
}