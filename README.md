<span style="font-size:0.8em;">227-0707-00L Optimization Methods for Engineers</span>
# Traffic Sim
Finding an optimal solution to a traffic problem using Ant Colony Optimization

![Preview](./preview.png)

## Features

[WIP]

## Run the app

> ℹ️ **Windows**  
> On Windows either use Windows directly or the Windows Subsystem for Linux (WSL)</span>

### 1. Install Node.js

Webpack is used to bundle all the JS files in the source directory into a single file (`/js/main.js`), which can be loaded on the website.

To used it we need NodeJS - Use these commands to install NodeJS:

**Windows**:

Download the [installer](https://nodejs.org/en/download/) and run it.

**Linux**:  
```
apt install nodejs npm
``` 

**MacOS**:  

Download the [installer](https://nodejs.org/en/download/) or install it directly with Homebrew

```
brew install node
```

### 2. Clone the repository

Create a directory for the project, open a terminal in it and run the following command to clone the repository.

``` 
git clone https://github.com/phlhg/traffic-sim ./
```

### 3. Install Dependencies

Now we want to install Webpack and its dependencies. To do this NodeJS provides an easy way:  
Enter the root directory of the project and run the following command.

```
npm install --dev
```

### 4. Build project

Currently the repository only provides the raw code. To actually run the project, we will have to bundle it.   
To do this enter the root directory of the project and run the following:

```
npm run build
``` 

This will build the main JS file wich is loaded on the website.

If you changed a file in `/source/`, you will have to run this command, for your changes to become visible.

> ℹ️ **VS Code**  
> If you are using VS Code, there is a predefined task for this, which can be used by pressing `Ctrl-Shift-B`</span>

### 5. Run the server

Now that we built our files we want to run a local server - Enter the root directory of the project and run:

```
python3 -m http.server 8080 --bind 127.0.0.1 --directory public/
```

> ℹ️ **VS Code**  
> If you are using VS Code, there is a predefined task for this, which can be used by `Ctrl-Shift-P` > `Tasks: Run Task` > `Run Webserver`</span>

Now you should be able to access the application via the address shown in the output of the above command.

> ℹ️ **Note**  
> Python needs to be installed for this command to work. Alternativley one can also use a different web server.
