class Book {
	constructor(title, author, isbn) {
		this.title = title;
		this.author = author;
		this.isbn = isbn;
	}
}

class UI {
	addBookToList(book) {
		//Get <tbody></tbody>
		const list = document.querySelector("#book-list");
		//Create <tr></tr>
		const row = document.createElement("tr");
		//Insert Columns
		row.innerHTML = `
    	<td>${book.title}</td>
			<td>${book.author}</td>
			<td>${book.isbn}</td>
			<td><a href="#" class="delete">X</a></td>
    `;
		list.appendChild(row);
	}

	showAlert(message, className) {
		//Create div
		const div = document.createElement("div");
		//Add classes
		div.className = `alert alert-${className} role="alert"`;
		//Create & add text
		const textNode = document.createTextNode(message);
		div.appendChild(textNode);
		//Get parent
		const container = document.querySelector(".container");
		//Get Form
		const form = document.querySelector("#book-form");
		//Insert
		container.insertBefore(div, form);
		//Timeout after 3 seconds
		setTimeout(() => {
			document.querySelector(".alert").remove();
		}, 2000);
	}

	clierFields() {
		document.querySelector("#title").value = "";
		document.querySelector("#author").value = "";
		document.querySelector("#isbn").value = "";
	}

	deleteBook(value) {
		if (value.className === "delete") {
			value.parentElement.parentElement.remove();
		}
	}
}

class Store {
	static getBooks() {
		let books;
		if (localStorage.getItem("books") === null) {
			books = [];
		} else {
			books = JSON.parse(localStorage.getItem("books"));
		}
		return books;
	}

	static displayBooks() {
		const books = Store.getBooks();
		books.forEach((book) => {
			const ui = new UI();
			//add book to UI
			ui.addBookToList(book);
		});
	}

	static addBook(book) {
		const books = Store.getBooks();
		books.push(book);
		localStorage.setItem("books", JSON.stringify(books));
	}

	static removeBook(isbn) {
		const books = Store.getBooks();
		books.forEach((book, index) => {
			if (book.isbn === isbn) {
				books.splice(index, 1);
			}
		});
		localStorage.setItem("books", JSON.stringify(books));
	}
}

//Local Stotage - DOM Load Event
document.addEventListener("DOMContentLoaded", Store.displayBooks);

//Event Listener for Add Book
const form = document.querySelector("#book-form");
form.addEventListener("submit", (e) => {
	e.preventDefault();
	//GEt Form Values
	const title = document.querySelector("#title").value;
	const author = document.querySelector("#author").value;
	const isbn = document.querySelector("#isbn").value;
	//Instantiate book
	const book = new Book(title, author, isbn);
	//Instantiate UI
	const ui = new UI();

	//Validation
	if (title === "" || author === "" || isbn === "") {
		ui.showAlert("Please fill in all fields", "danger");
	} else {
		//Add book to list
		ui.addBookToList(book);
		//ADD TO LOCAL STORAGE
		Store.addBook(book);
		//Show Success
		ui.showAlert("Book added", "success");
		//Clear Fields
		ui.clierFields();
	}
});

//Event Listener for delete
const booklist = document.querySelector("#book-list");
booklist.addEventListener("click", (e) => {
	e.preventDefault();
	//Instantiate UI
	const ui = new UI();
	//Delete book
	const value = e.target;
	ui.deleteBook(value);
	//Local Storage - Remove from Local Storage
	Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
	//Show Message
	ui.showAlert("Book removed!", "success");
});
