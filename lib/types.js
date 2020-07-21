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
      const { keyword } = variableValues;
      console.log(keyword)

      let db;
      let itemData;
      let ids;
      try {
        db = await connectDb();
        ids = items ? items.map((id) => ObjectID(id)) : [];
        itemData = ids.length > 0
          ? await db
            .collection("items")
            .find({ name: { $regex: ".*" + keyword + ".*", $options: "i" }, _id: { $in: ids } })
            .toArray()
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
