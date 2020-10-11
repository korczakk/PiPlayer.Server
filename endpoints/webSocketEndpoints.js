const MPlayer = require('mplayer');
const mplayer = new MPlayer();

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
                    break;
                case "openPlaylist":
                    mplayer.openPlaylist(messageContent.parameter, { pt_step: 3 });
                    break;

                case "play":
                    mplayer.play();
                    break;
                case "stop":
                    mplayer.stop();
                    break;
                case "pause":
                    mplayer.pause();
                    break;
                case "next":
                    mplayer.next();
                    break;
                case "previous":
                    mplayer.previous();
                    break;
                case "goto":
                    mplayer.goto(messageContent.position);
                    break;
            }
        });

        // Events
        mplayer.on("time", (t) => {
            // ws.send(t);
        })
        mplayer.on("status", (status) => {
            const json = JSON.stringify(status);
            ws.send(json);
        })
        mplayer.on("start", () => {
            const state = JSON.stringify(createStateObject('Started'));
            ws.send(state);
        })
        mplayer.on("stop", () => {
            const state = JSON.stringify(createStateObject('Stoped'));
            ws.send(state);
        })
        mplayer.on("play", () => {
            const state = JSON.stringify(createStateObject('Playing'));
            ws.send(state);
        })
        mplayer.on("pause", () => {
            const state = JSON.stringify(createStateObject('Paused'));
            ws.send(state);
        })

    });
}

function createStateObject(state) {
    const possibleStates = [
        'Started',
        'Stoped',
        'Paused',
        'Resumed'
    ];

    if (!possibleStates.some(x => x === state)) {
        return '';
    }

    return {
        'state': state
    };
}