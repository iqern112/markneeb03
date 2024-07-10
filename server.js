
const http = require('http');
const express = require('express')
const path = require('path')
const socketIo = require('socket.io')
const session = require('express-session'); // เพิ่ม express-session เข้ามาใช้งาน
const { v4: uuidv4 } = require('uuid');


const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const rooms = new Map();
const onlineUsers = new Set();
const roomNames = [123]; // เก็บเฉพาะชื่อห้อง

// เชื่อมต่อ Express กับ Socket.IO
app.use(express.static(path.join(__dirname, 'client')));
app.use(session({
    secret: 'your-secret-key', // ใช้คีย์เรื่องความลับของคุณ
    resave: false,
    saveUninitialized: true
}));

io.on('connection', (socket) => {
    let userId;
if (!socket.handshake.session) {
    socket.handshake.session = {};
}

if (socket.handshake.session.userId) {
    userId = socket.handshake.session.userId;
}
    console.log(`sadw : ${userId}`);
    // ส่ง userId กลับไปยัง client
    socket.emit('set-user-id', userId);
    socket.on('gust', () => {
        userId = socket.id;
        socket.handshake.session.userId = userId; // เก็บ userId ลงใน session
        socket.handshake.session.save(); // บันทึก session ทันที
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
    socket.on('leave', (userId) => {
        // ลบผู้ใช้ออกจากรายการของผู้ใช้ที่ออนไลน์
       onlineUsers.delete(userId);
       // ส่งรายชื่อผู้ใช้ที่ออนไลน์ให้กับผู้ใช้ทั้งหมดที่เข้าเว็บไซต์
       io.emit('update-online-users', Array.from(onlineUsers));
       console.log(`disconnect user : ${userId}`);
       
       rooms.forEach((users, roomId) => {
           if (users.has(userId)) {
               users.delete(userId);
               socket.to(roomId).emit('chat-message', { userId: 'system', msg: `User ${userId} has left the room.` });
           }
       });
   });
});

const port = process.env.port || 3000;
server.listen(port,()=>{
    console.log(`server run on port : ${port}`)
})//asdawdasdwa