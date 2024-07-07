
const http = require('http');
const express = require('express')
const path = require('path')
const socketIo = require('socket.io')

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const onlineUsers = new Set();

app.use(express.static(path.join(__dirname, 'client')));

io.on('connection', (socket) => {
    
    socket.on('gust', () => {
        const userId = socket.id;
        onlineUsers.add(userId);
        console.log(`new user : ${userId}`);
        console.log("gust")
        socket.emit('gustOk');
    });
});

const port = process.env.port || 3000;
server.listen(port,()=>{
    console.log(`server run on port : ${port}`)
})//asdawdasdwa