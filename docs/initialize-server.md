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
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQCzIjIRoNReJ5KTjTqsgtmq0GQKtGrFDY0jIclReKeKtC8uz5E0H3PZrjO1GOWBUBYBv3tJmd2weyRuxP0NlOUGDJwiyJRODADFPN6APZXKIeLm66mVUO5xVqQE50YEv2KqD8q1Y+JxMuR+akubBNFjKk107IaXpdbAitoVog2nZHwo60eeKfFP5th5yn5VsOpem4dMmRPwKgx0PazNjreAeaZtFMQ7HM42zVPs24Lh5DnqkLwff1IViguoTQfcbG4ftUug+/7AVpOB9gCbVYC98mOA4889NLKGy5rkXOdFRIkYW1igXTUcqicUq819BwbFNuvuChD04VQxgHa9a+zUVWA2awm6yiRkkdytc44shwCNDUF9MFHsSmg2mX2zVMWpOMklCHREO4QB0f7vYlyhqp5TiQf4y8B9Ds3iETkNsFjZTEy0gaIBmaseTtAKvf43sAVdD4QSteGqfC7iQurzRJC5MaM5d3swDQqcLD8YbdB8xtqHMKEFx5hVjymS9QEkdEVKlNyiBcBDRAwyJ9e/EqdGnwQY2zmlhC02Zquy4mdse0CNBXbfaSQ1OmSCzCAe+x++D5UJu9OapyVIfgZEdonknXUlFIY/6bakGnBQFCxnXZhYhYFt5qD6Cze72y7Bb/HOqqvatQvVKsTP7U0aGK/UHtrl14bfKfJE8pgAWQ== build@travis-ci.org
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

> TODO: Setup MySQL and `passwords.js`

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
