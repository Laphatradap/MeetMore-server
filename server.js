const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

// const authMiddleware = require("./auth/authMiddleware")
const userRoutes = require("./User/router");
const availabilityRoutes = require("./Availability/router")
const groupRoutes = require("./Group/router")
const userGroupRoutes = require("./UserGroup/model")
const port = process.env.PORT || 4000;
const app = express();

app
  .use(bodyParser.json())
  .use(cors())
  .use(userRoutes)
  .use(availabilityRoutes)
  .use(groupRoutes)
  .use(userGroupRoutes)
  .listen(port, () => console.log("listening on port " + port));