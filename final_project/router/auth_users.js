const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];
let currentUser;

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
let userswithsamename = users.filter((user)=>{
  return user.username === username
});
if(userswithsamename.length > 0){
  return true;
} else {
  return false;
}
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
let validusers = users.filter((user)=>{
  return (user.username === username && user.password === password)
});
if(validusers.length > 0){
  currentUser = validusers[0];
  return true;
} else {
  return false;
}
}



//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  console.log("login");

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60});

    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});


regd_users.use("/", function auth(req,res,next){
   if(req.session.authorization) {
       token = req.session.authorization['accessToken'];
       jwt.verify(token, "access",(err,users)=>{
           if(!err){
               req.users = users;
               next();
           }
           else{
               return res.status(403).json({message: "User not authenticated"})
           }
        });
    } else {
        return res.status(403).json({message: "User not logged in"})
    }
});


// Add a book review
regd_users.put("/reviews", (req, res) => {
  //Write your code here
  console.log(req.body);
  let isbn = req.body.ISBN;
  let reviewText = req.body.review;
  let book = books[isbn];

  if (book) {
    let currentuserReview = book.reviews.filter((review)=>{
      return (review.author === currentUser.username)
    });

    console.log(currentuserReview);

    if(currentuserReview.length > 0){
      // edit review
      console.log("editing a review");
      let rev = books[isbn].reviews.find(f=>f.author==currentUser.username);
      if(rev)
        rev.text=reviewText;
      res.send("Review updated!");
    }
    else{
      // add new review
      console.log("adding a review");
      books[isbn].reviews.push({author: currentUser.username, text: reviewText})
      res.send("Review added!");
    }
    
  }else{
    res.send("book not found!");
  } 
  return res.status(300).json({message: "Yet to be implemented"});
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {

  let isbn = req.params.isbn;
  let book = books[isbn];
  console.log(book);
  if (book) {
    let currentuserReview = book.reviews.filter((review)=>{
      return (review.author === currentUser.username)
    });
    console.log(currentuserReview);
    if(currentuserReview.length > 0) {
      let reviewIndex = book.reviews.indexOf(currentuserReview);    
      books[isbn].reviews.splice(reviewIndex-1, 1);
      res.send("Your review has been deleted!");
    }
    else{
      res.send("You don't have any review on this book");
    }
  }
  else{
    res.send("This book doesn't exist");
  }


});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
