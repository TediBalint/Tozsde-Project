import { WebSocketServer } from "ws";
import Stock from "./Stock.js";

const server = new WebSocketServer({
    port:8081,
    host:"localhost"
})


server.on('connection', (socket)=>{
    console.log("client connected")
    socket.on('message', (message) => {
    //     let answer = "";
    //     switch (message) {
    //         case "buy":
    //             Stock.Buy();
    //             break;
    //         case "sell":
    //             Stock.Sell();
    //             break;
    //         case "GetCurrntPrice":
    //             answer = Stock.GetCurrentPrice().ToString();
    //             break;
    //     }
    //     ws.send(answer)
    })
    socket.send("grafikon teszt trigger")
    // while(true){
    //     socket.send(Step) ez kell majd
    // }
})

server.on('close', ()=>{

})

server.on('error',(error)=>{ 
    console.log(error.message);
})
console.log("server started")

// npx nodemon index.js

// node index.js ->kész program