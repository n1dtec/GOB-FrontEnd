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
import Toast from "react-bootstrap/Toast";

class App extends Component {

    constructor(props) {
        super(props);

        this.demoRoomState = this.demoRoomState.bind(this);
    }

    state = {
        currentUser: this.props.user,
        currentUserProfile: [],
        image: [],
        metrics: [],
        warning: [],
        curTime: null,
        fNumber: '2067140670',
        hNumber: '2535278275',
        weather: 60,
        metricFlag: true,
        smsFlag: true,
        babyText: 'John is sleeping'
    };
    intervalID = null;

    setTemperature = () => {
        this.state.metrics.Temperature = (parseFloat((parseFloat(this.state.metrics.Temperature) + (Math.random() % 10)).toFixed(2)));
    };

    getTemperature = () => {
        return this.state.metrics.Temperature;
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

    getWarning = () => {
        return this.state.metrics.warning;
    };

    componentWillUnmount() {
        if (this.intervalID === null) return;
        clearInterval(this.intervalID);
    }

    componentDidMount() {

        // let request = new Request('http://localhost:8080/MyRESTApp/Weather');
        // fetch(request, {method: 'GET'})
        //     .then(function (response) {
        //         // Convert to text
        //         return response.text();
        //     })
        //     .then((data) => {
        //         console.log("Weather" + data.toString());
        //     })
        //     .catch(console.log);


        this.intervalID = setInterval(() => {
            this.setState({curTime: new Date().toLocaleString()});

            if (this.state.metricFlag) {

                let request = new Request('https://localhost:44348/getCurrentStats/1');
                fetch(request, {method: 'GET'})
                    .then(function (response) {
                        // Convert to JSON
                        return response.json();
                    })
                    .then((data) => {
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


            let request = new Request('https://localhost:44348/checkDistanceWarning/1');
            fetch(request, {method: 'GET'})
                .then(function (response) {
                    // Convert to JSON
                    return response.json();
                })
                .then((userData) => {
                    this.state.warning = userData;
                    this.state.warning.map((users) => {
                        userData.map((nUser) => {
                                if (nUser.user === users.user) {
                                    console.log("Same");
                                    if (this.state.smsFlag) {
                                        // let smsRequest = new Request('https://localhost:44348/sendNotification/' + this.state.hNumber + '/' + users.user.toString());
                                        // fetch(smsRequest, {method: 'GET'});
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

    sleep(time) {
        return new Promise((resolve) => {
            setTimeout(resolve, time || 1000);
        });
    }

    demoNotification() {
        let request = new Request('https://localhost:44348/Demo/3');
        fetch(request, {method: 'GET'})
            .then(function (response) {
                // Convert to JSON
                return response.json();
            })
            .catch(console.log);
    }

    demoRoomState() {
        let request = new Request('https://localhost:44348/getStats/1/26');
        fetch(request, {method: 'GET'})
            .then(function (response) {
                // Convert to JSON
                return response.json();
            })
            .then(async (data) => {
                this.state.metricFlag = !this.state.metricFlag;
                if(!this.state.metricFlag)
                    await this.sleep(1000);
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


    ifLogoutClicked() {
        ReactDOM.render(
            <Homepage/>,
            document.getElementById('root')
        );
    }

    deleteUsers() {
        ReactDOM.render(
            <DeleteUser/>,
            document.getElementById('root')
        );
    }

    addUsers() {
        ReactDOM.render(
            <AddUser/>,
            document.getElementById('root')
        );
    }

    updateUsers() {
        ReactDOM.render(
            <UpdateUser/>,
            document.getElementById('root')
        );
    }

    render() {

        return (
            <Container lg="true" fluid>
                <Navbar bg="light" navbar-fixed-top="true">
                    <Navbar.Brand onClick={this.goToHome}>Guardians of the Babies</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="justify-content-end">
                            <Nav.Link onClick={this.goToHome}>Home</Nav.Link>
                            {
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

                <Jumbotron fluid
                           style={{height:'100vh', background: 'linear-gradient(to right bottom, rgba(99,99,214,0.07), rgba(229,103,22,0.36))'}}>

                    <Container xs={11}>
                        <Row className="m-1">
                            <Col xs={10} md={6}>
                                <Image rounded fluid
                                       src={require('./components/media/picture.jpg')}
                                />
                            </Col>
                            <Col xs={10} md={6}>
                                <Row>
                                    <Col xs={10} md={12}>
                                        <Card bg="secondary" text="white" border="danger" style={{marginBottom: 10}}>
                                            <Card.Body style={{padding: 8}}>
                                                <Card.Title
                                                    style={{fontSize: 18, padding: 0, paddingLeft: 5, paddingTop: 5}}>
                                                    {this.state.metrics.Sound > 45? this.state.babyText = 'John is crying': this.state.babyText = 'John is sleeping'}
                                                    </Card.Title>
                                                <Card.Text style={{fontSize: 13, padding: 0, paddingLeft: 5}}>
                                                    {this.state.curTime}
                                                </Card.Text>
                                                <Metrics metrics={this.state.metrics}/>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col sm={6}>
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
                                {this.state.metrics.Temperature > 0 ?
                                    <TemperateGauge temperature={this.state.metrics.Temperature}/> : <div></div>}
                                <div style={{'textAlign': 'center'}}><h6>Temperature</h6></div>
                            </Col>
                            <Col lg={2} md={3} xs={6}>
                                {this.state.metrics.Oxygene_level > 0 ?
                                    <OxygenGauge oxygen={this.state.metrics.Oxygene_level}/> : <div></div>}
                                <div style={{'textAlign': 'center'}}><h6>Oxygen Level</h6></div>
                            </Col>
                            <Col lg={2} md={3} xs={6}>
                                {this.state.metrics.Sound > 0 ? <SoundGauge sound={this.state.metrics.Sound}/> :
                                    <div></div>}
                                <div style={{'textAlign': 'center'}}><h6>Sound</h6></div>
                            </Col>
                            <Col lg={2} md={3} xs={6}>
                                {this.state.metrics.Heartbeat > 0 ?
                                    <HeartbeatGauge heartbeat={this.state.metrics.Heartbeat}/> : <div></div>}
                                <div style={{'textAlign': 'center'}}><h6>Heartbeat</h6></div>
                            </Col>
                            <Col lg={2} md={3} xs={6}>
                                {this.state.metrics.Humidity > 0 ?
                                    <HumidityGauge humidity={this.state.metrics.Humidity}/> : <div></div>}
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
