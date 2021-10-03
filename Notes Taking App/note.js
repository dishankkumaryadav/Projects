const noteContainer = document.querySelector('.note-container');
const form = document.querySelector('form');
const titleInput = document.querySelector('#title');

class Note {
    constructor(title, body) {
        this.title = title;
        this.body = body;
        this.id = Math.random();
    }
}

/// /LOCAL STORAGE////
// Function: Retreive notes from local storage
function getNotes() {
    let notes;
    if (localStorage.getItem('noteApp.notes') === null) {
        notes = [];
    } else {
        notes = JSON.parse(localStorage.getItem('noteApp.notes'));
    }
    return notes;
}

// Function: Add a note to local storage
function addNotesToLocalStorage(note) {
    const notes = getNotes();
    notes.push(note);
    localStorage.setItem('noteApp.notes', JSON.stringify(notes));
}

// Function: remove a note  from local storage
function removeNote(id) {
    const notes = getNotes();
    notes.forEach((note, index) => {
        if (note.id === id) {
            notes.splice(index, 1);
        }
        localStorage.setItem('noteApp.notes', JSON.stringify(notes));
    })
}

function addNoteToList(note) {
    const newUINote = document.createElement('div');
    newUINote.classList.add('note');
    newUINote.innerHTML = `
      <span hidden>${note.id}</span>
      <h2 class="note__title">${note.title}</h2>
      <p class="note__body">${note.body}</p>
        <button class="note__delete">Delete Note</button>
    `;
    noteContainer.appendChild(newUINote);
}

// Function: Show notes in UI
function displayNotes() {
    const notes = getNotes();
    notes.forEach(note => {
        addNoteToList(note);
    })
}

// Function: Show alert message
function showAlertMessage(message, alertClass) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `message ${alertClass}`;
    alertDiv.appendChild(document.createTextNode(message));
    form.insertAdjacentElement('beforebegin', alertDiv);
    titleInput.focus();
    setTimeout(() => alertDiv.remove(), 2000)
}

// Event: Note Buttons
noteContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('note__delete')) {
        const currentNote = e.target.closest('.note');
        showAlertMessage('Your note was permanently deleted', 'remove-message');
        currentNote.remove();
        const id = currentNote.querySelector('span').textContent;
        removeNote(Number(id))
    }
})

// Event: Display Notes
document.addEventListener('DOMContentLoaded', displayNotes)

// Event: Note Form Submit
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const noteInput = document.querySelector('#note');

    // validate inputs
    if (titleInput.value.length > 0 && noteInput.value.length > 0) {
        const newNote = new Note(titleInput.value, noteInput.value);
        addNoteToList(newNote);
        addNotesToLocalStorage(newNote);
        titleInput.value = '';
        noteInput.value = '';
        showAlertMessage('Note successfully added', 'success-message');
        titleInput.focus();
    } else {
        showAlertMessage('Please add both a title and a note', 'alert-message');
    }
});