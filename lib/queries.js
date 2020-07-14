"use strict";

const connectDb = require("./db");
const { ObjectID } = require("mongodb");
const errorHandler = require("./errorHandler");

module.exports = {
  //#region Items
  getItems: async () => {
    let db;
    let items = [];
    try {
      db = await connectDb();
      items = await db.collection("items").find().toArray();
    } catch (error) {
      errorHandler(error);
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
      errorHandler(error);
    }
    return item;
  },
  //#endregion
  //#region catalogs
  getCatalogs: async () => {
    let db;
    let catalogs = [];
    try {
      db = await connectDb();
      catalogs = await db.collection("catalogs").find().toArray();
    } catch (error) {
      errorHandler(error);
    }
    return catalogs;
  },
  getCatalogsStandardPremimItemPlan: async (root, { keyword }) => {
    let db;
    let catalogs = [];
    let items = [];
    let result = [];
    try {
      db = await connectDb();
      catalogs = await db
        .collection("catalogs")
        .find({
          $text: { $search: keyword },
        })
        .toArray();
      items = await db
        .collection("items")
        .find({
          $text: { $search: keyword },
        })
        .toArray();
      result = [...catalogs, ...items];
    } catch (error) {
      errorHandler(error);
    }
    return result;
  },
  getCatalog: async (root, { id }) => {
    let db;
    let catalog;
    try {
      db = await connectDb();
      catalog = await db.collection("catalogs").findOne({ _id: ObjectID(id) });
    } catch (error) {
      errorHandler(error);
    }
    return catalog;
  },
  ////#endregion
};
