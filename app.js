// Imports
const express = require('express');
const http = require('http');
const websocket = require('ws');
const cors = require('cors');
const bodyParser = require('body-parser');
const { getFolderContentEndpoints } = require('./endpoints/folderContentEndpoints');
const { getWebSocketEndpoints } = require('./endpoints/webSocketEndpoints')
const { readFromFile } = require('./folderOperations');

const settings = JSON.parse(readFromFile('./settings.json'));

// Server init
const app = express();
app.use(cors({
    origin: ['http://localhost:4200', 'http://192.168.1.92']
}));
app.use(express.json());
app.use(bodyParser.json());
const server = http.createServer(app);
const wsServer = new websocket.Server({ server: server, path: '/ws' });

// Declare endpoints
getFolderContentEndpoints(app, settings);

getWebSocketEndpoints(wsServer);

server.listen(8080);