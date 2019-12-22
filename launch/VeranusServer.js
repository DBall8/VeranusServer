var express = require('express'),
    http = require('http'),
    fs = require('fs'),
    SerialPort = require('serialport'),
    url = require('url')

const SETTINGS = require(__dirname + "/settings.json");

const MSG_START = 0x7f;
const MSG_END = 0xff;

var activeSockets = [];

const MAX_STORED_DATA = 1000;
var savedData = [];
var startIndex = 0;
endIndex = 0;

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);
const serialConnection = new SerialPort(
    SETTINGS.serialPort,
    {
        baudRate: SETTINGS.baudRate
    }, 
    (err) => {if(err) console.log(err)}
);

startServer();
startSocket();
startSerial();

function startServer()
{
    app.get("/raw", (req, res) =>
    {
        sendRawData(res);
    });
    app.all('*', (req, res, next) =>
    {
        var uri = url.parse(req.url);
        var path = __dirname + '/../dist/Veranus' + uri.pathname
    
        if(uri.pathname !== '/' && fs.existsSync(path)){
            sendFile(res, path);
        }
        else{
            sendFile(res, __dirname + '/../dist/Veranus/index.html');
        }
    });

    server.listen(SETTINGS.serverPort, () =>
    {
        console.log("Listening on port: " + SETTINGS.serverPort);
    });
}

function startSocket()
{
    io.on("connect", (socket) =>
    {
        console.log("Connected to " + socket.id);
        activeSockets.push(socket);

        socket.on("disconnect", () =>
        {
            console.log("Disconnected from " + socket.id);
            for (var i=0; i<activeSockets.length; i++)
            {
                if(activeSockets[i].id == socket.id)
                {
                    activeSockets.splice(i, 1);
                    break;
                }
            }
        });
    })
}

function startSerial()
{
    serialConnection.on("open", () =>
    {
        console.log("Serial connection opened on " + SETTINGS.serialPort);
        serialConnection.on("data", (data) =>
        {
            parseSerial(data);
        });
    });
}

const EXPECTED_MESSAGE_LENGTH = 12;
var buffer = [];
var messageStart = false;
function parseSerial(data)
{
    for (var i=0; i<data.length; i++)
    {
        if (messageStart)
        {
            if (data[i] == MSG_END ||
                buffer.length > EXPECTED_MESSAGE_LENGTH)
            {
                if(buffer.length == EXPECTED_MESSAGE_LENGTH)
                {
                    handleNewData(bufferToMessage(buffer));
                }
                buffer = [];
                messageStart = false;
            }
            else
            {
                buffer.push(data[i]);
            }
        }
        else if (data[i] == MSG_START)
        {
            messageStart = true;
        }
    }
}

function handleNewData(msg)
{
    updateSockets(msg);
    savedData[endIndex] = msg;
    endIndex++;

    if (endIndex >= MAX_STORED_DATA) endIndex = 0;
    if (endIndex == startIndex) startIndex++;
    if (startIndex >= MAX_STORED_DATA) startIndex = 0;
}

const VALUE_SIZE = 4;
function bufferToMessage(buffer)
{
    var msg = {};
    msg.timestamp = new Date().getTime();

    msg.light = arrayToFloat32(buffer.slice(0, VALUE_SIZE));
    msg.temp = arrayToFloat32(buffer.slice(VALUE_SIZE, VALUE_SIZE * 2));
    msg.humid = arrayToFloat32(buffer.slice(VALUE_SIZE * 2, VALUE_SIZE * 3));

    return msg;
}

function updateSockets(msg)
{
    activeSockets.map((socket) =>
    {
        socket.emit("update", msg);
    })
}

function arrayToFloat32(arr)
{
    return new Float32Array(new Uint8Array(arr).buffer)[0]
}

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

function sendRawData(res)
{
    res.writeHead(200, { 'Content-type': 'text/html' });
    if(savedData[startIndex] == undefined)
    {
        res.end("<body>No data yet.</body");
        return;
    } 
    var startTime = savedData[startIndex].timestamp;
    res.write("<div>Light, Temp, Humid, Timestamp</div>");
    res.write("<body>");

    var i=startIndex;
    do{
        var msg = savedData[i];
        res.write("<div>" + msg.light + ',' + msg.temp + ',' + msg.humid + ',' + (msg.timestamp - startTime) + "</div>")
        i++;
        if (i >= MAX_STORED_DATA) i = 0;

        console.log(savedData[i])
        console.log(i + ',' + startIndex);
    } while (savedData[i] != undefined &&
            i != endIndex);
    res.end("</body>", 'utf-8');
}