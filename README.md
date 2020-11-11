# About PiPlayer.Server
This is a simple node.js server which can play music from different sources using MPlayer (it has to be installed first). It can play music from MP3 files (it reads folder content set in variable `folderWithMusic` in `folderContentEndpoint.js`). It can also play online radio stations.

# Set up
Create new folder for the application

`mkdir PiPlayer.Server`

and install dependencis

`npm update`

Application should run on system boot, for example by using SYSTEMD service. Copy this file into 
`/etc/systemd/system` as root.

Once this has been copied, you can attempt to start the service using the following command:

`sudo systemctl start piPlayerSystemd.service`