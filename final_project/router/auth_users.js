const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username
  });
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username, password) => {
  let validusers = users.filter((user) => {
    return (user.username === username && user.password === password)
  });
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.query.username;
  const password = req.query.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).json({ message: "User successfully logged in" });
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const username = req.session.authorization['username'];
  const isbn = req.params.isbn;
  const newreview = req.query.review;
  let filtered_books = books.filter((book) => book.isbn === isbn);
  if (newreview) {
    if (filtered_books.length > 0) {
      let filtered_book = filtered_books[0];

      if (filtered_book.reviews.length > 0) {
        console.log("Reviews length")
        console.log(filtered_book.reviews.length);
        console.log(filtered_book.reviews);
        let isReviewAvailable = false;
        for (let i = 0; i < filtered_book.reviews.length; i++) {
          if (filtered_book.reviews[i].reviewUser === username) {
            filtered_book.reviews[i].review = newreview;
            isReviewAvailable = true;
            break;
          }
        }
        if (isReviewAvailable) {
          res.status(201).json({ message: "Review Updated for user " + username });
        } else {
          filtered_book.reviews.push({ "review": newreview, "reviewUser": username })
          res.status(201).json({ message: "Review Added for user " + username });
        }
      } else {
        filtered_book.reviews.push({ "review": newreview, "reviewUser": username })
        res.status(201).json({ message: "Review Added for user " + username });
      }
    } else {
      res.status(404).send("Book not found");
    }
  } else {
    res.status(400).json({ message: "Please add new review" });
  }
});


// Delete review added by user
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const username = req.session.authorization['username'];
  const isbn = req.params.isbn;
  let filtered_books = books.filter((book) => book.isbn === isbn);
  if (filtered_books.length > 0) {
    const index = filtered_books[0].reviews.findIndex(review => review.reviewUser === username);
    console.log("Index :::::::: " + index);
    if (index !== -1) {
      filtered_books[0].reviews.splice(index, 1);
      res.status(200).json({ message: "Review Deleted for user " + username });
    } else {
      res.status(201).json({ message: "No Review added to delete for user " + username });
    }
  } else {
    res.status(404).json({ message: "Book not found." });
  }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
