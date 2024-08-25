const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean

    // Check if the username already exists in the users array
    return users.some(user => user.username === username);
}


    


const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
// Check if the username and password match any user in the users array
    return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (!authenticatedUser(username, password)) {
        return res.status(401).json({ message: "Invalid username or password" });
    }

    // Generate JWT access token
    let accessToken = jwt.sign({ username }, 'your_jwt_secret_key', { expiresIn: '1h' });

    // Store access token in session
    req.session.authorization = {
        accessToken
    };

    // Send the token in the response (optional)
    return res.status(200).json({ message: "User successfully logged in", token: accessToken });
});


// Add a book review
// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.user.username; // Assuming the username is stored in the req.user from the JWT middleware

    if (!review) {
        return res.status(400).json({ message: "Review content is required" });
    }

    // Check if the book exists
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Check if the user has already reviewed the book
    if (!books[isbn].reviews) {
        books[isbn].reviews = {};
    }

    // Add or update the review
    books[isbn].reviews[username] = review;

    return res.status(200).json({ message: "Review successfully added/updated", reviews: books[isbn].reviews });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.user.username; // Assuming the username is stored in req.user from the JWT middleware

    // Check if the book exists
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Check if the review by this user exists
    if (books[isbn].reviews && books[isbn].reviews[username]) {
        delete books[isbn].reviews[username]; // Delete the user's review
        return res.status(200).json({ message: "Review successfully deleted", reviews: books[isbn].reviews });
    } else {
        return res.status(404).json({ message: "Review by this user not found" });
    }
});



module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
