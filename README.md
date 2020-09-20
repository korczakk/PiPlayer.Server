# About PiPlayer.Server

# Set up
Create new folder for the application

`mkdir PiPlayer.Server`

and install dependencis

`npm update`

This application is using NGINX to serve static files. To install NGINX under Raspbian type

`sudo apt-get install nginx`

Music files should be stored in `/var/www/music` folder.

To configure NGINX go to `/etc/nginx` and remove content of `sites-enabled` folder. Next create new configuration file in `conf.d` folder (e.g. `my.conf`).
Add following configuration to newly created file:

    server {
        listen 80;
        root /var/www;
        location /music {
        }
    }
Server will be listening on port 80. If a URI of a requests ends with `/music` then NGINX will serve files from `/var/www/music` folder in the file system. It means that `location` is appended to `root` directive.

More about NGINX and serving static file can be found [here](https://docs.nginx.com/nginx/admin-guide/web-server/serving-static-content/)

