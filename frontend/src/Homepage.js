import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import App from "./App";
import {Button, Card, Col, Container, Jumbotron} from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Background from './components/media/B2.jpg';
import Image from "react-bootstrap/Image";


/*
 * Author : Harnidh Kaur
 * Project : Guardians of the Babies
 * Subject : TCSS 559
 *
 * This class builds the login page of the Web Application
 */

class Homepage extends Component {

    /*
     * This method is called when the Component of Homepage.js is created
     */
    constructor(props) {
        super(props);

        this.loginUser = this.loginUser.bind(this);
    }

    /*
     * The different variables used throughout the page are stored in the state
     */
    state = {
        systemID: null,
        userID: null,
        password: null
    }

    /*
     * This method handles the action taken when a user clicks on the Login button
     * It authenticates the user or throws an error message accordingly
     * Upon successful login, the App.js component is rendered on the root element on index.html
     */
    loginUser() {
        this.state.systemID = this.refs.systemID.value;
        this.state.userID = this.refs.userID.value;
        this.state.password = this.refs.password.value;

        // If any fields are empty, display the alert prompting the user to enter the data
        if (this.state.systemID === "") {
            alert("Please enter a user ID for the user");
            return;
        }
        if (this.state.userID === "") {
            alert("Please enter a user ID for the user");
            return;
        }
        if (this.state.password === "") {
            alert("Please enter a password for the user");
            return;
        }

        //Call the backend API responsible for authentication
        let request = new Request('https://localhost:44348/Authenticate/1');
        let requestBody = "{\n" +
            "  \"UserID\": \"" + this.state.userID + "\",\n" +
            "  \"password\": \"" + this.state.password + "\",\n" +
            "}";
        fetch(request, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: requestBody
        })
            .then(function (response) {
                return response.text();
            })
            .then((text) => {
                //Check the text received in response
                text.toString() !== "true" ?
                    // Display an error message if user enters wrong credentials
                    this.refs.statusText.innerHTML = "These login credentials are wrong. Please try again."
                    :
                    // Render the App.js with current user's ID if user enters correct credentials
                    ReactDOM.render(
                        <App user={this.state.userID}/>,
                        document.getElementById('root')
                    )
                ;
            })
    }

    /*
     * This method renders the view of the login page
     */
    render() {

        return (

            <Jumbotron fluid style={{backgroundImage: `url(${Background})`, height: '100vh', backgroundSize: '100%'}}>

                <Container>
                    <Row className="m-1">
                        <Col xs={2}/>
                        <Col xs={8}>
                            <Image rounded fluid
                                   src={require('./components/media/logoSmall.png')}
                            />
                        </Col>
                        <Col xs={2}/>
                    </Row>
                    <Row className="m-3">
                        <Col xs={3}/>
                        <Col xs={6}>
                            {/* This card display the login form */}
                            <Card>
                                <Card.Body>
                                    <Card.Title>Enter the login credentials</Card.Title>
                                    <Card.Text >
                                        {/* The user enters the login credentials in this form */}
                                        <Form onSubmit="return false" >
                                            <Form.Group>
                                                <Form.Control ref="systemID" type="text"
                                                              placeholder="Enter System ID" className="mr-sm-3"/>
                                            </Form.Group>
                                            <Form.Group><Form.Control ref="userID" type="text"
                                                                      placeholder="Enter User ID" className="mr-sm-3"/>
                                            </Form.Group>
                                            <Form.Group><Form.Control ref="password" type="text"
                                                                      placeholder="Enter the password"
                                                                      className="mr-sm-3"/>
                                            </Form.Group>

                                            {/* This button is used to login the user by checking the fields entered in the form */}
                                            <Button variant="warning" onClick={this.loginUser}>Login</Button>
                                            <div style={{marginTop: 10}} ref="statusText"/>
                                        </Form>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xs={3}/>
                    </Row>
                </Container>
            </Jumbotron>


        );
    }
}

export default Homepage;