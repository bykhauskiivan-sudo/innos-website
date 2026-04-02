"use strict";

const serverless = require("serverless-http");
const app = require("../../app");

module.exports.handler = serverless(app, {
  binary: ["multipart/form-data", "application/octet-stream"]
});
