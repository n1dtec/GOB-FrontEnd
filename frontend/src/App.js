import React, {Component} from 'react';
import Image from 'react-bootstrap/Image'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import {Button, Card, Col, Container, Jumbotron} from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import TemperateGauge from "./components/temperateGauge";
import Metrics from "./components/metrics";
import ReactDOM from "react-dom";
import NotificationAlert from "./components/notificationAlert";
import OxygenGauge from "./components/oxygenGauge";
import SoundGauge from "./components/soundGauge";
import HeartbeatGauge from "./components/heartbeatGauge";
import HumidityGauge from "./components/humidityGauge";
import DeleteUser from "./DeleteUser";
import Homepage from "./Homepage";
import AddUser from "./AddUser";
import UpdateUser from "./UpdateUser";

/*
 * Author : Harnidh Kaur
 * Project : Guardians of the Babies
 * Subject : TCSS 559
 *
 * This class builds the dashboard of the Web Application after the user logs in
 */

class App extends Component {

    /*
     * This method is called when the Component of App.js is created
     */
    constructor(props) {

        super(props);

        this.demoRoomState = this.demoRoomState.bind(this);
        this.addUsers = this.addUsers.bind(this);
        this.deleteUsers = this.deleteUsers.bind(this);
        this.updateUsers = this.updateUsers.bind(this);

    }

    /*
     * The different variables used throughout the page are stored in the state
     */
    state = {

        // The current user is the one which logs into the system. The user ID 1 is admin user, and all others are non-admin
        currentUser: this.props.user,
        image: [],
        metrics: [],
        warning: [],
        curTime: null,
        phoneNumber: '2067140670',
        weather: 49,
        metricFlag: true,
        smsFlag: true,
        customWarning: 'Alert!%20Your%20baby%20is%20crying!',
        babyText: 'John is sleeping'

    };

    intervalID = null;

    // This method is called when the Component of App.js is being removed from the DOM
    componentWillUnmount() {
        if (this.intervalID === null) return;
        clearInterval(this.intervalID);
    }

    // This method is called when the Component of App.js has mounted into the DOM
    componentDidMount() {

        /*
         * The following code fragment calls the backend on page load and retrieves the value of the outside temperature (F)
         * which is displayed in the corresponding section on the dashboard
         */
        let request = new Request('http://localhost:8080/WeatherApp/Weather');
        fetch(request, {method: 'GET'})
            .then(function (response) {
                // Convert to text
                return response.text();
            })
            .then((data) => {
                data !== undefined ? this.state.weather = data.toString() : this.state.weather = '49';
                console.log("Weather" + data.toString());
            })
            .catch(console.log);

        /*
         * The following code calls the following APIs at an interval of 1000 milliseconds for updating the view in real-time:
         *  1. Get Current Stats of the Baby and its surroundings/room
         *  2. Check if any restricted users are in vicinity of the baby
         */
        this.intervalID = setInterval(() => {

            // Update the current time displayed on the dashboard
            this.setState({curTime: new Date().toLocaleString()});

            // If metricFlag is true, the current metrics from the backend are retrieved by calling the API and values are set in real time
            if (this.state.metricFlag) {
                //Call the backend to get current metrics(stats)
                let request = new Request('https://localhost:44348/getCurrentStats/1');
                fetch(request, {method: 'GET'})
                    .then(function (response) {
                        // Convert response to JSON and return it
                        return response.json();
                    })
                    .then((data) => {
                        // Use the data received in response to create the metrics for the baby's surroundings
                        this.setState({metrics: data.Table[0]}, () => {
                                this.setTemperature();
                                this.setOxygenLevel();
                                this.setSoundLevel();
                                this.setHeartbeatLevel();
                                this.setHumidityLevel();
                            }
                        );
                        this.setState({curTime: new Date().toLocaleString()});
                    })
                    .catch(console.log);
            }

            // Call the backend to receive the list of restricted users which are too close to the baby
            let request = new Request('https://localhost:44348/checkDistanceWarning/1');
            fetch(request, {method: 'GET'})
                .then(function (response) {
                    // Convert response to JSON
                    return response.json();
                })
                .then((userData) => {
                    // Store the userData received in response
                    this.state.warning = userData;
                    // Iterate over the list of users received in response to send SMS for every restricted user that is too close to the baby
                    this.state.warning.map((users) => {
                        userData.map((nUser) => {
                                // Make sure that SMS is sent once when state changes
                                if (nUser.user === users.user) {
                                    if (this.state.smsFlag) {
                                        let smsRequest = new Request('https://localhost:44348/sendNotification/' + this.state.phoneNumber + '/' + users.user.toString());
                                        fetch(smsRequest, {method: 'GET'});
                                        // After sending the SMS, set the flag as false so that SMS is sent only once. We are assuming that only one retricted user is close to the baby for the demo.
                                        this.state.smsFlag = false;
                                    }
                                }

                            }
                        )
                    })
                })
                .catch(console.log);

        }, 1000);

    }

    // Custom method to pause/sleep the function for the specified milliseconds
    sleep(time) {
        return new Promise((resolve) => {
            setTimeout(resolve, time || 1000);
        });
    }

    demoNotification() {

        /*
         * To demo the notification when restricted user enters the baby's room, the backend API is called which
         * sets the location of a restricted as 2m which is considered as being close to the baby
        */
        let request = new Request('https://localhost:44348/Demo/3');
        fetch(request, {method: 'GET'})
            .then(function (response) {
                // Convert to JSON
                return response.json();
            })
            .catch(console.log);
    }

    demoRoomState() {

        // To demo the state when baby is crying, the backend API is called to get the metrics at the 26th minute in the database
        let request = new Request('https://localhost:44348/getStats/1/26');
        fetch(request, {method: 'GET'})
            .then(function (response) {
                // Convert to JSON
                return response.json();
            })
            .then(async (data) => {

                // The metricFlag is flipped when Demo Room State button is clicked
                this.state.metricFlag = !this.state.metricFlag;

                // When the metric flag is false, the frontend displays the demo metrics and sends the SMS to warn about baby's state
                if(!this.state.metricFlag) {
                    // This segment calls the backend to send an SMS with a custom warning when the baby starts crying
                    let smsRequest = new Request('https://localhost:44348/sendCustomNotification/' + this.state.phoneNumber + '/' + this.state.customWarning);
                    fetch(smsRequest, {method: 'GET'});
                    await this.sleep(1000);
                }

                // This code sets the metrics in the frontend to the demo metrics
                this.setState({metrics: data.Table[0]}, async () => {
                        this.setTemperature();
                        this.setOxygenLevel();
                        this.setSoundLevel();
                        this.setHeartbeatLevel();
                        this.setHumidityLevel();
                    }
                );

            })
            .catch(console.log);

    }


    /*
     * The following five methods are helpers for setting values of the metrics which are retrieved from the backend
     */
    setTemperature = () => {
        this.state.metrics.Temperature = (parseFloat((parseFloat(this.state.metrics.Temperature) + (Math.random() % 10)).toFixed(2)));
    };

    setOxygenLevel = () => {
        this.state.metrics.Oxygene_level = (parseFloat((parseFloat(this.state.metrics.Oxygene_level) + (Math.random() % 10)).toFixed(2)));
    };

    setSoundLevel = () => {
        this.state.metrics.Sound = (parseFloat((parseFloat(this.state.metrics.Sound) + (Math.random() % 10)).toFixed(2)));
    };

    setHeartbeatLevel = () => {
        this.state.metrics.Heartbeat = (parseFloat((parseFloat(this.state.metrics.Heartbeat) + (Math.random() % 10)).toFixed(2)));
    };

    setHumidityLevel = () => {
        this.state.metrics.Humidity = (parseFloat((parseFloat(this.state.metrics.Humidity) + (Math.random() % 10)).toFixed(2)));
    };

    /*
     * This method handles the action taken when user clicks on the Logout button
     * The Homepage.js component is rendered on the root element of index.html
     */
    ifLogoutClicked() {
        ReactDOM.render(
            <Homepage/>,
            document.getElementById('root')
        );
    }

    /*
     * This method handles the action taken when an admin user clicks on the Delete Users tab
     * The DeleteUser.js component is rendered on the root element of index.html
     */
    deleteUsers() {
        ReactDOM.render(
            <DeleteUser user={this.state.currentUser}/>,
            document.getElementById('root')
        );
    }

    /*
     * This method handles the action taken when an admin user clicks on the Add Users tab
     * The AddUser.js component is rendered on the root element of index.html
     */
    addUsers() {
        ReactDOM.render(
            <AddUser user={this.state.currentUser}/>,
            document.getElementById('root')
        );
    }

    /*
     * This method handles the action taken when an admin user clicks on the Update Users tab
     * The UpdateUser.js component is rendered on the root element of index.html
     */
    updateUsers() {
        ReactDOM.render(
            <UpdateUser user={this.state.currentUser}/>,
            document.getElementById('root')
        );
    }

    /*
     * This method renders the view of the dashboard
     */
    render() {

        return (
            <Container lg="true" fluid>
                {
                    /*
                     * This is the standard navigation bar across the dashboard which gives the options for Managing Users for admins, Demo buttons to test the functionality and Logout button for all users
                     */
                }
                <Navbar bg="light" navbar-fixed-top="true">
                    <Navbar.Brand onClick={this.goToHome}>Guardians of the Babies</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="justify-content-end">
                            <Nav.Link onClick={this.goToHome}>Home</Nav.Link>
                            {
                                // This condition ensures that only Admin User(User ID = 1) is able to view the User Management options on the Navigation Bar
                                this.state.currentUser === "1" ?
                                    <NavDropdown title="Manage Users" id="basic-nav-dropdown">
                                        <NavDropdown.Item onClick={this.addUsers}>Add User</NavDropdown.Item>
                                        <NavDropdown.Item onClick={this.updateUsers}>Update User</NavDropdown.Item>
                                        <NavDropdown.Item onClick={this.deleteUsers}>Delete User</NavDropdown.Item>
                                    </NavDropdown>
                                    :
                                    <div/>
                            }
                        </Nav>
                        <Button variant="light" onClick={this.demoNotification}>Demo Notification</Button>
                        <Button variant="light" onClick={this.demoRoomState}>Demo Room State</Button>
                        <Button style={{marginLeft: 5, marginEnd: 0}} variant="outline-dark"
                                className="justify-content-end" onClick={this.ifLogoutClicked}>Logout</Button>
                    </Navbar.Collapse>
                </Navbar>

                {/* The Jumbotron holds the useful contents of the dashboard like baby's picture, metrics, gauges and warnings */}
                <Jumbotron fluid
                           style={{height:'100vh', background: 'linear-gradient(to right bottom, rgba(99,99,214,0.07), rgba(229,103,22,0.36))'}}>

                    <Container xs={11}>
                        <Row className="m-1">
                            <Col xs={10} md={6}>
                                {/* This Image section displays the baby's picture */}
                                <Image rounded fluid
                                       src={require('./components/media/picture.jpg')}
                                />
                            </Col>
                            <Col xs={10} md={6}>
                                <Row>
                                    <Col xs={10} md={12}>
                                        {/* This card display the baby's state, current time and the baby's metrics after retrieving the data from the backend */}
                                        <Card bg="secondary" text="white" border="danger" style={{marginBottom: 10}}>
                                            <Card.Body style={{padding: 8}}>
                                                <Card.Title
                                                    style={{fontSize: 18, padding: 0, paddingLeft: 5, paddingTop: 5}}>
                                                    {
                                                        // This condition changes the baby's states in the babyText variable on the dashboard when the baby starts crying
                                                        this.state.metrics.Sound > 45? this.state.babyText = 'John is crying': this.state.babyText = 'John is sleeping'
                                                    }
                                                    </Card.Title>
                                                <Card.Text style={{fontSize: 13, padding: 0, paddingLeft: 5}}>
                                                    {this.state.curTime}
                                                </Card.Text>
                                                {/* The real time metrics are displayed with the use of a custom structure for metrics */}
                                                <Metrics metrics={this.state.metrics}/>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col sm={6}>
                                        {/* This card displays the real time Outside Weather when the page is loaded */}
                                        <Card bg="light" border="warning">
                                            <Card.Body style={{padding: 20}}>
                                                <Card.Title>Weather outside</Card.Title>
                                                <Card.Text>
                                                    {this.state.weather} F
                                                </Card.Text>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col sm={6}>
                                        {/* This section displays the warning notification by using a custom structure for notification alert if any restricted users or pets are near the baby */}
                                        {this.state.warning.length > 0 ?
                                            <NotificationAlert value={this.state.warning}/> :
                                            <div/>}
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row className="m-3"></Row>
                        <Row className="m-3">
                            <Col lg={1}></Col>
                            <Col lg={2} md={3} xs={6}>
                                {
                                    // The customized temperature gauge is displayed when data is retrieved from the backend
                                    this.state.metrics.Temperature > 0 ? <TemperateGauge temperature={this.state.metrics.Temperature}/> : <div></div>
                                }
                                <div style={{'textAlign': 'center'}}><h6>Temperature</h6></div>
                            </Col>
                            <Col lg={2} md={3} xs={6}>
                                {
                                    // The customized oxygen level gauge is displayed when data is retrieved from the backend
                                    this.state.metrics.Oxygene_level > 0 ? <OxygenGauge oxygen={this.state.metrics.Oxygene_level}/> :<div></div>
                                }
                                <div style={{'textAlign': 'center'}}><h6>Oxygen Level</h6></div>
                            </Col>
                            <Col lg={2} md={3} xs={6}>
                                {
                                    // The customized sound gauge is displayed when data is retrieved from the backend
                                    this.state.metrics.Sound > 0 ? <SoundGauge sound={this.state.metrics.Sound}/> : <div></div>
                                }
                                <div style={{'textAlign': 'center'}}><h6>Sound</h6></div>
                            </Col>
                            <Col lg={2} md={3} xs={6}>
                                {
                                    // The customized heartbeat gauge is displayed when data is retrieved from the backend
                                    this.state.metrics.Heartbeat > 0 ? <HeartbeatGauge heartbeat={this.state.metrics.Heartbeat}/> : <div></div>
                                }
                                <div style={{'textAlign': 'center'}}><h6>Heartbeat</h6></div>
                            </Col>
                            <Col lg={2} md={3} xs={6}>
                                {
                                    // The customized humidity gauge is displayed when data is retrieved from the backend
                                    this.state.metrics.Humidity > 0 ? <HumidityGauge humidity={this.state.metrics.Humidity}/> : <div></div>
                                }
                                <div style={{'textAlign': 'center'}}><h6>Humidity</h6></div>
                            </Col>
                            <Col lg={1}></Col>
                        </Row>
                    </Container>
                </Jumbotron>
            </Container>

        )
    }

}

export default App;
