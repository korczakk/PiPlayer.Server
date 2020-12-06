'use strict';

const { getDirectoryContent, isPathExists, readFromFile, appendToFile, writeToFile } = require('../folderOperations');

// const folderWithMusic = '/home/pi/Music';
const folderWithMusic = '/repos/PiPlayer.Server';

module.exports.getFolderContentEndpoints = (app) => {
    app.get('/getFolderContent/', (req, res) => {
        const folderName = req.query.foldername;

        if(RegExp(/(\.\.\/)|(~)|(\.\/)|(\.\.)/).test(folderName)) {
            res.status(400).send({ "error": "Path is incorrect" });
            return;
        }

        const fullPath = folderName ? folderWithMusic + folderName : folderWithMusic;

        if(fullPath.indexOf(folderWithMusic) == -1) {
            res.status(400).send({ "error": "Path is incorrect" });
            return;
        }
    
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

    app.get('/netRadioStations', (req, res) => {
        try {
            const radioStations = readFromFile('./Assets/netRadios.json');    
            res.send(JSON.parse(radioStations));
        } catch (error) {
            res.status(500);
            res.statusMessage = "Can't read list of online stations form file Assets/netRadios.json";
            res.send();
        }        
    });

    app.post('/netRadioStations', (req, res) => {
        const newRadioStation = req.body;

        if(!newRadioStation.name || !newRadioStation.radioUrl) {
            res.status(400);
            res.statusMessage('New radio station object was not provided.');
            res.send();
        }

        try {
            const readFile = readFromFile('./Assets/netRadios.json');
            let radioStations = readFile.length > 0 ? JSON.parse(readFile) : [];
            radioStations.push(newRadioStation);
            writeToFile('./Assets/netRadios.json', JSON.stringify(radioStations));

            res.send(radioStations);
        } catch (error) {
            res.status(500);
            res.statusMessage = 'Could not add new radio station.';
            res.send();
        }
    });
}