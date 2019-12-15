# GOB-FrontEnd
This is the Front End repository for the project Guardians of the Babies

To run and test our project, please follow the steps below in the given order:
(Please note that we have followed these steps each from our own laptops and the project works perfectly well)

1) Open the Visual Studio Solution "GOB-Backend" and run it. It is the main backend project containing 12 of our core APIS. The documentation for each API available in that project can be found at the bottom of this file or you can just append to the URL when you run the solution "/swagger" to get a UI documentation description of the web APIs.

2) Open the Visual studio solution "GOB-SOAP-WebServices" and run it. It contains our SOAP web API for validating email addresses.

3) Open the IntelliJ project "WeatherServiceRESTApp" and run it with Glassfish or a server of your choice. It contains our web API to get weather information for current location of the user.

4) Once you have the 3 previous projects running, open the IntelliJ project "GOB-FrontEnd".Open the terminal within IntelliJ and navigate to the folder /frontend, then type the command in terminal 'npm start'. The frontend will run and display the Homepage.js

We have thoroughly commented our code, and each API's function has been explained in detail in our report. Note that when testing, we are manually generating data in the database for the system since we do not have real RFID's which means that for each system we are adding, we added room metrics for each minute in the Room_data table, and for each user in that system we added his distanceToBaby in the Location_data table.  

For testing purposes, you should test all of the functionality which we have listed in the project report on system Id = 1 since we already have room metrics for that system and some existing users (however, you must add the distance to baby for each user in the system in the Location-data for your custom testing). 

#### API DOCUMENTATION

##### ASP.NET GOB-Backend solution
###### Admin controller

1.	POST /AddUser : This web API is used to add a user to the User_Info table in the database. It takes the info of the user to add from the body as a user model json object (SystemID, userID, Email, Password, phoneNumber, Admin, Allowed and userName). It also returns a custom header “SuccessfullyAddedToDb” with true/false value.

2.	PUT /updateUser/{systemID}/{userID} : This web API takes as URL parameters the system ID and the user ID as well as an updateUser json object in the body (password, email, phone number, allowed and username) and updates the information of the user in the system provided in the URL to the new information provided in the body in the User_Info table in the database. It also returns a custom header “Success” with true/false value.

3.	DELETE /deleteUser/{systemID}/{userID} : This web API takes as URL parameters the system ID and the user ID and deletes that user from the User_Info table in the database. It also returns a custom header “Success” with true/false value.

###### Location controller

4.	GET /getUserDistance/{systemID}/{userID} : This web API takes as URL parameters the system ID and the user ID and returns an xml containing the users distance to the baby that it retrieves from the Location_data table in thy database. 

5.	GET /checkDistanceWarning/{systemID} : This web API takes as URL parameters the system ID and returns as a json object the user and his distance to the baby of any user that is not allowed to be too close to the baby but is less than 3m away. It does so by first calling the /getAllUsers/{systemID} method to get all users, then it checks if each user is allowed to be close to the baby, if a user isn’t it calls the /getUserDistance/{systemID}/{userID} method and if the distance of that user is less than 3m, it will return as a json object the username and current distance to baby of that user. 

6.	GET /sendNotification/{phoneNumb}/{user} : This web API takes as URL parameters a phoneNumber and a user name and sends an SMS to that phone number alerting the receiver that the inputed user is too close to the baby. This method invokes a thirst party API from www.clicksend.com to achieve this functionality. 

7.	GET /sendCustomNotification/{phoneNumb}/{message} : This web API takes as URL parameters a phoneNumber and a message and sends an SMS to that phone number with the given message. This also uses clicksend.com’s API (Note: the caller has to write his message with %20 instead of whitespaces).

###### RetrieveRoomStats controller

8.	GET /getCurrentStats/{systemID} : This web API takes as url parameter the systemID and retrieves from the Room_data the metrics of the room as a json object at the minute when the call was made.

9.	GET /getStats/{systemID}/{time} : This web API takes as URL parameters the system ID and a time value between 0-60 and returns as json object the metrics of the room at that specific minute from the Room_data table in the database.

###### User controller

10.	POST /Authenticate/{systemID} : This web API takes as URL parameter the systemID as well as a json body containing a userID and password. It will retrieve that body and authenticate the info in the database and will return a string saying either true or false. It also returns a custom header “authenticated” with true/false value.

11.	GET /checkUserByID/{systemID}/{userID} : This web API takes as URL parameters the system ID and the user ID and checks if the user exists in the database’s User_Info table and returns true/false as a string. It also returns a custom header “exists” with true/false value.

12.	GET /getUserByID/{systemID}/{userID} : This web API takes as URL parameters the system ID and the user ID and returns as json object the user specified in the system specified from the User_Info table in the database. It also returns a custom header “PhoneNumber” with NA/phoneNumber.

13.	GET /getAllUsers/{systemID} : This web API takes as URL parameters the system ID and returns as a json object all the existing users in that system from the User_info table. It also returns a custom header “UserCount” with the count of users found.

##### ASP.NET GOB-SOAP-WebService solution
###### Email Validator

14.	POST /EmailValidator.asmx/checkEmailValidity : This API consumes the email to be validated with the content-type ‘application/x-www-form-urlencoded’ and returns Boolean true if the email is valid or false if it is not.

##### Java WeatherServiceRESTApp project
###### Weather API Service

15.	GET /WeatherApp/Weather :  This API returns the current weather in the city where the user is present by identifying the IP address, then the zipcode and finally the current weather with the help of nested calls to external web services.


#### FRONTEND DOCUMENTATION
We have built the frontend such that it has the following JavaScript components:
1.	Homepage.js - This is the login page which is the first thing the user sees while trying to access the project UI. It is rendered by the index.js of the project.
2.	App.js - After the user successfully logins in, he/she is redirected to App.js. This is the main page of the dashboard which displays the baby’s image, the baby’s metrics, baby’s current state and the different gauges which display the current metrics of the baby’s metrics. For the admin users, the user management options are displayed on the navigation bar.
3.	metrics.js - This is a custom textual representation for the current metrics in baby’s surrounding. These are displayed in a section on App.js.
4.	temperatureGauge.js - This gauge is responsible for displaying the current temperature in the baby’s room.
5.	oxygenGauge.js - This gauge is responsible for displaying the current oxygen level in the baby’s room.
6.	soundGauge.js - This gauge is responsible for displaying the current sound in the baby’s room.
7.	heartbeatGauge.js - This gauge is responsible for displaying the current heartbeat of the baby.
8.	humidityGauge.js - This gauge is responsible for displaying the current humidity level in the baby’s room.
9.	notificationAlert - This class is responsible for displaying the notification alert when restricted users or pets are closer to the baby than the specified limit of distance.
10.	AddUser.js - This component loads the form for adding a user to the database.
11.	UpdateUser.js - This component loads the form for updating an existing user in the database.
12.	DeleteUser.js - This component loads the form for deleting an existing user from the database.
In addition to the above major components, we have branding elements like displaying the ‘Guardians of the Babies’ logo on the webpages and similar navigation bar and consistent look for all the pages after the user is logged into the system.

The project has the following structure:
1. frontend - This folder contains all the files required to run the project. The configuration files and node modules are present in this folder
2. frontend/src - This folder contains all the core js files : index.js, App.js, Homepage.js, AddUser.js, UpdateUser.js, DeleteUser.js and serviceWorker.js
3. frontend/src/components - This folder contains the components which are used by the different web pages: metrics.js, temperatureGauge.js, oxygenGauge.js, soundGauge.js, heartbeatGauge.js, humidityGauge.js
4. frontend/src/components/media - This folder contains the media files used by different pages
5. frontend/public - This folder contains the public files like index.html, logo files, robots.txt and manifest.json