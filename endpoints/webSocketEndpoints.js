

module.exports.getWebSocketEndpoints = (wsServer) => {
    wsServer.on('connection', function connection(ws) {
        console.log('Web socket connection opened...');
    
        ws.on('message', function message(text) {
            console.log(text);
        });
    
        // zarejestrować zgłoszenia mplayer
    });
}