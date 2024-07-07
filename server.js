
const http = require('http');
const express = require('express')
const path = require('path')
const socketIo = require('socket.io')

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const rooms = new Map();
const onlineUsers = new Set();
const roomNames = [123]; // เก็บเฉพาะชื่อห้อง

app.use(express.static(path.join(__dirname, 'client')));

io.on('connection', (socket) => {
    
    socket.on('gust', () => {
        const userId = socket.id;
        onlineUsers.add(userId);
        // ส่งรายชื่อผู้ใช้ที่ออนไลน์ให้กับผู้ใช้ทั้งหมดที่เข้าเว็บไซต์
    io.emit('update-online-users', Array.from(onlineUsers));
        console.log(`new user : ${userId}`);
        console.log("gust")
        socket.emit('gustOk');
        
    });
    
    socket.on('disconnect', () => {
        // ลบผู้ใช้ออกจากรายการของผู้ใช้ที่ออนไลน์
       onlineUsers.delete(userId);
       // ส่งรายชื่อผู้ใช้ที่ออนไลน์ให้กับผู้ใช้ทั้งหมดที่เข้าเว็บไซต์
       io.emit('update-online-users', Array.from(onlineUsers));
       
       
   });
});

const port = process.env.port || 3000;
server.listen(port,()=>{
    console.log(`server run on port : ${port}`)
})//asdawdasdwa