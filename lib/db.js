"use strict";

const MongoClient = require("mongodb").MongoClient;

const { DB_USER, DB_PASSWD, DB_NAME } = process.env;

const mongoUrl = `mongodb+srv://${DB_USER}:${DB_PASSWD}@cluster0.yq5tn.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;
let connection;

async function connectDB() {
  if (connection) return connection;

  let client;

  try {
    client = await MongoClient.connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    connection = client.db(DB_NAME);
  } catch (error) {
    console.log("Can not connect to mongo DB", mongoUrl, error);
    process.exit();
  }
  return connection;
}

module.exports = connectDB;
