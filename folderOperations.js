const path = require('path');
const fs = require('fs');

function getDirectoryContent(path) {
    const dir = fs.readdirSync(path, { withFileTypes: true});

    const dirContent = dir.map(d => {
        return { name: d.name, isFolder: d.isDirectory() };
     });
    return dirContent;    
}

function isPathExists(path) {
    return fs.existsSync(path);
}

exports.getDirectoryContent = getDirectoryContent;
exports.isPathExists = isPathExists;