const { Router } = require("express");
const Group = require("./model")
// const auth = require("../auth/authMiddleware")
const User = require("../User/model")
const router = new Router();

router.post("/groups", async (req, res, next) => {
  try {
    // console.log("user value", req.user.dataValues.id)
    console.log("req", req.user)
    // const newGroup = {...req.body, userId: req.user.dataValues.id}
    await Group
      .create(req.body)
      .then(group => res.json(group))
  } catch (error) {
    next(error);
    // if (error.name === "SequelizeUniqueConstraintError") {
    //   return res.status(409).send("Group already exists!");
    // }
  }
});

router.get("/groups/user/:id", async (req,res,next) => {
  try {
    const groupOfThatUser = await Group.findAll({
      include: [
        {
          model: User,
          attributes: ["id", "username"]
        }
      ],
      where: {
        userId: req.params.id
      }
    })
    if(!req.params.id) {
      res.status(404).send("Group not found!")
    } else {
      res.json(groupOfThatUser)
    }
  } catch (error) {
    next (error)
  }
})

module.exports = router