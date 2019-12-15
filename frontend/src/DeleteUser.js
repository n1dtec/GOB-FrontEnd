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
import UpdateUser from "./UpdateUser";
import AddUser from "./AddUser";

/*
 * Author : Harnidh Kaur
 * Project : Guardians of the Babies
 * Subject : TCSS 559
 *
 * This class builds the Delete User page of the Web Application
 */

class DeleteUser extends Component {

    /*
     * This method is called when the Component of DeleteUser.js is created
     */
    constructor(props) {
        super(props);

        this.goToHome = this.goToHome.bind(this);
        this.addUsers = this.addUsers.bind(this);
        this.updateUsers = this.updateUsers.bind(this);

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    /*
     * The different variables used throughout the page are stored in the state
     */
    state = {
        currentUser: this.props.user
    };

    /*
     * This method handles the action taken when user clicks on the Logout button
     * The Homepage.js component is rendered on the root element of index.html
     */
    ifLogoutClicked() {
        ReactDOM.render(
            <Homepage />,
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
     * This method handles the action taken when an admin user clicks on the Add Users tab
     * The AddUser.js component is rendered on the root element of index.html
     */
    addUsers()
    {
        ReactDOM.render(
            <AddUser user={this.state.currentUser}/>,
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
     * This method checks if the user being deleted is an existing user or not
     * If the user exists, the user gets deleted, otherwise the error text is displayed
     * 1after successful check, the backend API for deleting the user is called
     */
    checkUser() {
        let id = this.refs.userToBeDeleted.value;
        // Call the backend API for checking user
        let request = new Request(('https://localhost:44348/checkUserByID/1/' + id).toString());
        fetch(request, {method: 'GET'})
            .then(function (response) {
                return response.text();
            })
            .then((text) => {
                if (text !== "true") {
                    // Display error message if user does not exist
                    this.refs.errorText.innerHTML = "This user does not exist. Please try again for a different user.";
                    return;
                }
                this.refs.errorText.innerHTML = "";
                // Call the backend API for deleting the user
                let deleteRequest = new Request(('https://localhost:44348/deleteUser/1/' + id).toString());
                fetch(deleteRequest,{method: 'DELETE'})
                    .then(function (deleteResponse) {
                        console.log(request.url);
                        return deleteResponse.text();
                    })
                    .then((message) => {
                        // Display success text if user gets deleted, otherwise display the error message
                        if(message !== "true") {
                            this.refs.errorText.innerHTML = "There was an error while deleting the user. Please try again.";
                            return;
                        }
                        this.refs.errorText.innerHTML = "The user has been deleted successfully";
                    })
            })
            .catch(console.log);
    }

    /*
     * This method handles the event when user clicks on Update User button
     */
    handleSubmit = event => {
        event.preventDefault();
        // Call the check user method which would call the delete API after checking the user
        this.checkUser();
    }

    /*
     * This method renders the view of the Delete Users page
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
                                <NavDropdown.Item onClick={this.addUsers}>Add User</NavDropdown.Item>
                                <NavDropdown.Item onClick={this.updateUsers}>Update User</NavDropdown.Item>
                                <NavDropdown.Item>Delete User</NavDropdown.Item>
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
                                {/* This card display the delete user form */}
                                <Card>
                                    <Card.Body>
                                        <Card.Title>Enter the ID of the user to be deleted</Card.Title>
                                        <Card.Text>
                                            {/* The user id to be deleted is entered in this form */}
                                            <Form onSubmit="return false">
                                                <Form.Group>
                                                    <Form.Control ref="userToBeDeleted" type="text"
                                                                  placeholder="Enter User ID" className="mr-sm-2"/>
                                                </Form.Group>
                                                {/* This button is used to delete the user when user clicks on it */}
                                                <Button variant="warning" onClick={this.handleSubmit}>Delete User</Button>
                                            </Form>
                                            <div ref="errorText"></div>
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

export default DeleteUser;