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

class DeleteUser extends Component {

    constructor(props) {
        super(props);

        this.goToHome = this.goToHome.bind(this);
        this.addUsers = this.addUsers.bind(this);
        this.updateUsers = this.updateUsers.bind(this);

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    state = {
        currentUser: this.props.user,
        doesUserExist : false,
        currentUserProfile: [],
        image: [],
        metrics: [],
        warning: [],
        curTime: null
    };
    intervalID = null;
    header;

    ifLogoutClicked() {
        ReactDOM.render(
            <Homepage />,
            document.getElementById('root')
        );
    }

    goToHome() {
        ReactDOM.render(
            <App user={this.state.currentUser}/>,
            document.getElementById('root')
        );
    }

    addUsers()
    {
        ReactDOM.render(
            <AddUser user={this.state.currentUser}/>,
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

    checkUser() {
        let id = this.refs.userToBeDeleted.value;
        let request = new Request(('https://localhost:44348/checkUserByID/1/' + id).toString());
        fetch(request, {method: 'GET'})
            .then(function (response) {
                return response.text();
            })
            .then((text) => {
                if (text !== "true") {
                    this.refs.errorText.innerHTML = "This user does not exist. Please try again for a different user.";
                    return;
                }
                this.refs.errorText.innerHTML = "";
                this.state.doesUserExist = true;
                console.log("exsi " + this.state.doesUserExist);
                let deleteRequest = new Request(('https://localhost:44348/deleteUser/1/' + id).toString());
                fetch(deleteRequest,{method: 'DELETE'})
                    .then(function (deleteResponse) {
                        console.log(request.url);
                        return deleteResponse.text();
                    })
                    .then((message) => {
                        if(message !== "true") {
                            this.refs.errorText.innerHTML = "There was an error while deleting the user. Please try again.";
                            return;
                        }
                        this.refs.errorText.innerHTML = "The user has been deleted successfully";
                    })
            })
            .catch(console.log);
    }

    handleSubmit = event => {
        event.preventDefault();
        this.checkUser();
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
                                <Card>
                                    <Card.Body>
                                        <Card.Title>Enter the ID of the user to be deleted</Card.Title>
                                        <Card.Text>
                                            <Form onSubmit="return false">
                                                <Form.Group>
                                                    <Form.Control ref="userToBeDeleted" type="text"
                                                                  placeholder="Enter User ID" className="mr-sm-2"/>
                                                </Form.Group>
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