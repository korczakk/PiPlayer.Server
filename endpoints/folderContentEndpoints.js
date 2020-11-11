const { getDirectoryContent, isPathExists } = require('../folderOperations');

const folderWithMusic = '/home/pi/Music/';
//  const folderWithMusic = './';

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
            { name:'Calm Radio - Christmass', isFolder: false, radioUrl: 'http://streams.calmradio.com:1428/stream' },

            { name:'Calm Radio - Handel', isFolder: false, radioUrl: 'http://streams.calmradio.com:8428/stream' },
            { name:'Calm Radio - Trumpet', isFolder: false, radioUrl: 'http://streams.calmradio.com:15828/stream' },
            { name:'Calm Radio - Puccini', isFolder: false, radioUrl: 'http://streams.calmradio.com:13028/stream' },
            { name:'Calm Radio - Salsa', isFolder: false, radioUrl: 'http://streams.calmradio.com:9628/stream' },
            { name:'Calm Radio - Schumann', isFolder: false, radioUrl: 'http://streams.calmradio.com:8128/stream/1/' },
            { name:'Calm Radio - Spaced', isFolder: false, radioUrl: 'http://streams.calmradio.com:6728/stream' },
            { name:'Calm Radio - Spa', isFolder: false, radioUrl: 'http://streams.calmradio.com:30328/stream' },
            { name:'Calm Radio - zen', isFolder: false, radioUrl: 'http://streams.calmradio.com:14028/stream' },
            { name:'Calm Radio - Haydn', isFolder: false, radioUrl: 'http://streams.calmradio.com:7228/stream' },
            { name:'Calm Radio - Rossini', isFolder: false, radioUrl: 'http://streams.calmradio.com:14128/stream' },
            { name:'Calm Radio - Schubert', isFolder: false, radioUrl: 'http://streams.calmradio.com:8228/stream' },
            { name:'Calm Radio - Solo piano', isFolder: false, radioUrl: 'http://streams.calmradio.com:1228/stream' }

        ];

        res.send(radioStations);
    });
}