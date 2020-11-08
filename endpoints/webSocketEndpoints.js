'use strict';

const MPlayer = require('mplayer');
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

        ws.on('message', function message(msg) {
            const messageContent = JSON.parse(msg);

            // Commands
            switch (messageContent.command) {
                case "openFile":
                    playerState = { ...playerState, state: possibleStates.Starting, requestedState: possibleStates.Starting };
                    ws.send(JSON.stringify(playerState));
                    mplayer.openFile(messageContent.parameter, {
                        cache: 128,
                        cacheMin: 1
                    });
                    break;
                case "openPlaylist":
                    playerState = { ...playerState, state: possibleStates.Starting, requestedState: possibleStates.Starting };
                    ws.send(JSON.stringify(playerState));
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
            const json = JSON.stringify(playerState);
            ws.send(json);
        })
        mplayer.on("stop", () => {

            playerState = { ...playerState, state: possibleStates.Stoped };
            const json = JSON.stringify(playerState);
            ws.send(json);
        })
        mplayer.on("play", () => {
            if (playerState.state === possibleStates.Playing) {
                return;
            }
            playerState = { ...playerState, state: possibleStates.Playing };
            const json = JSON.stringify(playerState);
            ws.send(json);
        })
        mplayer.on("pause", () => {
            if (playerState.requestedState === playerState.state) {
                return;
            }
            playerState = { ...playerState, state: possibleStates.Paused };
            const json = JSON.stringify(playerState);
            ws.send(json);
        })
    });
}
