"use strict";

const connectDb = require("./db");
const { ObjectID } = require("mongodb");
const errorHandler = require("./errorHandler");

module.exports = {
  Catalog: {
    items: async ({ items }) => {
      let db;
      let itemData;
      let ids;
      try {
        db = await connectDb();
        ids = items ? items.map((id) => ObjectID(id)) : [];
        itemData =
          ids.length > 0
            ? await db
                .collection("items")
                .find({
                  _id: { $in: ids },
                })
                .toArray()
            : [];
      } catch (error) {
        errorHandler(error);
      }
      return itemData;
    },
    standarPremiumItems: async ({ items }) => {
      let db;
      let itemData;
      let ids;
      try {
        db = await connectDb();
        ids = items ? items.map((id) => ObjectID(id)) : [];
        itemData =
          ids.length > 0
            ? await db
                .collection("items")
                .find({
                  _id: { $in: ids },
                  planId: { $in: [1, 2] },
                })
                .toArray()
            : [];
      } catch (error) {
        errorHandler(error);
      }
      return itemData;
    },
  },
};
