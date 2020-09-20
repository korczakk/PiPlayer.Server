const express = require('express');
const { getDirectoryContent, isPathExists } = require('./folderOperations');
const app = express();

app.use(express.json());

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

app.listen(8080);