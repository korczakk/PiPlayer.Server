// Imports
const express = require('express');
const http = require('http');
const websocket = require('ws');
const { getFolderContentEndpoints } = require('./endpoints/folderContentEndpoints')
const { getWebSocketEndpoints } = require('./endpoints/webSocketEndpoints')

// Server init
const app = express();
app.use(express.json());
const server = http.createServer(app);
const wsServer = new websocket.Server({ server: server, path: '/ws' });

// Declare endpoints
getFolderContentEndpoints(app);

getWebSocketEndpoints(wsServer);

server.listen(8080);