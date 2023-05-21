const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!isValid(username)) {
        users.push({ "username": username, "password": password });
        return res.status(200).json({ message: "User successfully registred. Now you can login" });
    } else {
        return res.status(404).json({ message: "User already exists!" });
    }
});

function getBooks() {
    return new Promise((resolve, reject) => {
        resolve(books);
    });
}
// Get the book list available in the shop
public_users.get('/', function (req, res) {
    getBooks().then((allbooks) => res.send(JSON.stringify({ allbooks }, null, 4)));
    // return res.status(200).json({message: "List has been pulled"}); changed to promise
});

function getBookByISbN(isbn) {
    return new Promise((resolve, reject) => {
        let isbnNum = parseInt(isbn);
        if (books[isbnNum]) {
            resolve(books[isbnNum]);
        } else {
            reject({ status: 404, message: 'Book with Isbn number ' + (isbnNum) + ' not found' });
        }
    });
}
// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    getBookByISbN(req.params.isbn).then(
        result => res.send(result),
        error => res.status(error.status).json({ message: error.message })
    );
});


function getBookByAuthor(author) {
    return new Promise((resolve, reject) => {
        const authortosearch = author
        const keys = Object.keys(books);
        let filteredBooks = [];

        for (let i = 0; i < keys.length; i++) {
            if (books[keys[i]].author == authortosearch) {
                filteredBooks.push(books[keys[i]]);
            }
        }
        if (Object.keys(filteredBooks).length > 0) {
            resolve(JSON.stringify(filteredBooks, null, 4));
        } else {
            reject({ status: 404, message: 'Book with Author ' + (author) + ' not found' });
        }
    });
}
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    getBookByAuthor(author).then(
        result => res.send(result),
        error => res.status(404).json({ message: error.message })
    )
});

function getBookByTitle(title) {
    return new Promise((resolve, reject) => {
        const titletosearch = title
        const keys = Object.keys(books);
        let filteredBooks = [];

        for (let i = 0; i < keys.length; i++) {
            if (books[keys[i]].title == titletosearch) {
                filteredBooks.push(books[keys[i]]);
            }
        }
        if (Object.keys(filteredBooks).length > 0) {
            resolve(JSON.stringify(filteredBooks, null, 4));
        } else {
            reject({ status: 404, message: 'Book with Title ' + (title) + ' not found' });
        }
    });
}
// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    getBookByTitle(title).then(
        result => res.send(result),
        error => res.status(404).json({ message: error.message })
    )
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const bookkey = req.params.isbn;
    let filter = books[bookkey];
    res.send(JSON.stringify(filter.reviews, null, 4));

    return res.status(403).json({ message: "Review not found" });
});

module.exports.general = public_users;