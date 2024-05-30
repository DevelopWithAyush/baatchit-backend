import express from "express"
import {Server}  from "socket.io"
import {createServer} from "http"
const port =5000
const app = express()
const server = createServer(app)

const users =[{}]
const io = new Server(server,{
    cors:{
        origin:"http://localhost:3000",
        methods:["GET","POST"],
        credentials: true,
    }
})

app.get("/", (req, res) => {
    res.json({ message: "hello from this side" });
});


io.on("connection",(socket)=>{ //io bole to socket ka pura server jaha pe pura data aa ja raha hai
    console.log("user connected with id",socket.id)

    socket.on("joined",({user})=>{
        users[socket.id] = user;
        console.log(`${user} has joined`) //yaha pe hum destructure kar rahe kyo  ki data user ko connect kiye the
        socket.emit("Welcome",{Message:`${users[socket.id]} welcome to chat`})
        socket.broadcast.emit("userJoined",{Message:`${users[socket.id]} join the chat`})
    })

    socket.on("send",({sendmessage,id})=>{
        console.log(sendmessage,users[id])
        io.emit("recivemessage",{recivemessage:sendmessage,user:users[id],id})
    })
    // console.log(users[socket.id])//yaha pe ye is liye kaam nahi ker raha hia kyo ki pelhe hi users me kuch nahi hai 
    
    socket.on('disconnect', () => {
        socket.broadcast.emit('leave',{message:`${users[socket.id]} left the chat`})
        console.log('User disconnected');
      });
})


server.listen(port ,()=>{
    console.log(`server listen on the port ${port}`)
})