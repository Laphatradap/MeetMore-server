const { Router } = require("express");
const Availability = require("./model");
const auth = require("../auth/authMiddleware");
const User = require("../User/model");

const router = new Router();

router.get("/availability/user/:id", async (req, res, next) => {
  console.log("params", req.params.id)
  try {
    const availability = await Availability.findAll({
      include: [
        {
          model: User,
          attributes: ["username"]
        }
      ],
      where: {
        userId: req.params.id
      }
    });
    if(!req.params.id) {
      res.status(404).send("Availability not found!")
    } else {
      res.send(availability);
    }
  } catch (error) {
    next(error);
  }
});

// router.get("/user/:id/availability", auth, async (req, res, next) => {
//   try {
//     const allAvailability = { ...req.body, userId: req.user.dataValues.id };
//     console.log("allAvailabilityUser", allAvailability)
//     await Availability.findAll({
//       include: [
//         {
//           model: User
//         }
//       ],
//       where: {
//         userId: req.user.dataValues.id
//       }
//     });
//     console.log(allAvailability)
//     res.send(allAvailability)
//   } catch(error) {
//     next(error)
//   }
// });

router.post("/availability", auth, async (req, res, next) => {
  // console.log("user value", req.user.dataValues.id);
  try {
    const newAvailability = { ...req.body, userId: req.user.dataValues.id };
    await Availability.create(newAvailability).then(entity => res.json(entity));
  } catch (error) {
    next(error);
  }
});

// router.post("/availability", async (req, res, next) => {
//   try {
//     await Availability.create(req.body).then(result => {
//       res.json(result);
//     });
//   } catch (error) {
//     next(error);
//   }
// });

module.exports = router;
