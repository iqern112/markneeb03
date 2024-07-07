
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
        // เมื่อเชื่อมต่อ
    socket.on('get-all-rooms', () => {
        socket.emit('all-rooms', roomNames); // ส่งข้อมูลห้องทั้งหมดกลับไปยัง client
    });
    });
    socket.on('join-room', (roomId) => {
        socket.join(roomId);
        if (!rooms.has(roomId)) {
            rooms.set(roomId, new Set());
        }
        rooms.get(roomId).add(userId);
        socket.to(roomId).emit('chat-message', { userId: 'system', msg: `User ${userId} has joined the room.` });
        io.to(socket.id).emit('join-room');
    });
    socket.on('create-room', (roomName) => {
        const roomId = uuidv4();
        rooms.set(roomId,{ roomName });
        roomNames.push(roomName); // เพิ่มชื่อห้องใหม่ลงใน Array
        io.emit('room-created', { roomId, roomName });
    });
    socket.on('chat-message', (roomId, userId, msg) => {
        socket.to(roomId).emit('chat-message', { userId, msg });
    });
    socket.on('disconnect', () => {
        // ลบผู้ใช้ออกจากรายการของผู้ใช้ที่ออนไลน์
       onlineUsers.delete(userId);
       // ส่งรายชื่อผู้ใช้ที่ออนไลน์ให้กับผู้ใช้ทั้งหมดที่เข้าเว็บไซต์
       io.emit('update-online-users', Array.from(onlineUsers));
       
       rooms.forEach((users, roomId) => {
           if (users.has(socket.userId)) {
               users.delete(socket.userId);
               socket.to(roomId).emit('chat-message', { userId: 'system', msg: `User ${socket.userId} has left the room.` });
           }
       });
   });
});

const port = process.env.port || 3000;
server.listen(port,()=>{
    console.log(`server run on port : ${port}`)
})//asdawdasdwa