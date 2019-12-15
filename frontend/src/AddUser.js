import {Button, Card, Col, Container, Jumbotron} from "react-bootstrap";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Row from "react-bootstrap/Row";
import React, {Component} from "react";
import Form from "react-bootstrap/Form";
import ReactDOM from "react-dom";
import Homepage from "./Homepage";
import App from "./App";
import DeleteUser from "./DeleteUser";
import UpdateUser from "./UpdateUser";

/*
 * Author : Harnidh Kaur
 * Project : Guardians of the Babies
 * Subject : TCSS 559
 *
 * This class builds the add user page of the Web Application
 */

class AddUser extends Component {

    /*
     * This method is called when the Component of AddUser.js is created
     */
    constructor(props) {
        super(props);

        this.goToHome = this.goToHome.bind(this);
        this.deleteUsers = this.deleteUsers.bind(this);
        this.updateUsers = this.updateUsers.bind(this);

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    /*
     * The different variables used throughout the page are stored in the state
     */
    state = {
        currentUser: this.props.user,
        systemID: 1,
        userID: null,
        password: null,
        email: null,
        phoneNumber: null,
        admin: 0,
        allowed: null,
        userName: null
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
     * This method handles the action taken when an admin user clicks on the Home button
     * The App.js component is rendered on the root element of index.html
     */
    goToHome() {
        ReactDOM.render(
            <App user={this.state.currentUser}/>,
            document.getElementById('root')
        );
    }

    /*
     * This method handles the action taken when an admin user clicks on the Delete Users tab
     * The DeleteUser.js component is rendered on the root element of index.html
     */
    deleteUsers()
    {
        ReactDOM.render(
            <DeleteUser user={this.state.currentUser}/>,
            document.getElementById('root')
        );
    }

    /*
     * This method handles the action taken when an admin user clicks on the Update Users tab
     * The UpdateUser.js component is rendered on the root element of index.html
     */
    updateUsers()
    {
        ReactDOM.render(
            <UpdateUser user={this.state.currentUser}/>,
            document.getElementById('root')
        );
    }

    /*
     * This method checks if the user being added is an existing user or not
     * If the user does not exist, the user is added, otherwise the error text is displayed
     * This method calls the addUserInDB method if the user does not exist
     */
    checkUser(){
        let id = this.refs.userID.value;
        // Call the backend API for checking user
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

    /*
     * This method is responsible to add the user's details by calling backend API
     */
    addUserInDB() {
        this.state.userID = this.refs.userID.value;
        this.state.password = this.refs.password.value;
        this.state.email = this.refs.email.value;
        this.state.phoneNumber = this.refs.phoneNumber.value;
        this.state.allowed = this.refs.allowed.value.toString().toLowerCase() === "yes" ? 1 : 0;
        this.state.userName = this.refs.userName.value;

        // If any mandatory field is empty, send an alert to the user
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

        // Build the response body
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

        // Call the backend API for adding the user
        let request = new Request('https://localhost:44348/AddUser');
        fetch(request, {method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: requestBody})
            .then(function(response) {
            return response.text();
        })
            .then((text) => {
                // Display success text if user gets added, otherwise display the error message
                text.toString() === "Successfully added entry to the database" ?
                    this.refs.statusText.innerHTML = "Sucessfully added the user."
                : this.refs.statusText.innerHtml = "There was an error in adding the user. Please try again.";
            })

    }

    /*
     * This method validates the email address being entered for the user
     * If it is a valid email address, the data is added, otherwise the user is prompted to enter a valid email ID
     * This method calls the checkUser method if the email is valid
     */
    checkEmail() {
        this.state.email = this.refs.email.value;
        // Call the backend API for validating email
        let request = new Request('https://localhost:44307/EmailValidator.asmx/checkEmailValidity');
        fetch(request, {method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: "email="+this.state.email})
            .then(function (response) {
                return response.text();
            })
            .then((xml) => {
                if(xml.toString().includes('true'))
                if (xml.toString().includes('false')) {
                    alert("This email is not valid. Please enter a valid email for the user");
                    return;
                }
                this.refs.statusText.innerHTML = "";
                // Calls the checkUser method
                this.checkUser();
            })
            .catch(console.log);
    }

    /*
     * This method handles the event when user clicks on Update User button
     */
    handleSubmit = event => {
        event.preventDefault();
        // Call the check email method which would call the check user method if email is valid
        this.checkEmail();
    }

    /*
     * This method renders the view of the Add Users page
     */
    render() {

        return (
            <Container lg="true" fluid>
                {/*
                 * This is the standard navigation bar across the dashboard which gives the options for Managing Users for admins and Logout button for all users
                 */}
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
                            {/* This card display the add user form */}
                            <Col xs={10}>
                                <Card>
                                    <Card.Body>
                                        <Card.Title>Enter the details of the user to be added</Card.Title>
                                        <Card.Text>
                                            {/* The user details are entered in this form */}
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
                                                {/* This button is used to add the user when user clicks on it */}
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