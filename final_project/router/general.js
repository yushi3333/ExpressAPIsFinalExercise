const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const { username, password } = req.body;
  
    // Check if both username and password are provided
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
  
    // Check if the username already exists
    if (isValid(username)) {
      return res.status(400).json({ message: "Username already exists" });
    }
  
    // Add the new user to the users array
    users.push({ username, password });
  
    return res.status(200).json({ message: "User registered successfully" });
  });
/** 
// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify({books}, null, 5));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn]; // Directly access the book by its ISBN

  if (book) {
    res.json(book);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    const book = Object.values(books).find(book => book.author === author); // Convert ISBN to string and compare
  
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({message: "author not found"});
    }
  });
// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const book = Object.values(books).find(book => book.title === title); // Convert ISBN to string and compare
  
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({message: "title not found"});
    }
  });
  */

  // Get the book list available in the shop
const axios = require('axios');

public_users.get('/', async function (req, res) {
    try {
        // Simulate an asynchronous operation using async-await
        const getBooks = () => {
            return new Promise((resolve, reject) => {
                if (books) {
                    resolve(books);
                } else {
                    reject("Books data not available");
                }
            });
        };

        const data = await getBooks();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: "Error fetching books", error: error });
    }
});

public_users.get('/isbn/:isbn', async function (req, res) {
    const getBookByISBN = (isbn) => {
        return new Promise((resolve, reject) => {
            const book = books[isbn];
            if (book) {
                resolve(book);
            } else {
                reject("Book not found");
            }
        });
    };

    try {
        const book = await getBookByISBN(req.params.isbn);
        res.status(200).json(book);
    } catch (error) {
        res.status(404).json({ message: error });
    }
});

  
public_users.get('/author/:author', function (req, res) {
    const getBooksByAuthor = (author) => {
        return new Promise((resolve, reject) => {
            const booksByAuthor = Object.values(books).filter(book => book.author === author);
            if (booksByAuthor.length > 0) {
                resolve(booksByAuthor);
            } else {
                reject("No books found by this author");
            }
        });
    };

    getBooksByAuthor(req.params.author)
        .then(books => {
            res.status(200).json(books);
        })
        .catch(error => {
            res.status(404).json({ message: error });
        });
});


public_users.get('/title/:title', async function (req, res) {
    const getBooksByTitle = (title) => {
        return new Promise((resolve, reject) => {
            const booksByTitle = Object.values(books).filter(book => book.title === title);
            if (booksByTitle.length > 0) {
                resolve(booksByTitle);
            } else {
                reject("No books found with this title");
            }
        });
    };

    try {
        const books = await getBooksByTitle(req.params.title);
        res.status(200).json(books);
    } catch (error) {
        res.status(404).json({ message: error });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn]; // Access the book by its ISBN
  
    if (book) {
      res.json(book.reviews); // Send the reviews as JSON
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  });

module.exports.general = public_users;
