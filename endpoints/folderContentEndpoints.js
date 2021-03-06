'use strict';

const { getDirectoryContent, isPathExists, readFromFile, writeToFile } = require('../folderOperations');

module.exports.getFolderContentEndpoints = (app, settings) => {

    const folderWithMusic = settings.musicFolderPath;
    const netRadiosJsonFile = settings.netRadiosJsonFile;

    app.get('/getFolderContent/', (req, res) => {
        const folderName = req.query.foldername;

        if (RegExp(/(\.\.\/)|(~)|(\.\/)|(\.\.)/).test(folderName)) {
            res.status(400).send({ "error": "Path is incorrect" });
            return;
        }

        let fullPath = '';
        if(!folderName || folderName === '/') {
            fullPath = folderWithMusic;
        } else {
            fullPath = folderWithMusic + folderName;
        }
        
        if (fullPath.indexOf(folderWithMusic) == -1) {
            res.status(400).send({ "error": "Path is incorrect" });
            return;
        }

        if (!isPathExists(fullPath)) {
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
            const radioStations = readFromFile(netRadiosJsonFile);
            res.send(JSON.parse(radioStations));
        } catch (error) {
            res.status(500);
            res.statusMessage = "Can't read list of online stations form file Assets/netRadios.json";
            res.send();
        }
    });

    app.post('/netRadioStations', (req, res) => {
        const newRadioStation = req.body;

        if (!newRadioStation.name || !newRadioStation.radioUrl) {
            res.status(400);
            res.statusMessage('New radio station object was not provided.');
            res.send();
        }

        try {
            const readFile = readFromFile(netRadiosJsonFile);
            let radioStations = readFile.length > 0 ? JSON.parse(readFile) : [];
            radioStations.push(newRadioStation);
            writeToFile(netRadiosJsonFile, JSON.stringify(radioStations));

            res.send(radioStations);
        } catch (error) {
            res.status(500);
            res.statusMessage = 'Could not add new radio station.';
            res.send();
        }
    });

    app.delete('/netRadioStations', (req, res) => {
        const radioStationToRemove = req.query.radioUrl;

        if (!radioStationToRemove) {
            res.status(400);
            res.statusMessage('New radio station to remove was not provided.');
            res.send();
        }

        try {
            const readFile = readFromFile(netRadiosJsonFile);
            let radioStations = readFile.length > 0 ? JSON.parse(readFile) : [];
            
            const radioStationsAfterRemoval = radioStations.filter(x => x.radioUrl !== radioStationToRemove);
            writeToFile(netRadiosJsonFile, JSON.stringify(radioStationsAfterRemoval));

            res.send(radioStationsAfterRemoval);
        } catch (error) {
            res.status(500);
            res.statusMessage = 'Could not remove radio station.';
            res.send();
        }

    });
}