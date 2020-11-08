const { getDirectoryContent, isPathExists } = require('../folderOperations');

// const folderWithMusic = '/var/www/music/';
const folderWithMusic = './';

module.exports.getFolderContentEndpoints = (app) => {
    app.get('/getFolderContent/:folderName?', (req, res) => {
        const folderName = req.params.folderName;
        
        const fullPath = folderName ? folderWithMusic + folderName : folderWithMusic;
    
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

    app.get("/netRadioStations", (req, res) => {
        const radioStations = [
            { name: 'Calm Radio - Opera', isFolder: false, radioUrl: 'http://streams.calmradio.com:1128/stream' },
            { name:'Calm Radio - Christmass', isFolder: false, radioUrl: 'http://streams.calmradio.com:1428/stream' }
        ];

        res.send(radioStations);
    });
}