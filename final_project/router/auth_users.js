const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

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
  return true;
} else {
  return false;
}
}


regd_users.use("/customer", function auth(req,res,next){
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

//only registered users can login
regd_users.post("/customer/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

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

;

// Add a book review
regd_users.put("/reviews", (req, res) => {
  //Write your code here
  const reviews = req.params.reviews;
  let books = books[reviews]

  if (books) {
    let author = req.body.author;
    let title = req.body.title;
    let reviews = req.body.reviews;

    if(author){
      friend["author"] = author
    }

    if (title){
      friend["title"] = title
    }

    if (reviews){
      friend["reviews"] = reviews
    }

    books[reviews] = reviews;
    res.send(`Reviews ${reviews} updated.`);
  }else{
    res.send("error!");
  } 
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
