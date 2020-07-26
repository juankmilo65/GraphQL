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
    filteredItems: async ({ items }, obj, obj1, { variableValues }) => {
      const { keyword, lang } = variableValues;
      let db;
      let itemData;
      let ids;
      let position = lang === "en" ? 0 : 1;
      try {
        db = await connectDb();
        ids = items ? items.map((id) => ObjectID(id)) : [];
        itemData = ids.length > 0
          ? await db
            .collection("items")
            .aggregate([
              { $project: { "description": { $arrayElemAt: [{ $split: ["$description", "|"] }, position] }, name: 1, mysqlId: 1, planId: 1, image: 1, price: 1 } },
              { $match: { name: { $regex: ".*" + keyword + ".*", $options: "i" }, _id: { $in: ids } } }
            ]).toArray()
          : [];
      } catch (error) {
        errorHandler(error);
      }
      return itemData;
    }
  },
  IndexSearch: {
    __resolveType: (item, context, info) => {
      if (item.planId === undefined) {
        return "Catalog";
      }

      return "Item";
    },
  },
};
