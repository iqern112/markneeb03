
const http = require('http');
const express = require('express');
const path = require('path');
const socketIo = require('socket.io');
const session = require('express-session');
const sharedSession = require("express-socket.io-session");

const sessionMiddleware = session({
    secret: "mysession",
    resave: false,
    saveUninitialized: false
});

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, 'client')));
app.use(sessionMiddleware);

io.use(sharedSession(sessionMiddleware, {
    autoSave: true
}));

io.on('connection', (socket) => {
    
    socket.on('gust', () => {
        console.log("gust");
        socket.emit('gustOk');
    });

    socket.on('in-to-lobby',()=>{//อาจมีการเขียน if และใช้ session มาช่วยในการเก็บ id เดิม
        const userId = socket.userId;
        if(!socket.handshake.session.userId){
            const userId = socket.userId;
            socket.handshake.session.userId = userId;
            socket.handshake.session.save();
            console.log(`New user : ${userId}`);
            socket.emit('your-user-id',userId);
        }else{
            const userId = socket.handshake.session.userId;
            console.log(`old user : ${userId}`);
            socket.emit('your-user-id', userId);
        }
    });

    socket.on('new-room',()=>{
        console.log("new room");
        socket.emit('acess-room');
    });
});

const port = process.env.port || 3000;
server.listen(port,()=>{
    console.log(`server run on port : ${port}`);
})