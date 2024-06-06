import React, { useEffect, useState } from "react";
import { Modal, Button } from "reactstrap";
import Draggable, { DraggableCore } from "react-draggable";

import Loader from "components/Modals/Loader";
import { FaThumbsUp, FaTrash, FaTrashAlt } from "react-icons/fa";

export default function RetryPrompt({ isRetryLoading = false, isRemoveLoading = false, handleClose = () => { }, cancelHandeler = () => { }, confirmHandeler = () => { }, title = "", message, showPrompt, setShowPrompt }) {
  console.log({ isRemoveLoading })
  return (
    <>
      <Draggable>
        <Modal
          className="modal-dialog-centered modal-danger modal-sm"
          contentClassName="bg-gradient-primary"
          isOpen={showPrompt}
          size="small"
          style={{ width: "20vw", cursor: "move" }}
        // draggable
        >

          <div className="modal-header" style={{ height: 0 }}>
            <h6 className="modal-title" id="modal-title-notification">
              {title}
            </h6>
            <button
              aria-label="Close"
              className="close"
              data-dismiss="modal"
              type="button"
              onClick={handleClose}
            >
              <span aria-hidden={true}>×</span>
            </button>
          </div>
          <div className="modal-body" style={{ height: 200 }}>
            <div className="text-center">
              <i className="ni ni-bell-55 ni-2x" />
              <h4 className="heading mt-2">Hi there...</h4>
              <p>{message}</p>
            </div>
          </div>
          <div className="modal-footer">
            <Button
              style={{ width: "45%" }}
              color="success"
              type="button"
              onClick={confirmHandeler}
              size="sm"
              disabled={isRemoveLoading}
            >
              <FaThumbsUp style={{ margin: 2, marginTop: -2.5 }} />
              Retry
            </Button>
            <Button
              className="text-white ml-auto"
              color="danger"
              data-dismiss="modal"
              type="button"
              onClick={cancelHandeler}
              size="sm"
              style={{ width: "45%" }}
              disabled={isRemoveLoading}
            >
              <FaTrashAlt style={{ margin: 2, marginTop: -2.5 }} />
              Remove Invoice
            </Button>
          </div>

        </Modal>
      </Draggable>
    </>
  );
}
