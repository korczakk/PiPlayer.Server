'use strict';

const MPlayer = require('mplayer');
const folderOperations = require('../folderOperations');
const mplayer = new MPlayer();

let playerState = {
    state: 'WaitingForCommand',
    fileName: '',
    duration: 0,
    title: '',
    requestedState: ''
};

const possibleStates = {
    Started: 'Started',
    Stoped: 'Stoped',
    Paused: 'Paused',
    Playing: 'Playing',
    Starting: 'Starting',
    WaitingForCommand: 'WaitingForCommand'
};

module.exports.getWebSocketEndpoints = (wsServer) => {
    wsServer.on('connection', function connection(ws) {
        console.log('Web socket connection opened...');

        sendStatus(ws, playerState);

        ws.on('message', function message(msg) {
            const messageContent = JSON.parse(msg);

            // Commands
            switch (messageContent.command) {
                case "openFile":
                    playerState = { ...playerState, state: possibleStates.Starting, requestedState: possibleStates.Starting };
                    sendStatus(ws, playerState);
                    mplayer.openFile(messageContent.parameter, {
                        cache: 128,
                        cacheMin: 2
                    });
                    break;
                case "openFolder":
                    createPlaylist(messageContent.parameter);
                    mplayer.openPlaylist(`${messageContent.parameter}/playlist.pls`, {
                        cache: 128,
                        cacheMin: 2
                    });
                    playerState = { ...playerState, state: possibleStates.Starting, requestedState: possibleStates.Starting };
                    sendStatus(ws, playerState);
                    break;
                case "openPlaylist":
                    playerState = { ...playerState, state: possibleStates.Starting, requestedState: possibleStates.Starting };
                    sendStatus(ws, playerState);
                    mplayer.openPlaylist(messageContent.parameter);
                    break;
                case "play":
                    playerState = { ...playerState, requestedState: possibleStates.Playing };
                    mplayer.play();

                    break;
                case "stop":
                    playerState = { ...playerState, requestedState: possibleStates.Stoped };
                    mplayer.stop();

                    break;
                case "pause":
                    playerState = { ...playerState, requestedState: possibleStates.Paused };
                    mplayer.pause();

                    break;
                case "next":
                    mplayer.next();
                    break;
                case "previous":
                    mplayer.previous();
                    break;
                case "checkState":
                    sendStatus(ws, playerState);
                    break;
            }
        });

        // Events
        mplayer.on("time", (t) => {
            // This will send timing after every 30 ms. Right now not used.
            // ws.send(JSON.stringify({time: t}));
        })
        mplayer.on("status", (status) => {
            playerState = { ...playerState, fileName: status.filename };
        })
        mplayer.on("start", () => {
            playerState = { ...playerState, state: possibleStates.Started };
            sendStatus(ws, playerState);
        })
        mplayer.on("stop", () => {

            playerState = { ...playerState, state: possibleStates.Stoped };
            sendStatus(ws, playerState);
        })
        mplayer.on("play", () => {
            // if (playerState.state === possibleStates.Playing) {
            //     return;
            // }
            playerState = { ...playerState, state: possibleStates.Playing };
            sendStatus(ws, playerState);
        })
        mplayer.on("pause", () => {
            // if (playerState.requestedState === playerState.state) {
            //     return;
            // }
            playerState = { ...playerState, state: possibleStates.Paused };
            sendStatus(ws, playerState);
        })
    });
}

function sendStatus(ws, playerState) {
    const json = JSON.stringify(playerState);
    ws.send(json);
}

function createPlaylist(path) {
    const pathExists = folderOperations.isPathExists(path);
    if (!pathExists) {
        return;
    }

    const filesInFolder = folderOperations
    .getDirectoryContent(path)
    .filter(x => !x.isFolder && !x.name.endsWith('.pls'))
    .map(x => `${path}/${x.name}`)
    .join('\n');
    
    folderOperations.writeToFile(`${path}/playlist.pls`, filesInFolder);
}
