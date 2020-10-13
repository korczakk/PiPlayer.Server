'use strict';

const MPlayer = require('mplayer');
const mplayer = new MPlayer();

let playerState = {
    state: 'NotRunning',
    fileName: '',
    duration: 0,
    title: '',
    previousState: ''
};

const possibleStates = {
    Started: 'Started',
    Stoped: 'Stoped',
    Paused: 'Paused',
    Playing: 'Playing',
    Starting: 'Starting'
};

module.exports.getWebSocketEndpoints = (wsServer) => {
    wsServer.on('connection', function connection(ws) {
        console.log('Web socket connection opened...');

        ws.on('message', function message(msg) {
            const messageContent = JSON.parse(msg);

            // Commands
            switch (messageContent.command) {
                case "openFile":
                    mplayer.openFile(messageContent.parameter, {
                        cache: 128,
                        cacheMin: 1
                    });
                    setRequestedState(possibleStates.Starting);
                    break;
                case "openPlaylist":
                    mplayer.openPlaylist(messageContent.parameter);
                    setRequestedState(possibleStates.Starting);
                    break;
                case "play":
                    mplayer.play();
                    setRequestedState(possibleStates.Playing);
                    break;
                case "stop":
                    mplayer.stop();
                    setRequestedState(possibleStates.Stopped);
                    break;
                case "pause":
                    mplayer.pause();
                    setRequestedState(possibleStates.Paused);
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
            // ws.send(t);
        })
        mplayer.on("status", (status) => {
            playerState = { ...playerState, fileName: status.filename };
            const json = JSON.stringify(playerState);
            ws.send(json);
        })
        mplayer.on("start", () => {
            const newState = createState(possibleStates.Started);
            if(newState === null)
            {
                return;
            }
            playerState = { ...playerState, state: newState };
            setRequestedState(possibleStates.Started);
            const json = JSON.stringify(playerState);
            ws.send(json);
        })
        mplayer.on("stop", () => {
            const newState = createState('Stoped');
            if(newState === null)
            {
                return;
            }
            playerState = { ...playerState, state: newState };
            const json = JSON.stringify(playerState);
            ws.send(json);
        })
        mplayer.on("play", () => {
            const newState = createState('Playing');
            if(newState === null)
            {
                return;
            }
            playerState = { ...playerState, state:  newState };
            const json = JSON.stringify(playerState);
            ws.send(json);
        })
        mplayer.on("pause", () => {
            const newState = createState('Paused');
            if(newState === null)
            {
                return;
            }
            playerState = { ...playerState, state: newState };
            const json = JSON.stringify(playerState);
            ws.send(json);
        })

    });
}

function createState(newState) {
    if (possibleStates[newState] === null) {
        return null;
    }

    // newState comes from MPlayer, not from client and for some reasone MPlayer emits too many events without user's interaction.
    // That is why I check what state has been set by client to avoid sending wrong state over WS.
    if(stateSetByClient.state === possibleStates.Playing && newState === possibleStates.Paused)
    {
        return null;
    }

    return newState;
}

function setRequestedState(newState) {
    // Sets state based on client's request

    if (possibleStates[newState] === null) {
        throw Error('Try to set an unknown state.');
    }

    stateSetByClient = { state: newState };
}