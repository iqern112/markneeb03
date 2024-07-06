
const http = require('http');
const express = require('express')
const path = require('path')
const socketIo = require('socket.io')

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, 'client')));

io.on('connection', (socket) => {
    
    socket.on('gust', () => {
        console.log("gust")
        socket.emit('gustOk');
    });

    socket.on('in-to-lobby',()=>{//อาจมีการเขียน if และใช้ session มาช่วยในการเก็บ id เดิม
        const userId = socket.id;
        console.log(`new user : ${userId}`);
        socket.emit('your-user-id',userId)
    })

    socket.on('new-room',()=>{
        console.log("new room")
        socket.emit('acess-room')
    })
});

const port = process.env.port || 3000;
server.listen(port,()=>{
    console.log(`server run on port : ${port}`)
})