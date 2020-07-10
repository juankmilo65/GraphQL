"use strict";

const connectDb = require("./db");

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
    getItem: (root, args) => {
      const course = courses.find((course) => course._id === args.id);
      return course;
    },
  },
};
