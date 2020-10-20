**Kenya Patient Safety Impact Evaluation (KePSIE) - Management information system (MIS)**
=====

## Table of Contents

1. [Background](#Background)

2. [Prerequisites](#Prerequisites)

3. [How to install the prerequisites?](#Prerequisites_install)

4. [How to install and use KePSIE MIS?](#install)

5. [Contributing to the code](#contributing)

6. [License](#License)

7. [Main Contact](#contact)

## Background <a id="Background"></a>

### The KePSIE Project 
The Kenya Patient Safety Impact Evaluation or KePSIE project is a partnership between the Kenyan Government and the World Bank Group seeking to create a comprehensive effort to improve patient safety in public and private health facilities in Kenya. It was carried out between 2013 and 2018. An assessment of Kenya's health facility inspection framework in 2013 uncovered many challenges, including limited data and analytics, making it difficult to assess constraints and provide feedback to facilities and local governments. The KePSIE team supported the Ministry of Health in the development a new regulatory framework with a strong focus on standardization and automation. By using tablets and a management and information system, data on inspections was available near real-time data, facilitating timely feedback and decisions. The new framework was piloted and tested in three counties in Kenya from 2016 to 2017.

### KePSIE MIS
KePSIE MIS is the pilot management and information system that was developed as part of the KePSIE project. It has functionalities that allow planning as well as monitoring. A set of user-friendly infographics provide users with patient safety indicators and breakdowns by region and facility type. The data that feeds the system was processed offline. The system needs to have some entries in the database to run. For this purpose, the team has committed a testing sample database of 200 observations with fictional data to the code repository itself with the name “kepsie-dummy-db.dmp.gz” in the directory dbDump.

KePSIE MIS was developed in partnership with the company Wishtree https://www.wishtreetech.com/.

## Prerequisites <a id="Prerequisites"></a>
The next three sections provide instructions for setting up the development environment for the KePSIE system on Debian-based Linux operating system. Though it should be able to run on most distributions, we would recommend that you host the application on Ubuntu 16.04.3 LTS 64-bit system, as it is extensively supported by an open source community. Although it is possible to set up the application on Windows platforms as well, kindly note that we have not tested the steps below on a Windows platform. Additional or revised steps may be required.

In order to run the system, you need to have the following components installed on the server machine - 
* NodeJS - Minimum Version is 4.8
* MongoDB - Minimum Version is 3.2

You can check the version number by executing the below commands in the terminal -
* node --version
* mongo --version

If you do not currently have the prerequisites installed, kindly follow the steps below that will guide you for an installation on a Ubuntu machine. Note that you may need admin access to be able to install the different packages.

## How to install the prerequisites? <a id="Prerequisites_install"></a>

Steps to install NodeJS:
Please execute the commands below to install NodeJS (for details please check the link #1 in [references](#reference)).
* curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
* sudo apt-get install -y nodejs
   
Steps to install MongoDB:
Please execute the commands below to install Mongo database (for details please check the link #2 in [references](#reference)).
* sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927
* echo "deb http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.2.list
* sudo apt-get update
* sudo apt-get install -y mongodb-org=3.2.18 mongodb-org-server=3.2.18 mongodb-org-shell=3.2.18 mongodb-org-mongos=3.2.18 mongodb-org-tools=3.2.18

The mongo database runs as a service in background. To start, stop, restart or check the status you need to execute the following command: 
* sudo systemctl <start | stop | restart | status> mongod

If you have followed the installation steps above for the mongo database, it will not start up on server start or restart by itself. If you want the service to be enabled (or disabled) on server bootup you can use the command:
* sudo systemctl <enable | disable> mongod

There is one last thing which needs to be checked before proceeding with the installation. The nodejs applications run on port 1337 by default.  

If you are setting up the project on your local machine, it should not be a problem to access the application after the deployment using http://localhost:1337 unless there is any other application running on the same port number. (You will have to make some changes in configuration files if you need to change the port)

If you are going to set up the project on a remote server, we would advise you to check either that the port 1337 is open or that the web server running on the server is properly configured to redirect the request to our node application at the end of the installation.

For this setup, we are assuming that the port 1337 is open at the time of installation.

## How to install and use KePSIE MIS? <a id="install"></a>
You can download the code from the repository’s GitHub page or use the git utility to clone the code from the repository. Here are the steps to clone the code using the git utility. 

1. To check if the git utility is installed, open the terminal, and execute the command:  
* git --version 

2. If git utility is not installed you can install it by executing the commands below:
* sudo apt-get update
* sudo apt-get install git

3. In addition to the “git” utility you will have to install an open source Git extension called “git lfs” for versioning large files because GitHub does not allow you to commit file with size larger than 100 MB directly using git command. Please execute these commands to install “git lfs”:
* curl -s https://packagecloud.io/install/repositories/github/git-lfs/script.deb.sh | sudo bash
* sudo apt-get install git-lfs

For the details, please refer to the link #3, #4 & #5 in [references](#reference).

4. Now navigate to the directory in which you need to clone the code and execute this command: 
* git clone <github-repository-url>

A repository directory “kepsie-repo” is created in the current directory after executing the above command. This will be referred to as application root directory.

5. We need to install the npm packages for the application, for which you enter the application root directory and execute the npm install command:
* npm install

All the packages mentioned in package.json will be installed.

6. After this we need to define the environment in which the application needs to be run - development (stage) or production. To set the environment, please open the local.js file in config directory using a text editor and set the value of environment variable accordingly.

You can use any graphical text editor (or vi) to make the necessary changes.
 -	environment: 'development'

7. After this we need to make some configuration changes to our environment file as per our current server parameters. If you are running in development environment, you will have to edit development.js file in “config/env” directory. 

Now update the hostname, assetURL and routesPrefix to system’s IP address or hostname.
 -	hostname: "<http://ip-address or hostname>",
 - 	assetURL: "<http://ip-address or hostname:1337>",
 -	routesPrefix: "<http://ip-address or hostname:1337>"
 -	logoURL: "<http://ip-address or hostname:1337>/static/images/moh_logo.png"

8. To run the application, we need either the “sails” or “forever” node packages. You can check if the forever or sails package are already installed on the system by executing the following commands:
* forever --version
* sails --version

If “forever” or “sails” are not installed, execute the command below to install them: 
* sudo npm install forever -g
* sudo npm install sails -g

Please note the above command will install forever globally for all users. To install selectively, please omit the “-g” parameter from the command.
  
9. You can now run the application using the “sails lift” command from the application root directory:
* sails lift
   
10. For production we use forever utility. This utility runs the application in the background and brings it up again in case it fails due to any error. After installing the forever utility, you can run the application using the command:
* forever start app.js
  
11. You can now check if the application is running properly by accessing the application URL in the browser
 - http://<ip-address or hostname>:1337/

The login page for the application should appear on the screen.

12. Before we can login into the system, we need to have some entries in the database. For this purpose, the team has committed a testing sample database with fictional data to the code repository itself with the name “kepsie-dummy-db.dmp.gz” in the directory dbDump.

To setup the sample database, execute the following command in the dbDump directory.
* mongorestore --gzip --archive=./kepsie-dummy-db.dmp.gz”

13. Once the sample database has been restored, you can use the below admin user credentials to log in and explore the system: 
- Username - admin@kepsie.org
- Password - kepsie

## Contributing to the code <a id="contributing"></a> 

The KePSIE MIS was developed solely as part of the KePSIE projet. Though we welcome any contribution to this repository or the use of the code in other projects, we do not at this stage intend to monitor contributions or actively maintain the code or the repository. We consequently do not guarantee that we can follow up on any technical issue. 

## License <a id="License"></a> 
**KePSIE MIS** is developed under MIT license. See http://adampritchard.mit-license.org/ or see the `LICENSE` file for details.

## Main Contact <a id="contact"></a> 
For the World Bank: Guadalupe Bedoya ([gbedoya@worldbank.org](mailto:gbedoya@worldbank.org))

For Wishtree      : Ravishankar Iyer ([ravi@wishtreetech.com](mailto:ravi@wishtreetech.com))

*References* <a id="reference"></a>
1. https://github.com/nodesource/distributions#debinstall
2. https://docs.mongodb.com/v3.2/tutorial/install-mongodb-on-ubuntu/
3. https://git-lfs.github.com/
4. https://help.github.com/articles/installing-git-large-file-storage/
5. https://github.com/git-lfs/git-lfs/blob/master/INSTALLING.md
