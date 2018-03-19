# Volunteering Peel Server Installation

These instructions are for anyone who wishes to install their own **local** version of the Volunteering Peel site.
This includes hosting your own database, etc.
If you just want to test the site, please use the current live version [hosted by me](volunteeringpeel.retrocraft.ca).
If the hosted site has not been updated recently, just drop me a message and I'll update it.

## Table of Contents

<!-- toc -->

- [Introduction](#introduction)
- [Dependencies](#dependencies)
- [Getting the Code](#getting-the-code)
- [Database Setup](#database-setup)
- [Server Setup](#server-setup)

<!-- tocstop -->

## Introduction

I would hope you have a basic understanding of the following:

* Your operating system's terminal (either `cmd` or `powershell` on Windows or `bash` on a UNIX-based system)
* The Git versioning system
* Dependency management
* Databases

I'll try and make this as noob-friendly as possible, do contact me if you need help though.

## Dependencies

Install the following programs, if you do not already have them.
These three should be fairly simple to install.

* [Git](https://git-scm.com/)
* [NodeJS](https://nodejs.org/en/)
* [Yarn](https://yarnpkg.com/en/)

When installing, ensure that any options to add software to the `PATH` are checked.
This allows the software to be found by your terminal.

You also need a copy of the database software, and a way to connect to and modify the database.

* [MySQL Server, Community Edition](https://dev.mysql.com/downloads/mysql/)
* [MySQL Workbench](https://dev.mysql.com/downloads/workbench/)
  * Note: MySQL Workbench can be installed from the Windows MySQL Server Installer.

The installer may provide a prompt to set the _root password_, or provide a generated one. Remember this password, you will need it later.

## Getting the Code

Open your favorite terminal.
Ensure you are in a directory that you control (like your Documents folder), and clone the repository using Git.
To change the current _working directory_, use the `cd` command by typing `cd foldername`.
The following command will create a directory called `volunteeringpeel` in whichever directory you are currently in, and download the code into it.

```bash
git clone https://github.com/retrocraft/volunteeringpeel.git
```

The output should look similar to the following:

```
Cloning into 'volunteeringpeel'...
remote: Counting objects: 2388, done.
remote: Compressing objects: 100% (321/321), done.
remote: Total 2388 (delta 439), reused 649 (delta 371), pack-reused 1654
Receiving objects: 100% (2388/2388), 686.32 KiB | 0 bytes/s, done.
Resolving deltas: 100% (1598/1598), done.
Checking connectivity... done.
```

Use `cd` to change the working directory to the newly created `volunteeringpeel` directory.
We will be working from there from now on.

```bash
cd volunteeringpeel
```

Keep your terminal open, we will come back to it.

## Database Setup

Open MySQL Workbench. Add a new connection with the plus button.

![MySQL Workbench Homescreen](https://i.imgur.com/FVbWtpj.png)

In the popup, fill out the name of the connection (red; whatever you want, I chose "volunteeringpeel").
Then, press "Store in Vault" (orange), and type in the root password from earlier.
Then, press OK.

![MySQL Workbench Create Connection Dialog](https://i.imgur.com/a7MeIOr.png)

Click the newly-made connection, and you should get a screen like this:

![MySQL Workbench Main Screen](https://i.imgur.com/7Xirtzn.png)

The main parts of the screen are:

* In red, the query tabs.
  This is where you edit scripts.
  * Inside the query area, there is a lightning bolt icon, highlighted in orange.
    This button is used to run the script that is currently open.
* In green, the open file button.
  CTRL/CMD-O doesn't open files (surprisingly).
  The shortcut is CTRL/CMD-SHIFT-O if you insist on using keyboard shortcuts.
* In purple, a sidebar for managing common tasks that aren't easy to just type into a script and run.
* In sky blue, a list of databases (called _schemas_).
  Yours should only contain `sys`, because I already have the database for VP and for another project set up.
* In indigo, the output panel.
  This is where error messages and success messages will show up when you run queries.

You can create an empty database by writing the following into the query tab, highlighting it, and pressing CTRL/CMD-Enter on your keyboard.
Note: the quotes used here are backticks, found next to the 1 on your keyboard.
Feel free to copy-paste if you really are that lazy.

```sql
CREATE SCHEMA `volunteeringpeel`;
```

If you hit the refresh button next to the schema tab, you should see your new `volunteeringpeel` schema appear.
Your screen should look something like this.

![MySQL Workbench post-schema creation](https://i.imgur.com/Cf33LxU.png)

Now, open the three SQL files inside the `volunteeringpeel` directory that Git created earlier.
They are found in a folder called `sql`, and are called `000-schema`, `001-data`, and `002-views`.
Open each one with the open SQL script button or with CTRL/CMD-SHIFT-O.
Select `000-schema`.

![MySQL Workbench with open files](https://i.imgur.com/gKzFUXG.png)

On each file, run the entire script with the lightning bolt icon.
Make sure to run them in order.
After running the final script, you should have a very full output panel.
There should be no errors, but warnings (yellow triangles) are fine.

Now, you must create a user for the site to connect to.

Navigate to the Users and Privileges tab.
Press "Add Account" (red), then fill in the name as "volunteeringpeel" (orange), and create a password (green).
The password can be whatever you want, just make sure you remember it.
Then navigate to the "Administrative Roles" tab.

![MySQL Workbench create user](https://i.imgur.com/aeVPF4e.png)

In this tab, check DELETE, INSERT, SELECT, and UPDATE (red), then press "Apply" (orange).

![MySQL Workbench assign permissions](https://i.imgur.com/f9H7SkB.png)

This completes the database creation and setup.

## Server Setup

Remember that terminal you have open? Find it.
Once you found it, install everything automagically by running `yarn`.
The output should look something like the following, and take a few minutes to complete:

```
yarn install v1.3.2
[1/4] Resolving packages...
[2/4] Fetching packages...
info fsevents@1.1.3: The platform "linux" is incompatible with this module.
info "fsevents@1.1.3" is an optional dependency and failed compatibility check. Excluding it from installation.
[3/4] Linking dependencies...
warning " > babel-loader@7.1.3" has unmet peer dependency "babel-core@6".
warning " > less-loader@4.0.5" has incorrect peer dependency "less@^2.3.1".
[4/4] Building fresh packages...
$ node scripts/fix-semantic.js
Done in 52.96s.
```

Don't worry about warnings or info messages.
There'll always be a few kinks here or there, and they shouldn't cause any problems.

Now, run `yarn run dev` to start up the development server.
This server will automagically recompile and (if the stars are aligned) replace the content on your web browser when you make a change to the source code.

The output will look something like this.
I cut out some lines because the full output is huge.

```
yarn run v1.3.2
$ nodemon
[nodemon] 1.15.1
[nodemon] to restart at any time, enter `rs`
[nodemon] watching: /mnt/d/Documents/GitHub/volunteeringpeel/src/**/*
[nodemon] starting `ts-node -P tsconfig.server.json ./src/index.ts`
webpack building...
Listening on http://localhost:19847
[JARVIS] Starting dashboard on: http://localhost:1337

[at-loader] Using typescript@2.7.2 from typescript and "tsconfig.json" from /mnt/d/Documents/GitHub/volunteeringpeel/tsconfig.json.

[at-loader] Checking started in a separate process...

[at-loader] Ok, 1.242 sec.
webpack built 20d683e6ee279afdd680 in 1943ms
ℹ ｢wdm｣: Hash: 20d683e6ee279afdd680
Version: webpack 3.11.0
Time: 12943ms
                  Asset       Size  Chunks                    Chunk Names
               admin.js    67.2 kB      15  [emitted]         admin
         commons.js.map    3.73 MB      13  [emitted]         commons
             app.js.map      58 kB      14  [emitted]         app
           admin.js.map    38.1 kB      15  [emitted]         admin
         runtime.js.map    33.4 kB      16  [emitted]         runtime
             index.html  469 bytes          [emitted]
             admin.html  477 bytes          [emitted]
   [0] ./node_modules/react/index.js 190 bytes {13} [built]
  [59] ./node_modules/moment/moment.js 132 kB {13} [built]
  [76] (webpack)/buildin/module.js 517 bytes {13} [built]
ℹ ｢wdm｣: Compiled successfully.
```

Don't worry if you get hung at certain points.
The barrier at 69% (unintentional, I swear) and 92% can take a while to get past.
Give it a few minutes on the first run.

If you want to see some fancy colours while it's compiling, point your favorite web browser at http://localhost:1337 during compilation.

The site should now be accessible at http://localhost:19847.
