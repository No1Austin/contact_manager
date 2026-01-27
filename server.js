const express = require("express");
const app = express();
app.use(express.json());

// Contact class
class Contact {
  constructor(name, phone) {
    this.name = name;
    this.phone = phone;
  }
}

// Doubly linked list node
class Node {
  constructor(contact) {
    this.contact = contact;
    this.prev = null;
    this.next = null;
  }
}

// Doubly linked list
class DoublyLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
  }

  append(contact) {
    const newNode = new Node(contact);

    if (!this.head) {
      this.head = this.tail = newNode;
      return;
    }

    this.tail.next = newNode;
    newNode.prev = this.tail;
    this.tail = newNode;
  }

  forward() {
    let result = [];
    let curr = this.head;
    while (curr) {
      result.push(curr.contact);
      curr = curr.next;
    }
    return result;
  }

  backward() {
    let result = [];
    let curr = this.tail;
    while (curr) {
      result.push(curr.contact);
      curr = curr.prev;
    }
    return result;
  }
}

// Naive substring search
function containsSubstring(text, pattern) {
  text = text.toLowerCase();
  pattern = pattern.toLowerCase();

  if (pattern.length === 0) return true;

  for (let i = 0; i <= text.length - pattern.length; i++) {
    if (text.substring(i, i + pattern.length) === pattern) {
      return true;
    }
  }
  return false;
}

// Data structures
const contactsList = new DoublyLinkedList();
const contactsTable = {}; // hash table: name -> Contact

// Route: add contact
app.post("/add", (req, res) => {
  const { name, phone } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ message: "Name and phone are required." });
  }

  if (contactsTable[name]) {
    return res.status(409).json({ message: "Contact already exists." });
  }

  const contact = new Contact(name, phone);
  contactsList.append(contact);
  contactsTable[name] = contact;

  res.json({ message: "Contact added.", contact });
});

// Route: search by exact name (hash table)
app.get("/search/name/:name", (req, res) => {
  const name = req.params.name;
  const contact = contactsTable[name];

  if (!contact) {
    return res.status(404).json({ message: "No contact found." });
  }

  res.json({ message: "Found contact.", contact });
});

// Route: search by keyword (substring match)
app.get("/search/keyword/:keyword", (req, res) => {
  const keyword = req.params.keyword;
  let matches = [];

  let curr = contactsList.head;
  while (curr) {
    if (containsSubstring(curr.contact.name, keyword)) {
      matches.push(curr.contact);
    }
    curr = curr.next;
  }

  if (matches.length === 0) {
    return res.status(404).json({ message: "No matches found." });
  }

  res.json({ message: "Matches found.", matches });
});

// Route: view forward
app.get("/view/forward", (req, res) => {
  res.json({ contacts: contactsList.forward() });
});

// Route: view backward
app.get("/view/backward", (req, res) => {
  res.json({ contacts: contactsList.backward() });
});

// Home route
app.get("/", (req, res) => {
  res.send("Contact Manager is running!");
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
