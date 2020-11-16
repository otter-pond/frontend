import React, {useState, useRef} from "react";
import {Button} from "reactstrap";
import PaymentAPI from "../../../api/PaymentAPI";
import NotificationAlert from 'react-notification-alert';


const ExecutePaymentButton = (props) => {
    const entry = props.entry;
    let paymentApi = new PaymentAPI();
    let notification = useRef(null)
    let [show, setShow] = useState(true);
    let [clicked, setClicked] = useState(false);


    if (!entry || entry.status !== "PENDING APPROVAL")
        return <></>

    let notify = (status) => {
        var options = {
            place: "tc",
            message: null,
            type: null,
        }
        if (status === "success") {
            options.message = "Successfully executed charge";
            options.type = "primary"
        }
        if (status === "failure") {
            options.message ="Error executing charge"
            options.type = "danger"
        }
        notification.current.notificationAlert(options);
    }

    let executePayment = () => {
        let entryId = entry["entry_id"]
        if (clicked)
            return
        setClicked(true)

        paymentApi.executeCharge(entryId).then(result => {
            if (result["error"] === "Success") {
                notify("success")
                if (props.callback)
                    props.callback()
                setShow(false)
            } else {
                notify("failure")
            }
        }).catch(e => {
            notify("failure")
        })
    }

    return <>
        {show &&
        <Button size={"sm"}
                color={"secondary"}
                onClick={() => {executePayment()}}
        >Execute Payment</Button>
        }
        <NotificationAlert ref={notification} />
    </>
}

export default ExecutePaymentButton