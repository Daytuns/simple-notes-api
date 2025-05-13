const mongoose = require('mongoose');

// Step 1: Define the schema
const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true // this means title is required
  },
  content: {
    type: String,
    required: true // content is also required
  },
  date: {
    type: Date,
    default: Date.now // sets the current date automatically
  }
});

// Step 2: Create the model from the schema
const Note = mongoose.model('Note', noteSchema);

// Step 3: Export the model so we can use it elsewhere
module.exports = Note;
