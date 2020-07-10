"use strict";

const connectDb = require("./db");
const { ObjectID } = require("mongodb");

module.exports = {
  Query: {
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
  },
};
