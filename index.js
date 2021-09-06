const express = require("express");
const app = express();

const axios = require('axios');
const http = require("http")
const server = http.createServer(app)
const {
    Server
} = require("socket.io")

const io = new Server(server)
const delay = require('delay');
// Route
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

var data = [];
// Socket
io.on('connection', (socket) => {
    console.log('user connected')
    socket.on('on-chat', data => {
        io.emit('user-chat', data)
    })
})

// Server Configuration
server.listen(3000, () => {
    console.log('listening port 3000')
})

// API

var bitCoinData = []

function getBitcoinPrice() {
    let url = "https://api.nomics.com/v1/currencies/ticker?key=b9f56f575c1039eefda06430b554c75969016680&ids=BTC,ETH,XRP&interval=1d,30d&convert=EUR&per-page=100&page=1";
    axios.get(url)
        .then(response => {
            bitCoinData = response.data[0];
        })
        .catch(error => {
            console.log(error);
        });
}

async function broadcastBitcoinPrice(){
    while(true){
        getBitcoinPrice();
        io.emit('bitcoin-price', {
            data: bitCoinData
        })
        await delay(1000)
    }
}
broadcastBitcoinPrice();
