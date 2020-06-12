const { Router } = require("express");
const auth = require("../auth/authMiddleware");
const Group = require("../Group/model");
const GroupUser = require("../GroupUser/model");
const Availability = require("./model");
const User = require("../User/model");

const router = new Router();
var moment = require("moment");

// Fetch all availabilities based on the userId
router.get("/availability/user/:id", async (req, res, next) => {
  try {
    const availability = await Availability.findAll({
      include: [
        {
          model: User,
          attributes: ["username"],
        },
      ],
      where: {
        userId: req.params.id,
      },
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
  try {
    const newAvailability = { ...req.body, userId: req.user.dataValues.id };
    await Availability.create(newAvailability).then((entity) =>
      res.json(entity)
    );
  } catch (error) {
    next(error);
  }
});

// Fetch matchedAvailability
router.get("/availability/:id", async (req, res, next) => {
  // Check who is loggedin
  const userIdFromParams = req.params.id;

  // Check e.g. userId 1 has groupId 1, 2, 3
  try {
    const groupIDsOfUser = await GroupUser.findAll({
      where: {
        userId: userIdFromParams,
      },
    });
    if (!groupIDsOfUser) {
      res.status(404).send("Groups not found!");
    } else {
      function findMatch(members) {
        const availabilityList = members
          .map((member) =>
            member.users.map((user) =>
              user.availabilities.map((el) => el.dataValues)
            )
          )
          .flat(Infinity)
          .map((el) => {
            var obj = {};
            obj["startDate"] = moment(el.startDate)
              //.tz("UTC")
              .format("YYYYMMDD HHmm");
            obj["endDate"] = moment(el.endDate)
              //.tz("UTC")
              .format("YYYYMMDD HHmm");
            obj["userId"] = el.userId;
            return obj;
          });
        console.log("OUTPUT: findMatch -> availabilityList", availabilityList);

        var criticalPoint = availabilityList
          .map((el) => [el.startDate, el.endDate])
          .flat()
          .sort();
        //get unique value
        criticalPoint = new Set(criticalPoint);
        criticalPoint = [...criticalPoint];
        // console.log("OUTPUT: findMatch -> criticalPoint", criticalPoint);

        let matches = [];
        for (let index = 0; index < criticalPoint.length - 1; index++) {
          const rangeBegin = criticalPoint[index];
          const rangeEnd = criticalPoint[index + 1];

          let usersAvailable = availabilityList
            .filter((el) => el.startDate < rangeEnd && el.endDate >= rangeEnd)
            .map((el) => el.userId);
          usersAvailable = new Set(usersAvailable);
          usersAvailable = [...usersAvailable];
          console.log("OUTPUT: findMatch -> usersAvailable", usersAvailable);

          // For a match, we need two people
          const countMatches = usersAvailable.length;

          if (countMatches >= 2) {
            matches.push({
              rangeBegin,
              rangeEnd,
              usersAvailable,
              count: countMatches,
            });
          }
        }
        return matches;
      }

      let groupResult = [];
      const eachGroupId = groupIDsOfUser.map((connect) => connect.groupId);
      for (let index = 0; index < eachGroupId.length; index++) {
        const currentGroup = eachGroupId[index];

        const members = await Group.findAll({
          where: {
            id: currentGroup,
          },
          include: {
            model: User,
            through: { attributes: [] },
            include: Availability, // include availability of each user in the group
          },
        });

        // display groupuname, date ranges with names of people who can make it during that range
        const groupName = members.map((member) => member.groupName);
        const matchResult = findMatch(members);
        console.log("OUTPUT: matchResult", matchResult);

        const memberIds = matchResult
          .map((result) => result.usersAvailable)
          .flat(Infinity);

        const memberData = await User.findAll({
          where: {
            id: memberIds,
          },
          attributes: ["id", "username"],
        });

        const availabilityInfo = matchResult.map((result) => {
          var newObj = {};
          newObj["rangeBegin"] = result.rangeBegin;
          newObj["rangeEnd"] = result.rangeEnd;
          newObj["usernames"] = memberData.filter((data) =>
            result.usersAvailable.includes(data.id)
          );
          return newObj;
        });

        groupResult.push({
          groupId: currentGroup,
          groupName,
          availabilityInfo,
          usersAvailable,
          criticalPoint,
        });
      }

      res.send(groupResult);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
