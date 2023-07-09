const axios = require('axios');
const url = "http://localhost:5050"

async function getBooks() {
    try {
        const response = await axios.get(url);
        const fetchedBooks = response.data;
        console.log(fetchedBooks);
    } catch (error) {
        console.error(error);
    }
}

function searchBookByISBN(isbn) {
    return new Promise((resolve, reject) => {
        axios.get(`${url}/isbn/${isbn}`)
            .then(response => {
                const book = response.data;
                resolve(book);
            })
            .catch(error => {
                reject(error.message);
            });
    });
}

function searchBookByAuthor(author) {
    return new Promise((resolve, reject) => {
        axios.get(`${url}/author/${author}`)
            .then(response => {
                const book = response.data;
                resolve(book);
            })
            .catch(error => {
                reject(error.message);
            });
    });
}

async function getBookByTitle(title) {
    try {
        const response = await axios.get(url + '/title/' + title);
        const fetchedBooks = response.data;
        console.log("Books found by Title : " + title)
        console.log(fetchedBooks);
    } catch (error) {
        console.error(error);
    }
}

//Values of sibn author and title
const isbnToSearch = "9781593279509";
const authorToSearch = "Nicholas C. Zakas";
const titleToSearch = "Speaking JavaScript";

searchBookByISBN(isbnToSearch)
    .then(book => {
        console.log("Book found for ISBN :" + isbnToSearch);
        console.log(book);
    })
    .catch(error => {
        console.error("Error:", error);
    });

searchBookByAuthor(authorToSearch)
    .then(book => {
        console.log("Book found for Author :" + authorToSearch);
        console.log(book);
    })
    .catch(error => {
        console.error("Error:", error);
    });

getBooks();
getBookByTitle(titleToSearch);
