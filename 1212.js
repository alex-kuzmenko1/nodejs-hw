
const library = {
books: 1923,
logBookCount() {
console.log(this.books);
}
};

const showBooks = library.logBookCount;
showBooks();
