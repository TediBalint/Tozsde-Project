import { WebSocketServer } from "ws";

const server = new WebSocketServer({
    port:8081
})


server.on('connection', (socket)=>{
    // ws.on('message', function incoming(message) {
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
    // }) -- kicrashel miatta
})

server.on('close', ()=>{

})

server.on('error',(error)=>{ 
    console.log(error.message);
})


// npx nodemon index.js

// node index.js ->kész program