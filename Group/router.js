const { Router } = require("express");
const Group = require("./model");
const User = require("../User/model");
const router = new Router();

// Create a new group
router.post("/groups", async (req, res, next) => {
  try {
    // console.log("req of groups", req.body);
    await Group.create(req.body).then(group => res.json(group));
  } catch (error) {
    next(error);
  }
});

// TO DO fix the id to be userId, as of now the id is the groupId
router.get("/groups/user/:id", async (req, res, next) => {
  try {
    // console.log("user value", req.params.id)
    const groupOfThatUser = await Group.findAll({
      include: [
        {
          model: User,
          attributes: ["id", "username"]
        }
      ],
      where: {
        id: req.params.id
      }
    });
    if (!req.params.id) {
      res.status(404).send("Group not found!");
    } else {
      res.json(groupOfThatUser);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
