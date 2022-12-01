const notes = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const {
  readFromFile,
  writeToFile,
  readAndAppend,
} = require('../helpers/fsUtils');

// GET Route for retrieving all the notes
notes.get('/', (req, res) => {
  readFromFile('./db/db.json')
  .then((data) => res.json(JSON.parse(data)));
});


// POST request for notes
notes.post('/', (req, res) => {
  const { title, text } = req.body;

  // If all the required properties are present
  if (title && text ) {
    // Variable for the object we will save
    const newNotes = {
      title,
      text,
      id: uuidv4(),
    };
  
    readAndAppend(newNotes, './db/db.json');
    res.json(`Note added successfully 🚀`);
  } else {
      res.error('Error in adding note');
  }
});

// DELETE Route for a specific notes
notes.delete('/:id', (req, res) => {
  const notesId = req.params.id;
  readFromFile('./db/db.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
      // Make a new array of all notes except the one with the ID provided in the URL
      const result = json.filter((note) => note.id !== notesId);

      // Save that array to the filesystem
      writeToFile('./db/db.json', result);

      // Respond to the DELETE request
      res.json(`Item ${notesId} has been deleted 🗑️`);
    });
});

module.exports = notes;