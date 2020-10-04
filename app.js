// Imports
const express = require('express');
const http = require('http');
const websocket = require('ws');
const { getDirectoryContent, isPathExists } = require('./folderOperations');

// Server init
const app = express();
app.use(express.json());
const server = http.createServer(app);

const wsServer = new websocket.Server({ server: server, path: '/ws' });

const folderWithMusic = '/var/www/music/';

app.get('/getInitialFolders', (req, res) => {
    const folcerContent = getDirectoryContent(folderWithMusic);
    res.send(folcerContent);
});

app.get('/getFolderContent', (req, res) => {
    const folderName = req.body.folderName;
    
    const fullPath = folderWithMusic + folderName;

    if(!isPathExists(fullPath)) {
        const statusMessage = `Folder "${folderName}" doesn't exist.`;

        res.statusMessage = statusMessage;
        res.status(404);
        res.send({ "error": statusMessage });
        return;
    }

    const folcerContent = getDirectoryContent(fullPath);
    res.send(folcerContent);
});

wsServer.on('connection', function connection(ws) {
    console.log('Web socket connection opened...');

    ws.on('message', function message(text) {
        console.log(text);
    });
});

server.listen(8080);