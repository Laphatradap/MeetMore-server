const { Router } = require("express");
const Availability = require("./model");
const auth = require("../auth/authMiddleware");
const User = require("../User/model");

const router = new Router();

// Fetch all availabilities based on the userId
router.get("/availability/user/:id", async (req, res, next) => {
  console.log("params", req.params.id);
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
    if (!req.params.id) {
      res.status(404).send("Availability not found!");
    } else {
      res.send(availability);
    }
  } catch (error) {
    next(error);
  }
});

// Add a new availability to the table
router.post("/availability", auth, async (req, res, next) => {
  // console.log("user value", req.user);
  try {
    const newAvailability = { ...req.body, userId: req.user.dataValues.id };
    // console.log("newAvailability", newAvailability)
    await Availability.create(newAvailability).then(entity => res.json(entity));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
