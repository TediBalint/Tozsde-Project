import { WebSocketServer } from "ws";
import Stock from "./Stock.js";
import fs from 'fs';
var users = JSON.parse(fs.readFileSync('./data/users.json', 'utf8'));

const server = new WebSocketServer({
    port:8081,
    host:"localhost"
})

server.on('connection', (socket) => {
    console.log("client connected");
    socket.send("grafikon teszt trigger");
    socket.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            console.log(data);
            if (data.type == "login") {
                const { user, pass } = data;
                let foundUser = filterByUsername(users, user);
                console.log(foundUser);
                if (foundUser === undefined || foundUser.Password !== pass) {
                    socket.send(JSON.stringify({ 
                        type: "login", 
                        success: false, 
                    }));
                    console.log("Login failed");
                }
                else{
                    socket.send(JSON.stringify({ type: "login", success: true, balance: foundUser.Balance }));
                    console.log("Login successful");
                }
            }
            if (data.type === "stock") {
                // Implement stock logic here if needed
                // Example:
                // let answer = "";
                // switch (data.action) {
                //     case "buy":
                //         Stock.Buy();
                //         break;
                //     case "sell":
                //         Stock.Sell();
                //         break;
                //     case "GetCurrentPrice":
                //         answer = Stock.GetCurrentPrice().toString();
                //         break;
                // }
                // socket.send(answer);
            }
        } catch (e) {
            socket.send(JSON.stringify({ type: "error", message: "Invalid message format" }));
        }
    });
});

server.on('close', ()=>{

})

server.on('error',(error)=>{ 
    console.log(error.message);
})
console.log("server started")

// npx nodemon index.js

// node index.js ->kész program

function filterByUsername(jsonObject, username) {return jsonObject.filter(function(jsonObject) {return (jsonObject['Name'] == username);})[0];}
