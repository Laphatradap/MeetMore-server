const { Router } = require("express");
const User = require("../User/model");
const GroupUser = require("./model");
const router = new Router();

router.get("/groupUser/:id", async (req, res, next) => {
  try {
    const members = await GroupUser.findAll({
      where: {
        groupId: req.params.id
      }
    });
    // get all members from groupUser based on groupId
    const eachMemberId = members.map(member => member.userId);
    const allMembers = await User.findAll();
    const membersList = allMembers.filter(member =>
      eachMemberId.includes(member.id)
      );

    // Get values out
    const memberUsernames = membersList
      .map(name => name.dataValues)
      .map(value => ({id: value.id, username: value.username}))
    console.log("OUTPUT: memberUsernames", memberUsernames)
    res.json(memberUsernames);
  } catch (error) {
    next(error);
  }
});

router.post("/groupUser", async (req, res, next) => {
  try {
    await GroupUser.create(req.body).then(gu => res.json(gu));
  } catch (error) {
    next(error);
  }
});

router.post("/groupUser/member", async (req, res, next) => {
  try {
    await GroupUser.create(req.body).then(result => res.json(result));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
