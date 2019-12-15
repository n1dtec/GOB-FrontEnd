import Col from "react-bootstrap/Col";
import Toast from "react-bootstrap/Toast";
import React, {useState} from "react";

/*
 * Author : Harnidh Kaur
 * Project : Guardians of the Babies
 * Subject : TCSS 559
 *
 * This class builds the notification alert when restricted users are too close to the baby
 */

const NotificationAlert = ({value}) => {
    const [show, setShow] = useState(true);

    return (
        <Col xs={12}>
            <div
                aria-live="polite"
                aria-atomic="true"
                style={{
                    position: 'relative',
                    minHeight: '50px',
                    width: '100%'
                }}
            >

                <Toast border="danger" style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                }} onClose={() => setShow(false)} show={show} delay={2000} autohide>
                    <Toast.Header>
                        <strong className="mr-auto">Notification</strong>
                    </Toast.Header>

                    {
                        //This code iterates over the warning json received from Backend and builds the Toast to alert the users
                        value.length > 0 ?
                        value.map((warning) => {
                            return (

                                <Toast.Body style={{fontSize: 16, padding: 5, margin: 0}}>{warning.user} is too close to
                                    the baby
                                    ({warning.distance}m)</Toast.Body>

                            );
                        }) : <Toast.Body></Toast.Body>
                    }

                </Toast>
            </div>
        </Col>
    );
};

export default NotificationAlert;