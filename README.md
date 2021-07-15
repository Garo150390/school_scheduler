# SCHOOL_Back

## Installing NODE.JS

Node.js is an open-source cross-platform JavaScript run-time environment that allows server-side execution of JavaScript code
## 1. Installing NVM (Node Version Manager) script 

To download and install the nvm script run:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
```
## 2. Installing Node.js and npm

```bash
nvm install node
```
# Common setup
Clone the repo and install the dependencies.

```bash
git clone ...
cd cshool-node

npm install
```

##### 1.create environments and change it what you need
```$bash
npm run copyEnv
```

##### 2. install PSQL and create database 
 
##### 3. migrate tables and data with this command
```$xslt
npm run migrate
npm run seed
```
