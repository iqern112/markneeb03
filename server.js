
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

    // if (!socket.handshake.session.userId) {
    //     socket.handshake.session.userId = socket.id;
    // }
    // const userId = socket.handshake.session.userId;
    // connectedUsers[userId] = socket.id;

    socket.on('gust', () => {
        console.log("gust");
        socket.emit('gustOk');
    });

    socket.on('req-user-id',()=>{
        // if(!session.userId){
        //     session.userId = socket.id;
        // }
        let userId = socket.id;
        connectedUsers[userId] = userId;
        socket.emit('res-user-id', userId);
        io.emit('res-online-users', Object.keys(connectedUsers));
        console.log(`user ${userId} connected`)
        io.emit('res-online-users', Object.keys(connectedUsers));
    });


    socket.on('req-online-users',()=>{
        socket.emit('res-online-users', Object.keys(connectedUsers));
    });

    socket.on('new-room',()=>{
        console.log("new room");
        socket.emit('acess-room');
    });

    // socket.on('disconnect', () => {
    //     delete connectedUsers[userId];
    //     io.emit('res-online-users', Object.keys(connectedUsers));
    //     // console.log(`User ${userId} disconnected`);
    // });

});

const port = process.env.port || 3000;
server.listen(port,()=>{
    console.log(`server run on port : ${port}`);
})