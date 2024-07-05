
const http = require('http');
const express = require('express')
const path = require('path')
const socketIo = require('socket.io')
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const indexPage = path.join(__dirname,"client/index.html")

app.use(express.static(path.join(__dirname, 'client')));

app.get("/",(req,res)=>{
    res.status(200)
    res.type('text/html')
    res.sendFile(indexPage)
})

io.on('connection', (socket) => {
    console.log('New client connected');
    socket.on('gust', () => {
        console.log("click")
        socket.emit('gustOk');
    });
});

const port = process.env.port || 3000;
server.listen(port,()=>{
    console.log(`server run on port : ${port}`)
})