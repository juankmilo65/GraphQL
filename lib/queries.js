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
  getItemsPaginationAndFIltered: async (root, { keyword, lang, order, pageNumber, nPerPage }) => {
    let db;
    let itemData;
    let ids;
    let position = lang === "en" ? 0 : 1;
    console.log(`${keyword} ${lang} ${order} ${pageNumber} ${nPerPage}`)
    try {
      db = await connectDb();
      itemData = await db
        .collection("items")
        .aggregate([
          { $project: { "description": { $arrayElemAt: [{ $split: ["$description", "|"] }, position] }, name: 1, mysqlId: 1, planId: 1, image: 1, price: 1 } },
          { $match: { name: { $regex: ".*" + keyword + ".*", $options: "i" } } },
          {
            $facet: {
              items: [
                { $sort: { name: order === "asc" ? 1 : -1 } },
                { $skip: pageNumber > 0 ? ((pageNumber - 1) * nPerPage) : 0 },
                { $limit: nPerPage }],
              pageInfo: [
                { $group: { _id: null, count: { $sum: 1 } } }
              ]
            }
          }
        ]).next();
    } catch (error) {
      errorHandler(error);
    }
    return itemData;
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
  getCatalogsStandardPremiumItemPlanFiltered: async (root, { keyword }) => {
    let db;
    let catalogs = [];
    let items = [];
    let result = [];
    try {
      db = await connectDb();
      catalogs = await db
        .collection("catalogs")
        .find({ name: { $regex: ".*" + keyword + ".*", $options: "i" } })
        .toArray();
      items = await db
        .collection("items")
        .find({ name: { $regex: ".*" + keyword + ".*", $options: "i" } })
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
