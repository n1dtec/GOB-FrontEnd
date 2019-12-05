import {Button, Card, Col, Container, Jumbotron} from "react-bootstrap";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Row from "react-bootstrap/Row";
import React, {Component} from "react";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import ReactDOM from "react-dom";
import Homepage from "./Homepage";
import App from "./App";
import DeleteUser from "./DeleteUser";
import UpdateUser from "./UpdateUser";

class AddUser extends Component {

    constructor(props) {
        super(props);

        this.goToHome = this.goToHome.bind(this);
        this.deleteUsers = this.deleteUsers.bind(this);
        this.updateUsers = this.updateUsers.bind(this);

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    state = {
        currentUser: this.props.user,
        doesUserExist: false,
        currentUserProfile: [],
        systemID: 1,
        userID: null,
        password: null,
        email: null,
        phoneNumber: null,
        admin: 0,
        allowed: null,
        userName: null,
        image: [],
        metrics: [],
        warning: [],
        curTime: null
    };
    intervalID = null;
    header;

    ifLogoutClicked() {
        ReactDOM.render(
            <Homepage/>,
            document.getElementById('root')
        );
    }

    goToHome() {
        ReactDOM.render(
            <App user={this.state.currentUser}/>,
            document.getElementById('root')
        );
    }

    deleteUsers()
    {
        ReactDOM.render(
            <DeleteUser user={this.state.currentUser}/>,
            document.getElementById('root')
        );
    }

    updateUsers()
    {
        ReactDOM.render(
            <UpdateUser user={this.state.currentUser}/>,
            document.getElementById('root')
        );
    }

    checkUser(){
        let id = this.refs.userID.value;
        let request = new Request(('https://localhost:44348/checkUserByID/1/' + id).toString());
        fetch(request, {method: 'GET'})
            .then(function (response) {
                return response.text();
            })
            .then((text) => {
                text.toString() === "true"?
                    this.refs.statusText.innerHTML = "This user ID already exists. Please try again for a different user."
                    : this.addUserInDB();
            })
    }

    addUserInDB() {
        this.state.userID = this.refs.userID.value;
        this.state.password = this.refs.password.value;
        this.state.email = this.refs.email.value;
        this.state.phoneNumber = this.refs.phoneNumber.value;
        this.state.allowed = this.refs.allowed.value.toString().toLowerCase() === "yes" ? 1 : 0;
        this.state.userName = this.refs.userName.value;

        if(this.state.userID === "") {
            alert("Please enter a user ID for the user");
            return;
        }
        if(this.state.userName === "") {
            alert("Please enter a user name to add the user");
            return;
        }
        if(this.state.password === "") {
            alert("Please enter a password for the user");
            return;
        }
        if(this.state.email === "") {
            alert("Please enter an email for the user");
            return;
        }
        if(this.state.phoneNumber === "") {
            alert("Please enter a phone number for the user");
            return;
        }

        let requestBody = "{\n" +
            "  \"SystemID\": " + this.state.systemID + ",\n" +
            "  \"UserID\": " + this.state.userID + ",\n" +
            "  \"Password\": \"" + this.state.password + "\",\n" +
            "  \"Email\": \"" + this.state.email + "\",\n" +
            "  \"PhoneNumber\": " + this.state.phoneNumber + ",\n" +
            "  \"Admin\": " + this.state.admin + ",\n" +
            "  \"Allowed\": " + this.state.allowed + ",\n" +
            "  \"userName\": \"" + this.state.userName + "\"\n" +
            "}";
        console.log(requestBody);
        let request = new Request('https://localhost:44348/AddUser');
        fetch(request, {method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: requestBody})
            .then(function(response) {
            return response.text();
        })
            .then((text) => {
                text.toString() === "Successfully added entry to the database" ?
                    this.refs.statusText.innerHTML = "Sucessfully added the user."
                : this.refs.statusText.innerHtml = "There was an error in adding the user. Please try again.";
            })

    }

    checkEmail() {
        this.state.email = this.refs.email.value;
        let request = new Request('https://localhost:44307/EmailValidator.asmx/checkEmailValidity');
        fetch(request, {method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: "email="+this.state.email})
            .then(function (response) {
                return response.text();
            })
            .then((xml) => {
                console.log(xml);
                if(xml.toString().includes('true'))
                    console.log("Found it");
                if (xml.toString().includes('false')) {
                    console.log("Finally");
                    alert("This email is not valid. Please enter a valid email for the user");
                    return;
                }
                this.refs.statusText.innerHTML = "";
                this.checkUser();
            })
            .catch(console.log);
    }

    handleSubmit = event => {
        event.preventDefault();
        this.checkEmail();
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
                            <NavDropdown title="Manage Users" id="basic-nav-dropdown">
                                <NavDropdown.Item >Add User</NavDropdown.Item>
                                <NavDropdown.Item onClick={this.updateUsers}>Update User</NavDropdown.Item>
                                <NavDropdown.Item onClick={this.deleteUsers}>Delete User</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                        <Button style={{marginLeft: 5, marginEnd: 0}} variant="outline-dark"
                                className="justify-content-end" onClick={this.ifLogoutClicked}>Logout</Button>
                    </Navbar.Collapse>
                </Navbar>

                <Jumbotron fluid
                           style={{height:'100vh', background: 'linear-gradient(to right bottom, rgba(99,99,214,0.07), rgba(229,103,22,0.36))'}}>

                    <Container>
                        <Row className="m-1">
                            <Col xs={10}>
                                <Card>
                                    <Card.Body>
                                        <Card.Title>Enter the details of the user to be added</Card.Title>
                                        <Card.Text>
                                            <Form onSubmit="return false">
                                                <Form.Group>
                                                    <Form.Control ref="userID" type="text"
                                                                  placeholder="Enter User ID" className="mr-sm-3"/>
                                                </Form.Group>
                                                <Form.Group>
                                                    <Form.Control ref="userName" type="text"
                                                                  placeholder="Enter User Name" className="mr-sm-3"/>
                                                </Form.Group>
                                                <Form.Group>
                                                    <Form.Control ref="email" type="text"
                                                                  placeholder="Enter email for the user" className="mr-sm-3"/>
                                                </Form.Group>
                                                <Form.Group>
                                                    <Form.Control ref="password" type="text"
                                                                  placeholder="Enter the password" className="mr-sm-3"/>
                                                </Form.Group>
                                                <Form.Group>
                                                    <Form.Control ref="phoneNumber" type="text"
                                                                  placeholder="Enter phone number for the user" className="mr-sm-3"/>
                                                </Form.Group>
                                                <Form.Group>
                                                    <Form.Control ref="allowed" type="text"
                                                                  placeholder="Enter yes if the user is allowed near the baby, no otherwise (Default is no)" className="mr-sm-3"/>
                                                </Form.Group>
                                                <Button variant="warning" onClick={this.handleSubmit}>Add User</Button>
                                            </Form>
                                            <div ref="statusText"></div>
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </Jumbotron>
            </Container>

        )
    }
}

export default AddUser;