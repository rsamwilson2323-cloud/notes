const searchBar =document.getElementById("search-bar");
const newNote =document.getElementById("new-note");
const noteList =document.getElementById("notes-list");
const noteTitle =document.getElementById("note-title");
const statusText =document.getElementById("update");
const noteContent =document.getElementById("note-content");
const saveBtn =document.getElementById("save-btn");
const deleteBtn =document.getElementById("delete-btn");

let notes = [];
let activeNoteId = null;

function getNotes(){
    let storage = localStorage.getItem("notes_app_data");
    if(storage === null){
           return [];
    }
    return JSON.parse(storage); 
}

function saveNotes(notes){
    let string= JSON.stringify(notes);
    localStorage.setItem("notes_app_data",string);
    
}

notes =getNotes();
if(notes.length>0){
   activeNoteId = notes[0].id;
}
else{
    activeNoteId = null;
}
renderNotesList();


function renderNotesList() {
    noteList.innerHTML = "";

    const query = searchBar.value.toLowerCase();

    const filteredNotes = notes.filter(note =>
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query)
    );

    filteredNotes.forEach(note => {
        const li = document.createElement("li");

        const titleEl = document.createElement("div");
        titleEl.textContent = note.title || "Untitled Note";

        const timeEl = document.createElement("small");
        timeEl.textContent = `Last edited ${getRelativeTime(note.updatedAt)}`;

        li.appendChild(titleEl);
        li.appendChild(timeEl);


        if (note.id === activeNoteId) {
            li.classList.add("active");
        }

        li.addEventListener("click", ()=>{
            selectNote(note.id);
        });
        
        noteList.appendChild(li);
    });
    

}

function updateActiveNote() {
    if (activeNoteId === null) return;

    const note = notes.find(note => note.id === activeNoteId);
    if (!note) return;

    note.title = noteTitle.value;
    note.content = noteContent.value;
    note.updatedAt = Date.now();
    statusText.textContent ="Saved";
    setTimeout(() => {
        statusText.textContent=`Last edited ${getRelativeTime(note.updatedAt)}`;
    }, 1500);

    saveNotes(notes);
    renderNotesList();
}


function selectNote(id){
    activeNoteId = id;

    const selectedNote =notes.find(note => note.id === id);

    if(!selectedNote) return;
    noteTitle.value = selectedNote.title;
    noteContent.value = selectedNote.content;
    statusText.textContent = `Last edited ${getRelativeTime(selectedNote.updatedAt)}`;

    renderNotesList();
}

noteTitle.addEventListener("input", updateActiveNote);
noteContent.addEventListener("input", updateActiveNote);

newNote.addEventListener("click", () => {
    const newNoteObj ={
        id:Date.now(),
        title:"",
        content:"",
        createdAt:Date.now(),
        updatedAt:Date.now()
    }

    notes.unshift(newNoteObj);
    activeNoteId = newNoteObj.id;

    saveNotes(notes);
    renderNotesList();
    noteTitle.value="";
    noteContent.value="";
    noteTitle.focus();
})

saveBtn.addEventListener("click", ()=>{
    updateActiveNote();
    
})

deleteBtn.addEventListener("click", () => {
    if (activeNoteId === null) return;   
    notes = notes.filter(note => note.id !== activeNoteId);

    if (notes.length > 0) {
        activeNoteId = notes[0].id;
        noteTitle.value = notes[0].title;
        noteContent.value = notes[0].content;
    } else {
        activeNoteId = null;
        noteTitle.value = "";
        noteContent.value = "";
    }
    saveNotes(notes);
    renderNotesList();
});

searchBar.addEventListener("input", () => {
    renderNotesList();
});

function getRelativeTime(timestamp) {
    const diff = Date.now() - timestamp;

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return "Just now";
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hr ago`;
    return `${days} day ago`;
}
