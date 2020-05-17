const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

// const authMiddleware = require("./auth/authMiddleware")
const userRoutes = require("./User/router");
const availabilityRoutes = require("./Availability/router")
const groupRoutes = require("./Group/router")
const groupUserRoutes = require("./GroupUser/router")
const port = process.env.PORT || 4000;
const app = express();

app
  .use(bodyParser.json())
  .use(cors())
  .use(userRoutes)
  .use(availabilityRoutes)
  .use(groupRoutes)
  .use(groupUserRoutes)
  .listen(port, () => console.log("listening on port " + port));