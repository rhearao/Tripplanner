const router = require("express").Router();
const { User } = require("../db/models");
module.exports = router;
const { userGateway } = require("./gateway");

router.get("/:userId", async (req, res, next) => {
  try {
    const userId = await Number(req.params.userId);
    if (userId === Number(req.session.passport.user)) {
      const user = await User.findByPk(userId);
      res.json({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      });
    }
  } catch (err) {
    next(err);
  }
});

router.post("/signup", async (req, res, next) => {
  try {
    const newUser = await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      googleId: null,
      password: req.body.password,
    });
    res.status(201).send(newUser);
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { email: req.body.email.toLowerCase() },
    });
    if (!user) {
      console.log("No such user found:", req.body.email);
      res.status(401).send("Wrong username and/or password");
    } else if (!user.correctPassword(req.body.password)) {
      console.log("Incorrect password for user:", req.body.email);
      res.status(401).send("Wrong username and/or password");
    } else {
      req.login(user, (err) => (err ? next(err) : res.json(user)));
    }
  } catch (err) {
    next(err);
  }
});

router.put(
  "/:userId",
  // userGateway,
  async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.userId);
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
  }
);

