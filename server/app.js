// Express framework for creating the server and routes
const express = require("express");

// Morgan logs HTTP requests in the terminal
const morgan = require("morgan");

// Helps read cookies sent by the browser
const cookieParser = require("cookie-parser");

// Mongoose allows Node.js to communicate with MongoDB
const mongoose = require("mongoose");

// Enables communication between frontend and backend on different ports/domains
const cors = require("cors");


// DEFINE SERVER PORT
// The backend server will run on port 5005
const PORT = 5005;


// IMPORT DATABASE MODELS
// These models represent collections in MongoDB
const Cohort = require("./models/Cohort.model");
const Student = require("./models/Student.model");



// STATIC DATA
// CREATE EXPRESS APPLICATION
const app = express();

// MIDDLEWARE
// Research Team - Set up CORS middleware here:
// ...
// Enable CORS so frontend apps can access this API
app.use(cors());

// Connect to MongoDB database
mongoose
  .connect("mongodb://127.0.0.1:27017/cohort-tools-api")

  // Runs if connection is successful
  .then((x) =>
    console.log(`Connected to Database: "${x.connections[0].name}"`)
  )

  // Runs if there is a database connection error
  .catch((err) =>
    console.error("Error connecting to MongoDB", err)
  );


// Parse incoming JSON data from requests
app.use(express.json());

// Log requests in the terminal
app.use(morgan("dev"));

// Makes files inside the "public" folder accessible
app.use(express.static("public"));

// Parses URL-encoded form data
// Useful when data comes from HTML forms
app.use(express.urlencoded({ extended: false }));

// Allows reading cookies from requests
app.use(cookieParser());


// ROUTES - https://expressjs.com/en/starter/basic-routing.html
// Devs Team - Start working on the routes here:
// TEST ROUTE
// Sends the docs.html file when user visits /docs
app.get("/docs", (req, res) => {

  // __dirname = current folder location
  res.sendFile(__dirname + "/views/docs.html");
});


// GET ALL COHORTS
// Route: GET /cohorts
app.get("/cohorts", (req, res) => {
  Cohort.find() // Find all cohort documents in MongoDB
    .then((cohorts) => { // Runs if data retrieval succeeds
      console.log("Retrieved cohorts ->", cohorts); // Display cohorts in terminal
      res.json(cohorts); // Send cohorts back as JSON response
    })
    .catch((error) => { // Runs if an error occurs
      console.error("Error while retrieving cohorts ->", error);  // Show error in terminal
      res.status(500).json({error: "Failed to retrieve cohorts" }); // Send error response to client
    });
});

// GET ALL STUDENTS
// Route: GET /students
app.get("/students", (req, res) => {
  Student.find({})
    .then((students) => {
      console.log("Retrieved students ->", students);
      res.json(students);
    })
    .catch((error) => {
      console.error("Error while retrieving students ->", error);
      res.status(500).json({ error: "Failed to retrieve students" });
    });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});