const http = require('http');
const express = require('express');
const path = require('path');
const socketIo = require('socket.io');
const session = require('express-session');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, 'client')));
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));

const connectedUsers = {};

io.on('connection', (socket) => {

    socket.on('guest', () => {
        console.log("guest");
        socket.emit('guestOk');
    });

    socket.on('req-user-id',()=>{
        let userId = socket.id;
        connectedUsers[userId] = userId;
        socket.emit('res-user-id', userId);
        console.log(`user ${userId} connected`)
    });

    socket.on('req-online-users',()=>{
        socket.emit('res-online-users', Object.keys(connectedUsers));
    });

    socket.on('new-room',()=>{
        console.log("new room");
        socket.emit('acess-room');
    });
   
    socket.on('disconnect',()=>{
        console.log("user disconnect")
    });
});

const port = process.env.port || 3000;
server.listen(port,()=>{
    console.log(`server run on port : ${port}`);
})