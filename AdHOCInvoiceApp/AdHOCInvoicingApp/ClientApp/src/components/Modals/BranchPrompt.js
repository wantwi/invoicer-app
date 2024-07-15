import React from "react";
import { Modal, Button } from "reactstrap";
import BRANCHIMG from "../../assets/img/BRANCHIMG.png";
import Loader from "./Loader";

export default function BranchPrompt({
  message,
  showPrompt,
  setshowPrompt,
  eventHandler,
  handleBranchChange,
  branch,
  loading,
  data=[],
  placeholder = "Select branch",
  fontSize = "1.5rem",
  showimg = true
}) {





  return (
    <>
      <Modal
        className="modal-dialog-centered"
        contentClassName="bg-gradient-warning"
        isOpen={showPrompt}

        size="lg"
      >
        {" "}
        {loading ? <Loader /> : null}
        <div className="modal-header">
          <h5 className="modal-title text-white" id="modal-title-notification">
            Your attention is required
          </h5>
          {/* <button
            aria-label="Close"
            className="close"
            data-dismiss="modal"
            type="button"
            onClick={() => setshowPrompt(false)}
          >
            <span aria-hidden={true}>×</span>
          </button> */}
        </div>
        <div className="modal-body" style={{ width: "25vw" }}>
          <div className="text-center">
            {/* <i className='ni ni-bell-55 ni-3x' /> */}
            {showimg && <img src={BRANCHIMG} alt="refund" style={{ width: 100 }} />}
            <h4 className="heading mt-2 text-white">Hi there...</h4>
            <p style={{ fontSize }} className="text-white">{message}</p>
            <select className="form-control form-control-sm form-select p-1" value={branch} onChange={handleBranchChange}>
              <option value={''}>{placeholder}</option>

              {
                data?.map(x => <option key={x?.code} value={x?.code}>{x?.name}</option>)
              }

            </select>

          </div>
          {/* <input type="checkbox" className="font-size-small mt-2" /><span> Remember</span> */}
        </div>
        <div className="modal-footer">
          <Button
            className="btn-white"
            color="default"
            type="button"
            onClick={eventHandler}
          // style={{ width: "100%" }}
          >
            Confirm
          </Button>

          {/* <Button
            className="text-white ml-auto"
            color="link"
            data-dismiss="modal"
            type="button"
            onClick={() => {
              setshowPrompt(false);
            }}
          >
            Close
          </Button> */}
        </div>
      </Modal>
    </>
  );
}
