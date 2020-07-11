"use strict";

const queries = require("./queries");
const mutations = require("./mutation");
const tyepes = require("./types");

module.exports = {
  Query: queries,
  Mutation: mutations,
  ...tyepes,
};
