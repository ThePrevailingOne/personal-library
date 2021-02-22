//let library = [];
// define book
function Book(title, author, pages, isRead, date) {
    return {
        title,
        author,
        pages,
        isRead,
		date,
    };
}
// define access to book info
//
class LocalStorage {
	constructor() {
		this.ls = window.localStorage;
		let txt = this.ls.getItem('keys');
		if (txt) {
			this.keys = JSON.parse(txt);
			if (!(this.keys)) {
				this.keys = [];
				this.ls.setItem('keys', []);
			}
		} else {
			this.keys = [];
		}
	}

	setBookObj(bookObj) {
		let len = this.keys.length;
		this.ls.setItem(bookObj.date, JSON.stringify(bookObj));
		this.keys.push(bookObj.date);
		this.ls.setItem('keys', JSON.stringify(this.keys));
	}

	getBookObj(key) {
		let obj = JSON.parse(this.ls.getItem(key));
		return obj;
	}

	getAllItems() {
		let arr = [];
		for (let i = 0; i < this.keys.length; i ++) {
			let itm = this.getBookObj(this.keys[i]);
			if (itm) {
				arr.push(itm);
			}
		}
		return arr;
	}

	delItem(obj) {
		this.delKeys(obj.date);
		this.ls.removeItem(obj.date);
	}

	// HELPER funcs
	delKeys(val) {
		this.keys = this.keys.filter(x => x !== val);
		this.ls.setItem('keys', JSON.stringify(this.keys));
	}

	push(obj) {
		this.setBookObj(obj);
	} 
}

function info(obj) {
	return `${obj.title} by ${obj.author}, ${obj.pages} pages, ${obj.isRead}.`
}

//let theHobbit = new Book("The Hobbit", "J. R. R. Tolkien", 295, false);
//for(key in theHobbit){if(typeof(theHobbit[key]) != 'function')console.log(key);};

let library = new LocalStorage();
//library.setBookObj(theHobbit);

// define form and modal
let modal = document.querySelector("#modal");
let titleInput = document.querySelector("#inptitle");
let authorInput = document.querySelector("#inpauthor");
let pagesInput = document.querySelector("#inppages");
let readBox = document.querySelector("#readbox");

// define html library
let gallery = document.querySelector("#gallery");

function BookBlock(book) {
    // define all elements
    this.block = document.createElement('div');
    this.cardButtons = document.createElement('div');
    this.cardInfos = document.createElement('div');
    this.delbtn = document.createElement('button');
    this.editbtn = document.createElement('button');
    // assign class to all elements
    this.block.classList.add("cardblock");
    this.cardButtons.classList.add('cardbutton');
    this.cardInfos.classList.add('cardinfo');
    this.delbtn.classList.add('delbtn');
    this.editbtn.classList.add('editbtn');
    // attach all info to card info
    console.log("bukunya nih ", book);
    for(let key in book){
        if(typeof(book[key]) != 'function' && typeof(book[key]) != 'object'){
            let section = document.createElement('div');
            let head = document.createElement('h4');
            let detail = document.createElement('p');
            head.textContent = key;
            detail.textContent = book[key];
            section.classList.add('section');
            section.appendChild(head);
            section.appendChild(detail);
            this.cardInfos.appendChild(section);
        }
    }
    // add icon and attach all buttons
    this.delbtn.classList.add("fas");
    this.delbtn.classList.add("fa-trash");
    this.editbtn.classList.add("fas");
    this.editbtn.classList.add("fa-edit");
    this.cardButtons.appendChild(this.delbtn);
    this.cardButtons.appendChild(this.editbtn);
    // attach info and button
    this.block.appendChild(this.cardInfos);
    this.block.appendChild(this.cardButtons);
    // corelate both book and block
    book.block = this;
    this.book = book;
    // attach onclick function to delete
    this.delbtn.addEventListener("click", () => deleteBook(this.book));
}

function deleteBook(book){
	library.delItem(book);
    //library = library.filter(b => b !== book);
    updateGallery();
}

function openForm(){
    modal.style.display = "flex";
}

function closeForm(){
    titleInput.value = authorInput.value = pagesInput.value = '';
    readBox.checked = false;
    modal.style.display = "none";
}

function submitForm() {
    let book = new Book(titleInput.value, authorInput.value, pagesInput.value, readBox.checked, (new Date()).toISOString());
    library.push(book);
    printLibrary();
    closeForm();
    updateGallery();
}

function printLibrary() {
    library.getAllItems().forEach(b => console.log(info(b)));
}

function updateGallery() {
    console.log("let's update")
    while(gallery.firstElementChild){
        gallery.removeChild(gallery.firstElementChild);
    };

	let items = library.getAllItems();
    for(let i in items){
        let block = new BookBlock(items[i]);
        console.log(block.block);
        gallery.appendChild(block.block);
    };
}

window.onLoad = updateGallery();
