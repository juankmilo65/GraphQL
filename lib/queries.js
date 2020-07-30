"use strict";

const connectDb = require("./db");
const { ObjectID } = require("mongodb");
const errorHandler = require("./errorHandler");
const { typeContainsSelectionSet } = require("graphql-tools");

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
    let itemsId = [];
    let position = lang === "en" ? 0 : 1;
    console.log(`${keyword} ${lang} ${order} ${pageNumber} ${nPerPage}`)
    try {
      db = await connectDb();
      itemData = await db
        .collection("items")
        .aggregate([
          { $match: { name: { $regex: ".*" + keyword + ".*", $options: "i" } } },
          { $project: { "description": { $arrayElemAt: [{ $split: ["$description", "|"] }, position] }, name: 1, mysqlId: 1, planId: 1, image: 1, price: 1 } },
          {
            $facet: {
              items: [
                { $sort: { name: order === "asc" ? 1 : -1 } },
                { $skip: pageNumber > 0 ? ((pageNumber - 1) * nPerPage) : 0 },
                { $limit: nPerPage }],
              itemsIds: [
                { $group: { _id: "$_id" } }
              ],
              pageInfo: [{ $group: { _id: null, count: { $sum: 1 } } }]
            }
          }
        ]).next();

      itemData.itemsIds.forEach(itemId => {
        itemsId.push(ObjectID(itemId._id))
      });

      let actualCatalog = await db.collection("catalogs").aggregate([
        { $unwind: "$items" },
        { $match: { items: { $in: itemsId } } },
        {
          $group: {
            _id: { mysqlId: "$mysqlId", name: { $arrayElemAt: [{ $split: ["$name", "|"] }, position] } },
            items: { $sum: 1 }
          }
        }
      ]).toArray();
      itemData['catalogsItems'] = actualCatalog;
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
