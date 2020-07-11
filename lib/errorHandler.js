"use strict";

function erorHandler(error) {
  console.log(error);
  throw new Error("Server operation failure");
}

module.exports = erorHandler;
