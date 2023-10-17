const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

app.use(express.json());

// Connect to the SQLite database
const db = new sqlite3.Database('shifts.db', (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Connected to the database');
  }
});


// Create a new shift
app.post('/shifts', (req, res) => {
  const { startTime, endTime } = req.body;

  // Insert the new shift into the database
  db.run('INSERT INTO shifts (startTime, endTime) VALUES (?, ?)', [startTime, endTime], function(err) {
    if (err) {
      console.error(err.message);
      res.sendStatus(500);
    } else {
      console.log(`Created shift with ID: ${this.lastID}`);
      res.sendStatus(201);
    }
  });
});

// Delete a shift by ID
app.delete('/shifts/:id', (req, res) => {
  const { id } = req.params;

  // Delete the shift from the database
  db.run('DELETE FROM shifts WHERE id = ?', id, function(err) {
    if (err) {
      console.error(err.message);
      res.sendStatus(500);
    } else if (this.changes === 0) {
      res.sendStatus(404);
    } else {
      console.log(`Deleted shift with ID: ${id}`);
      res.sendStatus(200);
    }
  });
});

// Retrieve all shifts
app.get('/shifts', (req, res) => {
  // Retrieve all shifts from the database
  db.all('SELECT * FROM shifts', (err, rows) => {
    if (err) {
      console.error(err.message);
      res.sendStatus(500);
    } else {
      res.json(rows);
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});