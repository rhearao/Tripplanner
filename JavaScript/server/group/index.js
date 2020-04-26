const router = require("express").Router();
const db = require("../db");
module.exports = router;
const { Group, Event } = require("../db/models");
const { UserGroup } = require("../db/models");

// Test
router.get("/111", async (req, res, next) => {
  console.log("get group");
  res.status(201).send("hello");
});

router.get("/:groupId", async (req, res, next) => {
  try {
    const groupId = await Number(req.params.groupId);
    console.log("get group #" + groupId);
    const group = await Group.findByPk(groupId);
    res.json({
      id: groupId,
      name: group.name,
      locationName: group.locationName,
      startDate: group.startDate,
      endDate: group.endDate,
      lat: group.lat,
      lng: group.lng,
    });
  } catch (err) {
    next(err);
  }
});

router.post("/:groupId/:userId", async (req, res, next) => {
  // console.log("hi to create a group");
  console.log("to bind users with the selected group");
  try {
    const newUserGroup = await UserGroup.create({
      userId: req.params.userId,
      groupId: req.params.groupId,
    });
    res.status(201).send("UserGroup");
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      res.status(401).send("The user has already in the group or invalid ids.");
    } else {
      next(err);
    }
  }
});

router.get("/:groupId/members", async (req, res, next) => {
  const groupId = await Number(req.params.groupId);
  console.log("Get all members from group #" + groupId);
  try {
    const [members] = await db.query(
      `
            SELECT 
                "id", "firstName", "lastName", "email","photoURLs"
            FROM users
            INNER JOIN user_groups
                ON "users"."id" = "user_groups"."userId"
            WHERE "user_groups"."groupId" = ?
        `,
      { replacements: [groupId] }
    );
    console.log("members", members);
    res.status(201).send(
      members.map(({ id, firstName, lastName, email, photoURLs }) => ({
        id,
        firstName,
        lastName,
        email,
        photoURLs,
      }))
    );
    // res.status(201).send("UserGroup");
  } catch (err) {
    next(err);
  }
});

router.get("/events/:groupId", async (req, res, next) => {
  const groupId = await Number(req.params.groupId);
  // console.log("Get all events from group #" + groupId);
  try {
    const [events] = await db.query(
      `
    SELECT 
                "id", "name", "location", "startTime",  "endTime","detail","lat","lng"
            FROM events
            WHERE "groupId" = ?
    `,
      { replacements: [groupId] }
    );
    // console.log("events", events);
    res.status(200).send(
      events.map(
        ({
          id,
          name,
          location,
          category,
          startTime,
          endTime,
          detail,
          lat,
          lng,
        }) => ({
          id,
          name,
          location,
          category,
          startTime,
          endTime,
          detail,
          lat,
          lng,
        })
      )
    );
  } catch (err) {
    next(err);
  }
});

router.post("/events/:groupId/create", async (req, res, next) => {
  const groupId = await Number(req.params.groupId);

  // console.log("Get a new event for group #" + groupId);
  // console.log("Get a new event for group #" + req.body.eventName);
  try {
    const event = await Event.create({
      groupId: groupId,
      name: req.body.eventName,
      location: req.body.location,
      detail: req.body.detail,
      startTime: req.body.startDate,
      endTime: req.body.endDate,
      lat: req.body.lat,
      lng: req.body.lng,
    });
    res.status(201).send(event);
  } catch (err) {
    next(err);
  }
});

router.post("/events/:groupId/remove", async (req, res, next) => {
  const groupId = await Number(req.params.groupId);
  const eventId = await Number(req.body.eventId);
  console.log("event id is", eventId);
  // console.log("Get a new event for group #" + groupId);
  // console.log("Get a new event for group #" + req.body.eventName);
  try {
    await db.query(
      `DELETE FROM events
            WHERE "id" = ?
    `,
      { replacements: [eventId] }
    );
    res.status(201);
  } catch (err) {
    next(err);
  }
});
