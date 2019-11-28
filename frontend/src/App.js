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
import Homepage from "./Homepage";
import ReactDOM from "react-dom";

function Logout(props)
{
    return(
        <button onClick = {props.clickFunc}>
            Logout
        </button>
    );
}

class App extends Component {

    state = {
        contacts: [],
        image: [],
        metrics: [],
        curTime: null
    };
    intervalID = null;

    setTemperature = () => {
        this.state.metrics.Temperature = (parseFloat(this.state.metrics.Temperature) + (Math.random() % 20));
    };

    getTemperature = () => {
        return this.state.metrics.Temperature;
    };

    componentWillUnmount() {
        if (this.intervalID === null) return;
        clearInterval(this.intervalID);
    }

    componentDidMount() {
        this.intervalID = setInterval(() => {
            const request = new Request('https://localhost:44348/getCurrentStats/1');
            fetch(request, {method: 'GET'})
                .then(function (response) {
                    // Convert to JSON
                    return response.json();
                })
                .then((data) => {
                    this.setState({metrics: data.Table[0]}, () => {
                            this.setTemperature();
                        }
                    );
                    this.setState({curTime: new Date().toLocaleString()});
                    console.log(this.getTemperature())
                })
                .catch(console.log);


            // console.log(this.getTemperature());
        }, 1000);

    }

    ifLogoutClicked()
    {
        ReactDOM.render(
            <Homepage />,
            document.getElementById('root')
        );
    }


    render(){

        return (
            <Container lg="true" fluid>
                <Navbar bg="light" navbar-fixed-top="true">
                    <Navbar.Brand href="#home">Guardians of the Babies</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="justify-content-end">
                            <Nav.Link href="#home">Home</Nav.Link>
                            <Nav.Link href="#link">Link</Nav.Link>
                            <NavDropdown title="Manage Users" id="basic-nav-dropdown">
                                <NavDropdown.Item >Add User</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.2">Update User</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.3">Delete User</NavDropdown.Item>
                                <NavDropdown.Divider/>
                                <NavDropdown.Item href="#action/3.4">Your profile</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                        <Button className="justify-content-end" onClick={this.ifLogoutClicked} >Logout</Button>
                        {/*<Form inline>*/}
                        {/*    <FormControl type="text" placeholder="Search" className="mr-sm-2"/>*/}
                        {/*    <Button variant="outline-success">Search</Button>*/}
                        {/*</Form>*/}
                    </Navbar.Collapse>
                </Navbar>

                <Jumbotron fluid>

                    <Container>
                        <Row className="m-1">
                            <Col xs={10} md={6}>
                                <Image rounded fluid
                                       src={require('./components/media/picture.jpg')}
                                />
                            </Col>
                            <Col xs={10} md={6}>
                                <Card>
                                    {/*<Card.Img variant="top" src="holder.js/100px180" />*/}
                                    <Card.Body>
                                        <Card.Title>John is sleeping</Card.Title>
                                        <Card.Text>
                                            {this.state.curTime}
                                        </Card.Text>
                                        <Metrics metrics={this.state.metrics}/>
                                        {/*<Button variant="primary">Go somewhere</Button>*/}
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                        <Row className="m-3">
                            <Col>
                                {<TemperateGauge temperature={this.state.metrics.Temperature}/>}
                                {/*<Gauge value={this.state.value} max={80} color={"rgba(236,114,19,0.78)"} width={200} height={120} label="Temperature" backgroundColor={"rgba(78,14,236,0.35)"} />*/}
                            </Col>
                        </Row>
                    </Container>
                </Jumbotron>
            </Container>

        )
    }

}

export default App;
