Steps to use the e-Health Application:

1) Install MongoDB in your System
2) Install Node.js
3) Unzip cmpe280.zip
4) Navigate to cmpe280 folder and run "npm install" from command promt or terminal.
5) Execute "node ./bin/www" from commmand prompt or terminal.
6) Access the application in Web Browser using "http://localhost:3000"
7) User (Doctor or Patient) needs to register first and then login into application by clicking Login button.
8) As we access Fitbit data, the application will ask for Fitbit authorization first time during login. So, a Fitbit account authentication is needed to access the application.

For Running In localhost:
In config.json file:
1. Change redirect uri file to : http://localhost:3000/callback
2.clientID :
3.ReadMe.txt :

The application is also deployed in AWS EC2 Instance:
http://ec2-35-164-39-68.us-west-2.compute.amazonaws.com:3000/