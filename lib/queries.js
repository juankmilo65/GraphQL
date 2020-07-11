"use strict";

const connectDb = require("./db");
const { ObjectID } = require("mongodb");

module.exports = {
  //#region Items
  getItems: async () => {
    let db;
    let items = [];
    try {
      db = await connectDb();
      items = await db.collection("items").find().toArray();
    } catch (error) {
      console.error(error);
    }
    return items;
  },
  getItem: async (root, { id }) => {
    let db;
    let item;
    try {
      db = await connectDb();
      item = await db.collection("items").findOne({ _id: ObjectID(id) });
    } catch (error) {
      console.error(error);
    }
    return item;
  },
  //#endregion
  //#region catalogs
  getcatalogs: async () => {
    let db;
    let catalogs = [];
    try {
      db = await connectDb();
      catalogs = await db.collection("catalogs").find().toArray();
    } catch (error) {
      console.error(error);
    }
    return catalogs;
  },
  getCatalog: async (root, { id }) => {
    let db;
    let catalog;
    try {
      db = await connectDb();
      catalog = await db.collection("catalogs").findOne({ _id: ObjectID(id) });
    } catch (error) {
      console.error(error);
    }
    return catalog;
  },
  ////#endregion
};
