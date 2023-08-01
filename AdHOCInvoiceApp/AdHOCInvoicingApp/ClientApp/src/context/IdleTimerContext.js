import { useEffect, useState } from "react";
import {
    IdleTimerProvider,
    PresenceType,
    useIdleTimerContext,
} from "react-idle-timer";
import { toast } from "react-toastify";
import { logout } from "services/AuthService";
import {Modal, Button} from "reactstrap"


const timeout = 300_000;
const promptBeforeIdle = 15000;


function Prompt(props) {
    const [remaining, setRemaining] = useState(0);

    const { activate, getRemainingTime } = useIdleTimerContext();

    useEffect(() => {
        const interval = setInterval(() => {
            setRemaining(Math.ceil(getRemainingTime() / 1000));
        }, 500);

        return () => {
            clearInterval(interval);
        };
    });

    return (
        <div>
            <Modal
                className='modal-dialog-centered modal-warning'
                contentClassName='bg-gradient-info'
                isOpen={props.open}
            >
                {' '}
                <div className='modal-header'>
                    <h6 className='modal-title' id='modal-title-notification'>
                        Your attention is required
                    </h6>

                </div>
                <div className='modal-body'>
                    <h2>Are you still here?</h2>
                    <h3>Logging out in {remaining} seconds</h3>

                </div>
                <div className='modal-footer'>
                    <Button
                        className='btn-white'
                        color='default'
                        type='button'
                        onClick={activate}
                    >
                        I'm still here
                    </Button>

                </div>
            </Modal>
        </div>
    );
}

export const IdleTimerProviderWrapper = () => {
    const [state, setState] = useState("Active");
    const [count, setCount] = useState(0);
    const [open, setOpen] = useState(false);


    const onPrompt = () => {
        setState("Prompted");
        setOpen(true);
    };

    const onIdle =  () => {
        setState("Idle");
        setOpen(false);
        toast.warn("Logging you out...")
         logout();
    };

    const onActive = () => {
        setState("Active");
        setOpen(false);
    };

    const onAction = () => {
        setCount(count + 1);
    };

    return (
        <IdleTimerProvider
            timeout={timeout}
            promptBeforeIdle={promptBeforeIdle}
            throttle={500}
            onPrompt={onPrompt}
            onIdle={onIdle}
            onActive={onActive}
            onAction={onAction}
        >
            <Prompt open={open} />
        </IdleTimerProvider>
    );
};
