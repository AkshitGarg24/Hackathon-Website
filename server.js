const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

const app = express();
dotenv.config();

const port = process.env.port || 3000;
app.use(express.static(__dirname + '/Registration'));
app.use(express.static(__dirname + '/Homepage'));

// MongoDB connection (using credentials from environment variables)
mongoose.connect("mongodb+srv://coderrrx:XwYYhvYmhc7FVCEc@codehack.wnl17.mongodb.net/registration_DB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Define the registration schema
const register_schema = new mongoose.Schema({
    name: String,
    email: String,
    phone: Number,
    password: String
});

// Create a model for the registration data
const Registration = mongoose.model("Registration", register_schema);

// Middleware for parsing request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve the registration form
app.get("/register", (req, res) => {
    res.sendFile(__dirname + "/Registration/registration.html");
});

// Handle form submission (POST request)
app.post("/register", async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;

        // Check if the user already exists
        const user_exist = await Registration.findOne({ email: email });
        if (!user_exist) {
            // Save the new user data to the database
            const register_data = new Registration({
                name,
                email,
                phone,
                password
            });
            await register_data.save();
            // Send success response back to the client
            res.json({ success: true, message: "Registration successful!" });
        } else {
            // Send error if the user already exists
            res.json({ success: false, message: "User already exists" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "An error occurred" });
    }
});

// Serve the homepage
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/Homepage/index.html");
});
// Start the server
app.listen(port, function () {
    console.log(`Server is running on port ${port}`);
});
