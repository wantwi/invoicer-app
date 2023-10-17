import React, { useEffect, useState } from "react";
import { Modal, Button } from "reactstrap";

import Loader from "components/Modals/Loader";

export default function ComfirmPrompt({confirmHandeler, title="", message, showPrompt, setShowPrompt }) {
  return (
    <>
      
      <Modal
        className="modal-dialog-centered modal-danger"
        contentClassName="bg-gradient-danger"
        isOpen={showPrompt}
      >
        <div className="modal-header">
          <h6 className="modal-title" id="modal-title-notification">
           {title}
          </h6>
          <button
            aria-label="Close"
            className="close"
            data-dismiss="modal"
            type="button"
            onClick={() => {
              setShowPrompt(false);
            }}
          >
            <span aria-hidden={true}>×</span>
          </button>
        </div>
        <div className="modal-body">
          <div className="py-3 text-center">
            <i className="ni ni-bell-55 ni-3x" />
            <h4 className="heading mt-4">Hi there...</h4>
            <p>{message}</p>
          </div>
        </div>
        <div className="modal-footer">
          <Button
            className="btn-white"
            color="default"
            type="button"
            onClick={confirmHandeler}
          >
            Yes
          </Button>
          <Button
            className="text-white ml-auto"
            color="link"
            data-dismiss="modal"
            type="button"
            onClick={() => {
              setShowPrompt(false);
            }}
          >
            No
          </Button>
        </div>
      </Modal>
    </>
  );
}
