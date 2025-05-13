require('dotenv').config();

const express = require('express'); // import express
const mongoose = require('mongoose');

const app = express();              // create an Express app
const PORT = 3000;                  // define the port

mongoose.connect(process.env.PASSWORD_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log(' Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error', err));

app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.send('Notes API is running...');
});

const Note = require('./models/Note'); // import the Note model

// GET route to retrieve all notes
app.get('/notes', async (req, res) => {
  try {
    const notes = await Note.find(); // get all notes from MongoDB
    res.status(200).json(notes);     // send them as JSON
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching notes' });
  }
});


// POST route to create a new note
app.post('/notes', async (req, res) => {
  try {
    const { title, content } = req.body;

    // Create a new Note instance
    const newNote = new Note({
      title,
      content
    });

    // Save the note to MongoDB
    const savedNote = await newNote.save();

    // Respond with the saved note
    res.status(201).json(savedNote);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong while saving the note.' });
  }
});

// PUT route to update a note by its id
app.put('/notes/:id', async (req, res) => {
  try {
    const { id } = req.params;  // Extract the id from the URL
    const { title, content } = req.body; // Extract new title and content from the request body

    // Find the note by its id and update it
    const updatedNote = await Note.findByIdAndUpdate(id, { title, content }, { new: true });

    if (!updatedNote) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Respond with the updated note
    res.status(200).json(updatedNote);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong while updating the note.' });
  }
});

// DELETE route to delete a note by its id
app.delete('/notes/:id', async (req, res) => {
  try {
    const { id } = req.params;  // Extract the id from the URL

    // Find the note by its id and delete it
    const deletedNote = await Note.findByIdAndDelete(id);

    if (!deletedNote) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Respond with a message confirming deletion
    res.status(200).json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong while deleting the note.' });
  }
});




// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
