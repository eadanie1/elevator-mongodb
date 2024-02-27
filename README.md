# Elevator API

## 1. Project Overview

- **Project Name:** Daniel's elevator api v1.0.0
- **Description:** This project is aimed at supplying endpoints for an end user to interact with an elevator control system API, built in Node using express.js. My API focuses on the app.get and app.put (read and update in CRUD) operations as the important features are to read and update different properties of the elevator objects. 

## 2. Installation and Setup

- **Requirements:** The required npm package as a dependency for this repository is merely express v4.18.2. 

- **Installation:** To run this api, use your preferred code editor (after having changed directory to the folder of the downloaded project), and in the terminal run: npm i express. This will install express package in the downloaded project folder. 

## 3. Project Features

- As mentioned the CRUD operations touched on in this API are Read and Update, or as explained in a bit more detail below, app.get and app.put (methods of the app instance of express.js). I have stored the elevators as objects in an array, with properties such as currentFloor, status (initialized as idle) and destinationFloor. The user can then access and change the properties by requesting a destinationFloor, in the request body as a JSON object, and also in the request parameters where the closest available elevator is called to service. 
- **app.get:** One app.get endpoint gets the full list and properties of all elevators, another checks the availability of an elevator with a given ID.
- **app.put:** I have two app.put endpoints, one of which calls on the closest available elevator to respond, which also stores in a queue a request if all elevators are in use. Another put endpoint simply sets the destinationFloor of an elevator with a given ID. 

## 4. Project Structure

The project is organized into the following directories:
/elevator-app - this is the main directory for the project, the following files are included in the main folder:
- .gitignore
- app.js - the main JavaScript file for the project, which is called in the terminal using nodemon to run the server and execute the HTTP requests (nodemon app.js in terminal)
- put-elevator.js, post-elevator.js and get-elevator.js respectively. Imported into app.js for readability and maintainability. 
- package-lock.json
- package.json
- README.md - This README file

./src - contains the source code stored in this repository.

./dist - subfolder for production files. 

## 5. Technologies Used

- **Languages:** JavaScript
- **Frameworks/libraries:** Express.js