const { Router } = require("express");
// const Group = require("./model");
// const User = require("../User/model");
const GroupUser = require("./model");
const router = new Router();

// router.get("/userGroup", async (req, res, next) => {
//   try {
//     const ug = UserGroup.findAll()
//     res.send(ug);
//   } catch (error) {
//     next(error);
//   }
// });

router.post("/groupUser", async (req, res, next) => {
  try {
    await GroupUser.create(req.body).then(gu => res.json(gu));
    console.log("groupuser", req.body);
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
