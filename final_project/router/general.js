const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.status(300).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  let filtered_books = books.filter((book) => book.isbn === isbn);
  if (filtered_books.length > 0) {
    return res.status(300).json(filtered_books);
  } else {
    return res.status(404).json({ "status": 404, "message": "Book not found" });
  }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const authorName = req.params.author;
  let filtered_books = books.filter((book) => book.author === authorName);
  if (filtered_books.length > 0) {
    return res.status(300).json(filtered_books);
  } else {
    return res.status(404).json({ "status": 404, "message": "Book not found" });
  }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  let filtered_books = books.filter((book) => book.title === title);
  if (filtered_books.length > 0) {
    return res.status(300).json(filtered_books);
  } else {
    return res.status(404).json({ "status": 404, "message": "Book not found" });
  }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  let filtered_books = books.filter((book) => book.isbn === isbn);
  if (filtered_books.length > 0) {
    let filtered_reviews = [];
    filtered_books.forEach(function (book) {
      console.log(book.review);
      filtered_reviews.push({ "isbn": book.isbn, "title": book.title, "reviews": book.reviews });
    });
    return res.status(300).json(filtered_reviews);
  } else {
    return res.status(404).json({ "status": 404, "message": "Book not found for isbn " + isbn });
  }
});

module.exports.general = public_users;
