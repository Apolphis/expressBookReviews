const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  //Write your code here

  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
  
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return new Promise((resolve) => {
    resolve(res.status(200).json(books));
  })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  return new Promise((resolve) => {
    const isbn = req.params.isbn;
    let book = books[isbn];
    if(book){
      resolve(res.status(200).json(books[isbn]));
    }
    else{
      resolve(res.status(404).json({Message:"Book not found"}));
    }
  })
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  return new Promise((resolve) => {
    let author = req.params.author;
    var bk = Object.keys(books).map((key) => books[key]);
    let book = bk.find(b => b.author == author);
    if(book){
      resolve(res.status(200).json(book));
    }
    else{
      resolve(res.status(404).json({Message:"Book not found"}));
    }
  })
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  return new Promise((resolve) => {
    let title = req.params.title;
    var bk = Object.keys(books).map((key) => books[key]);
    let book = bk.find(b => b.title == title);
    if(book){
      resolve(res.status(200).json(book));
    }
    else{
      resolve(res.status(404).json({Message:"Book not found"}));
    }
  })
});

//  Get book reviews
public_users.get('/reviews/:isbn',function (req, res) {
  //Write your code here
  return new Promise((resolve) => {
    let isbn = req.params.isbn;
    let book = books[isbn];
    if(book){
      resolve(res.status(200).json(book.reviews));
    }
    else{
      resolve(res.status(404).json({Message:"Book not found"}));
    }
  })
});



module.exports.general = public_users;
