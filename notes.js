document.addEventListener("DOMContentLoaded", function() {
    loadNotes();
});

function addNote() {
    const noteInput = document.getElementById('noteInput');
    const noteText = noteInput.value.trim();
    if (noteText) {
        db.collection("notes").add({
            text: noteText,
            likes: 0,
            dislikes: 0
        })
        .then(() => {
            noteInput.value = '';
            loadNotes(); // Reload notes after adding
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        });
    }
}

function loadNotes() {
    const notesContainer = document.getElementById('notes');
    notesContainer.innerHTML = ''; // Clear previous notes

    db.collection("notes").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const note = doc.data();
            const noteDiv = document.createElement('div');
            noteDiv.className = 'note';
            noteDiv.textContent = note.text;
            noteDiv.setAttribute('data-note-id', doc.id);
            noteDiv.addEventListener('click', () => showNoteDetails(doc.id));
            notesContainer.appendChild(noteDiv);
        });
    });
}

function showNoteDetails(noteId) {
    const noteRef = db.collection("notes").doc(noteId);

    noteRef.get().then((doc) => {
        if (doc.exists) {
            const note = doc.data();
            const likes = note.likes;
            const dislikes = note.dislikes;
            alert(`Likes: ${likes}\nDislikes: ${dislikes}`);
        } else {
            console.error("No such document!");
        }
    }).catch((error) => {
        console.error("Error getting document:", error);
    });
}

function toggleNoteInput() {
    const addNoteSection = document.querySelector('.add-note');
    addNoteSection.classList.toggle('visible');
}
