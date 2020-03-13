const { Router } = require("express");
const Group = require("./model");
const GroupUser = require("../GroupUser/model");
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

// Fetch all groups based on userId from GroupUser table
router.get("/groups/user/:id", async (req, res, next) => {
  // Get userId from req.params.id
  const userIdFromParams = req.params.id;

  // Find groupIDs based on userId (e.g. userId 1 has groupId 1, 2, 3)
  try {
    const groupIDsOfUser = await GroupUser.findAll({
      where: {
        userId: userIdFromParams
      }
    });
    if (!groupIDsOfUser) {
      res.status(404).send("Groups not found!");
    } else {
      // Get only groupIDs
      const eachGroupId = groupIDsOfUser.map(connect => connect.groupId);
      // Filter out the groups that matched the groupIDs from Group table
      const allGroups = await Group.findAll();
      const groups = allGroups.filter(group => eachGroupId.includes(group.id));
      const data = groups;
      res.send(data);
    }
  } catch (error) {
    next(error);
  }
});

// Fetch one group based on req.params.id to to see which group the user are in
router.get("/groups/:id", async (req, res, next) => {
  console.log("id of groups", typeof req.params.id);
  try {
    const group = await Group.findAll({
      where: {
        id: req.params.id
      }
    });
    if (!req.params.id) {
      res.status(404).send("Group not found");
    } else {
      res.json(group);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
