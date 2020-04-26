const router = require("express").Router();
const db = require("../db");
module.exports = router;
const { User, Group, UserGroup } = require("../db/models");

router.get("/profile", async (req, res, next) => {
  try {
    console.log("get profile");
    const userId = Number(req.session.passport.user);
    const user = await User.findByPk(userId);
    console.log(userId);
    console.log(user);
    res.json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
      photoURLs: user.photoURLs,
    });
  } catch (err) {
    next(err);
  }
});

router.put("/profile", async (req, res, next) => {
  try {
    // TODO:
    // const user = await User.findByPk(req.params.userId);
    const userId = Number(req.session.passport.user);
    const user = await User.findByPk(userId);
    if (!user) {
      res.sendStatus(404);
    } else {
      const updatedUser = await user.update({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
      });
      res.send(updatedUser);
    }
  } catch (err) {
    next(err);
  }
});

// router.get("/group", async (req, res, next) => {
/**Get all the groups of the user */
router.get("/group/:userId", async (req, res, next) => {
  try {
    // const id = Number(req.session.passport.user);
    // With "/group/:userId"
    const id = await Number(req.params.userId);
    // const groups = await Group.findAll({
    //   include: [{
    //       model: UserGroup,
    //       where: {
    //         // groupId: Group.id,
    //         userId: id
    //        }
    //   }]
    // })
    const [groups] = await db.query(
      `
            SELECT 
                "id", "name", "locationName", "startDate",  "endDate","lat","lng"
            FROM groups
            INNER JOIN user_groups
                ON "groups"."id" = "user_groups"."groupId"
            WHERE "user_groups"."userId" = ?
        `,
      { replacements: [id] }
    );
    // Find all projects with a least one task where task.state === project.task
    //   Project.findAll({
    //     include: [{
    //         model: Task,
    //         where: { state: Sequelize.col('project.state') }
    //     }]
    // })
    console.log("groups", groups);
    res.send(
      groups.map(
        ({ id, name, locationName, startDate, endDate, lat, lng }) => ({
          id,
          name,
          locationName,
          startDate,
          endDate,
          lat,
          lng,
        })
      )
    );
  } catch (e) {
    next(e);
  }
});

router.post("/group/create", async (req, res, next) => {
  try {
    const newGroup = await Group.create({
      name: req.body.groupName,
      locationName: req.body.locationName,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      lat: req.body.lat,
      lng: req.body.lng,
    });
    await UserGroup.create({
      userId: req.session.passport.user,
      groupId: newGroup.id,
    });
    res.status(201).send(newGroup);
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      res.status(401).send("Group already exists");
    } else {
      next(err);
    }
  }
});
