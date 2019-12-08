var express = require('express'),
    http = require('http'),
    fs = require('fs')

const PORT = 8002;

var app = express();
var server = http.createServer(app);

app.all('*', (req, res, next) =>
{
    sendFile(res, './index2.html', 'text/html');
})

const io = require('socket.io')(server);

io.on("connect", (socket) =>
{
    console.log("Connected to " + socket.id);
    socket.emit("ready", socket.id);
})

server.listen(PORT, () =>
{
    console.log("Listening on port: " + PORT);
});

function sendFile(res, filename, type)
{
    type = type || 'text/html'
    fs.readFile(filename, function (error, content) {
        if (error) {
            console.log(error);
        }
        res.writeHead(200, { 'Content-type': type });
        res.end(content, 'utf-8');

    })
}