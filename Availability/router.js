const { Router } = require("express");
const Availability = require("./model");

const router = new Router();

router.get("/availability", async (req, res, next) => {
  try {
    const availability = await Availability.findAll({ include: [User] });
    res.send(availability);
  } catch (error) {
    next(error);
  }
});

router.post("/availability", async (req, res, next) => {
  try {
    await Availability.create(req.body).then(result => {
      res.json(result);
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
