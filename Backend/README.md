# ecommerce-api-node

## Introduction

This project is the backend of E-Commerce React App, an imaginary online shopping.

## Setup

Make sure to follow all these steps exactly as explained below.

### Install MongoDB

To run this project, you need to install the latest version of MongoDB Community Edition first.

https://docs.mongodb.com/manual/installation/

Once you install MongoDB, make sure it's running.

### Run Mongo Daemon

    mongod (for older version of mongo)
    mongod --config /usr/local/etc/mongod.conf (new version)

### Install the Dependencies

Next, from the project folder, install the dependencies:

    sudo npm update
    sudo npm install

### Populate the Database

    node seed.js

### Start the Server

    node index.js

This will launch the Node server on port 3900. If that port is busy, you can set a different point in config/default.json.

Open up your browser and head over to:

http://localhost:3900/api/genres

You should see the list of genres. That confirms that you have set up everything successfully.
