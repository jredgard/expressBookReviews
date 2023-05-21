const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

function isValid(username) {
    const userswithsamename = users.filter((user) => user.username === username);
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

function authenticatedUser(username, password) {
    const validusers = users.filter((user) => user.username === username && user.password === password);
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign(password, "access", { expiresIn: 3600 });
        req.session.authorization = { accessToken, username };
        return res.status(200).send("User has been logged in");
    }
    else {
        return res.status(403).json({ message: "Invalid username or passowrd provided" });
    }

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.body.review;
    const username = req.session.authorization.username;
    if (books[isbn]) {
        let book = books[isbn];
        book.reviews[username] = review;
        return res.status(200).send("Book Review successfully posted");
    }
    else {
        return res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
    }
});
//deleting a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;
    if (books[isbn]) {
        let book = books[isbn];
        delete book.reviews[username];
        return res.status(200).send("Book review successfully deleted");
    }
    else {
        return res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
