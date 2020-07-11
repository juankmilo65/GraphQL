"use strict";
const connectDb = require("./db");
const { ObjectID } = require("mongodb");

module.exports = {
  //#region Item section
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
  relateItemsToCatalog: async (root, { catalogID, itemID }) => {
    let db;
    let item;
    let catalog;
    try {
      db = await connectDb();
      catalog = await db
        .collection("catalogs")
        .findOne({ _id: ObjectID(catalogID) });
      item = await db.collection("items").findOne({ _id: ObjectID(itemID) });

      if (!item || !catalog) throw new Error("Catalog or Item does not exists");
      await db.collection("catalogs").updateOne(
        {
          _id: ObjectID(catalogID),
        },
        { $addToSet: { items: ObjectID(itemID) } }
      );
    } catch (error) {
      console.log(error);
    }
    return catalog;
  },
  //#endregion
  //#region Catalog Section
  createCatalog: async (root, { input }) => {
    let db;
    let item;

    try {
      db = await connectDb();
      item = await db.collection("catalogs").insertOne(input);
      input._id = item.insertedId;
    } catch (error) {
      console.error(error);
    }
    return input;
  },
  //#endregion
};
