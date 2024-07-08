
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

io.on('connection', (socket) => {
    
    socket.on('gust', () => {
        console.log("gust");
        socket.emit('gustOk');
    });

    socket.on('in-to-lobby',()=>{
        if(!session.userId){
            session.userId = socket.id;
        }
        socket.emit('your-user-id', session.userId);
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