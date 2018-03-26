# Volunteering Peel Server Installation

These instructions are for anyone who wishes to install their own **local** version of the Volunteering Peel site.
This includes hosting your own database, etc.
If you just want to test the site, please use the current live version [hosted by me](volunteeringpeel.retrocraft.ca).
If the hosted site has not been updated recently, just drop me a message and I'll update it.

**THIS IS ONLY FOR PEOPLE WHO WISH TO EDIT THE CODE AND VIEW THEIR OWN VERSION ON THEIR OWN COMPUTER!!**
**IF YOU JUST WANT TO PLAY AROUND WITH THE SITE, USE THE HOSTED VERSION**

## Table of Contents

<!-- toc -->

* [Introduction](#introduction)
* [Dependencies](#dependencies)
* [Getting the Code](#getting-the-code)
* [Database Setup](#database-setup)
* [Server Setup](#server-setup)
* [Building a Distribution](#building-a-distribution)

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
git clone https://github.com/volunteeringpeel/volunteeringpeel.git
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

```
yarn
```

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

There's one file of code that's actually missing from your generated folder.
That's the database password.
You picked it earlier when creating the `volunteeringpeel` user.
Create a file called `passwords.js` inside of `src/api`.
Put this inside, and put the password in (don't delete the quotes though).

```javascript
module.exports = {
  mysql: {
    password: 'password-goes-here',
  },
};
```

Now, to start up the development server.
This server will automagically recompile and (if the stars are aligned) replace the content on your web browser when you make a change to the source code.

```bash
yarn run dev
```

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

You can stop here if you'd like.
The next section is only for production copies.

## Building a Distribution

You can also build a production copy.
This build will be minified and optimized for download.
It should not be used for testing.
Run the build script.

```
yarn run build
```

It will have a very similar output to the dev script.
Once again, I have deleted a large number of lines for brevity's sake.

```
yarn run v1.3.2
$ yarn run build:server && yarn run build:client
$ webpack --config webpack.server.js; cp ./src/api/passwords.js ./dist/passwords.js || :

[at-loader] Using typescript@2.7.2 from typescript and "tsconfig.json" from /mnt/d/Documents/GitHub/volunteeringpeel/tsconfig.server.json.

[at-loader] Checking started in a separate process...

[at-loader] Ok, 0.81 sec.
Hash: b1c73ce74afa6cc5634b
Version: webpack 3.11.0
Time: 2417ms
   Asset     Size  Chunks             Chunk Names
index.js  26.1 kB       0  [emitted]  main
   [1] ./src/index.ts 2.67 kB {0} [built]
   [4] ./src/api/api.ts 17.1 kB {0} [built]
    + 10 hidden modules
$ webpack --progress --config webpack.prod.js
clean-webpack-plugin: /mnt/d/Documents/GitHub/volunteeringpeel/dist/app has been removed.
[JARVIS] Starting dashboard on: http://localhost:1337
[at-loader] Using typescript@2.7.2 from typescript and "tsconfig.json" from /mnt/d/Documents/GitHub/volunteeringpeel/tsconfig.json.
[at-loader] Checking started in a separate process...

[at-loader] Ok, 0.683 sec.                                                                                                                                                      Hash: e46fca6643740fa16540
Version: webpack 3.11.0
Time: 42999ms
                          Asset       Size  Chunks                    Chunk Names
commons.13756224bdfa58808729.js     811 kB      11  [emitted]  [big]  commons
    app.5686220d9d4295580388.js    40.6 kB      12  [emitted]         app
  admin.cf4bd47465b1f466547e.js    24.6 kB      13  [emitted]         admin
runtime.bc295df70d4a2ec2bf4a.js    1.65 kB      14  [emitted]         runtime
                      style.css  447 bytes  12, 13  [emitted]         app, admin
                     index.html  573 bytes          [emitted]
                     admin.html  581 bytes          [emitted]
[1UUV] ./public/routes.tsx 2.88 kB {12} [built]
[Ctyq] ./common/actions.ts 3.92 kB {12} {13} [built]
[E4vQ] (webpack)/buildin/module.js 517 bytes {11} [built]
[Ehch] ./css/style.less 41 bytes {12} {13} [built]
    + 1230 hidden modules
Done in 48.93s.
```

The distribution will be found in the `dist` folder.
This may be uploaded to another server, or run on your own machine.
To run the distribution, simply `cd` into the `dist` folder, and run `index.js`

```bash
cd dist
node index.js
```

The output will be one line:

```
Listening on http://localhost:19847
```

The server is once again accessible from http://localhost:19847.
