const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

      if (!isValid(username)) {
          users.push({"username":username,"password":password});
          return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
          return res.status(404).json({message: "User already exists!"});
      }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify({books},null,4));

  return res.status(200).json({message: "List has been pulled"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  let filter = books[isbn];
  res.send(JSON.stringify(books[isbn],null, 4));

  return res.status(403).json({message: "Book not found"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const keys = Object.keys(books);

  for ( let i = 0; i< keys.length; i++)
  {
     if(books[keys[i]].author == author)
     {
      res.send(JSON.stringify(books[keys[i]],null,4));    
     }
  }
    
  return res.status(403).json({message: "Author not found"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const keys = Object.keys(books);  
    for ( let i = 0; i< keys.length; i++)
    {
       if(books[keys[i]].title == title)
       {
        res.send(JSON.stringify(books[keys[i]],null,4));    
       }
    }
  return res.status(403).json({message: "Title not found"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const bookkey = req.params.isbn;
  let filter = books[bookkey];
  res.send(JSON.stringify(filter.reviews,null,4));
  
  return res.status(403).json({message: "Review not found"});
});

module.exports.general = public_users;
