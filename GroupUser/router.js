const { Router } = require("express");
const User = require("../User/model");
const GroupUser = require("./model");
const router = new Router();

router.get("/groupUser/:id", async (req, res, next) => {
  try {
    let members = await GroupUser.findAll({
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
    const memberUsernames = membersList.map(name => name.dataValues);
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

// router.post("/groups/:id", async (req, res, next) => {
//   const groupId = req.params.id
//   try {
//     const group = await Group.
//     console.log("req of UserGroup", req.body);
//     await UserGroup.create(req.body).then(ug => res.json(ug));
//   } catch (error) {
//     next(error);
//   }
// });

module.exports = router;
