'use strict';

const path = require('path');
const fs = require('fs');
const { hasUncaughtExceptionCaptureCallback } = require('process');

function getDirectoryContent(path) {
    
    
    const dir = fs.readdirSync(path, { withFileTypes: true}, );

    const dirContent = dir
        .filter(d => (!d.isDirectory() && d.name.toLowerCase().endsWith('.mp3')) || d.isDirectory())
        .map(d => {
            return { name: d.name, isFolder: d.isDirectory(), path: path };
        });
    return dirContent.sort((a, b) => sortFolders(a, b));
}

function isPathExists(path) {
    return fs.existsSync(path);
}

function sortFolders(a, b) {
    if(a.isFolder && !b.isFolder) {
        return -1;
    }
    if(!a.isFolder && b.isFolder) {
        return 1;
    }
}

function writeToFile(path, data) {
    fs.writeFileSync(path, data, err => {
        throw new Error(`Error when writting playlist. ${err}`);
    });
}

exports.getDirectoryContent = getDirectoryContent;
exports.isPathExists = isPathExists;
exports.writeToFile = writeToFile;