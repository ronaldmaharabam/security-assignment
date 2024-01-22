const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const session = require('express-session');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const port = 3000;


/*
-- Create database
CREATE DATABASE chatroom;
USE chatroom;

-- Create users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Create messages table
CREATE TABLE messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender_username VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

*/

// Set up MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'chatroom'
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'your_secret_key', resave: true, saveUninitialized: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username && password) {
        const query = `SELECT * FROM users WHERE username = ? AND password = ?`;
        db.query(query, [username, password], (err, result) => {
            if (err) throw err;

            if (result.length > 0) {
                req.session.loggedin = true;
                req.session.username = username;
                res.redirect('/chat');
            } else {
                res.send('Incorrect username or password!');
            }
        });
    } else {
        res.send('Please enter username and password!');
    }
});

app.get('/chat', (req, res) => {
    if (req.session.loggedin) {
        res.sendFile(__dirname + '/chat.html');
    } else {
        res.send('Please log in first!');
    }
});

const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
    console.log('a user connected');

    db.query('SELECT * FROM messages', (err, result) => {
        if (err) throw err;

        socket.emit('chat history', result);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('chat message', (data) => {
        const { username, message } = data;
        db.query('INSERT INTO messages (sender_username, content) VALUES (?, ?)', [username, message], (err) => {
            if (err) throw err;
        });

        io.emit('chat message', data);
    });
});

// Start the server
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
