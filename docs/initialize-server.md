# Spinning up a new server

**NOTE: This is for new servers only, not an existing one!**

## Setup server

> [TODO] Screenshots setting up DigitalOcean server

## Setup access

To remain consistent with the build tools that automate the website, setup a user named `build` that
you can use to access. To do this, SSH into the server with the SSH key. Use a GUI or a command
line, I don't really care. You are logging in as `root@xxx.xxx.xxx.xxx`.

**You are now logged in as root. This is very dangerous. This is the only time you should ever have
to be root.**

Run these commands to setup a new user `build`. It will have a pregenerated SSH key that you will be
able to find in the Google Drive.

As root:

```bash
# Create user "build"
adduser build
# Give "build" sudo permissions
usermod -aG sudo build
# Switch to your new user
su - build
```

You are now `build`. You can tell because the first character before the cursor is now `$` instead
of `#`. To setup ssh:

```bash
# Create SSH config directory
mkdir ~/.ssh
# Give it permissions
chmod 700 ~/.ssh
# Create keyfile
nano ~/.ssh/authorized_keys
```

After the `nano` command you should be in a text editor. Paste in the following SSH key. It should
all be on one line.

```
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQDARi9ZFeolS+0Q3Ai39x56c7fUmTT3Bkmr1pWRpFXUAlsEucl9tORe5VUFP6+MIKYZHmrRP238N0oRy2vZ11ACOuOYrVdGWICJxkeRNlwOf5CwJq3sGJ367uuOSQxbVeGA2/wduATXpCXWdliP0T1e6hsCK7+j+hoFVpP9vrWi2aSMQAzDfykImHbTW0zZsxfzqnOojWtfPMeKVfju0oWR1SBmCN3TU3ppVCxF3dNX7vuxNIy1TkUWXxH3rfLojrXgXDYSu71qDmXQak5WLp82lB8UvTmQssh1nCbJZUX1Ej8/9usnrnHTYO7dsEEEA0KY4lB41ywa6hfiE2CnEQ58DNzo99+gWVDw2iauTK5a1jIbpjkD2j90GqqEg4dBDURa2m3T8enQ8yuaryolHYgfKRDanQ9CutYUmE+BH1jDAomSxy0G/S5OSUf/sh6JB649RqfI79I1mvdbd0FUYCGHDbgfTbKM6rwZWhnX8USylMI39v3Bhs2q7RBUlfftnwpCLoSdyg5e7+m4RsCYHjtWJ1PUx652fDZ6Y+6PbDC23Bd9E0EmS6gQivx4893nAMK+ZDHlVSyCqUwgV+Q7May127YcUzvHiihWfMNHxBXkiWfESEkmu8TEb/wkLtabazuOgxe00OKUQvG/k26mJcKfPQuzpYrJWUGu7V2r/o3r/Q== build@volunteeringpeel
```

To save and exit, press `CTRL-X`, then `Y`, then `Enter`. Still as `build`:

```bash
# Permissions on authorized_keys
chmod 600 ~/.ssh/authorized_keys
# Return to root user
exit
```

You are now `root` again. You can tell because the first character before the cursor is now `#`
instead of `$`. Now we will restrict SSH to key access only. Open `nano` again with

```bash
nano /etc/ssh/sshd_config
```

Find and replace the line with `PasswordAuthentication` from `yes` to `no`. Save and exit with
`CTRL-X`, `Y`, `Enter` again. Reload the SSH server with

```bash
systemctl reload sshd
```

Logout/end your session. For any future SSH, login as `build`.

## Install software

Once you create a new server, you need to do a few things. First, SSH into the server and run a few
commands. Do these in order.

```bash
# To install Node.js:
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt install -y nodejs

# To install Yarn:
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt update && sudo apt install -y yarn

# To install PM2:
sudo npm install -g pm2
```

## Setup website

Now, as `build`, create a folder for the website:

```bash
# Make folder
sudo mkdir /var/volunteeringpeel
# Give it to yourself
sudo chown build:build /var/volunteeringpeel
```

The server needs some files to host, and those are uploaded automatically when the server updates.
To force a server update, head on over to TravisCI, find the latest build on the `production`
branch, and restart it.

> TODO: Add screenshots

Once the build is complete (should take less than five minutes), check to see if the files have
uploaded.

```bash
ls -la
```

If there's a bunch of files showing, then you're good!

> TODO: Setup MySQL and environment variables

Start the server.

```bash
NODE_ENV=production PORT=80 pm2 start index.js
```

Now, have PM2 generate a startup script that you can have the server run automatically when it
starts.

```bash
pm2 startup
```

You should get a command starting with `sudo env`. Copy and paste that, and run it. Now run

```bash
pm2 save
```

to save the current config (the one index.js process) to startup.

> TODO: nginx, DNS

You should be good now! Check out https://volunteeringpeel.org/ and everything should be working!
