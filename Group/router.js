const { Router } = require("express");
const Group = require("./model");
const GroupUser = require("../GroupUser/model");
const Availability = require("../Availability/model");
const User = require("../User/model");
const router = new Router();

// Create a new group
router.post("/groups", async (req, res, next) => {
  try {
    await Group.create(req.body).then((group) => res.json(group));
  } catch (error) {
    next(error);
  }
});

// Fetch all groups based on userId from GroupUser table with availability
router.get("/groups/user/:id", async (req, res, next) => {
  // Get userId from req.params.id
  const userIdFromParams = req.params.id;

  // Find groupIDs based on userId (e.g. userId 1 has groupId 1, 2, 3)
  try {
    const groupIDsOfUser = await GroupUser.findAll({
      where: {
        userId: userIdFromParams,
      },
    });
    if (!groupIDsOfUser) {
      res.status(404).send("Groups not found!");
    } else {
      // Get only groupIDs
      const eachGroupId = groupIDsOfUser.map(connect => connect.groupId);
      const members = await Group.findAll({
        where: {
          id: eachGroupId,
        },
        include: {
          model: User,
          through: { attributes: [] },
          // include availability of each user in the group
          include: Availability
        }
      });
      res.send(members);
      // console.log("OUTPUT: members", members.map(member => member.dataValues.users))
      
    }
  } catch (error) {
    next(error);
  }
});

// Fetch one group based on req.params.id to to see which group the user are in
router.get("/groups/:id", async (req, res, next) => {
  try {
    const groupInfo = await Group.findAll({
      where: {
        id: req.params.id,
      },
    });
    if (!req.params.id) {
      res.status(404).send("Group not found");
    } else {
      // Get all users(members) of that group from groupUser table
      const groupId = groupInfo[0].dataValues.id;
      const members = await Group.findAll({
        where: {
          id: groupId,
        },
        include: {
          model: User,
          through: { attributes: [] },
        },
      });
      res.json(members);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
