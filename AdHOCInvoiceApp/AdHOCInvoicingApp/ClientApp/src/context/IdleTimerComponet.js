
import React, { useEffect, useState } from "react";
//import { useIdleTimer } from "react-idle-timer";
import { useLocation } from "react-router-dom";
import { Button, Modal } from "reactstrap";
import { logout } from "services/AuthService";


const IdleTimerComponet = (props) => {
 return "IdleTimer Component"

// const timeout = 1000 * 60 * 5;
// //const timeout = 1000 * 5;
//  const promptTimeout = 1000 * 15;

//  const [open, setOpen] = useState(false);
//  const [remaining, setRemaining] = useState(0);
 
//const location = useLocation()
  

//  const onPrompt = () => {
//    // onPrompt will be called after the timeout value is reached
//    // In this case 30 minutes. Here you can open your prompt.
//    // All events are disabled while the prompt is active.
//    // If the user wishes to stay active, call the `reset()` method.
//    // You can get the remaining prompt time with the `getRemainingTime()` method,
//    setOpen(true);
//    setRemaining(promptTimeout);
//  };

//  const onIdle = () => {
//    // onIdle will be called after the promptTimeout is reached.
//    // In this case 30 seconds. Here you can close your prompt and
//    // perform what ever idle action you want such as log out your user.
//    // Events will be rebound as long as `stopOnMount` is not set.

//    setOpen(false);

//    // sessionStorage.setItem("previous", location?.pathname)
 
//    logout();
//    setRemaining(0);
//  };

//  const onActive = () => {
//    // onActive will only be called if `reset()` is called while `isPrompted()`
//    // is true. Here you will also want to close your modal and perform
//    // any active actions.
//    setOpen(false);
//    setRemaining(0);
//  };

//  const { getRemainingTime, isPrompted, activate } = useIdleTimer({
//    timeout,
//    promptTimeout,
//    onPrompt,
//    onIdle,
//    onActive,
//  });

//  const handleStillHere = () => {
//    setOpen(false);
//    activate();
//  };

//  useEffect(() => {
//    const interval = setInterval(() => {
//      if (isPrompted()) {
//        setRemaining(Math.ceil(getRemainingTime() / 1000));
//      }
//    }, 1000);

//    return () => {
//      clearInterval(interval);
//    };
//  }, [getRemainingTime, isPrompted]);



//  return (
//    <div>
//            <Modal
//                className='modal-dialog-centered modal-warning'
//                contentClassName='bg-gradient-info'
//                isOpen={open}
//            >
//                {' '}
//                <div className='modal-header'>
//                    <h6 className='modal-title' id='modal-title-notification'>
//                        Your attention is required
//                    </h6>

//                </div>
//                <div className='modal-body'>
//                    <h2>Are you still here?</h2>
//                    <h3>Logging out in {remaining} seconds</h3>

//                </div>
//                <div className='modal-footer'>
//                    <Button
//                        className='btn-white'
//                        color='default'
//                        type='button'
//                        onClick={handleStillHere}
//                    >
//                        I'm still here
//                    </Button>

//                </div>
//            </Modal>
//        </div>
//  );
};

export default IdleTimerComponet;
