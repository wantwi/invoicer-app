import React, { useEffect, useState } from "react";
import { Modal, Button } from "reactstrap";
import refund from "../../assets/img/theme/refundimg.png";
import { toast } from "react-toastify";
import Loader from "./Loader";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import useCustomAxios from "hooks/useCustomAxios";
import { v4 as uuid } from "uuid";
import useAuth from "hooks/useAuth";

export default function Prompt({
  message,
  showPrompt,
  setshowPrompt,
  refundInvoice,
  reset,
  setOpen,
  refundTypeForPost,
}) {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const axios = useCustomAxios();
  const { selectedBranch, user } = useAuth();

  const submitRefund = async ({ postData, refundType }) => {
    setLoading(true);
    const request = await axios.post(
      `/api/PurchaseReturn`,
      postData
    );
console.log({request});
    if(request?.data.status >=400){
      const error = new Error(JSON.parse(request?.data?.data)?.message)

      error.code = request?.data?.status 
      //error.message = 

      throw error;
    }

    console.log({submitRefund: request});

    return request.data;
  };
  // console.log({refundTypeForPost, refundInvoice})

  const { mutate } = useMutation({
    mutationFn: submitRefund,
    onSuccess: (data) => {

      toast.success("Purchase Invoice successfully cancelled");
      setLoading(false);
      setshowPrompt(false);
      setOpen(false);
      queryClient.invalidateQueries(
        "purchase-returns",
        refundInvoice?.invoiceNumber
      );
      reset(uuid());
    },
    onError: (error) => {
      console.log({ useMutationError: error });
      toast.error(
        error?.message|| "Could not refund invoice. Please contact support."
      );
      setLoading(false);
      setshowPrompt(false);
    },
  });

  const postRefund = (invoice) => {
    // const isPartialRefund = invoice?.invoiceItemsToPost.every((item) => Boolean(item?.refundQuantity))
    // const isFullRefund = invoice?.invoiceItemsToPost.every((item) => item.quantity == 0)
    let postData = {};
    let refundTypeVal = "";
    // console.log({ refundTypeForPost })
    // return
    if (refundInvoice?.refundType === "NO REFUNDS") {
      if (refundTypeForPost == "Full") {
        postData = {
          id: invoice.id,
          invoiceNumber: invoice.invoiceNo,
          customerTinghcard: invoice.customerTinghcard,
          nameOfUser: user?.name,
         
        };
        refundTypeVal = "Full";
      } else {
        //get all items whose refundQty have been updated
        let temp = invoice?.invoiceItemsToPost.filter((item) =>
          Boolean(item.refundQuantity)
        );
        postData = {
         
          purchaseId: invoice.id,
          invoiceNumber: invoice.invoiceNo,
          customerTinghcard: invoice.customerTinghcard,
          nameOfUser: user?.name,
          branchCode:selectedBranch?.code,
          companyId:"",
          purchaseReturnItems: temp.map((item, idx) => {
            return {
              returnQuantity: item.refundQuantity,
              returnAmount:
                (item.refundQuantity *
                  invoice?.invoiceItems[idx]?.payablePrice) /
                invoice?.invoiceItems[idx]?.quantity,
                vatItemId: item.id,
            };
          }),
        };
        refundTypeVal = "Partial";
      }
    } else {
      let temp = invoice?.invoiceItemsToPost.filter((item) =>
        Boolean(item.refundQuantity)
      );
      postData = {
        purchaseId: invoice.id,
          invoiceNumber: invoice.invoiceNo,
          customerTinghcard: invoice.customerTinghcard,
          nameOfUser: user?.name,
          branchCode:selectedBranch?.code,
          companyId:"",
          purchaseReturnItems: temp.map((item, idx) => {
            return {
              returnQuantity: item.refundQuantity,
              returnAmount:
                (item.refundQuantity *
                  invoice?.invoiceItems[idx]?.payablePrice) /
                invoice?.invoiceItems[idx]?.quantity,
                vatItemId: item.id,
            };
          }),
        // id: invoice.id,
        // itemId: invoice.invoiceNo,
        // customerTinghcard: invoice.customerTinghcard,
        // nameOfUser: user?.name,
        // invoiceItems: temp.map((item, idx) => {
        //   return {
        //     refundQuantity: item.refundQuantity,
        //     refundAmount:
        //       (item.refundQuantity * invoice?.invoiceItems[idx]?.price) /
        //       invoice?.invoiceItems[idx]?.quantity,
        //     vatItemId: item.id,
        //   };
        // }),
      };
      refundTypeVal = "Partial";
    }

    mutate({ postData, refundType: refundTypeVal });

    // return -1
    // setLoading(true)
    // fetch(`${process.env.REACT_APP_CLIENT_ROOT}/Refunds/${refundType}`, {
    //   method: 'POST', // or 'PUT'
    //   headers: {
    //     'Content-Type': 'application/json',
    //     Authorization: `Bearer ${userDetails.access_token}`,
    //   },
    //   body: JSON.stringify(postData),
    // })
    //   .then((response) => {
    //     // console.log(response)
    //     if (response.status === 401) {
    //       toast.error(
    //         'Token expired. Logging you out. Log back in to refresh token'
    //       )
    //       setTimeout(() => {
    //         window.location = '/'
    //       }, 3000)
    //     } else if (response.status === 200 || response.status === 201) {
    //       toast.success('Invoice successfully refunded')
    //       setLoading(false)
    //       setshowPrompt(false)
    //       setOpen(false)
    //     } else {
    //       toast.error('Could not refund invoice')
    //       setLoading(false)
    //       setshowPrompt(false)
    //     }
    //   })
    //   // .then((data) => {
    //   //   console.log(data)
    //   // })
    //   .catch((error) => {
    //     toast.error('Server Error. Could not refund invoice')
    //     setLoading(false)
    //     setshowPrompt(false)
    //   })
  };

  return (
    <>
      <Modal
        className="modal-dialog-centered modal-danger"
        contentClassName="bg-gradient-info"
        isOpen={showPrompt}
      >
        {" "}
        {loading ? <Loader /> : null}
        <div className="modal-header">
          <h6 className="modal-title" id="modal-title-notification">
            Your attention is required
          </h6>
          <button
            aria-label="Close"
            className="close"
            data-dismiss="modal"
            type="button"
            onClick={() => setshowPrompt(false)}
          >
            <span aria-hidden={true}>×</span>
          </button>
        </div>
        <div className="modal-body">
          <div className="py-3 text-center">
            {/* <i className='ni ni-bell-55 ni-3x' /> */}
            <img src={refund} alt="refund" />
            <h4 className="heading mt-4">Hi there...</h4>
            <p>{message}</p>
          </div>
        </div>
        <div className="modal-footer">
          <Button
            className="btn-white"
            color="default"
            type="button"
            onClick={() => postRefund(refundInvoice)}
          >
            Confirm
          </Button>
          <Button
            className="text-white ml-auto"
            color="link"
            data-dismiss="modal"
            type="button"
            onClick={() => {
              setshowPrompt(false);
            }}
          >
            Decline
          </Button>
        </div>
      </Modal>
    </>
  );
}
