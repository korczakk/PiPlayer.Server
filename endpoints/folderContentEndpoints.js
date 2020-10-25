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
    
        const folcerContent = getDirectoryContent(fullPath).sort((a, b) => sortFolders(a, b));
        res.send(folcerContent);
    });    
}

function sortFolders(a, b) {
    if(a.isFolder && !b.isFolder) {
        return -1;
    }
    if(!a.isFolder && b.isFolder) {
        return 1;
    }
}