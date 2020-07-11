"use strict";
const connectDb = require("./db");
const { ObjectID } = require("mongodb");

module.exports = {
  createItem: async (root, { input }) => {
    //se utiliza cuando los campod que no son obligatorios se les puedan setear un valor por defecto.
    // const defaults = {};
    // const newItem = Object.assign(defaults, input);
    let db;
    let item;

    try {
      db = await connectDb();
      item = await db.collection("items").insertOne(input);
      input._id = item.insertedId;
    } catch (error) {
      console.error(error);
    }
    return input;
  },
  editItem: async (root, { _id, input }) => {
    let db;
    let item;

    try {
      db = await connectDb();
      await db
        .collection("items")
        .updateOne({ _id: ObjectID(_id) }, { $set: input });
      item = await db.collection("items").findOne({ _id: ObjectID(_id) });
    } catch (error) {
      console.error(error);
    }
    return item;
  },
  deleteItem: async (root, { _id }) => {
    let db;
    let response;
    try {
      db = await connectDb();
      response = await db.collection("items").deleteOne({ _id: ObjectID(_id) });
    } catch (error) {
      console.error(error);
    }
    return response.deletedCount
      ? "Item was deletes successfully"
      : "Item does not exist";
  },
};
